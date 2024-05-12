const userService = require("../service/userService");
const playlistService = require("../service/playlistService");
const getPlaylistDetail = async (req, res, next) => {
    const playlistId = req.params.playlistId;
    const user = req?.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Can not find user',
        data: []
      })
    }
    const getPlaylistResult = await playlistService.getPlaylistById(user, playlistId);
    if (getPlaylistResult.success) {
      return res.status(200).json({
         success: true,
         message: 'Get playlist successful',
         data: getPlaylistResult.playlist
      })
    } else {
      return res.status(400).json({
        success: false,
        message: getPlaylistResult.message,
        data: []
      })
    }
}

const getPublicPlaylistListOfChannel = async (req, res, next) => {

}

const getAllPlaylistListOfChannel = async (req, res, next) => {

}

const createPlaylist = async (req, res, next) => {
  const result = await playlistService.createPlaylist(req.user, req.body);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Create playlist successful',
      data: result.playlist
    })
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
      data: null
    })
  }
}

const deletePlaylist = async (req, res, next) => {
  const result = await playlistService.deletePlaylist(req.user, req.params.playlistId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Delete playlist successful'
    })
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    })
  }
}

const addVideoToPlaylist = async (req, res, next) => {
  const result = await playlistService.addVideoToPlaylist(req.user, req.body.playlistId, req.body.videoId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Add video to playlist successful',
      data: result.data
    })
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
      data: null
    })
  }
}

const removeVideoFromPlaylist = async (req, res, next) => {
  const result = await playlistService.deleteVideoFromPlaylist(req.user, req.body.playlistId, req.body.videoId);
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: 'Delete video from playlist successful',
      data: result.data
    })
  } else {
    return res.status(400).json({
      success: false,
      message: result.message,
      data: result.data
    })
  }
}


module.exports = {
  getPlaylistDetail,
  getPublicPlaylistListOfChannel,
  getAllPlaylistListOfChannel,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  createPlaylist,
  deletePlaylist
}
