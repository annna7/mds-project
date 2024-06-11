import MapView, { Marker } from 'react-native-maps';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getCoordinatesFromLocation, mapStyles } from '../utils';
import { IListing, IReview } from '../models';
import { BottomListingCard } from './BottomListingCard';
import { useSearchContext } from '../contexts/SearchContext';
import { SearchTypeEnum } from '../enums';
import { BottomReviewCard } from './BottomReviewCard';

const EPSILON = 0.001;

type IMapItem = IListing | IReview;

export const Map: React.FC = () => {
	const [selectedItem, setSelectedItem] = React.useState<IMapItem>();
	const { state, setRegion } = useSearchContext();

	const handleClose = () => setSelectedItem(undefined);

	const handleMarkerPress = (item: IMapItem) => {
		if (selectedItem == item) {
			setSelectedItem(undefined);
		} else {
			setSelectedItem(item);
		}
	};

	const handleRegionChange = (newRegion) => {
		if (needsUpdate(state.region, newRegion)) {
			setRegion(newRegion);
		}
	};

	const needsUpdate = (oldRegion, newRegion) => {
		return Math.abs(newRegion.latitude - oldRegion.latitude) > EPSILON ||
			Math.abs(newRegion.longitude - oldRegion.longitude) > EPSILON||
			Math.abs(newRegion.latitudeDelta - oldRegion.latitudeDelta) > EPSILON||
			Math.abs(newRegion.longitudeDelta - oldRegion.longitudeDelta) > EPSILON;
	};

	console.log(state.searchType);

	return (
		<View style={styles.map}>
			<MapView
				style={styles.map}
				region={state.region}
				onRegionChangeComplete={handleRegionChange}
				customMapStyle={mapStyles}
				onPress={() => setSelectedItem(undefined)}
			>
				{(state.searchType === 'listings' ? state.filteredListings : state.filteredReviews).map((item, index) => (
					<Marker
						key={index}
						coordinate={getCoordinatesFromLocation(item.location)}
						onPress={() => handleMarkerPress(item)}
					>
					</Marker>
				))}
			</MapView>
			{selectedItem && (
				<View style={styles.bottomCardContainer}>
					{state.searchType === SearchTypeEnum.Listings ?
						<BottomListingCard item={selectedItem as IListing} onClose={handleClose} /> :
						<BottomReviewCard item={selectedItem as IReview} onClose={handleClose} />
					}
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