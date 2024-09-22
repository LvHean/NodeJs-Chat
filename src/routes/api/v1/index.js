import express from "express"
import dotenv from "dotenv"
import URL from 'url'
import Worker from "../../../lib/worker"
import Validator from '../validator'
import Mongoose from "../../../mongoose"
import * as SharedFunction from "../../../lib/shared_functions"
import WebSocketServer from "../../../lib/websocket"

dotenv.config()

let router = express.Router()
router.get('/get_system_information', function (req, res) {
    res.json({ status: "1", message: "Success." }).end();
});

router.post('/register', Validator.RegisterValidator.schemeCheck, Validator.RegisterValidator.validateParams, function (req, res) {
    const apiToken = SharedFunction.generateRandomText()

    let canProceed = true
    let message = "Register Sucessfully."

    Mongoose.UserModel.find({ $or: [{ name: req.body.name }, { email: req.body.email }, { api_token: apiToken }] }).then((result) => {
        canProceed = (result.length == 0)
        if (result.length > 0) {
            canProceed = false
            message = "Name or email existing."
        }
    }).catch((err) => {
        res.status(500).send(err);
    }).finally(() => {
        if (canProceed) {
            Mongoose.UserModel.create({
                name: req.body.name,
                email: req.body.email,
                password: SharedFunction.encryptText(req.body.password),
                api_token: apiToken
            }).then((result) => {
                res.status(200).send({ status: 1, message, data: { id: result['_id'], name: result['name'], email: result['email'], api_token: result['api_token'] } });
            }).catch((err) => {
                res.status(400).send({ status: 0, err });
            })
        } else {
            res.status(400).send({ status: 0, message });
        }
    });
})

router.post('/login', Validator.LoginValidator.schemeCheck, Validator.LoginValidator.validateParams, function (req, res) {
    let canProceed = true
    let message = "Logged In"
    let userInfo = {}

    Mongoose.UserModel.find({ $or: [{ email: req.body.email }] }).then((result) => {
        if (result.length <= 0) {
            canProceed = false
            message = "Invalid email or password."
        } else {
            const currentPassword = result[0]['password']
            if (!SharedFunction.compareEncryptedTextWithPlainText(currentPassword, req.body.password)) {
                canProceed = false
                message = "Invalid email or password."
            } else {
                userInfo = result[0]
            }
        }
    }).catch((err) => {
        res.status(500).send(err);
    }).finally(() => {
        if (canProceed) {
            res.status(200).send({ status: 1, message, data: { id: userInfo['_id'], name: userInfo['name'], email: userInfo['email'], api_token: userInfo['api_token'] } });
        } else {
            res.status(400).send({ status: 0, message });
        }
    });
})

router.post('/search_user', Validator.AuthValidator.authentication, Validator.SearchUserValidator.schemeCheck, Validator.SearchUserValidator.validateParams, function (req, res) {
    let canProceed = true
    let message = "Success."
    let userList = []

    Mongoose.UserModel.find({ $and: [{ name: { "$regex": req.body.name } }, { name: { $ne: req.auth_user.name} }] }).select({ "_id": 1, "name": 1, "email": 1 }).then((result) => {
        userList = result
    }).catch((err) => {
        res.status(500).send(err);
    }).finally(() => {
        if (canProceed) {
            res.status(200).send({ status: 1, message, data: userList });
        } else {
            res.status(400).send({ status: 0, message });
        }
    });
})

router.post('/send_chat', Validator.AuthValidator.authentication, Validator.SendChatValidator.schemeCheck, Validator.SendChatValidator.validateParams, Validator.SendChatValidator.validateReceiver, function (req, res) {
    let message = "Success."

    // Update Sender Conversations
    Mongoose.ConversationModel.findOneAndUpdate(
        { sender_id: req.auth_user._id, receiver_id: req.body.receiver_id },
        { $set: { sender_id: req.auth_user._id, sender_name: req.auth_user.name, receiver_id: req.body.receiver_id, receiver_name: req.receiver_user.name, last_message_sender_id: req.auth_user._id, last_message: req.body.message } },
        { new: true, upsert: true }
    ).then((result) => {

        // Update Receiver Conversations
        Mongoose.ConversationModel.findOneAndUpdate(
            { sender_id: req.body.receiver_id, receiver_id: req.auth_user._id },
            { $set: { sender_id: req.body.receiver_id, sender_name: req.receiver_user.name, receiver_id: req.auth_user._id, receiver_name: req.auth_user.name, last_message_sender_id: req.auth_user._id, last_message: req.body.message }, $inc: { unread_count: 1 } },
            { new: true, upsert: true }
        ).then((result) => {

            // Insert Chat
            Mongoose.ChatModel.create({
                sender_id: req.auth_user._id,
                sender_name: req.auth_user.name,
                receiver_id: req.body.receiver_id,
                receiver_name: req.receiver_user.name,
                message: req.body.message,
                is_read: false
            }).then((result) => {
                WebSocketServer.reloadMessage(req.body.receiver_id)
                res.status(200).send({ status: 1, message, data: { sender_id: req.auth_user._id, receiver_id: req.body.receiver_id, message: req.body.message, is_read: false, createdAt: result.createdAt } });
            }).catch((err) => {
                res.status(400).send({ status: 0, err });
            })
        }).catch((err) => {
            res.status(400).send({ status: 0, err });
        })
    }).catch((err) => {
        res.status(400).send({ status: 0, err });
    })
})

router.get('/get_conversations', Validator.AuthValidator.authentication, function (req, res) {
    let message = "Success."
    Mongoose.ConversationModel.find({ sender_id: req.auth_user._id }).then((result) => {
        res.status(200).send({ status: 1, message, data: result });
    }).catch((err) => {
        res.status(400).send({ status: 0, err });
    })
})

router.get('/get_chats/:receiver_id', Validator.AuthValidator.authentication, function (req, res) {
    let message = "Success."
    Mongoose.ChatModel.find({
        $and : [
            { $or : [ { sender_id : req.auth_user._id }, { receiver_id : req.auth_user._id } ] },
            { $or : [ { sender_id : req.params.receiver_id }, { receiver_id : req.params.receiver_id } ] }
        ]
    }).then((result) => {
        res.status(200).send({ status: 1, message, data: result });
    }).catch((err) => {
        res.status(400).send({ status: 0, err });
    })
})

export default router
