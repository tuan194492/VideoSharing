const express = require('express');
const User = require('../model/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const userService = require("../service/userService");
const {USER_STATUS} = require("../constant/enum/ENUM");
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
            if (user.status === USER_STATUS.SUSPEND) {
              return res.status(401).json({ error: "User is suspended." });
            }
        }
        // User does exist, send token to client
        const token = jwt.sign({ userId: user.id, name: user.name, role: user.name === 'admin' ? 'admin' : 'user'}, jwtSecret, {
            expiresIn: "365d",
          });
        return res.json({
            token: token,
            user: user,
            role: user.name === 'admin' ? 'admin' : 'user',
            message: "Login successful",
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

const getAllUsers = async (req, res) => {
  const result = await userService.getAllUsers();
  if (result.success) {
    return res.status(200).json(result.data);
  }
  return res.status(500).json({ message: result.message });
};

const activateUser = async (req, res) => {
  const userId = req.params.userId;
  const result = await userService.updateUserStatus(userId, 'A');
  if (result.success) {
    return res.status(200).json({ message: result.message });
  }
  return res.status(500).json({ message: result.message });
};

const suspendUser = async (req, res) => {
  const userId = req.params.userId;
  const result = await userService.updateUserStatus(userId, 'S');
  if (result.success) {
    return res.status(200).json({ message: result.message });
  }
  return res.status(500).json({ message: result.message });
};

const changePassword = async (req, res) => {
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;
  console.log(req.body)
  const user = await userService.getUserById(userId);
  console.log(user.user.dataValues.password)
  if (!(await bcrypt.compare(oldPassword, user.user.dataValues.password))) {
    return res.status(400).json({ message: "Old password is not correct." });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const updateResult = await userService.updateUser({
    id: userId,
    password: hashedPassword,
  })
  if (updateResult.success) {
    return res.status(200).json({ message: "Update password successful!" });
  }
  return res.status(400).json({ message: updateResult.message });
}

module.exports = {
    login,
    register,
    update,
    getAllUsers,
    activateUser,
    suspendUser,
    changePassword
}
