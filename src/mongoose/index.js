import mongoose from 'mongoose';
import dotenv from 'dotenv'

import UserModel from "./model/user"
import ConversationModel from "./model/conversation"
import ChatModel from "./model/chat"

dotenv.config()

function connect () {
    const URL = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABSE_NAME}`
    const OPTIONS = {
      authSource: process.env.MONGODB_AUTHSOURCE,
      auth: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
      },
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
    mongoose.connect(URL, OPTIONS).then(() => console.log('Connected to MongoDB!'));
}

export default { connect, UserModel, ConversationModel, ChatModel }

