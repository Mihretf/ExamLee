const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const initSocket = require("../socket/socket"); // Double check your path here!

const app = express();
const server = http.createServer(app);
const io = initSocket(server); 

app.use(cors());
app.use(express.json());

// --- ADD THIS LINE HERE ---
app.use('/api/auth', require('../routes/auth.routes')); 
app.use('/api/users' , require('../routes/user.routes'));
// --------------------------

app.get("/", (req, res) => {
  res.send("Examlee Backend is Running!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});