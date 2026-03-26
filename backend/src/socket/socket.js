const {Server} = require ("socket.io");
const jwt = require("jsonwebtoken");

const initSocket = (server) =>{
    const io = new Server(server, {
        cors: {origin: "*"}
    });

    io.use((socket, next) =>{
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error"));

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch(err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket)=>{
        console.log(`User connected: ${socket.user.id}`);

        socket.join(`user_${socket.user.id}`);

        require("./handlers/commentHandler")(io, socket);
        require("./handlers/notificationHandlet")(io, scoket);

        socket.on("disconnect", ()=> console.log("User disconnected"));
    });
    return io;
};
module.exports = initSocket;