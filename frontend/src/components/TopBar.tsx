import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	useWindowDimensions
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MenuIcon } from './MenuIcon';
import { theme } from '../theme';
import SwitchSelector from 'react-native-switch-selector';
import { SearchTypeEnum } from '../enums';
import { useSearchContext } from '../contexts/SearchContext';
import { getCoordinatesFromAddress } from '../services/external/googleMapsService';

type TopBarProps = {
	navigation: any,
};

const TopBar: React.FC<TopBarProps> = ({ navigation }) => {
	const { setSearchType, triggerSearch } = useSearchContext();
	const routeName = navigation.getState().routes[navigation.getState().index].name;
	const [searchQuery, setSearchQuery] = useState('');
	const windowWidth = useWindowDimensions().width;

	const changeSearchType = (newType: SearchTypeEnum) => {
		setSearchType(newType);
	};

	// Function to handle search query submission
	const handleSearchQuery = () => {
		if (searchQuery) {
			// Perform geocoding to get coordinates from the address
			getCoordinatesFromAddress(searchQuery)
				.then(region => {
					// Trigger search with the obtained region and clear query after search
					triggerSearch(region, true);
					setSearchQuery('');
				})
				.catch(error => {
					console.error('Geocoding error:', error);
				});
		}
	};

	const searchBar = (
		<Searchbar
			style={styles.searchBar}
			value={searchQuery}
			placeholder="Search by location.."
			onChangeText={setSearchQuery}
			onSubmitEditing={handleSearchQuery}
		/>
	);

	// Render the top bar for the 'Home' route
	const renderHomeTopBar = () => (
		<View style={styles.container}>
			<View style={styles.rowContainer}>
				<View style={[styles.smallerRowContainer, { marginTop: 40 }]}>
					<MenuIcon iconName={'menu'} onPress={() => navigation.openDrawer()} />
					<View style={styles.searchBarContainer}>
						{searchBar}
					</View>
					<MenuIcon iconName="tune" onPress={() => navigation.navigate('Filters')} />
				</View>
			</View>
			<View style={[styles.rowContainer, { width: '80%' }]}>
				<View style={[styles.smallerRowContainer, { marginTop: 20, marginBottom: 10 }]}>
					<SwitchSelector
						options={[
							{ label: 'Listings', value: SearchTypeEnum.Listings },
							{ label: 'Reviews', value: SearchTypeEnum.Reviews },
						]}
						buttonColor={theme.colors.inverseSurface}
						backgroundColor={theme.colors.inversePrimary}
						borderColor={theme.colors.text}
						borderWidth={10}
						initial={0}
						bold={true}
						onPress={(value) => {
							changeSearchType(value);
						}}
					/>
				</View>
			</View>
		</View>
	);

	// Render the default top bar for other routes that do not require a specific top bar
	const renderDefaultTopBar = () => (
		<View style={styles.menuContainer}>
			<MenuIcon iconName={'menu'} onPress={() => navigation.openDrawer()} />
		</View>
	);

	// Main rendering logic based on the current route
	if (routeName === 'Home') {
		return renderHomeTopBar();
	} else {
		// Define routes that should not display the top bar
		const excludedRoutes = ['Filters', 'ReviewGeneralDetails', 'BuildingFeedback', 'AreaFeedback'];
		if (excludedRoutes.includes(routeName)) {
			return null; // Do not render top bar for excluded routes
		} else {
			return renderDefaultTopBar(); // Render default top bar for other routes
		}
	}
};

const styles = StyleSheet.create({
	searchBarContainer: {
		width: '80%',
	},
	container: {
		zIndex: 1000,
		height: 'auto',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		padding: 10,
		backgroundColor: theme.colors.offWhite,
		elevation: 20,
	},
	button: {
		width: 150,
		backgroundColor: 'white',
		borderColor: 'black'
	},
	buttonsContainer: {
		alignSelf: 'center',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	rowContainer: {
		height: 'auto',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
	},
	smallerRowContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
	},
	searchBar: {
		marginLeft: '7%',
		marginRight: '7%'
	},
	menuContainer: {
		position: 'absolute',
		marginLeft: '3%',
		marginTop: '9%'
	}
});

export default TopBar;
