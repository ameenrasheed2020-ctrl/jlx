const express = require('express')
const http = require('http')
const { Server } = require('socket.io')






const app = express()
const server = http.createserver(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})



const PORT = process.env.PORT || 7000; iuuu