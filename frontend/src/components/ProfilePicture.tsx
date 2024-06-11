import React from 'react';
import { Image, ImageProps, StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { uploadProfilePicture } from '../services';
import { useUser } from '@clerk/clerk-expo';
import userService from '../services/internal/userService';

type ProfilePictureProps = {
	canEdit: boolean,
} & ImageProps;

export const ProfilePicture: React.FC<ProfilePictureProps> = (props) => {
	const { profilePictureUrl, setProfilePictureUrl } = useUserDetails();
	const { user } = useUser();
	if (!user || !profilePictureUrl) {
		return null;
	}
	const handleEdit = async () => {
		const newUrl = await uploadProfilePicture(user.id);
		if (newUrl) {
			setProfilePictureUrl(newUrl);
			await userService.updateUser(user.id, { profilePicture: newUrl });
		}
	};

	const imageComponent = (
		<Image
			source={{ uri: profilePictureUrl || undefined }}
			style={styles.image}
			{...props}
		/>
	);

	if (props.canEdit) {
		return (
			<TouchableOpacity style={styles.container} onPress={props.canEdit ? handleEdit : undefined}>
				{imageComponent}
				<View style={styles.iconContainer}>
					<MaterialCommunityIcons name="plus" size={24} color="#fff" />
				</View>
			</TouchableOpacity>
		);
	} else {
		return (
			<View style={styles.container}>
				{imageComponent}
			</View>
		);
	}
};

const styles= StyleSheet.create({
	container: {
		position: 'relative',
		height: 200,
		width: 200,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		height: '100%',
		width: '100%',
		borderRadius: 100,
		borderWidth: 2,
		borderColor: theme.colors.outline
	},
	iconContainer: {
		position: 'absolute',
		right: 20,
		bottom: 5,
		backgroundColor: theme.colors.primary,
		elevation: 24,
		borderRadius: 15,
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
