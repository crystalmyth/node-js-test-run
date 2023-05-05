const express = require('express');
const router = express.Router();
const path = require('path');
const logoutController = require(path.join(__dirname, "..", "controllers", "logoutController"));

router.get('/',logoutController.handleLogout);
module.exports = router;