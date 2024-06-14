import os

import googlemaps
from dotenv import load_dotenv

load_dotenv()


class GoogleMapsService:
    def __init__(self):
        self.client = googlemaps.Client(key=os.getenv('GOOGLE_MAPS_API_KEY'))

    def get_coordinates(self, address):
        try:
            geocode_result = self.client.geocode(address)
            if not geocode_result:
                print(f'No results found for address: {address}')
                return None
            location = geocode_result[0]['geometry']['location']
            return [location['lng'], location['lat']]
        except Exception as e:
            raise Exception(f"Error fetching coordinates: {e}")
