const express = require("express");
const User = require("../model/User");
const Subcriber = require("../model/Subcriber");
const userService = require("../service/userService");

const subcribeToUser = async (userId, channelId) => {
  try {
    if (userId == channelId) {
        return {
            success: false,
            message: "Can't subcribe to own channel"
          } 
    }
    const user = await User.findByPk(userId);
    const channel = await User.findByPk(channelId);
    if (user && channel) {
      await Subcriber.create({
        publisher_id: channelId,
        subscriber_id: userId,
      });
      return {
        success: true,
        message: "Subcribe to channel successful"
      }
    } else {
      return {
        success: false,
        message: "Subcribe to channel unsuccessful",
      };
    }
  } catch (e) {
    return {
      success: false,
      message: e,
    };
  }
};

const unsubcribeToUser = async (userId, channelId) => {
  try {
    const user = await User.findByPk(userId);
    const channel = await User.findByPk(channelId);
    if (user && channel) {
      await Subcriber.destroy({
        where: {
          publisher_id: channelId,
          subscriber_id: userId,
        },
      });
      return {
        success: true,
        message: "Unsubcribe to channel successful"
      }
    } else {
      return {
        success: false,
        message: "Unsubcribe to channel unsuccessful",
      };
    }
  } catch (e) {
    return {
      success: false,
      message: "User or channel not found",
    };
  }
};

const getListOfSubcribersByChannelId = async (channelId) => {
  try {
    const channel = await User.findByPk(channelId);
    if (channel) {
      const data = await Subcriber.findAll({
        where: {
          publisher_id: channelId,
        },
      });
      return {
        success: true,
        data: data
      }
    } else {
      return {
        succes: false,
        data: [],
        message: "Channel not found",
      };
    }
  } catch (e) {
    return {
      succes: false,
      data: [],
      message: "Channel not found",
    };
  }
};

const getListOfSubcribedChannel = async (userId) => {
    try {
        const channel = await User.findByPk(userId);
        if (channel) {
          const data = await Subcriber.findAll({
            where: {
              subscriber_id: userId,
            },
          });
          return {
            success: true,
            data: data
          }
        } else {
          return {
            succes: false,
            data: [],
            message: "User not found",
          };
        }
      } catch (e) {
        return {
          succes: false,
          data: [],
          message: "User not found",
        };
      }
};

module.exports = {
  subcribeToUser,
  getListOfSubcribersByChannelId,
  getListOfSubcribedChannel,
  unsubcribeToUser,
};
