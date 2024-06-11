import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from './src/auth/tokenCache';
import { PaperProvider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { theme } from './src/theme';
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './src/screens/SignUpScreen';
import { UnauthenticatedHomeScreen } from './src/screens';
import { UserDetailsProvider } from './src/contexts/UserDetailsContext';
import { AppNavigation } from './src/components';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignInScreen from './src/screens/SignInScreen';

const Stack = createNativeStackNavigator();
export default function App() {
	return (
		<ClerkProvider
			tokenCache={tokenCache}
			publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
			<PaperProvider theme={theme}>
				<SignedIn>
					<UserDetailsProvider>
						<AppNavigation/>
					</UserDetailsProvider>
				</SignedIn>
				<SignedOut>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<NavigationContainer>
							<Stack.Navigator
								initialRouteName={'Home'}
								screenOptions={{
									headerShown: false
								}}>
								<Stack.Screen name="Home" component={UnauthenticatedHomeScreen}/>
								<Stack.Screen name="SignIn" component={SignInScreen}/>
								<Stack.Screen name="SignUp" component={SignUpScreen}/>
							</Stack.Navigator>
						</NavigationContainer>
					</GestureHandlerRootView>
				</SignedOut>
			</PaperProvider>
		</ClerkProvider>
	);
}