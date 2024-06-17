import e from "express";
import {IMessage, Message} from "../models";
import {$and} from "sift";


export const MessageService = {
    uploadMessage: async(messageBody: IMessage) => {
        const message = new Message(messageBody);
        return message.save();
    },

    getConversationMessages: async(senderId, receiverId) => {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        });
        return messages;
    },

    getUserUnreadMessages: async(userClerkId) => {
        const messages = await Message.find({
            // receiverId: userClerkId,
            isRead: false
        });
        return messages;
    },

    updateMessage: async(id, update) =>{
        return Message.findOneAndUpdate({_id: id}, update);
    }
}