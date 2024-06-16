import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions, Pressable} from 'react-native';
import Background from "../components/Background";
import { API_PORT, API_HOST, AUTH0_DOMAIN, AUTH0_CLIENT_ID, GOOGLE_MAPS_API_KEY } from '@env';
import {Entypo, Feather} from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {TextInput} from "react-native-paper";
import {theme} from "../theme";
import EmojiSelector from "react-native-emoji-selector"
import {useUserDetails} from "../contexts/UserDetailsContext";
import {messageService} from "../services";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../navigation/AppNavigation";
import {useUserData} from "../hooks/useUserData";
import {Image} from "expo-image";
import {useCustomFonts} from "../hooks/useCustomFonts";
import userService from "../services/internal/userService";
import RenderMessages from "../components/renderMessages";
import {io} from "socket.io-client";
import {update} from "lodash";

type ChatMessagesScreenRouteProps = RouteProp<RootStackParamList, 'Message'>;
const ENDPOINT = `http://${API_HOST}:${API_HOST}`;
let socket;

export const ChatMessagesScreen: React.FC = () => {
    useCustomFonts();
    const { navigate } = useNavigation();
    const route = useRoute<ChatMessagesScreenRouteProps>();
    const { receiverId, referenceId: initialReferenceId, type: initialType } = route.params;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const { userId, contactedUsers: currUserContactedUsers } = useUserDetails();
    const { userId: clerkUserId } = useUserDetails();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user: receiverUser } = useUserData(receiverId);
    const [referenceId, setReferenceId] = useState(initialReferenceId);
    const [type, setType] = useState(initialType);

    useEffect(() => {
        socket = io(ENDPOINT, {transports: ['websocket']});
        const roomId = userId < receiverId ?
            `${userId}-${receiverId}` :
            `${receiverId}-${userId}`;
        socket.emit('join', {roomId: roomId});
    }, []);

    useEffect(() => {
        getConversationMessages();
        setType(initialType);
        setReferenceId(initialReferenceId);
    }, [receiverId, initialReferenceId]);

    useEffect(() => {
        socket.on('messageReceived', (msg)=>{
            if(msg.receiverId === userId && msg.senderId === receiverId){
                setMessages([...messages, msg]);
            }
        })
        socket.on("updateMessages", (msg) =>{
            if(msg.receiverId === userId && msg.senderId === receiverId){
                getConversationMessages();
            }
        })
    }, []);

    const getConversationMessages = async () => {
        const data = await messageService.getConversationMessages(userId, receiverId);
        setMessages(data);
    };

    const handleSend = async () => {
        if (message.length === 0) return;

        if (messages.length === 0) {
            if (!receiverUser.contactedUsers.includes(userId)) {
                const newContactedUsers = [...receiverUser.contactedUsers, userId];
                await userService.updateUser(receiverUser?.clerkId, { contactedUsers: newContactedUsers });
            }
            if (!currUserContactedUsers.includes(receiverId)) {
                const newContactedUsers = [...currUserContactedUsers, receiverId];
                await userService.updateUser(clerkUserId, { contactedUsers: newContactedUsers });
            }
        }
        const newMessage = await messageService.uploadMessage(
            {
                senderId: userId,
                receiverId: receiverId,
                content: message,
                isRead: false,
                referenceId: referenceId,
                type: type,
            },
            userId
        );
        socket.emit('newMessage', newMessage);
        // After the first message is sent, set referenceId and type to null
        if (referenceId !== null || type !== null) {
            setReferenceId(null);
            setType(null);
        }

        setMessage('');
        getConversationMessages();
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Background>
                <View style={{ width: screenWidth, flex: 1, height: screenHeight }}>
                    <View style={styles.topBar}>
                        {receiverUser && (
                            <>
                                <View style={styles.nameWrapper}>
                                    <Text style={styles.receiverName}>
                                        {receiverUser.firstName} {receiverUser.lastName}
                                    </Text>
                                </View>
                                <Image style={styles.receiverProfilePicture} source={receiverUser?.profilePicture} />
                            </>
                        )}
                    </View>

                    <RenderMessages initialMessages={messages} userId={userId} />
                    <View style={styles.inputBarContainer}>
                        <TextInput
                            style={styles.inputBar}
                            placeholder="Type your message..."
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                        />
                        <Pressable onPress={handleSend}>
                            <Ionicons name="send" size={24} color={theme.colors.primary} />
                        </Pressable>
                    </View>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 60,
        backgroundColor: theme.colors.background,
        alignItems: 'center', // Keep vertical centering
        paddingHorizontal: 10,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderColor: theme.colors.primary,
    },
    receiverProfilePicture: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    receiverName:{
        fontFamily: 'ProximaNova-Regular',
        fontSize: 20,
    },
    nameWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 40,
    },
    message: {
        display: "flex",
        flexDirection: "column",
        fontFamily: 'ProximaNova-Regular',
        fontSize: 17,
        color: 'black',
        maxWidth: '70%',
        minHeight: 30,
        margin: 2.5,
        marginHorizontal: 10,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    senderMsgBubble: {
        alignItems: "center",
        alignSelf:"flex-end",
        backgroundColor: theme.colors.primary,
    },
    senderMsg:{
        color: 'white',
        alignSelf: 'flex-start',

    },
    receiverMsgBubble: {
        backgroundColor: theme.colors.background,
        alignItems: "center",
        alignSelf: "flex-start",
        color: 'black',
    },
    receiverMsg:{
        color: 'black',
        alignSelf: 'flex-end',
    },
    inputBarContainer:{
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: theme.colors.primary,
        borderTopWidth: 2,
        paddingBottom: 20,
        padding:10,
        backgroundColor: theme.colors.background,
        width: '100%',
        gap:5,
    },
    inputBar:{
        borderColor: theme.colors.primary,
        borderWidth: 1,
        height: 40,
        marginHorizontal: 5,
        flex: 1,
    }
});
