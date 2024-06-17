import React, {useEffect, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import { Caption, Drawer, Title, } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfilePicture } from '../components/ProfilePicture';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useUserDetails } from '../contexts/UserDetailsContext';
import { capitalize } from '../utils';
import Button from '../components/Button';
import { UserRoleEnum } from '../enums';
import {messageService} from "../services";

export function DrawerContent(props: DrawerContentComponentProps) {
	const { user } = useUser();
	const { profilePictureUrl, role } = useUserDetails();
	const { signOut } = useAuth();
	const {socket} = useUserDetails();
	const [hasNewMessage, setHasNewMessage] = useState(false);

	useEffect(() => {
		const fetchUserUnreadMessages = async () => {
			console.log("Checking for new messages...");
			const messages = await messageService.getUserUnreadMessages(user.id);
			if (messages.length !== 0) {
				setHasNewMessage(true);
			}
		};
		fetchUserUnreadMessages();

		// Empty dependency array means this effect runs only once on mount
	}, []);


	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (message) => {
			if(message.receiverId === user.id){
				setHasNewMessage(true);

			}
		};

		socket.on('messageReceived', handleNewMessage);
		socket.on('updateMessages', ()=>{
			setHasNewMessage(false);
		})

		return () => {
			socket.off('messageReceived', handleNewMessage);
		};
	}, [socket]);

	if (!user || !role) {
		return null;
	}

	return (
		<DrawerContentScrollView {...props}>
			<View style={styles.drawerContent}>
				<View style={styles.userInfoSection}>
					<View style={styles.profilePictureContainer}>
						<ProfilePicture canEdit={false} source={{ uri: profilePictureUrl }} />
					</View>
					<Caption style={styles.nickname}>@{user.username}</Caption>
					<Title style={styles.title}>{`${capitalize(user.firstName)} ${capitalize(user.lastName)}`}</Title>
				</View>
				<Drawer.Section style={styles.drawerSection}>
					<DrawerItem
						icon={({ color, size }) => (
							<MaterialCommunityIcons name="account-outline" color={color} size={size} />
						)}
						label="Profile"
						onPress={() => { props.navigation.navigate('Profile'); }}
					/>
					{ role === UserRoleEnum.Landlord &&
						<DrawerItem
							icon={({ color, size }) => (
								<MaterialCommunityIcons name="map-marker-outline" color={color} size={size} />
							)}
							label="Add Property"
							onPress={() => { props.navigation.navigate('CreateListing'); }}
						/>
					}
					{ role === UserRoleEnum.RegularUser &&
						<DrawerItem
							icon={({ color, size }) => (
								<MaterialCommunityIcons name="home-outline" color={color} size={size} />
							)}
							label="Add Review"
							onPress={() => { props.navigation.navigate('CreateReview'); }}
						/>
					}
					<DrawerItem
						icon={({ color, size }) => (
							<MaterialCommunityIcons name="heart-outline" color={color} size={size} />
						)}
						label="Favorites"
						onPress={() => { props.navigation.navigate('Favorites'); }}
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<View>
								<MaterialCommunityIcons name="message-outline" color={color} size={size} />
								{hasNewMessage && (
									<View style={styles.notificationBadge} />
								)}
							</View>
						)}
						label="Chats"
						onPress={() => {
							setHasNewMessage(false); // Reset the notification when navigating to Chats
							props.navigation.navigate('Chats');
						}}
					/>
					<Button
						mode="elevated"
						style={{
							width: '70%',
							alignSelf: 'center',
						}}
						icon="logout"
						onPress={() => signOut()}
					>
							Log out
					</Button>
				</Drawer.Section>
			</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingLeft: 20,
	},
	nickname: {
		marginTop: 10
	},
	title: {
		marginTop: 5,
		fontWeight: 'bold',
	},
	drawerSection: {
		marginTop: 15,
	},
	profilePictureContainer: {
		marginLeft: 15
	},
	notificationBadge: {
		position: 'absolute',
		right: -5,
		top: -5,
		backgroundColor: 'red',
		width: 10,
		height: 10,
		borderRadius: 5,
	},
});
