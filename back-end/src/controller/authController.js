const express = require('express');
const User = require('../model/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const userService = require("../service/userService");
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
        return res.json({
            token: token,
            user: user,
            message: "Login successful",
            role: 'user'
        });

    })
    .catch((error) => {
        console.error("Error finding user:", error);
        res.status(500).json({ error: "Internal User Error" });
    });
}

const register = async (req, res, next) => {
    const validateUser = await userService.validateNewUser(req.body);
    console.log(validateUser)
    if (validateUser.success) {
        await userService.createNewUser(req.body);
        return res.status(200).json({
            success: true,
            message: "Register user successful!"
        })
    } else {
        return res.status(400).json({
            success: true,
            message: validateUser.message
        })
    }
}

const update = async (req, res, next) => {
    let data = {
      ...req.body
    }
    console.log(req.files)
    if (req.files) {
      data = {
        ...data,
        avatar: req.files.avatar[0].data,
        banner: req.files.banner[0].data
      }
    }
    const updateResult = await userService.updateUser(data);
    if (updateResult.success) {
      return res.status(200).json({
        success: true,
        message: "Update user successful!",
        user: updateResult.user
      })
    }
    return res.status(400).json({
      success: true,
      message: updateResult.message
    })
}

module.exports = {
    login,
    register,
    update
}
