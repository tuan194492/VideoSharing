const express = require("express");
const path = require("path");
const { resolve } = require("path");
const absolutePath = resolve("");
const fs = require('fs');

const createUrlForVideo = (file, user) => {
    const dir = `${absolutePath}/public/${user.userId}`;
    if (!fs.existsSync(dir)){    //check if folder already exists
        fs.mkdirSync(dir);    //creating folder
    }
    return `${absolutePath}/public/${user.userId}/${file.name}`
}

const getUserPathForVideo = (file, user) => {
  const dir = `${absolutePath}/public/${user.userId}`;
  if (!fs.existsSync(dir)){    //check if folder already exists
    fs.mkdirSync(dir);    //creating folder
  }
  return `${absolutePath}/public/${user.userId}`
}

const createShortenUrlForVideo = (file, user) => {

    return `${user.userId}/${file.name}`;
}

const createUrlForVideoS3 = (file, user) => {
  const dir = `${absolutePath}/public/${user.userId}`;
  return `${absolutePath}/public/${user.userId}/${file.name}`
}

const getUserPathForVideoS3 = (file, user) => {
  const dir = `${absolutePath}/public/${user.userId}`;
  if (!fs.existsSync(dir)){    //check if folder already exists
    fs.mkdirSync(dir);    //creating folder
  }
  return `${absolutePath}/public/${user.userId}`
}

const createShortenUrlForVideoS3 = (file, user) => {

  return `${user.userId}/${file.name}`;
}

module.exports = {
    createUrlForVideo,
    createShortenUrlForVideo,
    getUserPathForVideo,
    createUrlForVideoS3,
    createShortenUrlForVideoS3,
    getUserPathForVideoS3
}
