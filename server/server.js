const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require('node:http');
const server = createServer(app);

app.use(cors({
    origin: "*",
    methods: ['GET', 'PUSH', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true
}))

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'PUSH', 'POST', 'PATCH', 'DELETE', 'PUT'],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on("message",({message,user,language}) => {
        console.log(message,user);
        io.to(user).emit("recieve-message",{message,from:socket.id,language});
    });

    socket.on("disconnect",() => {
        console.log(socket.id , "discconected");
    })
});


app.get("/", (req, res) => {
    res.send("Hello World");
})

server.listen(port, () => {
    console.log("listening on port ", port);
})