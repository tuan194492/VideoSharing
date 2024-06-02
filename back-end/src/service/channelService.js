const { Log } = require("../model/Log");
const {USER_ACTION} = require("../constant/enum/ENUM");

const getViewCountByChannel =  async (channelId, startDate, endDate) => {
  console.log(channelId)
  const defaultDayAgo = 7;
  if (!endDate) {
    endDate = new Date();
  }
  if (!startDate) {
    startDate = new Date(new Date().getDate() - defaultDayAgo);
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
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        logs: { $push: "$$ROOT" }
      }
    },
    { $sort: { _id: 1 } }])
  console.log(logs);
  return {
    success: true,
    data: logs
  }
  // Optional: sort by date
}

module.exports  = {
  getViewCountByChannel
}
