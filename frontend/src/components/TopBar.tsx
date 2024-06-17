import React from 'react';
import {
	View,
	StyleSheet
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
	const { state, setSearchType, triggerSearch } = useSearchContext();
	const routeName = navigation.getState().routes[navigation.getState().index].name;
	const [searchQuery, setSearchQuery] = React.useState('');

	const changeSearchType = (newType: SearchTypeEnum) => {
		setSearchType(newType);
	};

	const handleSearchQuery = () => {
		if (searchQuery) {
			getCoordinatesFromAddress(searchQuery)
				.then(region => {
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

	if (routeName === 'Home') {
		return (
			<View style={styles.container}>
				<View style={styles.rowContainer}>
					<View style={[styles.smallerRowContainer, { marginTop: 40 }]}>
						<MenuIcon iconName={'menu'} onPress={() => navigation.openDrawer()} />
						<View style={styles.searchBarContainer}>
							{searchBar}
						</View>
						<MenuIcon iconName="tune" onPress={() => navigation.navigate('Filters')}/>
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
							initial={state.searchType === 'listings' ? 0 : 1}
							bold={true}
							onPress={(value) => {
								changeSearchType(value);
							}}
						/>
					</View>
				</View>
			</View>
		);
	} else if (routeName === 'Filters' || routeName === 'ReviewGeneralDetails' || routeName === 'BuildingFeedback'
		|| routeName === 'AreaFeedback') {
		return null;
	} else {
		return (
			<View style={styles.menuContainer}>
				<MenuIcon iconName={'menu'} onPress={() => {navigation.openDrawer();}}/>
			</View>
		);
	}
};

export default TopBar;

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
	/* TODO: maybe fix hardcoded? */
	menuContainer: {
		position: 'absolute',
		marginLeft: '3%',
		marginTop: '9%'
	}
});
