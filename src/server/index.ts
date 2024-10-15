import express from 'express'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { router } from './routers.js'
import { userRoleParser } from './options.js';
import { API_ROUTE } from '../types/routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const privateKey = fs.readFileSync(path.join(__dirname, './secure/wardrobes-privateKey.key'));
const certificate = fs.readFileSync(path.join(__dirname, './secure/wardrobes.crt'));
const credentials = {key: privateKey, cert: certificate};
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../../dist')))
app.use(userRoleParser)

app.use(API_ROUTE, router)

app.use(function (req, res) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'))
  })

const port = process.env.PORT || 5555
export const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`HTTP server running on ${port}.`)
})



