import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import PropertyCard from '../components/PropertyCard';
import BottomSheet from '@gorhom/bottom-sheet';
import styles from 'react-native-loading-spinner-overlay/lib/style';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { BottomListingCard } from '../components';
import { listingService } from '../services';
import { useUser } from '@clerk/clerk-expo';

const landlordId = '663cb48ee88f928f9cb35f69';

const photos = [
	'https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart1.jpeg?alt=media&token=ef9567f0-aa4f-4370-a207-7afc1c22f022',
	'https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart2.jpeg?alt=media&token=b08cc3a8-f2b9-4a75-a8f6-4fa4ee7467c4'
];
const exampleListings = [{
	landlordId: landlordId,
	title: 'Luxury Penthouse in Central Bucharest',
	description: 'Exclusive penthouse offering panoramic city views, top-notch finishes, and private elevator access. Located in the heart of the city.',
	photos: photos,
	address: '15 Calea Victoriei, Bucharest, Romania',
	location: { type: 'Point', coordinates: [26.0963, 44.4323] },
	type: 'apartment',
	price: 2000,
	numberOfRooms: 3,
	numberOfBathrooms: 3,
	size: 120,
	amenities: ['Elevator', 'Pool', 'AirConditioning', 'SecuritySystem'],
	external: false,
	createdAt: new Date(),
	updatedAt: new Date(),
	_id: '0'
},

];


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
					canOpen={true} // Example: You can adjust this based on your requirements
					mode="contained" // Example: You can adjust this based on your requirements
					backgroundColor="white" // Example: You can adjust this based on your requirements
				/>
			))}
		</ScrollView>
	);
};
