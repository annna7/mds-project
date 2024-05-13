import React, { useEffect, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from './src/auth/tokenCache';
import { PaperProvider } from 'react-native-paper';
import { Text, StyleSheet, View, ImageBackground } from 'react-native';
import { theme } from './src/theme';
import Background from './src/components/Background';
import SignInScreen from './src/screens/SignInScreen';
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@env';
import { UnauthenticatedHomeScreen } from './src/screens/UnauthenticatedHomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './src/screens/SignUpScreen';
import { OnboardingDecisionScreen } from './src/screens';
import { UserDetailsProvider } from './src/contexts/UserDetailsContext';
///import { uploadFile } from './src/services';

const Stack = createNativeStackNavigator();
export default function App() {
	return (
		<ClerkProvider
			tokenCache={tokenCache}
			publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
			<PaperProvider theme={theme}>
				<SignedIn>
					<UserDetailsProvider>
						<NavigationContainer>
							<OnboardingDecisionScreen/>
						</NavigationContainer>
					</UserDetailsProvider>
				</SignedIn>
				<SignedOut>
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
				</SignedOut>
			</PaperProvider>
		</ClerkProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});


// const [myData, setMyData] = useState<string>('');
//
// const fetchData = async (): Promise<void> => {
// 	try {
// 		console.log('Fetching data...');
// 		const url = `${config.api.baseUrl}/api/secret`;
// 		console.log('URL:', url);
// 		const response = await axios.get<string>(url);
// 		console.log('Data fetched:', response.data);
// 		setMyData(response.data);
// 	} catch (error) {
// 		console.error('Error fetching data:', error);
// 	}
// };
