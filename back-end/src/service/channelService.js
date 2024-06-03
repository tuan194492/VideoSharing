const { Log } = require("../model/Log");
const {USER_ACTION} = require("../constant/enum/ENUM");

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
  const result = [];
  const logMap = new Map(logs.map(log => [log._id, log.viewCount]));

  // Check for start date
  const startStr = startDate.toISOString().split('T')[0];
  result.push({
    _id: startStr,
    viewCount: logMap.get(startStr) || 0
  });

  // Check for end date
  const endStr = endDate.toISOString().split('T')[0];
  result.push({
    _id: endStr,
    viewCount: logMap.get(endStr) || 0
  });

  console.log(result);
  return {
    success: true,
    data: result
  }
  // Optional: sort by date
}

module.exports  = {
  getViewCountByChannel
}
