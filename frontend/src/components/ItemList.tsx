import { Text } from 'react-native';
import React, { useCallback } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import PropertyCard from './PropertyCard';
import { IListing, IReview } from '../models';

export const ItemList = () => {
	const { state } = useSearchContext();

	const renderListing = useCallback(
		(listing: IListing) => (
			<PropertyCard listing={listing} canOpen={true}/>
		), []
	);

	const renderReview = useCallback(
		(review: IReview) => (
			<Text> Not yet implemented! </Text>
		), []
	);

	switch (state.searchType) {
	case 'listings':
		return state.listings.map(renderListing);
	case 'reviews':
		return state.reviews.map(renderReview);
	}
};
