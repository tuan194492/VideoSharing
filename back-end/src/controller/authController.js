const express = require('express');
const User = require('../model/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
// Access the JWT secret as an environment variable
const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res, next) => {
    const { email, password } = req.body;
    User.findOne(
        {
            where: {
                email
            }
        }
    ).then(async (user) => {
        if (!user) {
            return res.status(401).json({ error: "Email is not exist." });
        } else {
            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: "Password is not correct." });
            }
        }
        // User does exist, send token to client
        const token = jwt.sign({ userId: user.id}, jwtSecret, {
            expiresIn: "1h",
          });
          res.json({
            token: token,
            user: user,
            message: "Login successful",
        });

    })
    .catch((error) => {
        console.error("Error finding user:", error);
        res.status(500).json({ error: "Internal User Error" });
    });
}

const register = async (req, res, next) => {
    
}

module.exports = {
    login,
    register
}