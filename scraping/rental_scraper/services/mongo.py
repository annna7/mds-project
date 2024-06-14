from pymongo import MongoClient
from .google_maps import GoogleMapsService
from geographiclib.geodesic import Geodesic
import random


class MongoService:
    def __init__(self, uri='mongodb://localhost:27017/', db_name='one-roof', collection_name='listings'):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]
        self.google_maps_service = GoogleMapsService()

    @staticmethod
    def add_random_offset_to_coordinates(lat, lon, max_distance_meters=100):
        geod = Geodesic.WGS84

        # generate a random distance in meters (from 0 to max_offset)
        distance = random.uniform(0, max_distance_meters)

        # generate a random direction (azimuth) in degrees from 0 to 360
        azimuth = random.uniform(0, 360)

        # compute the new position using the geographic library
        g = geod.Direct(lat, lon, azimuth, distance)

        # extract new latitude and longitude coords
        new_lat = g['lat2']
        new_lon = g['lon2']

        return new_lat, new_lon

    def insert_listing(self, data):
        # if data is not precise
        # (ex: on OLX only the district is provided, and the location is usually more detailed in the title),
        # try to get coordinates using the title first
        # if getting no results, revert to address

        coordinates = None
        if not data.get('precise', False):
            print('trying to get from title')
            coordinates = self.google_maps_service.get_coordinates(data['title'])
            print('got coordinates from title', coordinates)

        # if no results yet (i.e. unsuccessful from title, or we trust the parsed address)
        # then try to get coordinates using the address
        if not coordinates:
            print('trying to get from address')
            coordinates = self.google_maps_service.get_coordinates(data['address'])
            print('got coordinates from address', coordinates)

        listing = {
            'title': data['title'],
            'price': data['price'],
            'address': data['address'],
            'url': data['url'],
            'size': data['surface'],
            'numberOfRooms': data.get('rooms', 1),
            'numberOfBathrooms': data.get('bathrooms', 1),
            'photos': data['photos'],
            'type': data.get('type', 'apartment'),
            'location': {
                'type': 'Point',
                'coordinates': coordinates,
            },
            'external': True,
        }
        self.collection.insert_one(listing)

    def insert_apartment(self, apartment_data):
        apartment = {
            'title': apartment_data['title'],
            'price': apartment_data['price'],
            'address': apartment_data['address'],
            'url': apartment_data['url'],
            'size': apartment_data['surface'],
            'numberOfRooms': apartment_data['rooms'],
            'numberOfBathrooms': apartment_data.get('bathrooms', 1),
            'photos': apartment_data['photos'],
            'type': 'apartment',
            'location': {
                'type': 'Point',
                'coordinates': self.google_maps_service.get_coordinates(apartment_data['address']),
            },
            'external': True,
        }
        self.collection.insert_one(apartment)

    def insert_studio(self, title, price, address, surface, photo_urls, url):
        apartment = {
            'title': title,
            'price': price,
            'address': address,
            'url': url,
            'size': surface,
            'photos': photo_urls,
            'type': 'studio'
        }
        self.collection.insert_one(apartment)

    def close_connection(self):
        self.client.close()


mongo_service = MongoService()
grozavesti_coords = [44.44278054082214, 26.060235542007778]

for _ in range(5):
    new_coords = mongo_service.add_random_offset_to_coordinates(grozavesti_coords[0], grozavesti_coords[1])
    print(new_coords)