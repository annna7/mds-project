import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import PropertyCard from '../components/PropertyCard';
import BottomSheet from '@gorhom/bottom-sheet';
import styles from 'react-native-loading-spinner-overlay/lib/style';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { BottomListingCard } from '../components';
import { listingService } from '../services';
import { useUser } from '@clerk/clerk-expo';


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
		<ScrollView style={styles.container}>
			{listings.map((listing) => (
				<PropertyCard
					key={listing._id} // Ensure each component in a list has a unique key prop
					listing={listing}
					isFavorite={favoriteListings.includes(listing._id)}
					canOpen={true}
					mode="contained"
					backgroundColor="white"
				/>
			))}
		</ScrollView>
	);
};
