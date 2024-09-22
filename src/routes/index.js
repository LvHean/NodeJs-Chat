import express from 'express'
import path from "path"

let router = express.Router()

router.get('/uploads/*', (req, res)  => {
    res.sendFile(path.join(__dirname, '../../' + req.url))
})

export default router
