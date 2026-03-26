const jwt = require("jsonwebtoken");
// Replace "your_jwt_secret_here" with your actual secret from .env
const secret = "your_jwt_secret_here"; 

const token1 = jwt.sign({ id: 1 }, secret);
const token2 = jwt.sign({ id: 2 }, secret);

console.log("--- COPY THESE ---");
console.log("User 1 (Owner):", token1);
console.log("User 2 (Commenter):", token2);

//node generateToken.js
// --- COPY THESE ---
// User 1 (Owner): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// eyJpZCI6MSwiaWF0IjoxNzc0NTI3MTE1fQ.9hNKM2NLAwhXvi7c4c
// L66q2emstPC8j0cZCMkvsJUv8


// User 2 (Commenter): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV
// CJ9.eyJpZCI6MiwiaWF0IjoxNzc0NTI3MTE1fQ.8WgIj2pyEYr079
// E_CVI7q_lq1WVDUUtmV9Dvxw9s7SU