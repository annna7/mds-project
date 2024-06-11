import React from 'react';
import { View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../components';
import { useUser } from '@clerk/clerk-expo';
import { useListing } from '../hooks';

type ListingScreenRouteProp = RouteProp<RootStackParamList, 'Listing'>;

export const ListingScreen: React.FC = () => {
	const route = useRoute<ListingScreenRouteProp>();
	const { id } = route.params;
	const { user } = useUser();
	const { listing } = useListing(id, user?.id as string);

	if (listing == null) {
		return <Text>Error - listing not found</Text>;
	}

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Listing: {id}, {listing?.title}, {listing.title}</Text>
		</View>
	);
};

