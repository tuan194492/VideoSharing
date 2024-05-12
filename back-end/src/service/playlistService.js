const { VIDEO_STATUS, REACTION_TYPE } = require("../constant/enum/ENUM");

const Playlist = require("../model/Playlist");
const Video = require("../model/Video");
const PlaylistVideo = require("../model/PlaylistVideo");

async function authorizeUser(user, playlistId) {
  if (!user) {
    return {
      success: false,
      message: 'Can not find user'
    }
  }
  const playlist = await Playlist.findByPk(playlistId);
  if (!playlist) {
    return {
      success: false,
      message: 'Can not find playlist'
    }
  }
  if (playlist.publisher_id !== user.userId && playlist.status !== VIDEO_STATUS.PUBLIC) {
    return {
      success: false,
      message: 'Not have permission to see this playlist'
    }
  }
  return {
    success: true,
    message: 'Have full permission'
  }
}

const getPlaylistById = async (user, playlistId) => {
  const authorizeResult = await authorizeUser(user, playlistId);
  if (!authorizeResult.success) {
    return authorizeResult;
  }
  const playlist = await Playlist.findByPk(playlistId, {
    include: Video,
  })
  return {
    success: true,
    message: 'Get playlist successful',
    playlist: playlist
  }
}

const addVideoToPlaylist = async (user, playlistId, videoId) => {
  try {
    console.log(playlistId, videoId)
    const authorizeResult = await authorizeUser(user, playlistId);
    if (!authorizeResult.success) {
      return authorizeResult;
    }
    const foundPlaylist = await PlaylistVideo.findOne({
      where: {
        VideoId: videoId,
        PlaylistId: playlistId
      }
    })
    if (foundPlaylist) {
      return {
        success: false,
        message: 'Already added to playlist',
        data: null
      }
    }
    const playlist = await PlaylistVideo.create({
        VideoId: videoId,
        PlaylistId: playlistId
    })
    return {
      success: true,
      message: 'Add video to playlist successful',
      data: playlist
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message,
      data: null
    };
  }
}

const deleteVideoFromPlaylist = async (user, playlistId, videoId) => {
  try {
    const authorizeResult = await authorizeUser(user, playlistId);
    if (!authorizeResult.success) {
      return authorizeResult;
    }
    const playlist = await PlaylistVideo.findOne({
      where: {
        VideoId: videoId,
        PlaylistId: playlistId
      }
    })
    if (playlist) {
      await playlist.destroy();
      return {
        success: true,
        message: 'Delete video from playlist successful',
        data: playlist
      }
    } else {
      return {
        success: false,
        message: 'Video or playlist not found',
        data: null
      }
    }


  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message,
      data: null
    };
  }
}

const findPlaylistByChannelId = async (channelId) => {

}

const createPlaylist = async (user, data) => {
  try {
    const playlist = await Playlist.create({
      publisher_id: user.userId,
      title: data.title,
      description: data.description,
      status: data.isPublic ? VIDEO_STATUS.PUBLIC : VIDEO_STATUS.PRIVATE
    })
    return {
      success: true,
      message: 'Create playlist successful',
      playlist: playlist
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message
    };
  }
}

const deletePlaylist = async (user, playlistId) => {
  try {
    const authorizeResult = await authorizeUser(user, playlistId);
    if (!authorizeResult.success) {
      return authorizeResult;
    }
    const playlist = await Playlist.findByPk(playlistId);
    if (playlist) {
      await playlist.destroy();
      return {
        success: true,
        message: 'Delete playlist successful'
      }
    } else {
      return {
        success: true,
        message: 'Delete playlist not successful'
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
    getPlaylistById,
    addVideoToPlaylist,
    deleteVideoFromPlaylist,
    findPlaylistByChannelId,
    createPlaylist,
    deletePlaylist
}
