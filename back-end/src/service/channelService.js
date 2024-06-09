const { Log } = require("../model/Log");
const Subscriber = require("../model/Subcriber");
const Video = require("../model/Video");
const User = require("../model/User");

const sequelize = require("../utils/database/sequelize")
const {USER_ACTION} = require("../constant/enum/ENUM");
const Sequelize = require("sequelize");

const getViewCountByChannel =  async (channelId, startDate, endDate) => {
  console.log(channelId)
  const defaultDayAgo = 7;
  if (!endDate) {
    endDate = new Date();
    console.log(endDate)
  }
  if (!startDate) {
    const date = new Date();
    startDate = new Date(date.getTime() - defaultDayAgo * 24 * 60 * 60 * 1000);
    console.log(startDate)
  }
  const logs = await Log.aggregate([
    { $match:
        {
          action: USER_ACTION.WATCH,
          channelId: parseInt(channelId, 10),
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
      } },
    {
      $group: {
        _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
        viewCount: {$sum: 1}
      }
    },
    { $sort: { _id: 1 } }])
  console.log(logs);
  const result = [...logs];
  const logMap = new Map(logs.map(log => [log._id, log.viewCount]));

  // Check for start date
  const startStr = startDate.toISOString().split('T')[0];
  if (!logMap.has(startStr)) {
    result.push({
      _id: startStr,
      viewCount: logMap.get(startStr) || 0
    });
  }

  // Check for end date
  const endStr = endDate.toISOString().split('T')[0];
  if (!logMap.has(endStr)) {
    result.push({
      _id: endStr,
      viewCount: logMap.get(endStr) || 0
    });
  }

  console.log(result);
  return {
    success: true,
    data: result
  }
  // Optional: sort by date
}

const getSubscriberCountByChannel =  async (channelId, startDate, endDate) => {
  const defaultDayAgo = 7;
  if (!endDate) {
    endDate = new Date();
    console.log(endDate)
  }
  if (!startDate) {
    const date = new Date();
    startDate = new Date(date.getTime() - defaultDayAgo * 24 * 60 * 60 * 1000);
    console.log(startDate)
  }


   // Replace with the actual publisher_id you want to filter
  const subscribers = await Subscriber.findAll({
    attributes: [
      'publisher_id',
      [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
      [Sequelize.fn('COUNT', Sequelize.col('subscriber_id')), 'subscriberCount']
    ],
    where: {
      publisher_id: channelId,
      createdAt: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    },
    group: ['publisher_id', 'createdAt'],
    order: [['publisher_id', 'ASC'], ['createdAt', 'ASC']]
  })

  const logMap = new Map(subscribers.map(log => {
    console.log(log.dataValues)
    return [log.dataValues.date, log.dataValues.subscriberCount]
  }
      ));
  console.log(logMap)
  const result = [...subscribers];
// Check for start date
  const startStr = startDate.toISOString().split('T')[0];
  if (!logMap.has(startStr)) {
    result.push({
      date: startStr,
      subscriberCount: logMap.get(startStr) || 0
    });
  }

  // Check for end date
  const endStr = endDate.toISOString().split('T')[0];
  if (!logMap.has(endStr)) {
    result.push({
      date: endStr,
      subscriberCount: logMap.get(endStr) || 0
    });
  }

  return {
    success: true,
    data: result
  }
}

const mostWatchedVideoByDate = async (channelId, numberOfVideo, endDate, dayAgo) => {
    const defaultDayAgo = 28;
    if (!numberOfVideo) {
      numberOfVideo = 5;
    }
    if (!endDate) {
      endDate = new Date();
      console.log(endDate)
    }
    if (!dayAgo) {
      dayAgo = defaultDayAgo;
    }
    const startDate = new Date(endDate.getTime() - dayAgo * 24 * 60 * 60 * 1000);
    const logs = await Log.aggregate([
      { $match:
          {
            action: USER_ACTION.WATCH,
            channelId: parseInt(channelId, 10),
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
        } },
      {
        $group: {
          _id: "$videoId",
          viewCount: {$sum: 1}
        }
      },
      { $sort: { viewCount: -1 } },
      { $limit: parseInt(numberOfVideo) }])
    console.log(logs);
    const result = [];
    for (let log of logs) {
      const video = await Video.findByPk(log._id);
      if (video) {
        result.push({
          videoId: log._id,
          viewCount: log.viewCount,
          title: video.title,
          video_length_in_seconds: video.video_length_in_seconds,
          thumbnail: video.thumbnail,
          createdAt: video.createdAt
        });
      }
    }
    return {
      success: true,
      data: result
    }
}

/*
  Get analytics data of a channel
  Data to get:
    1. View count from started to end date
    2. Current Subscribers
    3. Watching time from state date to end date
 */
const getChannelAnalyticsData = async (channelId, startDate, endDate) => {
  const defaultDayAgo = 7;

  if (!endDate) {
    endDate = new Date();
    console.log(endDate)
  }
  startDate = new Date(endDate.getTime() - defaultDayAgo * 24 * 60 * 60 * 1000);
  const viewCount = await Log.countDocuments({
    channelId: parseInt(channelId),
    action: "WATCH",
    createdAt: {$gte: startDate, $lte: endDate}
  });
  const watchTimeResult = await Log.aggregate([
    {
      $match: {
        channelId: parseInt(channelId),
        action: "WATCH",
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        totalWatchTime: {$sum: "$watchTime"}
      }
    }
  ]);

  console.log(`Watch time result ` + watchTimeResult)

  const user = await User.findByPk(channelId);
  let subscriberCount = 0;
  if (user) {
    subscriberCount = user.subscriberCount;
  }

  const totalWatchTime = watchTimeResult[0] ? watchTimeResult[0].totalWatchTime : 0;
  return {
    success: true,
    data: {
      viewCount,
      totalWatchTime,
      subscriberCount
    }
  }
}

const deleteWatchedVideo = async (logId) => {
  try {
    await Log.findOneAndDelete(logId, { lean: true}).exec();
    return {
      success: true,
      message: "Delete watched video successful"
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: "Delete watched video failed"
    }
  }
}


module.exports  = {
  getViewCountByChannel,
  getSubscriberCountByChannel,
  mostWatchedVideoByDate,
  getChannelAnalyticsData,
  deleteWatchedVideo
}
