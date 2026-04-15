const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check if the token exists in the "Authorization" header
  // It usually looks like: Bearer eyJhbGci...
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the string
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token with your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user info to the request object (so routes can use it)
      req.user = decoded; 

      // 5. Move to the next function (the actual route)
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

module.exports = { protect };