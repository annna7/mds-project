import React from 'react';
import { DrawerContent, OnboardingDecisionScreen } from '../screens';
import { CreateReviewScreen } from '../screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ProfileScreen } from '../screens';
import { AlertsScreen } from '../screens';
import { CreateListingScreen } from '../screens';
import { ChatsScreen }  from '../screens';
import { FavoritesScreen } from '../screens';
import { ListingScreen } from '../screens';
import TopBar from '../components/TopBar';
import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { SearchProvider } from '../contexts/SearchContext';

export type RootStackParamList = {
	Home: undefined,
	Alerts: undefined,
	Chats: undefined,
	CreateReview: undefined,
	CreateListing: undefined,
	Favorites: undefined,
	Profile: undefined,
	Listing: { id: string },
};

export const AppNavigation = () => {
	const Drawer = createDrawerNavigator();
	const { onboardingStep } = useUserDetails();

	return (
		<SearchProvider>
			<NavigationContainer>
				<Drawer.Navigator
					initialRouteName="Home"
					drawerContent={(props) => <DrawerContent {...props} />}
					screenOptions={({ navigation }) => ({
						header: () => <TopBar navigation={navigation} />,
						headerShown: onboardingStep == 3,
						headerTitle: '',
					})}
				>
					<Drawer.Screen name="Home" component={OnboardingDecisionScreen} />
					<Drawer.Screen name="SignIn" component={SignInScreen}/>
					<Drawer.Screen name="SignUp" component={SignUpScreen}/>
					<Drawer.Screen name="Alerts" component={AlertsScreen} />
					<Drawer.Screen name="Chats" component={ChatsScreen} />
					<Drawer.Screen name="CreateReview" component={CreateReviewScreen} />
					<Drawer.Screen name="CreateListing" component={CreateListingScreen} />
					<Drawer.Screen name="Favorites" component={FavoritesScreen} />
					<Drawer.Screen name="Profile" component={ProfileScreen} />
					<Drawer.Screen name="Listing" component={ListingScreen}/>
				</Drawer.Navigator>
			</NavigationContainer>
		</SearchProvider>
	);
};