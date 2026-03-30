const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

// 1. Import your custom socket initializer
const initSocket = require("../socket/socket"); 

const app = express();
const server = http.createServer(app);

// 2. Initialize your sockets with the logic we wrote earlier
// This replaces the 'const io = new Server(...)' you had here
const io = initSocket(server); 

app.use(cors());
app.use(express.json());

// 3. (Optional) Add a basic test route
app.get("/", (req, res) => {
  res.send("Examlee Backend is Running!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});