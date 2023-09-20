const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// Access the JWT secret as an environment variable
const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, jwtSecret, (err, user) => {
      console.log(err)
      if (err) {
        return res.status(403).json({message: 'Token expired. Please login again'});
      }
      req.user = user;
      console.log("USER from token", req.user);
      next();
    });
};

const getUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, user) => {
    req.user = user;
    console.log("USER from token", req.user);
    next();
  });
}

module.exports = {
    authenticateToken,
    getUserToken
}