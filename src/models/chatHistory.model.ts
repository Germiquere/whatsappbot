import mongoose, { Schema, Document } from 'mongoose';

interface IChatHistory extends Document {
    agentId: string;
    from: string;
    history: IMessage[] | []
}
interface IMessage{
    content:string;
    additional_kwargs:{};
    type: 'ai' |'human';
    name: string | null;
    example: boolean;
}
const ChatHistorySchema: Schema = new Schema({
    agentId: { type: String, required: true },
    from: { type: String, required: true },
    history: { type: [{ 
        content: { type: String, required: true },
        additional_kwargs: { type: {}, required: true },
        type: { type: String, enum: ['ia', 'human'], required: true },
        name: { type: String, default: null },
        example: { type: Boolean, required: true }
    }], default: [] }
},
{
    timestamps: true,
    versionKey: false
}
);

const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);

export default ChatHistory;
export { IChatHistory,IMessage };