import WebSocket from 'ws'
import dotenv from 'dotenv'
import Constant from './constant'
import { json } from 'body-parser'

dotenv.config()

let instance = null

class WebSocketServer {
    constructor() {
        if (!instance) {
            instance = this
            instance.sockets = {}
        }
        return instance
    }

    // Call from app.js
    initialWebsocketServer() {
        try {
            instance.wss = new WebSocket.Server({ port: process.env.SOCKET_PORT },
                () => {
                    instance.wss.on('listening', () => {
                        console.log(`${process.env.NODE_ENV} Socket listening on PORT ${process.env.SOCKET_PORT}`)
                        this.startTimerToTerminateBrokenConnection()
                    })

                    instance.wss.on('connection', (ws, req) => {
                        this.initialNewConnection(ws, req)

                        ws.on('pong', (data) => {
                            ws.isAlive = true
                        })

                        ws.on('message', (data) => {
                            try {
                                if (typeof data == 'string' || Buffer.isBuffer(data)) {
                                    this.onMessage(ws, req, data)
                                }
                                else {
                                    this.returnInvalidDataMsg(ws)
                                }
                            }
                            catch (e) {
                                console.error(e)
                            }
                        })

                        ws.on('close', (data) => {
                            this.disconnectWs(ws)
                        })
                    })

                    instance.wss.on('error', (error) => {
                        throw error
                    })
                }
            )
        } catch (err) {
            console.error(err)
        }
    }

    /***************************************************
       Handle action from websocket received
    ***************************************************/
    initialNewConnection(ws, req) {
        let socketId = req.headers['sec-websocket-key']
        ws.id = socketId
        ws.isAlive = true
        ws.isAuth = Constant.WEBSOCKET_AUTH_STATUS.UNAUTHORIZED
        ws.ipAddress = (req.headers['x-real-ip']) ? req.headers['x-real-ip'].split(",")[0] : "127.0.0.1"
        console.log(`Client Connected ${socketId}`)
    }

    onMessage(ws, req, data) {
        try {
            if (Buffer.isBuffer(data)) {
                data = Buffer.from(data).toString()
            }
            let jsonObject = JSON.parse(data)
            switch (jsonObject.action.toString().toLowerCase()) {
                case Constant.WEBSOCKET_ACTIONS.LOGIN:
                    this.onLogin(ws, jsonObject)
                    break
                default:
                    break
            }
        }
        catch (err) {
            this.returnInvalidDataMsg(ws)
        }
    }

    /***************************************************
       WebSocket Functions
    ***************************************************/

    onLogin(ws, jsonObject) {
        ws.sender_id = jsonObject['sender_id']
        instance.sockets[jsonObject['sender_id']] = ws
        ws.send(JSON.stringify({
            action: Constant.WEBSOCKET_ACTIONS.LOGIN,
            message: "Done"
        }))
    }

    /***************************************************
       Private functions
    ***************************************************/

    // Start an interval to remove broken connection
    startTimerToTerminateBrokenConnection() {
        setInterval(() => {
            instance.wss.clients.forEach(ws => {
                if (!ws.isAlive) {
                    this.disconnectWs(ws)
                }
                else {
                    ws.isAlive = false
                    ws.ping(() => { })
                }
            })
        }, Constant.WEBSOCKET_TERMINATE_BROKEN_CONNECTION_INTERVAL)
    }

    returnInvalidDataMsg(ws) {
        ws.send(JSON.stringify({
            action: Constant.WEBSOCKET_ACTIONS.INVALID_DATA,
            status: Constant.WEBSOCKET_STATUS.FAILED,
            message: Constant.WEBSOCKER_MESSAGE_INVALID_DATA
        }))
    }

    disconnectWs(ws) {
        if (ws) {
            console.log(`Client Disconnected ${ws.sender_id}`)
            instance.wss.clients.delete(ws)
            delete instance.sockets[ws.sender_id]
            ws.terminate()
        }
    }

    reloadMessage(receiver_id) {
        if (instance.sockets.hasOwnProperty(receiver_id)) {
            instance.sockets[receiver_id].send(JSON.stringify({
                action: Constant.WEBSOCKET_ACTIONS.NEW_MESSAGE,
                message: "Done"
            }))
        }
    }
}

export default new WebSocketServer()
