const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");

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
    const result = await User.create({ ...user, password: hashedPassword });
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

module.exports = {
  validateNewUser,
  createNewUser,
  getUserById,
  updateUser
};
