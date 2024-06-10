const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const playlistService = require("../service/playlistService");
const {USER_STATUS} = require("../constant/enum/ENUM");
const {Sequelize} = require("sequelize");
const {sequelize} = require("../utils/database");
const validateNewUser = async (newUser) => {
  const { email } = newUser;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    return {
      success: false,
      message: "Email already existed! Please choose another one!",
    };
  } else {
    return {
      success: true,
    };
  }
};

const createNewUser = async (user) => {
  const res = await validateNewUser(user);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  if (res.success) {
    const result = await User.create({ ...user, password: hashedPassword, status: USER_STATUS.ACTIVE });
    console.log(result)
    await playlistService.createDefaultPlaylistForUser(result.dataValues);
    return {
      success: true,
      message: "Create User Successful",
      data: user,
    };
  } else {
    return {
      success: false,
      message: res.message,
    };
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);

    return {
      success: true,
      message: 'Success',
      user: user
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message
    };
  }
}

const updateUser = async (userData) => {
  try {
    const user = await User.findByPk(userData.id);
    console.log(userData)
    if (user) {
      await user.update({
        ...userData
      });
      return {
        success: true,
        message: 'Success',
        user: user
      }
    } else {
      return {
        success: false,
        message: 'User not found',
        user: user
      }
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message
    };
  }
}

const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      where:{
        id: {
          [Sequelize.Op.gt]: 0 // Users with more than 100 subscribers
        },
        email: {
          [Sequelize.Op.ne]: 'admin@gmail.com'
        }
      }
    });
    return { success: true, data: users };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

const updateUserStatus = async (userId, status) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    user.status = status;
    await user.save();
    return { success: true, message: `User ${status === 'A' ? 'activated' : 'suspended'} successfully` };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  validateNewUser,
  createNewUser,
  getUserById,
  updateUser,
  getAllUsers,
  updateUserStatus
};
