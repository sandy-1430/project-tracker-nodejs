const { verifyToken } = require("../utils/token");
const User = require("../model/User");
const { log } = require("../services/logger.service");
const { currentUser } = require("../utils/current.user");
/**
 * 1. check if token exists
 * 2. if not token send res
 * 3. decode the token
 * 4. if valid then perform next
 */

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    const user = await currentUser(token);
    if (!user.isLoggedIn) {
      log("Invalid request: Stolen Token", "error");
      res.status(401).json({
        status: "rejected",
        error: "Invalid request: Stolen Token"
      });
    }
    next();
  } catch (error) {
    console.log(error);
    log("Invalid request: Invalid token", "error");
    res.status(403).json({
      status: "fail",
      error: "Invalid token"
    });
  }
};