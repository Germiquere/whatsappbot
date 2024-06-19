import ChatHistory, { IChatHistory,IMessage } from '../models/chatHistory.model';
import { Document, Types } from 'mongoose';

class ChatHistoryService {
    getByFrom = async(from: string): Promise<IChatHistory | null> => {
        try {
            return await ChatHistory.findOne({ from });
        } catch (error) {
            console.error('Error fetching ChatHistory by from:', error);
            throw new Error('Error fetching ChatHistory by from');
        }
    }

    updateChatHistory = async (from: string, agentId: string,message: IMessage): Promise<IChatHistory> => {
        try {
            let chatHistory = await ChatHistory.findOneAndUpdate(
                { from: from },
                {
                    $setOnInsert: { agentId,from },
                    $push: { history: message }
                },
                {
                    upsert: true,
                    new: true 
                }
            );
    
            if (!chatHistory) {
                throw new Error();
            }
    
            return chatHistory;
        } catch (error) {
            console.error('Error updating ChatHistory:', error);
            throw new Error('Error updating ChatHistory');
        }
    }

    deleteChatHistory = async (from: string): Promise<void> => {
        try {
            await ChatHistory.findByIdAndDelete({from});
        } catch (error) {
            console.error('Error deleting ChatHistory:', error);
            throw new Error('Error deleting ChatHistory');
        }
    }
}

export const chatHistoryService = new ChatHistoryService();