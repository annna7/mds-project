import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Checkbox, TextInput } from 'react-native-paper';
import { Button, HeaderText } from '../components';
import { NumberOfBathroomsEnum, NumberOfBedroomsEnum, PropertyTypeEnum } from '../enums';
import { CustomSwitchSelector } from '../components/CustomSwitchSelector';
import { useCustomFonts } from '../hooks/useCustomFonts';
import { theme } from '../theme';
import RentalAmenitiesEnum from '../enums/RentalAmenitiesEnum';
import { MAX_PRICE, MIN_PRICE } from '../utils';
import { AddressSchema, LocationSchema, type IAddress, type ILocation, type IUser } from '../../../backend/src/models/';
import { IListing } from '../models';
import SwitchSelector from 'react-native-switch-selector';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Background from '../components/Background';


export const CreateListingScreen = () => {
	useCustomFonts();
	const [listing, setListing] = useState<IListing>();

	const [title, setTitle] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [address, setAddress] = React.useState<IAddress>();
	const [country, setCountry] = React.useState('');
	const [stateOrProvince, setStateOrProvince] = React.useState('');
	const [city, setCity] = React.useState('');
	const [postalCode, setPostalCode] = React.useState('');
	const [streetNumber, setStreetNumber] = React.useState('');
	const [streetName, setStreetName] = React.useState('');
	const [location, setLocation] = React.useState<ILocation>();
	const [type, setType] = React.useState('');
	const [price, setPrice] = React.useState(1000);
	const [numberOfBedrooms, setNumberOfBedrooms] = React.useState(0);
	const [numberOfBathrooms, setNumberOfBathrooms] = React.useState(0);
	const [size, setSize] = React.useState('');
	const [amenities, setAmenities] = React.useState(['']);
	const [createdAt, setCreateAt] = React.useState(new Date());
	const [updatedAt, setUpdatedAt] = React.useState(new Date());

	const amenitiesArray = Object.entries(RentalAmenitiesEnum);


	const handleSelectAmenity = (amenity) => {
		const updatedAmenities = amenities.includes(amenity)
			? amenities.filter(item => item !== amenity)
			: [...amenities, amenity];
		setAmenities(updatedAmenities );
	};

	return (
		<ScrollView>
			<Card style={{ marginTop: 20, padding:20 }}>
				<View style={styles.container}>
					<View
						style={styles.filtersContainer}
					>
						<HeaderText paddingBottom={10} textAlign={'left'} size={17}>Listing title:</HeaderText>
						<TextInput
							value={title}
							placeholder={'Listing title...'}
							onChangeText={title => setTitle(title)}
						/>

						<HeaderText paddingBottom={10} textAlign={'left'} size={17}>Property Type:</HeaderText>
						<CustomSwitchSelector
							options={[
								{ label: 'Studio', value: PropertyTypeEnum.Studio },
								{ label: 'Apartment', value: PropertyTypeEnum.Apartment },
								{ label: 'House', value: PropertyTypeEnum.House },
							]}
							onPress={type => setType(type)}
							value={type}
							mode={'green'}
						/>

						<HeaderText paddingBottom={10} textAlign={'left'} size={17}>Address:</HeaderText>
						<TextInput
							value={country}
							placeholder={'Country'}
							onChangeText={country => setCountry(country)}
						/>

						<TextInput
							value={stateOrProvince}
							placeholder={'State or Province'}
							onChangeText={name => setStateOrProvince(name)}
						/>

						<TextInput
							value={city}
							placeholder={'City'}
							onChangeText={city => setCity(city)}
						/>
						<TextInput
							value={postalCode}
							placeholder={'Postal Code'}
							onChangeText={postalCode => setPostalCode(postalCode)}
						/>
						<TextInput
							value={streetName}
							placeholder={'Street name'}
							onChangeText={streetName => setStreetName(streetName)}
						/>
						<TextInput
							value={streetNumber}
							placeholder={'Street number'}
							onChangeText={streetNumber => setStreetNumber(streetNumber)}
						/>


						<HeaderText textAlign={'left'} size={17}>Price (monthly fee):</HeaderText>
						<View style={styles.flexContainer}>
							<View>
								<MultiSlider
									values={[price]}
									sliderLength={300}
									onValuesChange={(price) =>{
										setPrice(price);}}
									min={MIN_PRICE}
									max={MAX_PRICE}
									step={1}
									allowOverlap={false}
									snapped
									minMarkerOverlapDistance={40}
									onValuesChangeStart={this.disableScroll}
									onValuesChangeFinish={this.enableScroll}
								/>
								<Text style={styles.priceStyling}>{price} € </Text>

							</View>
						</View>

						<HeaderText paddingBottom={5} textAlign={'left'} size={17}>Number of Bedrooms:</HeaderText>
						<CustomSwitchSelector
							options={[
								{ label: '1', value: NumberOfBedroomsEnum.One },
								{ label: '2', value: NumberOfBedroomsEnum.Two },
								{ label: '3', value: NumberOfBedroomsEnum.Three },
								{ label: '4+', value: NumberOfBedroomsEnum.FourOrMore }
							]}

							mode='green'
							value={numberOfBedrooms}
							onPress={number => setNumberOfBedrooms(number)}
						/>
					 {/*In unele parti e number of rooms in altele number of Bedrooms*/}
						<HeaderText paddingBottom={5} textAlign={'left'} size={17}>Number of Bathrooms:</HeaderText>
						<CustomSwitchSelector
							options={[
								{ label: '1', value: NumberOfBathroomsEnum.One },
								{ label: '2', value: NumberOfBathroomsEnum.Two },
								{ label: '3+', value: NumberOfBathroomsEnum.ThreeOrMore },
							]}
							mode='green'
							value={numberOfBathrooms}
							onPress={number => setNumberOfBathrooms(number)}
						/>

						<HeaderText textAlign={'left'} size={17}>Size (m2):</HeaderText>
						<TextInput
							value={size}
							placeholder={'m2'}
							onChangeText={size => setSize(size)}
						/>
						<HeaderText textAlign={'left'} size={17}>Amenities:</HeaderText>
						<ScrollView>
							{amenitiesArray.map(((amenity, index) => (
								<Checkbox.Item
									labelStyle={styles.checkbox}
									key={index}
									label={amenity[1]}
									status={amenities.includes(amenity[0]) ? 'checked' : 'unchecked'}
									onPress={() => handleSelectAmenity(amenity[0])}
								/>
							)))}
						</ScrollView>
					</View>
					<View style={[styles.buttonsContainer]}>
						<Button width={'auto'} mode={'contained'}> Add </Button>
					</View>
				</View>
			</Card>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	checkbox: {
		fontFamily: 'ProximaNova-Regular'
	},
	flexContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	priceContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	priceStyling: {
		fontFamily: 'ProximaNova-Regular',
		backgroundColor: 'lightgray',
		fontSize: 18,
		margin: 10,
		padding: 10,
		borderRadius: 20,
		elevation: 5,
		borderColor: 'darkgray',
		borderStyle: 'solid',
		borderWidth: 1,
		color: theme.colors.text
	},
	container: {
		flex: 1,
		margin: 10,
		marginTop: 50,
	},
	filtersContainer: {
		elevation: 3,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 20,
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 20
	}
});

