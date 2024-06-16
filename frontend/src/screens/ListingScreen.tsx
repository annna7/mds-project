import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../components';
import { useUser } from '@clerk/clerk-expo';
import { useListing } from '../hooks';
import Background from '../components/Background';
import Carousel from 'react-native-reanimated-carousel';
import PropertyDetails from '../components/PropertyDetails';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import LandlordDetails from '../components/LandlordDetails';
import { useCustomFonts } from '../hooks/useCustomFonts';

type ListingScreenRouteProp = RouteProp<RootStackParamList, 'Listing'>;

export const ListingScreen: React.FC = () => {
	const route = useRoute<ListingScreenRouteProp>();
	const { id } = route.params;
	const { user } = useUser();
	const { listing } = useListing(id, user?.id as string);
	const width = Dimensions.get('window').width;
	const customFont = useCustomFonts();
	if (listing == null) {
		return <Text>Error - listing not found</Text>;
	}

	return (
		<ScrollView contentContainerStyle={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
			<Background>
				<Card style={styles.container}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{listing.title}</Text>
						<Text style={styles.price}>Price: {listing.price} €</Text>
						<Text>
							<Icon name={'map-marker'}/>
							{listing.address}
						</Text>
					</View>
					<Carousel
						loop
						width={width - 100}
						height={width / 2}
						autoPlay={true}
						data= {listing.photos}
						autoPlayInterval={5000}
						scrollAnimationDuration={1000}
						renderItem={({ index }) => (
							<View>
								<Image
									style={styles.image}
									source={{
										uri: listing.photos[index]
									}}
								/>
							</View>
						)}
					/>
					<PropertyDetails listing = {listing}/>
					<Text style={styles.description}>{listing.description}</Text>

				</Card>
			</Background>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		marginVertical: 20,
		paddingVertical: 20,
		margin: 10,
		backgroundColor: 'white',
		fontFamily: 'ProximaNova-Regular'
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 10,
	},
	titleContainer:{
		paddingBottom: 20,
	},
	title: {
		fontSize: 25,
		fontFamily: 'ProximaNova-Bold',
	},
	description: {
		marginTop: 5,
		marginBottom: 10,
		fontFamily: 'ProximaNova-Regular',
	},
	price: {
		fontFamily: 'ProximaNova-Bold',
		paddingVertical: 5,
		fontSize: 20,
		color: 'green',
	},

});

