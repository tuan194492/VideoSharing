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
      message: "User already existed!",
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

module.exports = {
  validateNewUser,
  createNewUser,
};
