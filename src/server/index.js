import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url';
import config from 'config'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import multipart from 'connect-multiparty';
const multipartMiddleware = multipart();
//import _debug from 'debug'
import { router } from './routers.js'
import { userRoleParser } from './options.js';

//var debug = _debug('server')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//var privateKey  = fs.readFileSync('cert/cert.key', 'utf8');
//var certificate = fs.readFileSync('cert/cert.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

var app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: config.bodyParserLimit}))
app.use(multipartMiddleware)
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '')))

app.use(userRoleParser)

app.use('/api', router)

// app.use(function (req, res) {
//     res.sendFile(path.join(__dirname, '/index.html'))
//   })

const port = process.env.PORT || 5000
var httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`HTTP server running on ${port}.`)
})
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(port, () => {
//     debug(`HTTPS server running on ${port}.`)
//   })
