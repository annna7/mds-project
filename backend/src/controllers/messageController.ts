import {Request, Response} from "express";
import {ReviewService} from "../services";
import {MessageService} from "../services/messageService";


export const MessageController = {
    async uploadMessage(req: Request, res: Response) {
        console.log("In messageController");
        try {
            const message = await MessageService.uploadMessage(req.body);
            res.status(201).json(message);
        } catch (error) {
            res.status(500).json({ error: 'Failed to upload message' });
        }
    },

    async getConversationMessages(req: Request, res: Response) {
        try {
            const {senderId, receiverId} = req.params;
            const messages = await MessageService.getConversationMessages(senderId, receiverId);
            if(!messages){
                return res.status(404).json({ error: 'Failed to get conversation messages' });
            }
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get conversation messages' });
        }
    },

    async getUserUnreadMessages(req: Request, res: Response) {
        try {
            const {userClerkId }= req.params;
            const messages = await MessageService.getUserUnreadMessages(userClerkId);
            if(!messages){
                return res.status(404).json({ error: 'Failed to get user unread message' });
            }
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get userUnread messages' });
        }
    },

    async updateMessage(req: Request, res: Response) {
        try{
            const messageId = req.params.id;
            const updates = req.body;
            const updatedMessage = await MessageService.updateMessage(req.params.id, updates);
            updatedMessage ? res.json(updatedMessage) : res.status(404).json({ error: 'Failed to update message' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating message' });
        }

    }
}