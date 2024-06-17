import express from "express";
import {MessageController} from "../controllers/messageController";

const messageRouter = express.Router();
messageRouter.post('/', MessageController.uploadMessage);
messageRouter.get('/:senderId/:receiverId', MessageController.getConversationMessages);
messageRouter.put('/:id', MessageController.updateMessage);
messageRouter.get('unreadMessages/:userClerkId', MessageController.getConversationMessages);

export {messageRouter};