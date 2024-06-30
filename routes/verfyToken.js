const jwt = require("jsonwebtoken");
const User=require("../models/User")

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      console.log("rrgrgrgd",user)
      req.user = user;
      console.log("rfsg",req.user)
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  console.log("req.params.id:", req.params.id)
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      req.user.isAdmin=true
      next();
    } else {
      res.status(403).json("You ahhre not alowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
     // Log req.user to see the decoded user info
  
  verifyToken(req, res, () => {
    console.log("req.user in verifyTokenAndAdmin:", req.user);
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  
};