import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { DEFAULT_LATITUDE_DELTA, DEFAULT_LONGITUDE_DELTA, mapStyles } from '../utils';

interface MapInputProps {
	onLocationChange: (latitude: number, longitude: number) => void;
}

export const MapInput: React.FC<MapInputProps> = ({ onLocationChange }) => {	const [location, setLocation] = useState<Location.LocationObject | null>(null);
	const [region, setRegion] = useState<Region | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}
			// Get the real-time location of the user
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
			setRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: DEFAULT_LATITUDE_DELTA,
				longitudeDelta: DEFAULT_LONGITUDE_DELTA,
			});
		})();
	}, []);

	const handleMapPress = (event: MapPressEvent) => {
		const { coordinate } = event.nativeEvent;
		setLocation({
			coords: {
				latitude: coordinate.latitude,
				longitude: coordinate.longitude,
			},
		});
		setRegion((prevRegion) => ({
			...prevRegion,
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
		}));
		onLocationChange(coordinate.latitude, coordinate.longitude);
	};

	if (errorMsg) {
		return <Text>{errorMsg}</Text>;
	}

	return (
		<View style={styles.container}>
			<MapView
				customMapStyle={mapStyles}
				style={styles.map}
				initialRegion={region}
				showsUserLocation={true}
				onPress={handleMapPress}
			>
				{location && (
					<Marker
						coordinate={{
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
						}}
					/>
				)}
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchBarContainer: {
		position: 'absolute',
		top: 20,
		width: '100%',
		zIndex: 999,
		paddingHorizontal: 10,
	},
	map: {
		height: 300
	},
});
