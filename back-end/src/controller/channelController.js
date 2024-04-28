const userService = require("../service/userService");
const findChannelById = async (req, res, next) => {
  const result = await userService.getUserById(req.params.channelId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: result.user
    });
  } else {
      return res.status(400).json({
        success: false,
        message: result.message
      });
  }
}

module.exports = {
  findChannelById
}
