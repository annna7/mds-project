import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Button, HeaderText } from '../components';
import { NumberOfBathroomsEnum, NumberOfBedroomsEnum, PropertyTypeEnum, TypeOfProviderEnum } from '../enums';
import { CustomSwitchSelector } from '../components/CustomSwitchSelector';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useCustomFonts } from '../hooks/useCustomFonts';
import { theme } from '../theme';
import RentalAmenitiesEnum from '../enums/RentalAmenitiesEnum';
import { MAX_PRICE, MIN_PRICE } from '../utils';
import { useSearchContext } from '../contexts/SearchContext';
import { debounce } from 'lodash';

export const FiltersScreen = ({ navigation }) => {
	const [cleared, setCleared] = useState(false);
	const { state, setFilters, triggerSearch } = useSearchContext();
	const { filters } = state;
	const amenitiesArray = Object.entries(RentalAmenitiesEnum);

	const priceRangeRef = useRef([filters.priceRange.min, filters.priceRange.max]);
	const roomTypeRef = useRef(filters.roomType);
	const bedroomsRef = useRef(filters.bedrooms);
	const bathroomsRef = useRef(filters.bathrooms);
	const providerRef = useRef(filters.provider || TypeOfProviderEnum.Any);

	const recommendOptions = [
		{ label: 'Any', value: -1},
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '4', value: 4 },
		{ label: '5', value: 5 },
	];

	const clearFilters = () => {
		setFilters({
			roomType: PropertyTypeEnum.Any,
			priceRange: { min: MIN_PRICE, max: MAX_PRICE },
			bedrooms: NumberOfBedroomsEnum.Any,
			bathrooms: NumberOfBathroomsEnum.Any,
			amenities: [],
			provider: TypeOfProviderEnum.Any,
			recommend: -1,
		});
		setCleared(true);
	};

	const navigateToHome = () => setTimeout(() => navigation.navigate('Home'), 500);

	useEffect(() => {
		if (cleared) {
			triggerSearch();
			setCleared(false);
			navigateToHome();
		}
	}, [cleared]);

	const handleSearch = () => {
		triggerSearch();
		navigateToHome();
	};

	const handleSelectAmenity = (amenity) => {
		const updatedAmenities = filters.amenities.includes(amenity)
			? filters.amenities.filter(item => item !== amenity)
			: [...filters.amenities, amenity];
		setFilters({
			...filters,
			amenities: updatedAmenities,
			provider: TypeOfProviderEnum.Internal
		});
		providerRef.current = TypeOfProviderEnum.Internal;
	};


	const handlePriceChange = useCallback(
		(values) => {
			priceRangeRef.current = values;
			setFilters({ ...filters, priceRange: { min: values[0], max: values[1] } });
		},
		[filters]
	);

	const handleRoomChange = useCallback(debounce((value) => {
		roomTypeRef.current = value;
		const newFilters = { ...filters, roomType: value };
		if (value === PropertyTypeEnum.Studio) {
			newFilters.bedrooms = NumberOfBedroomsEnum.One;
			newFilters.bathrooms = NumberOfBathroomsEnum.One;
		} else if (filters.roomType === PropertyTypeEnum.Studio) {
			newFilters.bedrooms = NumberOfBedroomsEnum.Any;
			newFilters.bathrooms = NumberOfBathroomsEnum.Any;
		}
		setFilters(newFilters);
	}, 50), [filters]);

	const handleChangeBedrooms = useCallback(debounce((value) => {
		bedroomsRef.current = value;
		setFilters({ ...filters, bedrooms: value });
	}, 50), [filters]);

	const handleChangeBathrooms = useCallback(debounce((value) => {
		bathroomsRef.current = value;
		setFilters({ ...filters, bathrooms: value });
	}, 30), [filters]);

	const handleProviderChange = useCallback(debounce((value) => {
		if (value === TypeOfProviderEnum.Storia || value === TypeOfProviderEnum.Olx) {
			setFilters({
				...filters,
				provider: value,
				amenities: []
			});
		} else {
			setFilters({
				...filters,
				provider: value
			});
		}
		providerRef.current = value;
	}, 50), [filters]);

	const propertyFilters = (
		<View style={styles.container}>
		<HeaderText paddingBottom={10} textAlign="left" size={17}>Property Type:</HeaderText>
	<CustomSwitchSelector
		options={[
			{ label: 'Any', value: PropertyTypeEnum.Any },
			{ label: 'Studio', value: PropertyTypeEnum.Studio },
			{ label: 'Apartment', value: PropertyTypeEnum.Apartment },
			{ label: 'House', value: PropertyTypeEnum.House },
		]}
		onPress={handleRoomChange}
		value={roomTypeRef.current}
		mode="green"
	/>

	<HeaderText paddingBottom={10} textAlign="left" size={17}>Source of Listing:</HeaderText>
	<CustomSwitchSelector
		options={[
			{ label: 'Any', value: TypeOfProviderEnum.Any },
			{ label: 'Internal', value: TypeOfProviderEnum.Internal },
			{ label: 'Storia', value: TypeOfProviderEnum.Storia },
			{ label: 'Olx', value: TypeOfProviderEnum.Olx },
		]}
		onPress={handleProviderChange}
		value={filters.provider}
		mode="green"
	/>

	<HeaderText textAlign="left" size={17}>Price Range (monthly fee):</HeaderText>
	<View style={styles.flexContainer}>
		<View style={styles.priceContainer}>
			<Text style={styles.priceStyling}>{priceRangeRef.current[0]} € </Text>
			<Text> - </Text>
			<Text style={styles.priceStyling}>{priceRangeRef.current[1]} € </Text>
		</View>
		<MultiSlider
			trackStyle={{ height: 3 }}
			values={priceRangeRef.current}
			sliderLength={300}
			onValuesChangeFinish={handlePriceChange}
			min={MIN_PRICE}
			max={MAX_PRICE}
			step={1}
			allowOverlap={false}
			snapped
			minMarkerOverlapDistance={40}
		/>
	</View>

	<HeaderText paddingTop={0} paddingBottom={5} textAlign="left" size={17}>Number of Bedrooms:</HeaderText>
	<CustomSwitchSelector
		options={[
			{ label: 'Any', value: NumberOfBedroomsEnum.Any },
			{ label: '1', value: NumberOfBedroomsEnum.One },
			{ label: '2', value: NumberOfBedroomsEnum.Two },
			{ label: '3', value: NumberOfBedroomsEnum.Three },
			{ label: '4+', value: NumberOfBedroomsEnum.FourOrMore }
		]}
		mode="green"
		value={filters.bedrooms}
		onPress={handleChangeBedrooms}
		disabled={roomTypeRef.current === PropertyTypeEnum.Studio}
	/>

	<HeaderText paddingBottom={5} textAlign="left" size={17}>Number of Bathrooms:</HeaderText>
	<CustomSwitchSelector
		options={[
			{ label: 'Any', value: NumberOfBathroomsEnum.Any },
			{ label: '1', value: NumberOfBathroomsEnum.One },
			{ label: '2', value: NumberOfBathroomsEnum.Two },
			{ label: '3+', value: NumberOfBathroomsEnum.ThreeOrMore },
		]}
		mode="green"
		value={filters.bathrooms}
		onPress={handleChangeBathrooms}
		disabled={roomTypeRef.current === PropertyTypeEnum.Studio}
	/>

	<HeaderText textAlign="left" size={17}>Amenities (only for internal listings):</HeaderText>

	<ScrollView>
		{amenitiesArray.map((amenity, index) => (
			<Checkbox.Item
				labelStyle={styles.checkbox}
				key={index}
				label={amenity[1]}
				disabled={providerRef.current !== TypeOfProviderEnum.Internal && providerRef.current !== TypeOfProviderEnum.Any}
				status={filters.amenities.includes(amenity[0]) ? 'checked' : 'unchecked'}
				onPress={() => handleSelectAmenity(amenity[0])}
			/>
		))}
	</ScrollView>
		</View>
			);

	const buttons = (
		<View style={[styles.buttonsContainer]}>
			<Button width={'auto'} mode={'contained-tonal'} onPress={clearFilters}> Clear All </Button>
			<Button width={'auto'} mode={'contained-tonal'} onPress={handleSearch}> Search </Button>
		</View>
	)

	const reviewFilters = (
		<View style={styles.container}>
			<HeaderText paddingBottom={20} textAlign="left" size={20}>Recommendation Rating:</HeaderText>
			<CustomSwitchSelector
				options={recommendOptions}
				initial={2}
				onPress={(value) => setFilters({...filters, recommend: value })}
				value={filters.recommend}
				mode="green"
			/>
		</View>
	)

	return (
		<React.Fragment>
			{state.searchType === 'listings' ? propertyFilters : reviewFilters}
			<View style={{height: 100}}/>
			{buttons}
		</React.Fragment>
	);
};

const styles = StyleSheet.create({
	checkbox: {
		fontFamily: 'Proxima-Nova/Regular'
	},
	flexContainer: {
		display: 'flex',
		alignItems: 'center',
	},
	priceContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	priceStyling: {
		fontFamily: 'Proxima-Nova/Regular',
		backgroundColor: 'lightgray',
		fontSize: 18,
		padding: 10,
		margin: 10,
		marginBottom: 0,
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
		maxHeight: '90%',
		elevation: 3,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	}
});

export default FiltersScreen;
