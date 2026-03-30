require("dotenv").config(); // <--- THIS IS THE MISSING PIECE
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET; 

if (!secret) {
    console.error("❌ ERROR: JWT_SECRET is not defined in your .env file!");
    process.exit(1);
}

const token1 = jwt.sign({ id: 1 }, secret);
const token2 = jwt.sign({ id: 2 }, secret);

console.log("--- COPY THESE AS ONE CONTINUOUS LINE ---");
console.log("User 1 (Owner):", token1);
console.log("\nUser 2 (Commenter):", token2);