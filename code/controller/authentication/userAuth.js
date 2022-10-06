const jwt = require('jsonwebtoken');
require('dotenv').config()
const jwtKey = process.env.TOKEN_USER_SECRET

exports.authenticate = (req, res, next) => {
  const token = req.headers.access_token;
  // console.log('User Token ---->',token)
  if (!token) {
    return res.json("No token Found");
  }
  try {
    const data = jwt.verify(token, jwtKey);
    console.log(data)
    const email = data.email;
    const userRole = data.role;
    const id = data.id;
    req.userId = email;
    req.userRole = userRole;
    req.id = id;
    return next();
  } catch {
    return res.json("not found");
  }
};