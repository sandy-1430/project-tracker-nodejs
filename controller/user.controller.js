const User = require("../model/User");
const { generateToken } = require("../utils/token");
const { log } = require("../services/logger.service");
const jwt = require("jsonwebtoken");
const { currentUser } = require("../utils/current.user");

// register user
// sign up
exports.findAll = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    const loggedInUser = await currentUser(token);

    const users = await User.find({ _id: { $nin: loggedInUser._id} })

    let usersList = users.map((user) => {
      return {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        empId: user.empId,
        role: user.role,
        isActiveUser: user.isActiveUser,
      };
    })

    res.status(200).json({
      status: "success",
      data: {
        users: usersList,
      },
    });
  } catch (error) {
    next(error)
  }
};

// register user
// sign up
exports.signup = async (req, res, next) => {
  try {
    const user = await this.getExistingUser(req.body.empId);
    if (user) {
      res.send({ status: "failed", message: "User already exists" });
    } else {
      let user = req.body;
      const saved_user = await User.create(user);
      const { password: pwd, isLoggedIn, __v, ...others } = saved_user.toObject();

      log(`new user added; empId = ${req.body.empId}`, "info")

      res.status(200).json({
        status: "success",
        message: "Registration Success",
        data: {
          user: others,
        },
      });
    }
  } catch (error) {
    log(`new user add Error = ${error} \n______EOR`, "error");
    next(error)
  }
};

// // change password
// exports.changePassword = async (req, res, next) => {
//   try {
//     const { empId, password } = req.body || {};
//     const user = await getExistingUser(empId);
//     if (!user) {
//       res.send({ status: "failed", message: "User not found!" });
//     } else {
//       log(`user password updated; empId = ${empId}`, "info")
//       const saved_user = await User.updateOne({ "empId": empId },
//         { $set: { "newPassword": password } });

//       res.status(200).json({
//         status: "success",
//         message: "Your password has been changed",
//       });
//     }
//   } catch (error) {
//     log(`user password update Error = ${error} \n______EOR`, "error");
//     next(error)
//   }
// };

// // update a profile
// exports.updateUser = async (req, res, next) => {
//   try {
//     const { empId, firstname, lastname, email, isActiveUser, role, isEnabledAdminPrivileges, password, isPasswordChange } = req.body || {};
//     const user = await this.getExistingUser(empId);
//     if (user) {
//       user.firstname = firstname;
//       user.lastname = lastname;
//       user.email = email;
//       user.isActiveUser = isActiveUser;
//       user.role = role;
//       user.isEnabledAdminPrivileges = isEnabledAdminPrivileges;
//       if (password) {
//         user.password = password;
//       }

//       const updatedUser = await user.save();
//       log(`User details Updated; empId = ${user.empId}`, "info");

//       const { password: pwd, isLoggedIn, ...others } = updatedUser;
//       res.status(200).json({
//         status: "success",
//         message: "Successfully updated profile",
//         data: {
//           user: others,
//         },
//       });
//     }
//   } catch (error) {
//     next(error)
//   }
// };

// // update permission
// exports.updateUserPermission = async (req, res, next) => {
//   try {
//     const { empId, role } = req.body || {};
//     const user = await getExistingUser(empId);
//     if (!user) {
//       res.send({ status: "failed", message: "User not found!" });
//     } else {
//       const saved_user = await User.updateOne({ "empId": empId },
//         { $set: { "role": role } });
//       const { password: pwd, isLoggedIn, ...others } = saved_user;

//       log(`User permission Updated; empId = ${user.empId}`, "info");
//       res.status(200).json({
//         status: "success",
//         message: "New permission updated",
//         data: {
//           user: others,
//         },
//       });
//     }
//   } catch (error) {
//     next(error)
//   }
// };

// // Change active status
// exports.updateUserStatus = async (req, res, next) => {
//   try {
//     const { empId, status } = req.body || {};
//     const user = await getExistingUser(empId);
//     if (!user) {
//       res.send({ status: "failed", message: "User not found!" });
//     } else {
//       await User.updateOne({ "empId": empId },
//         { $set: { "isActiveUser": status } });

