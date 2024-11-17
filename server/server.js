const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require('node:http');
const server = createServer(app);
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const connectDb = require("./utillity/dbConfig");


const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const User = require("./models/user");

connectDb();

app.use(bodyParser.json())

app.use(cors({
    origin: `${process.env.CLIENT_DOMAIN}`,
    methods: ['GET', 'PUSH', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true
}))

const io = new Server(server, {
    cors: {
        origin: `${process.env.CLIENT_DOMAIN}`,
        methods: ['GET', 'PUSH', 'POST', 'PATCH', 'DELETE', 'PUT'],
        credentials: true
    }
})

const emailTosocket = new Map();
io.on('connection', (socket) => {
    
    console.log("Socket connect for " , socket.id);
    console.log(emailTosocket);

    socket.on('set-email', (emailId) => {
        emailTosocket.set(emailId, socket.id);
        console.log("Socket connect for ", emailId, "  ", socket.id);


    })

    socket.on("message", async ({ message, fromUser, toUser, language, createdAt }) => {
        console.log(message, fromUser, toUser, language);
        if (emailTosocket.has(toUser)) {
            let toId = emailTosocket.get(toUser);
            io.to(toId).emit("recieve-message", { message, fromUser, createdAt, language });
        }
    });

    socket.on("disconnect", () => {
        console.log(socket.id, "discconected");
    })
});


app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/payment",paymentRoutes);


server.listen(port, () => {
    console.log("listening on port ", port);
})