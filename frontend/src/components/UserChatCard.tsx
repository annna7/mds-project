import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from "react";
import {useUserData} from "../hooks/useUserData";
import {theme} from "../theme";
import {useNavigation} from "@react-navigation/native";
import {messageService} from "../services";
import {useUserDetails} from "../contexts/UserDetailsContext";
import {io} from "socket.io-client";
import {API_HOST} from "@env";

const ENDPOINT = `http://${API_HOST}:${API_HOST}`;
let socket;

const UserChatCard: React.FC<any> = ({ userId: receiverId, index }) => {
    const { user: recvUser, isLoading, error } = useUserData(receiverId);
    const { userId } = useUserDetails();
    const { navigate } = useNavigation();
    const [message, setMessage] = useState(null);

    const getLastConversationMessages = async () => {
        const data = await messageService.getConversationMessages(userId, receiverId);
        if (data.length > 0) {
            setMessage(data[data.length - 1]);
        }
    };

    useEffect(() => {
        getLastConversationMessages();
    }, [userId, receiverId]);

    useEffect(() => {
        socket = io(ENDPOINT, {transports: ['websocket']});
        const roomId = userId < receiverId ?
            `${userId}-${receiverId}` :
            `${receiverId}-${userId}`;
        socket.emit('join', {roomId: roomId});
    }, []);

    useEffect(() => {
        socket.on('messageReceived', (msg)=>{
            console.log("am orimit mesaj nou in userCard");
            setMessage(msg);
        });

        socket.on('updateMessages', (msg) =>{
            if(msg.receiverId === userId && msg.senderId === receiverId){
                setMessage(msg);
                getLastConversationMessages();
            }
        });
    }, []);

    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString('en-US', options);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>{error.toString()}</Text>
            </View>
        );
    }
    if (!recvUser) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const messageStyle = message && message.receiverId===userId && !message.isRead ? styles.unreadMessage : styles.readMessage;

    return (
        <Pressable style={styles.container} onPress={() => navigate("Messages", { receiverId: recvUser._id, referenceId: null, type: null })}>
            <Image style={styles.profilePicture} source={{ uri: recvUser.profilePicture }} />
            <View style={{ gap: 5, flex: 1 }}>
                <Text style={styles.name}>{recvUser.firstName} {recvUser.lastName}</Text>
                {message && (
                    <Text style={[styles.lastMessage, messageStyle]}>
                        {message.content}
                    </Text>
                )}
            </View>
            <View>
                {message && (
                <Text style={[styles.time, messageStyle]}>{formatTime(message.createdAt)}</Text>
                )}
            </View>
        </Pressable>
    );
};

export default UserChatCard;

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderBottomWidth:0.75,
        borderColor: theme.colors.primary,
        padding: 10,
    },
    profilePicture: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight:5,
    },
    name:{
        fontFamily: 'ProximaNova-Bold',
        fontSize: 20,
    },
    lastMessage:{
        fontFamily: 'ProximaNova-Regular',
        color: 'gray'
    },
    unreadMessage: {
        fontFamily: 'ProximaNova-Bold',
        color: 'black',
    },
    time:{
        fontFamily: 'ProximaNova-Regular',
        color: 'gray'
    },
    loadingContainer: {
        padding: 10,
        alignItems: 'center',
    },
    errorContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'red',
    },
})