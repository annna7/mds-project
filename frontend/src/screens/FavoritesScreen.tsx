import React, { useEffect, useState } from 'react';
import {  View, ScrollView } from 'react-native';
import PropertyCard from '../components/PropertyCard';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { HeaderText } from '../components';
import { listingService } from '../services';
import { useUser } from '@clerk/clerk-expo';
import { StyleSheet } from 'react-native';

export const FavoritesScreen: React.FC = () => {
	const { favoriteListings } = useUserDetails();
	const { user } = useUser();
	const [listings, setListings] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	if(listings)
		useEffect(() => {
			const fetchListings = async () => {
				const fetchedListings = await Promise.all(favoriteListings.map(id => listingService.getListing(id, user?.id)));
				setListings(fetchedListings.filter(listing => listing !== null));
				setLoading(false);
			};

			fetchListings();
		}, [favoriteListings]);
	return (
		<View style={styles.wrapper}>
			<ScrollView style={styles.container}>
				<HeaderText size={40}>
					Check out your favorite listings!
				</HeaderText>
				{listings.map((listing) => (
					<PropertyCard
						key={listing._id}
						listing={listing}
						canOpen={true}
						mode="contained"
						showCarousel={false}
						showFavorite={false}
						backgroundColor="white"
					/>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	'container': {
		width: '100%',
	},
	'wrapper': {
		marginTop: 50,
		width: '100%'
	}
})