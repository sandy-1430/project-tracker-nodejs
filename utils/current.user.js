const User = require("../model/User");
const { verifyToken } = require("./token");

exports.currentUser = async (token) => {
    let currentUser = await verifyToken(token);
    const user = await User.findOne({ empId: currentUser._id });
    return user;
}