const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require(path.join(__dirname, "..", "controllers", "authController"));

router.post('/',authController.handleLogin);
module.exports = router;