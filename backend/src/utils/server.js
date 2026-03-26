const express = require("express")
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
require("dotenv").config();



const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin:"*",
  }
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) =>{
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () =>{
    console.log("User disconnected");
  });
});

const PORT= process.env.PORT || 5000;
server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});

