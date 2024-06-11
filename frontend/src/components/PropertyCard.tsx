import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { IListing } from '../models';
import { DetailBox, HeaderText } from '.';
import { useNavigation } from '@react-navigation/native';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { theme } from '../theme';

type PropertyCardProps = {
	listing: IListing,
	canOpen: boolean,
	mode?: string,
	backgroundColor?: string,
};

const PropertyCard: React.FC<PropertyCardProps> = ({ listing, canOpen, mode, backgroundColor  }) => {
	const { navigate }  = useNavigation();
	return (
		<Card mode={mode ?? 'elevated'} key={listing._id} style={[styles.cardContainer, {
			backgroundColor: backgroundColor ?? theme.colors.background
		}]}>
			<View style={styles.contentContainer}>
				<View style={styles.imageContainer}>
					{canOpen && (
						<Button
							mode="elevated"
							style={styles.openButton}
							onPress={() => navigate('Listing', { id: listing._id })}
						>
							Open
						</Button>
					)}
					{/* TODO: de pus o galerie mai frumoasa */}
					<Image
						source={{
							uri: listing.photos[0]
						}}
						style={styles.image}
					/>
				</View>
				<HeaderText paddingTop={0} paddingBottom={10} size={20}> {listing.price} RON </HeaderText>
				<Text style={styles.address}>
					{listing.address.streetName} {listing.address.streetNumber}, {listing.address.city}
				</Text>
				<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
					<DetailBox content={`${listing.size} m2`}/>
					<DetailBox content={`${listing.numberOfRooms} bedrooms`}/>
					<DetailBox content={`${listing.numberOfBathrooms} bathrooms`}/>
				</View>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	address: {
		marginBottom: 15,
		fontSize: 16,
		fontFamily: 'ProximaNova-Regular'
	},
	cardContainer: {
		zIndex: 1000,
		padding: 30,
		height: 350,
		marginHorizontal: 15,
		marginBottom: 30
	},
	contentContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%'
	},
	imageContainer: {
		marginTop: 100,
		width: '100%',
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	openButton: {
		zIndex: 100,
		position: 'absolute',
		top: 5,
		left: '74%'
	}
});

export default PropertyCard;
