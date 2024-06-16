import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { IListing } from '../models';
import { DetailBox, HeaderText } from '.';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import Carousel from 'react-native-reanimated-carousel';
import { PropertyTypeEnum } from '../enums';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCustomFonts } from '../hooks/useCustomFonts';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';
import { useUser } from '@clerk/clerk-expo';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { includes } from 'lodash';
import userService from '../services/internal/userService';
import Spinner from 'react-native-loading-spinner-overlay';

type PropertyCardProps = {
	listing: IListing,
	canOpen: boolean,
	mode?: string,
	backgroundColor?: string,
	showCarousel?: boolean,
	showFavorite: boolean
};


export const PropertyCard: React.FC<PropertyCardProps> = ({ listing,
															  canOpen,
															  mode,
															  backgroundColor,
															  showCarousel = true,
															  showFavorite
														  }) => {
	useCustomFonts();

	const getOpenMessage = useCallback(() => {
		if (!listing.external) {
			return 'Open';
		} else if (listing.url?.startsWith('https://www.storia')) {
			return 'Go to Storia';
		} else {
			return 'Go to Olx';
		}
	}, []);

	const { favoriteListings, setFavoriteListings } = useUserDetails();
	const [isFavorite, setIsFavorite] = useState(listing._id in favoriteListings);
	const { navigate } = useNavigation();
	const width = Dimensions.get('window').width;
	const [pressed, setPressed] = useState(isFavorite); // State to manage pressed state of the button

	const { user } = useUser();
	const open = useCallback(() => {
		if (!listing.external) {
			navigate('Listing', { id: listing._id });
		} else {
			Linking.openURL(listing.url as string);
		}
	}, [listing, navigate]);

	const updateFavoriteListings = async (updatedFavorites: string[]) => {
		try {
			await userService.updateUser(user?.id ?? '', { favoriteListings: updatedFavorites });
			// useUserDetails().favoriteListings = updatedFavorites;
		} catch (error) {
			console.error('Failed to update favorite listings:', error);
		}
	};

	if (!user?.id) {
		return <Spinner></Spinner>
	}

	const toggleFavorite = useCallback(async () => {
		console.log('toggle fav');
		setPressed((prev) => !prev);
		setIsFavorite(!isFavorite);
		const id_ = user?.id;
		setFavoriteListings((prevFavorites) => {
			if (prevFavorites.includes(listing._id)) {
				const list = prevFavorites.filter(id => id !== listing._id);
				updateFavoriteListings(list);
				return list;
			} else {
				const list = [...prevFavorites, listing._id];
				updateFavoriteListings(list);
				return list;
			}

		});

	}, [listing._id, setFavoriteListings]);

	return (
		<Card mode={mode ?? 'elevated'} key={listing._id} style={[styles.cardContainer, { backgroundColor: backgroundColor ?? theme.colors.background }]}>
			<View style={styles.contentContainer}>
				<View style={styles.imageContainer}>
					{canOpen && (
						<Button mode="elevated" style={styles.openButton} onPress={() => open()}>{getOpenMessage()}</Button>
					)}
					{showCarousel ? (
						<Carousel
							loop
							width={width - 100}
							height={width / 2}
							autoPlay={true}
							data={listing.photos}
							autoPlayInterval={5000}
							scrollAnimationDuration={1000}
							renderItem={({ index }) => (
								<View>
									<Image
										style={styles.image}
										source={{
											uri: listing.photos[index],
										}}
										contentFit={'cover'}
									/>
								</View>
							)}
						/>
					) : (
						<Image
							style={[styles.image, { width: width - 100 }]}
							source={{
								uri: listing.photos[0],
							}}
							contentFit="cover"
						/>
					)}
					{showFavorite && <MaterialCommunityIcons
						name={(favoriteListings.includes(listing._id)) ? 'heart' : 'heart'}
						size={40}
						color={(favoriteListings.includes(listing._id)) ? 'red' : 'gray'}
						style={styles.heartIcon}
						onPress={toggleFavorite}
					/>}
				</View>
				<HeaderText paddingTop={0} paddingBottom={3} size={20}>
					{listing.title} - {listing.price} €
				</HeaderText>
				<Text style={styles.address}>{listing.address}</Text>
				<View style={[styles.detailRow, { marginBottom: 15 }]}>
					<DetailBox>
						<Text style={styles.contentText}> {listing.size} m2 </Text>
					</DetailBox>
					<DetailBox>
						<Text style={styles.contentText}>{listing.type}</Text>
					</DetailBox>
					{listing.type !== PropertyTypeEnum.Studio && (
						<DetailBox>
							<Text style={styles.contentText}>{listing.numberOfRooms}</Text>
							<MaterialCommunityIcons
								style={styles.icon}
								name={'bed-king-outline'}
								size={20}
								color={'white'}
							/>
						</DetailBox>
					)}
					{listing.type !== PropertyTypeEnum.Studio && (
						<DetailBox>
							<Text style={styles.contentText}>{listing.numberOfBathrooms}</Text>
							<MaterialCommunityIcons
								style={styles.icon}
								name={'bathtub'}
								size={20}
								color={'white'}
							/>
						</DetailBox>
					)}
				</View>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	contentText: {
		color: 'white',
		fontSize: 16,
		fontFamily: 'ProximaNova-Bold',
	},
	icon: {
		marginLeft: 3,
	},
	detailRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	address: {
		marginBottom: 5,
		fontSize: 16,
		fontFamily: 'ProximaNova-Regular',
		textAlign: 'center',
	},
	cardContainer: {
		zIndex: 1000,
		height: 375,
		marginHorizontal: 15,
	},
	contentContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 30,
	},
	imageContainer: {
		width: '100%',
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30,
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		borderRadius: 10,
	},
	openButton: {
		zIndex: 100,
		position: 'absolute',
		top: 5,
		right: '10%',
	},
	heartIcon: {
		position: 'absolute',
		bottom: 0,
		right: 40,
	},
});

export default PropertyCard;
