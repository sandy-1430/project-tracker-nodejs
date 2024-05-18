const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");

exports.generateToken = (userInfo) => {
  const payload = {
    _id: userInfo.empId,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role
  };

  const token = jwt.sign(payload,secret.token_secret, {
    expiresIn: "24h",
  });

  return token;
};

// tokenForVerify
exports.tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    secret.jwt_secret_for_verify,
    { expiresIn: "1m" }
  );
};

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret.token_secret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          reject({ status: 401, message: 'Token expired' });
        } else {
          reject({ status: 401, message: 'You are not logged in' });
        }
      } else {
        resolve(decoded);
      }
    });
  });
};