import React from 'react';
import { Card, Text } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';
import { theme } from '../theme';
import { useUserData } from '../hooks/useUserData';
import Button from '../components/Button';
import { useCustomFonts } from '../hooks/useCustomFonts';


const  LandlordDetails: React.FC<any> = ({ landlordID }) => {
	const customFont = useCustomFonts();
	const { user } = useUserData(landlordID);
	return (
		<Card style={styles.container}>
			<Text style={styles.landlordTitle}>Contact the landlord</Text>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Image style={styles.landlordProfilePicture} source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }} />
				<Text style={styles.landlordName}>{user.role}</Text>
			</View>
			<Button mode={'elevated'}>Send a message</Button>
		</Card>
	);
};
//TODO: add on press for button
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		marginVertical: 10,
		backgroundColor: theme.colors.primary,
		color: 'white',
		fontFamily: 'ProximaNova-Regular',
	},
	landlordTitle: {
		fontFamily: 'ProximaNova-Bold',
		fontSize: 20,
		paddingHorizontal: 5,
		color: 'white',
		marginBottom: 10,
	},
	landlordProfilePicture: {
		width: 70,
		height: 70,
		borderRadius: 35,
		marginBottom: 10,
		marginRight:5,
	},
	landlordName: {
		fontSize: 16,
		marginBottom: 5,
		fontFamily: 'ProximaNova-Regular',
		color: 'white',
	},
	landlordEmail: {
		fontSize: 14,
	},

});

export default LandlordDetails;
