import json
import logging
import scrapy
import re
import unidecode
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from services import MongoService


class OlxSpider(scrapy.Spider):
    # custom_settings = {
    #     'LOG_LEVEL': 'WARNING'  # Or 'ERROR' or 'CRITICAL'
    # }
    name = "olx_spider"
    conversion_rate = 0.2  # from RON to EUR
    start_urls = [
        # apartments and studios in Bucharest, photos mandatory, currency in EUR, sort by latest
        'https://www.olx.ro/imobiliare/apartamente-garsoniere-de-inchiriat/bucuresti/?currency=EUR&search%5Bphotos%5D=1&view=list',
    ]

    def __init__(self, *args, **kwargs):
        super(OlxSpider, self).__init__(*args, **kwargs)
        geckodriver_path = '/snap/bin/geckodriver'
        self.driver = webdriver.Firefox(service=Service(geckodriver_path))
        self.mongo_service = MongoService()

    @staticmethod
    def parse_number_of_keyword(keyword, tokens):
        # try to extract number of bedrooms/bathrooms from title
        # situations taken care of:
        # 2 camere ==> 2 bedrooms
        # trei bai ==> 3 bathroomsz
        room_index = tokens.index(keyword)
        potential_number_of_rooms = tokens[room_index - 1]
        try:
            potential_number_of_rooms = int(potential_number_of_rooms)
            if potential_number_of_rooms >= 2:
                return potential_number_of_rooms
        except ValueError as e:
            romanian_to_digits_mappings = [
                ('doua', 2),
                ('trei', 3),
                ('patru', 4),
                ('cinci', 5),
                ('sase', 6)
            ]
            if potential_number_of_rooms in romanian_to_digits_mappings:
                return romanian_to_digits_mappings[potential_number_of_rooms]
            return None
        return None

    @staticmethod
    def dump_logs(selector_list, filename):
        address_paragraph_json = json.dumps(selector_list, ensure_ascii=False, indent=4)
        with open(filename, 'w+', encoding='utf-8') as f:
            f.write(address_paragraph_json)

    def parse(self, response):
        # collects all links to listings we want to scrape next
        listing_urls = response.css('div[data-testid="listing-grid"] a::attr(href)').getall()
        for url in listing_urls:
            # a lot of OLX listings redirect to Storia, and we want to visit only those on OLX
            if url.startswith('/d/oferta'):
                full_url = response.urljoin(url)
                yield scrapy.Request(full_url, callback=self.parse_listing)

    def parse_listing(self, response):
        # parse an individual listing
        self.driver.get(response.url)
        try:
            accept_cookies_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'button#onetrust-accept-btn-handler'))
            )
            accept_cookies_button.click()
        except Exception as e:
            self.logger.info("No cookie acceptance button found or an error occurred.")

        section = WebDriverWait(self.driver, 20).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "div[data-testid='aside'] section"))
        )

        address_paragraphs = section.find_elements(By.CSS_SELECTOR, 'p')
        address = address_paragraphs[0].text

        div = WebDriverWait(self.driver, 20).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[class="swiper swiper-initialized swiper-horizontal swiper-backface-hidden"]'))
        )

        photos = div.find_elements(By.CSS_SELECTOR, 'img')
        photo_urls = [img.get_attribute('src') for img in photos]

        title = response.css('div[data-cy="ad_title"] h4::text').get().strip()

        price = response.css('div[data-testid="ad-price-container"] > h3::text').get().strip()
        price = int(price.split()[0])

        # there are multiple li's in the unordered list, and since their order might vary we need to ensure we get
        # the one containing the desired surface

        surface = None
        surface_variants = response.css('div[data-testid="main"] li p::text').getall()
        self.log(f'SURFACE TYPE: {surface_variants[0]}')
        for li in surface_variants:
            li_text = str(li)
            if li_text.startswith('Suprafata'):
                # Example: Suprafata utila: 32 m^2
                surface = int(li_text.split(' ')[2])

        # lowercase and remove diacritics from title
        title_tokens = list(map(lambda w: unidecode.unidecode(w.lower()), title.split()))
        room_type = 'apartment'
        number_of_rooms = number_of_bathrooms = 1

        if 'garsoniera' in title_tokens or 'studio' in title_tokens:
            # garsoniera (studio with one room)
            room_type = 'studio'
        else:
            # if it's not a studio, then it is an apartment, and it can have multiple bedrooms/bathrooms
            # parse the title for this info
            # if we can't find anything, we assume the property has one bedroom and one bathroom
            if 'camere' in title_tokens:
                number_of_rooms = OlxSpider.parse_number_of_keyword('camere', title_tokens)
            if 'bai' in title_tokens:
                number_of_bathrooms = OlxSpider.parse_number_of_keyword('bai', title_tokens)

        data = {
            'title': title,
            'price': price,
            'address': address,
            'surface': surface,
            'rooms': number_of_rooms,
            'bathrooms': number_of_bathrooms,
            'photos': photo_urls,
            'type': room_type,
            'url': response.url,
            'precise': False
        }

        self.mongo_service.insert_apartment(data)
        self.logger.info(f'Inserted data: {data}')

        yield data

    def closed(self, reason):
        self.driver.quit()
        self.mongo_service.close_connection()
