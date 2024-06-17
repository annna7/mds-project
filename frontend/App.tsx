// import React, { useState } from 'react';
// import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
// import { tokenCache } from './src/auth/tokenCache';
// import { PaperProvider } from 'react-native-paper';
// import { StyleSheet } from 'react-native';
// import { theme } from './src/theme';
// import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@env';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SignUpScreen from './src/screens/SignUpScreen';
// import { UnauthenticatedHomeScreen } from './src/screens';
// import { UserDetailsProvider } from './src/contexts/UserDetailsContext';
// import { AppNavigation } from './src/navigation';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import SignInScreen from './src/screens/SignInScreen';
// import AppLoading from 'expo-app-loading';
// import { useCustomFonts } from './src/hooks/useCustomFonts';
//
// const Stack = createNativeStackNavigator();
// export default function App() {
// 	const [isReady, setIsReady] = useState<boolean>(false);
// 	const loadFonts = async () => {
// 		await useCustomFonts();
// 	}
//
// 	if (!isReady) {
// 		return (
// 			<AppLoading
// 				startAsync={loadFonts}
// 				autoHideSplash={true}
// 				onFinish={() => setIsReady(true)}
// 				onError={() => {}}
// 			/>
// 		)
// 	}
//
// 	return (
// 		<ClerkProvider
// 			tokenCache={tokenCache}
// 			publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
// 			<PaperProvider theme={theme}>
// 				<SignedIn>
// 					<UserDetailsProvider>
// 						<AppNavigation/>
// 					</UserDetailsProvider>
// 				</SignedIn>
// 				<SignedOut>
// 					<GestureHandlerRootView style={{ flex: 1 }}>
// 						<NavigationContainer>
// 							<Stack.Navigator
// 								initialRouteName={'Home'}
// 								screenOptions={{
// 									headerShown: false
// 								}}>
// 								<Stack.Screen name="Home" component={UnauthenticatedHomeScreen}/>
// 								<Stack.Screen name="SignIn" component={SignInScreen}/>
// 								<Stack.Screen name="SignUp" component={SignUpScreen}/>
// 							</Stack.Navigator>
// 						</NavigationContainer>
// 					</GestureHandlerRootView>
// 				</SignedOut>
// 			</PaperProvider>
// 		</ClerkProvider>
// 	);
// }
import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Alert} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { tokenCache } from './src/auth/tokenCache';
import { PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './src/screens/SignUpScreen';
import { UnauthenticatedHomeScreen } from './src/screens';
import { UserDetailsProvider } from './src/contexts/UserDetailsContext';
import { AppNavigation } from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignInScreen from './src/screens/SignInScreen';
import { useCustomFonts } from './src/hooks/useCustomFonts';
import {useNotificationManager} from "./src/hooks/useNotificationManager";

const Stack = createNativeStackNavigator();

export default function App() {
	const [appIsReady, setAppIsReady] = useState(false);
	const { subscribe, unsubscribe } = useNotificationManager();

	useEffect(() => {
		const handleNewMessage = (message) => {
			Alert.alert("New Message", message.text);
		};
		console.log('subscribe');
		subscribe('messageReceived', handleNewMessage);
		return () => {
			console.log("unsubscribe");
			unsubscribe('messageReceived', handleNewMessage);
		};
	}, [subscribe, unsubscribe]);

	useEffect(() => {
		async function prepare() {
			try {
				// Keep the splash screen visible while we fetch resources
				await SplashScreen.preventAutoHideAsync();
				// Load fonts and perform any other setup
				await useCustomFonts();
			} catch (e) {
				console.warn(e);
			} finally {
				// After loading resources, hide the splash screen
				setAppIsReady(true);
				await SplashScreen.hideAsync();
			}
		}

		prepare();
	}, []);

	if (!appIsReady) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" />
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<ClerkProvider tokenCache={tokenCache} publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
			<PaperProvider theme={theme}>
				<SignedIn>
					<UserDetailsProvider>
						<AppNavigation />
					</UserDetailsProvider>
				</SignedIn>
				<SignedOut>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<NavigationContainer>
							<Stack.Navigator initialRouteName={'Home'} screenOptions={{ headerShown: false }}>
								<Stack.Screen name="Home" component={UnauthenticatedHomeScreen} />
								<Stack.Screen name="SignIn" component={SignInScreen} />
								<Stack.Screen name="SignUp" component={SignUpScreen} />
							</Stack.Navigator>
						</NavigationContainer>
					</GestureHandlerRootView>
				</SignedOut>
			</PaperProvider>
		</ClerkProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
