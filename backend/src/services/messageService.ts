import e from "express";
import {IMessage, Message} from "../models";

// MessageService handles operations related to message data
export const MessageService = {


    uploadMessage: async(messageBody: IMessage) => {
        const message = new Message(messageBody); // create a new Message instance
        return message.save(); // save the message instance to the database
    },

    // getConversationMessages retrieves all messages between two users
    // senderId: ID of the message sender
    // receiverId: ID of the message receiver
    getConversationMessages: async(senderId, receiverId) => {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId }, // messages sent by sender to receiver
                { senderId: receiverId, receiverId: senderId }, // messages sent by receiver to sender
            ],
        });
        return messages; // return the retrieved messages
    },

    updateMessage: async(id, update) => {
        return Message.findOneAndUpdate({_id: id}, update); // find message by ID and update it
    }
}
