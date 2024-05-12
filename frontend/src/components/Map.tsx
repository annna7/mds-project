import MapView, { Marker } from 'react-native-maps';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BUCHAREST_COORDINATES } from '../utils';
import { useListings } from '../hooks';
import { getCoordinatesFromListing } from '../utils';
import { IListing } from '../models';
import { BottomListingCard } from './BottomListingCard';

export const Map: React.FC = () => {
	const { listings } = useListings();
	const [openedListing, setOpenedListing] = React.useState<IListing>();
	const handleClose = () => setOpenedListing(undefined);
	const handleMarkerPress = (listing: IListing) => {
		if (openedListing == listing) {
			setOpenedListing(undefined);
		} else {
			setOpenedListing(listing);
		}
	};
	return (
		<View style={styles.map}>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: BUCHAREST_COORDINATES.latitude,
					longitude: BUCHAREST_COORDINATES.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				customMapStyle={mapStyles}
				onPress={() => setOpenedListing(undefined)}
			>
				{listings.map((listing, index) => (
					<Marker
						key={index}
						coordinate={getCoordinatesFromListing(listing)}
						onPress={() => handleMarkerPress(listing)}
					>
					</Marker>
				))}
			</MapView>
			{openedListing && (
				<View style={styles.bottomCardContainer}>
					<BottomListingCard item={openedListing} onClose={handleClose} />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	bottomCardContainer: {
		position: 'absolute',
		bottom: 0,
		height: 300,
		width: '100%',
		zIndex: 1000,
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});

const mapStyles = [
	{
		'featureType': 'administrative.neighborhood',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'simplified'
			}
		]
	},
	{
		'featureType': 'landscape.natural',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'visibility': 'on'
			},
			{
				'color': '#d5e1dd'
			}
		]
	},
	{
		'featureType': 'landscape.natural.landcover',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'landscape.natural.landcover',
		'elementType': 'geometry',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'landscape.natural.terrain',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
			}
		]
	},
	{
		'featureType': 'poi',
		'elementType': 'geometry',
		'stylers': [
			{
				'visibility': 'off'
			}
		]
	},
	{
		'featureType': 'poi',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'visibility': 'on'
			},
			{
				'hue': '#1900ff'
			},
			{
				'color': '#b4e5e5'
			}
		]
	},
	{
		'featureType': 'poi',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
			}
		]
	},
	{
		'featureType': 'poi.attraction',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi.business',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi.government',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
			}
		]
	},
	{
		'featureType': 'poi.medical',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi.park',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi.park',
		'elementType': 'geometry',
		'stylers': [
			{
				'visibility': 'simplified'
			},
			{
				'color': '#cbe3cc'
			}
		]
	},
	{
		'featureType': 'poi.park',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi.place_of_worship',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi.school',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'poi.sports_complex',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'road',
		'elementType': 'geometry',
		'stylers': [
			{
				'lightness': 100
			},
			{
				'visibility': 'simplified'
			}
		]
	},
	{
		'featureType': 'road',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
			}
		]
	},
	{
		'featureType': 'road.highway.controlled_access',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
			}
		]
	},
	{
		'featureType': 'road.arterial',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'road.arterial',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'simplified'
			},
			{
				'invert_lightness': true
			}
		]
	},
	{
		'featureType': 'road.local',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'simplified'
			}
		]
	},
	{
		'featureType': 'road.local',
		'elementType': 'geometry',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'road.local',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'road.local',
		'elementType': 'geometry.stroke',
		'stylers': [
			{
				'visibility': 'on'
			}
		]
	},
	{
		'featureType': 'road.local',
		'elementType': 'labels',
		'stylers': [
			{
				'invert_lightness': true
			}
		]
	},
	{
		'featureType': 'transit',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'simplified'
			}
		]
	},
	{
		'featureType': 'transit',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'simplified'
			}
		]
	},
	{
		'featureType': 'transit',
		'elementType': 'labels.text',
		'stylers': [
			{
				'visibility': 'simplified'
			},
			{
				'color': '#777777'
			}
		]
	},
	{
		'featureType': 'transit.line',
		'elementType': 'geometry',
		'stylers': [
			{
				'visibility': 'off'
			},
			{
				'lightness': 700
			}
		]
	},
	{
		'featureType': 'transit.line',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
			}
		]
	},
	{
		'featureType': 'water',
		'elementType': 'all',
		'stylers': [
			{
				'color': '#9cdfdf'
			},
			{
				'visibility': 'simplified'
			}
		]
	}
];