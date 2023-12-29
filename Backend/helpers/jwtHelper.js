// helpers/jwtHelper.js
const jwt = require('jsonwebtoken');


const generateToken = (userId,name,premiumUser) => {
  return jwt.sign({ userId,name,premiumUser }, process.env.SECRET_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token,process.env.SECRET_KEY);
};

module.exports = { generateToken, verifyToken };

