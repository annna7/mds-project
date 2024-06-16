import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Text, Pressable, View, StyleSheet} from 'react-native';
import {theme} from "../theme";
import { Ionicons } from '@expo/vector-icons';
import {listingService, messageService} from "../services";
import {io} from "socket.io-client";
import {useNavigation} from "@react-navigation/native";
import {API_HOST} from "@env";

const ENDPOINT = `http://${API_HOST}:${API_HOST}`;
let socket;

const RenderMessages = ({ initialMessages, userId }) => {
    const {navigate} = useNavigation();
    const [messages, setMessages] = useState(initialMessages);
    const [listings, setListings] = useState({});
    const scrollViewRef = useRef();
    const [receiverId, setreceiverId] = useState("");

    useEffect(() => {
        // Function to mark received messages as read
        const markMessagesAsRead = () => {
            let ok = false;
            const updatedMessages = initialMessages.map(msg => {
                if (msg.senderId !== userId && !msg.isRead) {
                    ok = true;
                    messageService.updateMessage(msg._id, { isRead: true });
                    return { ...msg, isRead: true };
                }
                return msg;
            });
            if(ok){

                socket.emit('updateMessages', updatedMessages[updatedMessages.length - 1])  ;
            }
            setMessages(updatedMessages);
        };
        markMessagesAsRead();
        if(initialMessages.length > 0){
            setreceiverId(initialMessages[0].receiverId);
        }
    }, [initialMessages, userId]);

    useEffect(() => {
        socket = io(ENDPOINT, {transports: ['websocket']});
        const roomId = userId < receiverId ?
            `${userId}-${receiverId}` :
            `${receiverId}-${userId}`;
        socket.emit('join', {roomId: roomId});
    }, []);


    useEffect(() => {
        // Scroll to the bottom whenever messages change
        scrollViewRef.current.scrollToEnd({ animated: true });
    }, [messages]);

    useEffect(() => {
        // Fetch listing data for messages with referenceId
        const fetchListings = async () => {
            const messagesWithListing = initialMessages.filter(msg => msg.referenceId != null);
            const listingPromises = messagesWithListing.map(async msg => {
                const listing = await listingService.getListing(msg.referenceId);
                return { referenceId: msg.referenceId, listing };
            });
            const listingsArray = await Promise.all(listingPromises);
            const listingsMap = listingsArray.reduce((acc, { referenceId, listing }) => {
                acc[referenceId] = listing;
                return acc;
            }, {});
            setListings(listingsMap);
        };

        fetchListings();
    }, [initialMessages]);

    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString('en-US', options);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toDateString();
    };

    const truncateText = (text, limit) => {
        if (text.length > limit) {
            return text.substring(0, limit) + '...';
        }
        return text;
    };

    const renderMessages = () => {
        let lastDate = null;

        return messages.map((msg, index) => {
            const messageDate = new Date(msg.createdAt).toDateString();
            const showDate = messageDate !== lastDate;
            const showListing = msg.referenceId != null;
            lastDate = messageDate;

            return (
                <React.Fragment key={index}>
                    {showDate && (
                        <View style={styles.dateLabelContainer}>
                            <Text style={styles.dateLabel}>{formatDate(msg.createdAt)}</Text>
                        </View>
                    )}
                    {showListing && (
                        <View style={[styles.listingContainer, msg.senderId === userId ? {alignSelf: 'flex-end'}: {alignSelf: 'flex-start'}]}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.listingTitle}>
                                    {listings[msg.referenceId] ? listings[msg.referenceId].title : 'Loading listing...'}
                                </Text>
                                <Text style={styles.listingDescription}>
                                    {listings[msg.referenceId] ? truncateText(listings[msg.referenceId].description, 100) : ''}
                                </Text>
                            </View>
                        </View>
                    )}
                    <Pressable
                        style={[
                            styles.message,
                            msg.senderId === userId ? styles.senderMsgBubble : styles.receiverMsgBubble
                        ]}
                    >
                        <Text style={msg.senderId === userId ? styles.senderMsg : styles.receiverMsg}>
                            {msg.content}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 5, display: 'flex' }}>
                            <Text style={msg.senderId === userId ? styles.senderMsg : styles.receiverMsg}>
                                {formatTime(msg.createdAt)}
                            </Text>
                            {msg.senderId === userId && (
                                <Ionicons
                                    name="checkmark-outline"
                                    size={15}
                                    color={msg.isRead ? '#70e000' : 'white'}
                                />
                            )}
                        </View>
                    </Pressable>
                </React.Fragment>
            );
        });
    };

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
            {renderMessages()}
        </ScrollView>
    );
};
export default RenderMessages;


const styles = StyleSheet.create({
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
    dateLabelContainer: {
        padding: 10,
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 12,
        color: 'gray',
    },
    listingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        padding: 10,
        paddingHorizontal:15,
        backgroundColor: theme.colors.background,
        borderRadius: 10,
        marginTop: 5,
        marginHorizontal: 10,
        borderColor: theme.colors.primary,
        borderWidth: 1,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    listingDescription: {
        fontSize: 14,
        color: 'gray',
    },
    openButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    openButtonText: {
        color: 'white',
    },
});
