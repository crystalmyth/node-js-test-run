const path = require('path');
const allowedOrigins = require(path.join(__dirname, "..", "config", "allowedOrigins"));
const credentials = (req, res, next) => { 
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Crendentials', true);
    }
    next();
}

module.exports = credentials;