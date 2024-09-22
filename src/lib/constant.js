export default {

    WEBSOCKET_ACTIONS: {
        LOGIN: 'login',
        NEW_MESSAGE: 'new_message',

    },

    WEBSOCKET_AUTH_STATUS: {
        AUTHORIZED: 'authorized',
        UNAUTHORIZED: 'unauthorized',
        AUTHORIZING: 'authorizing',
    },

    WEBSOCKET_STATUS: {
        SUCCESS : '1',
        FAILED : '0',
    },

    WEBSOCKER_MESSAGE_INVALID_DATA: "Invalid message, please make sure you\'ve sent correct message format", 

    WEBSOCKET_TERMINATE_BROKEN_CONNECTION_INTERVAL: 10000

}
