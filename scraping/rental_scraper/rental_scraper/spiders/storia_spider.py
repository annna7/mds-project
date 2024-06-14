import json
import logging
import scrapy
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from services import MongoService


class StoriaSpider(scrapy.Spider):
    name = "storia_spider"
    conversion_rate = 0.2  # from RON to EUR
    start_urls = [
        'https://www.storia.ro/ro/rezultate/inchiriere/apartament/bucuresti?ownerTypeSingleSelect=ALL&distanceRadius=0&viewType=listing&limit=72&page=1'
    ]

    def __init__(self, *args, **kwargs):
        super(StoriaSpider, self).__init__(*args, **kwargs)
        geckodriver_path = '/snap/bin/geckodriver'
        self.driver = webdriver.Firefox(service=Service(geckodriver_path))
        self.mongo_service = MongoService()

    @staticmethod
    def get_nested_text_by_aria_label(response, aria_label, rooms_fallback=True):
        divs = response.css(f'div[aria-label="{aria_label}"] > div')
        try:
            return divs[1].css('div::text').get().strip().split()[0]
        except Exception as e:
            if rooms_fallback:
                return divs[1].css('a[data-cy="ad-information-link"]::text').get().strip()
            return e


    @staticmethod
    def process_price(price):
        # if price is in RON, converts it to EUR
        if 'RON' in price:
            cleaned_price = re.sub(r'\s*RON', '', price)
            cleaned_price = cleaned_price.replace(' ', '')
            price_in_ron = int(cleaned_price)
            price_in_eur = price_in_ron * StoriaSpider.conversion_rate
            return price_in_eur
        # otherwise cleans the price and returns it as it is
        else:
            cleaned_price = re.sub(r'\s*€', '', price)
            cleaned_price = cleaned_price.replace(' ', '')
            return int(cleaned_price)

    def parse(self, response):
        # collects all links to listings we want to scrape next
        listing_urls = response.css('a[data-cy="listing-item-link"]::attr(href)').getall()
        for url in listing_urls:
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

        div = WebDriverWait(self.driver, 20).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, 'div.image-gallery-swipe'))
        )

        photos = div.find_elements(By.CSS_SELECTOR, 'img.image-gallery-image')
        photo_urls = [img.get_attribute('src') for img in photos]

        title = response.css('h1[data-cy="adPageAdTitle"]::text').get().strip()
        price = response.css('strong[data-cy="adPageHeaderPrice"]::text').get().strip()
        address = response.css('div[data-testid="map-link-container"] > a::text').get().strip()
        surface = StoriaSpider.get_nested_text_by_aria_label(response, 'Suprafață utilă')
        rooms = StoriaSpider.get_nested_text_by_aria_label(response, 'Numărul de camere')

        data = {
            'title': title,
            'price': StoriaSpider.process_price(price),
            'address': address,
            'surface': int(surface),
            'rooms': int(rooms),
            'photos': photo_urls,
            'url': response.url,
            'precise': True
        }

        self.mongo_service.insert_apartment(data)
        self.logger.info(f'Inserted data: {data}')

        yield data

    def closed(self, reason):
        self.driver.quit()
        self.mongo_service.close_connection()
