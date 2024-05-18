const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

/**
 * Following endpoins are available here:
 * /login
 * /refresh-token
 * /logout
*/

// login
router.post("/login", userController.login);
// refresh client token
// router.post("/refresh-token", userController.generateRefreshToken);
// logout
// router.post("/logout", userController.logout);

module.exports = router;