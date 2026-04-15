require('dotenv').config(); // THIS MUST BE AT THE TOP
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const initSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.use((socket, next) => {
        // Postman is sending it in 'query', so we check both places:
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;

        console.log("--- Handshake Details ---");
        console.log("Token found in Query:", !!socket.handshake.query?.token);
        console.log("Token found in Auth:", !!socket.handshake.auth?.token);

        if (!token) {
            console.log("❌ No token provided. Connection rejected.");
            return next(new Error("Authentication error"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            console.log(`✅ Authenticated User ID: ${socket.user.id}`);
            next();
        } catch (err) {
            console.error("❌ JWT Verification Failed:", err.message);
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        // If we get here, socket.user MUST exist
        console.log(`🚀 Socket Connected for User: ${socket.user.id}`);

        socket.join(`user_${socket.user.id}`);

        require("./handlers/commentHandler")(io, socket);
        require("./handlers/notificationHandler")(io, socket);
        require("./handlers/reactionHandler")(io, socket);

        socket.on("disconnect", () => console.log("User disconnected"));
    });

    return io;
};

module.exports = initSocket;