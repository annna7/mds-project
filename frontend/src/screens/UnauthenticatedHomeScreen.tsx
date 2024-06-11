import Background from '../components/Background';
import React from 'react';
import Logo from '../components/Logo';
import { HeaderText } from '../components/';
import { View } from 'react-native';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

export const UnauthenticatedHomeScreen = () => {
	const { navigate } = useNavigation();

	return (
		<Background>
			<Logo/>
			<HeaderText size={24}> Real Reviews, Real Homes</HeaderText>
			<View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
				<View style={{ flex: 1, marginRight: 5 }}>
					<Button mode="contained" onPress={() => navigate('SignIn')}> Login </Button>
				</View>
				<View style={{ flex: 1, marginLeft: 5 }}>
					<Button mode="contained" onPress={() => navigate('SignUp')}> Register </Button>
				</View>
			</View>
		</Background>
	);
};
