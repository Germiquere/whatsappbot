import ChatHistory, { IChatHistory,IMessage } from '../models/chatHistory.model';

class ChatHistoryService {
    // method to get a chat history by from
    getByFrom = async(from: string): Promise<IChatHistory | null> => {
        try {
            return await ChatHistory.findOne({ from });
        } catch (error) {
            throw new Error('Error fetching ChatHistory by from');
        }
    }

    // method to create or update the chat history
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
            throw new Error('Error updating ChatHistory');
        }
    }

    // method to delete a chat history
    deleteChatHistory = async (from: string): Promise<void> => {
        try {
            await ChatHistory.findByIdAndDelete({from});
        } catch (error) {
            throw new Error('Error deleting ChatHistory');
        }
    }
}

export const chatHistoryService = new ChatHistoryService();