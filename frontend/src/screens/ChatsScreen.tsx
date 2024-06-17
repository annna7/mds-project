import React, {useContext, useEffect} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useUserDetails} from "../contexts/UserDetailsContext";
import { useUserData, useUserDataByClerkId } from '../hooks/useUserData';
import UserChatCard from "../components/UserChatCard";
import {useCustomFonts} from "../hooks/useCustomFonts";
import {theme} from "../theme";
import { useUser } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNotificationManager} from "../hooks/useNotificationManager";

export const ChatsScreen: React.FC = () => {
	const navigation = useNavigation();
	// const {userId, } = useUserDetails();
	// const {user: currentUser} = useUserData(userId)
	const { user } = useUser();
	const { subscribe, unsubscribe } = useNotificationManager();
	console.log('CLERK ID FROM CHATS', user.id);

	const { user: currentUser, isLoading, error } = useUserDataByClerkId(user?.id ?? '');
	console.log('CURRENT USER FROM CLERK', currentUser);

	if (isLoading) {
		return <Spinner></Spinner>
	}

	if(!currentUser){
		return (
			<View style={{justifyContent: 'center'}}>
				<Text>Loading..</Text>
			</View>
		);
	}
	//
	// useEffect(() => {
	// 	const handleNewMessage = (message) => {
	// 		Alert.alert("New Message", message.text);
	// 	};
	//
	// 	unsubscribe('messageReceived', handleNewMessage);
	// 	return () => {
	// 		console.log("Chats screen unmounted");
	// 		subscribe('messageReceived', handleNewMessage);
	// 	};
	// }, []);

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
			<View style={styles.title}>
				<Text style={{fontSize:25}}> Chats</Text>
			</View>
			<Pressable>
				{currentUser?.contactedUsers.map((clerkUserId, index) =>(
					<UserChatCard key={index} userId={clerkUserId}/>
				))}
			</Pressable>
		</ScrollView>
	);
};


const styles = StyleSheet.create({
	title:{
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: theme.colors.primary,
		paddingVertical: 15,
		paddingTop: 45,
	},
	container: {
		backgroundColor: 'white',
		minHeight: 'fit-content',
		width: '100%',
		margin:0,
	},
});
