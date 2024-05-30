const express = require("express");
const User = require("../model/User");
const Subcriber = require("../model/Subcriber");
const userService = require("../service/userService");
const {Sequelize} = require("sequelize");

const subcribeToUser = async (userId, channelId) => {
  try {
    console.log(userId);
    console.log(channelId)
    if (userId == channelId) {
        return {
            success: false,
            message: "Can't subscribe to own channel"
          }
    }
    const user = await User.findByPk(userId);
    const channel = await User.findByPk(channelId);
    if (user && channel) {
      await Subcriber.create({
        publisher_id: channelId,
        subscriber_id: userId,
      });
      channel.subscriberCount++;
      await channel.save();
      return {
        success: true,
        message: "Subscribe to channel successful"
      }
    } else {
      return {
        success: false,
        message: "Subscribe to channel unsuccessful",
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
      channel.subscriberCount--;
      await channel.save();
      return {
        success: true,
        message: "Unsubscribe to channel successful"
      }
    } else {
      return {
        success: false,
        message: "Unsubscribe to channel unsuccessful",
      };
    }
  } catch (e) {
    console.log(e)
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
        include: [
          {
            model: User,
            as: 'User',
            attributes: ["id", "name", "avatar", "shortname", "subscriberCount"],
            required: true
          }
        ]
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
      console.log(userId)
        const channel = await User.findByPk(userId);
        if (channel) {
          const data = await Subcriber.findAll({
            where: {
              subscriber_id: userId,
            },
            include: [
              {
                model: User,
                as: 'Publisher',
                attributes: ["id", "name", "avatar", "shortname", "subscriberCount"],
                required: true
              }
            ]
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
      console.log(e)
        return {
          succes: false,
          data: [],
          message: "User not found",
        };
      }
};

const isSubscribedToChannel = async (userId, channelId) => {
  try {
    const channel = await User.findByPk(userId);
    if (channel) {
      const data = await Subcriber.findAll({
        where: {
          subscriber_id: userId,
          publisher_id: channelId
        },
      });
      return {
        success: true,
        isSubscribed: data.length > 0
      }
    } else {
      return {
        success: false,
        isSubscribed: false,
        message: "User not found",
      };
    }
  } catch (e) {
    return {
      success: false,
      isSubscribed: false,
      message: "User not found",
    };
  }
};

module.exports = {
  subcribeToUser,
  getListOfSubcribersByChannelId,
  getListOfSubcribedChannel,
  unsubcribeToUser,
  isSubscribedToChannel
};
