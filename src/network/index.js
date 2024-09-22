import dotenv from 'dotenv'
import request from 'request'
import NetworkConstant from './network_constant'

dotenv.config()

function callCmcPostApi (path, params) {
    let url = ((process.env.NODE_ENV == "DEVELOPMENT") ? NetworkConstant.API_URL_DEV : NetworkConstant.API_URL_PRD) + "/" + path
    var options = {
        'headers': { 
            'Content-Type': 'application/json',
            'X-CHAT_PRO_API_KEY': process.env.CHAT_API_TOKEN
        },
        'method': 'POST',
        'url': url,
        'body': JSON.stringify(params)
    };

    return new Promise((res, rej) => {
        request(options, function (error, response) {
            if (error) {
                rej(error)
            }
            res(response)
        });
    })
}

function callCmcGetApi (path, params) {
    let url = ((process.env.NODE_ENV == "DEVELOPMENT") ? NetworkConstant.API_URL_DEV : NetworkConstant.API_URL_PRD) + "/" + path + "?"
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            url = url + key + "=" + params[key] + "&"
        }
    }
    var options = {
        'headers': { 
            'Content-Type': 'application/json',
            'X-CHAT_PRO_API_KEY': process.env.CHAT_API_TOKEN
        },
        'method': 'GET',
        'url': url
    };
    return new Promise((res, rej) => {
        request(options, function (error, response) {
            if (error) {
                rej(error)
            }
            res(response)
        });
    })
}

export default { callCmcPostApi, callCmcGetApi }
