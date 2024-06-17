import MapView from 'react-native-map-clustering';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	BUCHAREST_COORDINATES,
	DEFAULT_LATITUDE_DELTA,
	DEFAULT_LONGITUDE_DELTA,
	getCoordinatesFromLocation, getShortenedString,
	mapStyles
} from '../utils';
import { IListing, IReview } from '../models';
import { BottomItemCard } from './BottomItemCard';
import { useSearchContext } from '../contexts/SearchContext';
import { SearchTypeEnum } from '../enums';
import { CustomMarker } from './CustomMarker';
import { capitalize, debounce } from 'lodash';
import { theme } from '../theme';

const EPSILON = 0.001;

type IMapItem = IListing | IReview;

// Map component displays a map with clustered markers and a bottom card for selected items
export const Map: React.FC = () => {
	const mapRef = useRef(null); // Ref to access the MapView component
	const [legalToUpdate, setLegalToUpdate] = useState<boolean>(true); // State to track if map updates are allowed
	const [selectedItem, setSelectedItem] = React.useState<IMapItem>(); // State to store the currently selected item
	const { state, setIsWaitingForSearch, setWasExternalSearchPerformed, triggerSearch } = useSearchContext();

	const handleClose = useCallback(() => setSelectedItem(undefined), []); // Handler to close the bottom card

	const handleMarkerPress = useCallback((item: IMapItem) => {
		setSelectedItem(prevItem => (prevItem === item ? undefined : item)); // Toggle the selected item
	}, []);

	const debouncedRegionUpdate = useCallback(debounce((newRegion) => {
		triggerSearch(newRegion, false); // Trigger a search with the new region after a delay
	}, 600), [triggerSearch]);

	const handleRegionChangeComplete = useCallback((newRegion) => {
		if (needsUpdate(state.region, newRegion)) { // Check if the region has changed significantly
			if (legalToUpdate) {
				setIsWaitingForSearch(true); // Set waiting state for search
				debouncedRegionUpdate(newRegion); // Trigger debounced region update
			} else {
				console.log('was illegal');
				setLegalToUpdate(true); // Reset the legal update flag
			}
		}
	}, [state.region, legalToUpdate, debouncedRegionUpdate]);

	const handleMapLoaded = useCallback(() => {
		setIsWaitingForSearch(true); // Set waiting state for search when map is loaded
		debouncedRegionUpdate(state.region); // Trigger debounced region update
	}, []);

	const needsUpdate = (oldRegion, newRegion) => {
		// Check if the region has changed beyond a small threshold (EPSILON)
		return Math.abs(newRegion.latitude - oldRegion.latitude) > EPSILON ||
			Math.abs(newRegion.longitude - oldRegion.longitude) > EPSILON ||
			Math.abs(newRegion.latitudeDelta - oldRegion.latitudeDelta) > EPSILON ||
			Math.abs(newRegion.longitudeDelta - oldRegion.longitudeDelta) > EPSILON;
	};

	useEffect(() => {
		if (mapRef.current && state.wasExternalSearchPerformed) {
			// Animate to the new region if an external search was performed
			console.log('was external map');
			mapRef.current.animateToRegion(state.region, 1000);
			setWasExternalSearchPerformed(false); // Reset the external search flag
			setLegalToUpdate(false); // Prevent immediate update after animation
		}
	}, [state.wasExternalSearchPerformed]);

	return (
		<View style={styles.map}>
			<MapView
				clusterColor={theme.colors.primary} // Set the cluster color
				ref={mapRef} // Reference to the MapView component
				style={styles.map}
				initialRegion={state.region} // Set the initial region
				onMapLoaded={handleMapLoaded} // Handler for when the map is loaded
				onRegionChangeComplete={handleRegionChangeComplete} // Handler for when region change is complete
				customMapStyle={mapStyles} // Apply custom map styles
				onPress={() => setSelectedItem(undefined)} // Deselect item on map press
			>
				{(state.searchType === 'listings' ? state.filteredListings : state.filteredReviews).map((item, index) => (
					<CustomMarker
						key={index}
						coordinate={getCoordinatesFromLocation(item.location)} // Get coordinates from the item's location
						onPress={() => handleMarkerPress(item)} // Handle marker press
						text={state.searchType === SearchTypeEnum.Listings ? `${item.price} €` : getShortenedString(item.title, 10)} // Display price or shortened title
					/>
				))}
			</MapView>
			{selectedItem && (
				<View style={styles.bottomCardContainer}>
					{state.searchType === SearchTypeEnum.Listings ?
						<BottomItemCard item={selectedItem as IListing} onClose={handleClose} /> :
						<BottomItemCard item={selectedItem as IReview} type={'review'} onClose={handleClose} />
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
