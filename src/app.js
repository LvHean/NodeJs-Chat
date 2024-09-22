import express from "express"
import path from "path"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import http from 'http'
import cors from 'cors'
import router from "./routes"
import apiRouter from "./routes/api"
import Worker from './lib/worker'
import WebSocketServer from './lib/websocket'

dotenv.config()

let app = express()
let NODE_ENV = process.env["NODE_ENV"] || "DEV"
let PORT = process.env.PORT

app.enable('trust proxy')
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 
	parameterLimit: 10000000,
    limit: '500mb',
	extended: true 
}))
// app.use('/', router)
app.use('/api', apiRouter)
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, './react-chat/build', 'index.html'));
    }
});
app.use(express.static(path.join(__dirname, "./react-chat/build")));

// app.use(express.static('src/react-chat/build'));
// app.use(express.static(path.join(__dirname, "./public")))
// app.use("/view", views)

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
	res.header("Access-Control-Allow-Headers", "Content-Type,X-Auth-P2PGAME-Web")

	if ("OPTIONS" == req.method) {
		res.send()
	} else {
		next()
	}
})
app.use((req, res, next) => {
	if (!req.timeout) next()
})

process.on('exit', terminate)
process.on('SIGINT', terminate)
process.on('SIGUSR1', terminate)
process.on('SIGUSR2', terminate)
process.on('uncaughtException', terminate)

function terminate(e) {
	console.log(e)
    process.exit()
}

http.createServer(app).listen(PORT, () => {
	console.log(`${NODE_ENV} Server listening on PORT ${PORT}`)
	WebSocketServer.initialWebsocketServer()
})
