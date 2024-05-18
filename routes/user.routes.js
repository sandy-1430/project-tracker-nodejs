const express = require('express');
const router = express.Router();
const userController= require('../controller/user.controller');


// add a user
router.get("", userController.findAll);

// // get user details by token
// router.get("/identity", userController.getDetailsByToken);
// // get user details by token
// router.get("/refresh", userController.generateRefreshToken);
// // add a user
// router.get("/:id", userController.findOneById);

// add a user
router.post("/create", userController.signup);

// get Profile
router.get("/getProfile", userController.getProfile);


// change user password
// router.post("/changePassword", userController.changePassword);
// // updateUser
// router.put('/update-user', userController.updateUser);
// // updateUser Permission
// router.put('/update-permission', userController.updateUserPermission);
// // Toggle active status
// router.put('/change-status', userController.updateUserStatus);
// // deleteUser Permission
// router.delete('/:id', userController.deleteByPeoplesoftId);

module.exports = router;