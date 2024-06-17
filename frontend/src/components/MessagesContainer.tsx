import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { theme } from "../theme";
import { listingService, messageService, reviewService } from '../services';
import { io } from "socket.io-client";
import { MessageItem } from './MessageItem';
import { useUser } from '@clerk/clerk-expo';
import {API_HOST, API_PORT} from "@env";
const ENDPOINT = `http://${API_HOST}:${API_PORT}`;

export const MessagesContainer = ({ initialMessages, userId }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [listings, setListings] = useState({});
    const [reviews, setReviews] = useState({});
    const [receiverId, setReceiverId] = useState("");
    const flatListRef = useRef(null);
    const socket = useRef(null);
    const { user: clerkUser } = useUser();
    const clerkId = clerkUser?.id;

    useEffect(() => {
        socket.current = io(ENDPOINT, { transports: ['websocket'] });
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const roomId = userId < receiverId ? `${userId}-${receiverId}` : `${receiverId}-${userId}`;
        console.log('JOINING SOCKET', roomId);
        socket.current.emit('join', { roomId: roomId });
    }, [userId, receiverId]);

    useEffect(() => {
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
            if (ok) {
                socket.current.emit('updateMessages', updatedMessages[updatedMessages.length - 1]);
            }
            setMessages(updatedMessages);
        };
        markMessagesAsRead();
        if (initialMessages.length > 0) {
            setReceiverId(initialMessages[0].receiverId);
        }
    }, [initialMessages, userId]);

    useEffect(() => {
        const fetchListings = async () => {
            const messagesWithListing = initialMessages.filter(msg => msg.type == 'listing' && msg.referenceId != null);
            const listingPromises = messagesWithListing.map(msg => listingService.getListing(msg.referenceId, clerkId as string));
            const listingsArray = await Promise.all(listingPromises);
            const listingsMap = listingsArray.reduce((acc, listing, index) => {
                acc[messagesWithListing[index].referenceId] = listing;
                return acc;
            }, {});
            setListings(listingsMap);
        };

        fetchListings();
    }, [initialMessages]);

    useEffect(() => {
        const fetchReviews = async () => {
            const messagesWithReviews = initialMessages.filter(msg => msg.type == 'review' && msg.referenceId != null);
            const reviewPromises = messagesWithReviews.map(msg => reviewService.getReview(msg.referenceId, clerkId as string));
            const reviewsArray = await Promise.all(reviewPromises);
            const reviewsMap = reviewsArray.reduce((acc, review, index) => {
                acc[messagesWithReviews[index].referenceId] = review;
                return acc;
            }, {});
            setReviews(reviewsMap);
        };

        fetchReviews();
    }, [initialMessages]);


    const renderItem = ({ item, index }) => (
        <MessageItem msg={item} index={index} listings={listings} reviews={reviews} userId={userId} />
    );

    const keyExtractor = (item, index) => item._id || index.toString();

    return (
        <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ flexGrow: 1 }}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
    );
};


const styles = StyleSheet.create({
    message: {
        display: "flex",
        flexDirection: "column",
        fontFamily: 'Proxima-Nova/Regular',
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