//       log(`User Status Updated; empId = ${user.empId}`, "info");
//       res.status(200).json({
//         status: "success",
//         message: "Active status updated",
//       });
//     }
//   } catch (error) {
//     next(error)
//   }
// };

module.exports.login = async (req, res, next) => {
  try {
    const { empId, password } = req.body;

    if (!empId || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await this.getExistingUser(empId);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    const token = generateToken(user);

    const { password: pwd, isLoggedIn, __v, isActiveUser, ...others } = user.toObject();

    await User.updateOne({ "empId": empId },
      { $set: { "isLoggedIn": true } });

    log(`User login (${user.empId})`, "info");
    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    next(error)
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    const user = await currentUser(token);

    const { password, isLoggedIn, __v, isActiveUser, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
      },
    });
  } catch (error) {
    next(error)
  }
};

// module.exports.generateRefreshToken = async (req, res, next) => {
//   try {
//     const token = req.headers?.authorization?.split(" ")?.[1];
//     if (!token) {
//       res.status(400).json({ message: "Invalid request" });
//     }
//     let currentUser = await verifyToken(token);

//     const user = await this.getExistingUser(currentUser._id);
//     const newToken = generateToken(user);

//     log(`Active User (${user.empId})`, "info");
//     const { exp } = jwt.decode(newToken);
//     const { password: pwd, isLoggedIn, __v, createdAt, editedAt, editedBy, updatedAt, ...others } = user.toObject();

//     res.status(200).json({
//       status: "success",
//       data: {
//         token: newToken,
//         exp: exp,
//         user: others,
//       },
//     });
//   } catch (error) {
//     next(error)
//   }
// };

// module.exports.logout = async (req, res, next) => {
//   try {
//     const token = req.headers?.authorization?.split(" ")?.[1];
//     const {_id} = jwt.decode(token);

//     await User.updateOne({ "empId": _id },
//       { $set: { "isLoggedIn": false } });
//     log(`Logged out user (${_id})`, "info");
//     res.status(200).json({ message: "Logout success" });
//   } catch (error) {
//     res.status(200).json({ message: "Token not found" });
//   }
// };

// module.exports.findOneById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const token = req.headers?.authorization?.split(" ")?.[1];
//     await verifyToken(token);

//     let userInfo = await User.findOne({ _id: id });
//     const { password: pwd, isLoggedIn, __v, createdAt, editedAt, editedBy, updatedAt, ...others } = userInfo.toObject();
//     res.status(200).json({
//       status: "success",
//       data: others,
//     });
//   } catch (error) {
//     next(error)
//   }
// };

// exports.getDetailsByToken = async (req, res, next) => {
//   try {
//     const token = req.headers?.authorization?.split(" ")?.[1];
//     const { _id, exp } = await verifyToken(token);
//     const userById = await this.getExistingUser(_id);
//     const { password: pwd, isLoggedIn, __v, createdAt, editedAt, editedBy, updatedAt, ...others } = userById.toObject();

//     res.status(200).json({
//       status: "success",
//       data: {
//         token: token,
//         exp: exp,
//         user: others,
//       },
//     });
//   } catch (error) {
//     next(error)
//   }
// }

// module.exports.deleteByempId = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const token = req.headers?.authorization?.split(" ")?.[1];
//     let currentUser = await verifyToken(token);

//     let result = await User.deleteOne({ "empId": id });
//     const { password: pwd, isLoggedIn, __v, _id, ...others } = result;
//     log(`User (${_id}) deleted (${currentUser._id})`, "info");
//     res.status(200).json({
//       status: "success",
//       data: others,
//     });
//   } catch (error) {
//     next(error)
//   }
// };

module.exports.getExistingUser = async (empId) => {
  return await User.findOne({ empId: empId });
}
