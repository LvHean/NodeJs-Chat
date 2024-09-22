import mongoose from 'mongoose'

const chatScheme = new mongoose.Schema({
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
    message: {
        type: String,
        required: true,
    },
    is_read: {
        type: Boolean,
        required: true,
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

const ChatModel = mongoose.model('Chat', chatScheme);

export default ChatModel
