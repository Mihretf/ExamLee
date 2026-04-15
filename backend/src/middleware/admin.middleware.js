// const jwt = require('jsonwebtoken');
const isAdmin = (req, res, next) => {
    // req.user is populated by the 'protect' middleware before this runs
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            error: "Access denied. Only administrators can perform this action." 
        });
    }
};

module.exports = { isAdmin };