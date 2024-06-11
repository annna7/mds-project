import React from 'react';
import { View } from 'react-native';
import { BottomBar, Map } from '../components';

export const HomeScreen = () => {
	return (
		<View style={{ flex: 1 }}>
			<Map />
			<BottomBar/>
		</View>
	);
};


