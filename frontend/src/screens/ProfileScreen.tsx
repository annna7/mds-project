import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { ProfilePicture } from '../components/ProfilePicture';
import Background from '../components/Background';
import { EditableField } from '../components/EditableField';
import { Card, Divider } from 'react-native-paper';
import { HeaderText } from '../components';
import { theme } from '../theme';

export const ProfileScreen: React.FC = () => {
	const { user } = useUser();
	const { profilePictureUrl, role } = useUserDetails();

	if (!user) return null;

	return (
		<Background>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
				<View style={{ marginBottom: 7, alignItems: 'center' }}>
					<ProfilePicture canEdit={true} source={{ uri: profilePictureUrl }}/>
				</View>
				<HeaderText size={19}>
							Role: <Text style={{ color: theme.colors.primary }}>{role}</Text>
				</HeaderText>
				<EditableField
					isEditable={true}
					label="First Name"
					value={user.firstName || ''}
					onSave={(newValue) => user.update({ firstName: newValue })}
				/>
				<Divider/>
				<EditableField
					isEditable={true}
					label="Last Name"
					value={user.lastName || ''}
					onSave={(newValue) => user.update({ lastName: newValue })}
				/>
				<Divider/>
				<EditableField
					isEditable={true}
					label="Username"
					value={user.username || ''}
					onSave={(newValue) => user.update({ username: newValue })}
				/>
				<Divider/>
				<EditableField
					isEditable={false}
					label="Email"
					value={user.primaryEmailAddress?.emailAddress || ''}
					onSave={(newValue) => console.log(newValue)}
				/>
			</ScrollView>
		</Background>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		backgroundColor: 'white',
		elevation: 20,
		flexGrow: 1,
		justifyContent: 'center',
		padding: 20,
		paddingHorizontal: 15
	},
	card: {
		margin: 20,
		backgroundColor: 'white',
		height: '100%',
	},
});
