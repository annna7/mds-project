import React from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';
import { theme } from '../theme';
import { useCustomFonts } from '../hooks/useCustomFonts';

const  PropertyDetails: React.FC<any> = ({ listing }) => {
	return (
		<View style={styles.container}>
			<View style={styles.detailsContainer}>
				<View style={styles.row}>
					<View style={[styles.cell, styles.borderBottom]}>
						<Text style={styles.label}>City:</Text>
						<Text style={styles.value}>{listing.address.city}</Text>
					</View>
					<View style={[styles.cell, styles.borderBottom]}>
						<Text style={styles.label}>Rooms:</Text>
						<Text style={styles.value}>{listing.numberOfRooms}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={[styles.cell, styles.borderBottom]}>
						<Text style={styles.label}>Bathrooms:</Text>
						<Text style={styles.value}>{listing.numberOfBathrooms}</Text>
					</View>
					<View style={[styles.cell, styles.borderBottom]}>
						<Text style={styles.label}>Size:</Text>
						<Text style={styles.value}>{listing.size} m2</Text>
					</View>
				</View>
			</View>
			<View style={styles.amenitiesList}>
				<Text style={styles.label}>Amenities:</Text>
				{listing.amenities.map((amenity, index) => (
					<Text key={index} style={styles.amenity}>  {`\u2022  ${amenity}`}</Text>
				))}
			</View>

		</View>
	);
};


const styles = StyleSheet.create({
	container:{
		paddingVertical: 10,
		fontFamily: 'Proxima-Nova/Regular'
	},
	detailsContainer: {
		paddingBottom: 10,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	cell: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 5,
		width: '48%',
		fontFamily: 'Proxima-Nova/Regular'
	},
	label: {
		fontSize: 16,
		fontFamily: 'ProximaNova-Bold',
	},
	value: {
		fontSize: 16,
	},
	borderRight: {
		borderRightWidth: 1,
		borderColor: '#ccc',
	},
	borderBottom: {
		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
	amenitiesList: {
		marginTop: 5,
		height: 'fit-content',
	},
	amenity: {
		fontSize: 16,
		marginLeft: 5,
		fontFamily: 'Proxima-Nova/Regular'
	},
});

export default PropertyDetails;
