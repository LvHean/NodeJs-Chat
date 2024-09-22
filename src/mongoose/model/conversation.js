import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true,
    },
    sender_name: {
        type: String,
        required: true,
    },
    receiver_id: {
        type: String,
        required: true,
    },
    receiver_name: {
        type: String,
        required: true,
    },
    last_message_sender_id: {
        type: String,
        required: true,
    },
    last_message: {
        type: String,
        required: true,
    },
    unread_count: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const ConversationModel = mongoose.model('Conversation', conversationSchema);

export default ConversationModel
