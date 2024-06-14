from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from rental_scraper.spiders.storia_spider import StoriaSpider


def run_spider():
    process = CrawlerProcess(get_project_settings())
    process.crawl(StoriaSpider)
    process.start()


if __name__ == "__main__":
    run_spider()
