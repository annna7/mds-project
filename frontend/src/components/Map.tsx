import MapView from 'react-native-map-clustering';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	getCoordinatesFromLocation,
	mapStyles
} from '../utils';
import { IListing, IReview } from '../models';
import { BottomListingCard } from './BottomListingCard';
import { useSearchContext } from '../contexts/SearchContext';
import { SearchTypeEnum } from '../enums';
import { BottomReviewCard } from './BottomReviewCard';
import { CustomMarker } from './CustomMarker';
import { debounce } from 'lodash';
import { theme } from '../theme';

const EPSILON = 0.001;

type IMapItem = IListing | IReview;

export const Map: React.FC = () => {
	const mapRef = useRef(null);
	const [legalToUpdate, setLegalToUpdate] = useState<boolean>(true);
	const [selectedItem, setSelectedItem] = React.useState<IMapItem>();
	const { state, setIsWaitingForSearch, setWasExternalSearchPerformed, triggerSearch } = useSearchContext();

	const handleClose = useCallback(() => setSelectedItem(undefined), []);

	const handleMarkerPress = useCallback((item: IMapItem) => {
		setSelectedItem(prevItem => (prevItem === item ? undefined : item));
	}, []);

	const debouncedRegionUpdate = useCallback(debounce((newRegion) => {
		triggerSearch(newRegion, false);
	}, 600), [triggerSearch]);

	const handleRegionChangeComplete = useCallback((newRegion) => {
		 if (needsUpdate(state.region, newRegion)) {
			 if (legalToUpdate) {
				 setIsWaitingForSearch(true);
				 debouncedRegionUpdate(newRegion);
			 } else {
				 console.log('was illegal');
				 setLegalToUpdate(true);
			 }
		}
	}, [state.region, legalToUpdate, debouncedRegionUpdate]);

	const handleMapLoaded = useCallback(() => {
		setIsWaitingForSearch(true);
		debouncedRegionUpdate(state.region);
	}, []);

	const needsUpdate = (oldRegion, newRegion) => {
		return Math.abs(newRegion.latitude - oldRegion.latitude) > EPSILON ||
			Math.abs(newRegion.longitude - oldRegion.longitude) > EPSILON ||
			Math.abs(newRegion.latitudeDelta - oldRegion.latitudeDelta) > EPSILON ||
			Math.abs(newRegion.longitudeDelta - oldRegion.longitudeDelta) > EPSILON;
	};

	useEffect(() => {
		if (mapRef.current && state.wasExternalSearchPerformed) {
			console.log('was external map');
			mapRef.current.animateToRegion(state.region, 1000);
			setWasExternalSearchPerformed(false);
			setLegalToUpdate(false);
		}
	}, [state.wasExternalSearchPerformed]);

	return (
		<View style={styles.map}>
			<MapView
				clusterColor={theme.colors.primary}
				ref={mapRef}
				style={styles.map}
				initialRegion={state.region}
				onMapLoaded={handleMapLoaded}
				onRegionChangeComplete={handleRegionChangeComplete}
				customMapStyle={mapStyles}
				onPress={() => setSelectedItem(undefined)}
			>
				{(state.searchType === 'listings' ? state.filteredListings : state.filteredReviews).map((item, index) => (
					<CustomMarker
						key={index}
						coordinate={getCoordinatesFromLocation(item.location)}
						onPress={() => handleMarkerPress(item)}
						text={state.searchType === SearchTypeEnum.Listings ? `${item.price} €` : 'review'}
					/>
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
		height: 400,
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