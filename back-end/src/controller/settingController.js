const Setting = require('../model/Setting');
const {Log} = require("../model/Log");
const User = require("../model/User");
const Video = require("../model/Video");
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        view_count_percent: 80,
        point_for_like: 5,
        point_for_dislike: -5,
        point_for_watch: 3,
        point_for_comment: 10
      })
    }
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Update settings
    settings.view_count_percent = req.body.view_count_percent || settings.view_count_percent;
    settings.point_for_like = req.body.point_for_like || settings.point_for_like;
    settings.point_for_dislike = req.body.point_for_dislike || settings.point_for_dislike;
    settings.point_for_watch = req.body.point_for_watch || settings.point_for_watch;
    settings.point_for_comment = req.body.point_for_comment || settings.point_for_comment;

    await settings.save();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdminDashBoard = async (req, res, next) => {
  try {
    const totalActiveUsers = await User.count({where: {
      status: 'A'
      }
    });

    const totalSuspendUsers = await User.count({where: {
        status: 'S'
      }
    });

    const totalVideos = await Video.count();

    const watchTimeResult = await Log.aggregate([
      {
        $match: {
          action: "WATCH"
        }
      },
      {
        $group: {
          _id: null,
          totalWatchTime: {$sum: "$watchTime"}
        }
      }
    ]);

    const totalWatchTime = watchTimeResult[0] ? watchTimeResult[0].totalWatchTime : 0;


    res.status(200).json({
      success: true,
      message: 'Admin dashboard data',
      data: {
        totalActiveUsers,
        totalVideos,
        totalSuspendUsers,
        totalWatchTime,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getSettings,
  updateSettings,
  getAdminDashBoard
};
