require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require("./middleware/logEvents");
const {errorHandler} = require("./middleware/errorHandler");
const verifyJWT = require(path.join(__dirname, "middleware", "verifyJWT"));
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);

//cors => cross origin resourse sharing
app.use(cors(corsOptions));

// build in middleware for form-data
app.use(express.urlencoded({ extended: false }));

// build in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// server static files
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));


app.all('*', (req, res) => { 
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('josn')) {
        res.json({ error: "404 Not Found" });
    } else { 
        res.type("text").send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to mongoDB');
    app.listen(PORT, () => {
        console.log(`server running on port: ${PORT}`);
    });
});