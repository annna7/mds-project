import { callApi } from '../../utils';
import {IMessage} from "../../models/messageModel";

export const messageService = {
    async uploadMessage (data: any, userId: string): Promise<IMessage> {
        return callApi('messages', { method: 'POST', body: data });
    },
    async getConversationMessages (senderId: string, receiverId: string): Promise<IMessage[]> {
        return callApi(`messages/${senderId}/${receiverId}`);
    },
    async getUserUnreadMessages(userClerkId: string): Promise<IMessage[]> {
        return callApi(`messages/unreadMessages/${userClerkId}`);
    },
    async updateMessage (id: string, data: any): Promise<IMessage> {
        return callApi(`messages/${id}`, {
            method: 'PUT',
            body:data
        });
    }
};