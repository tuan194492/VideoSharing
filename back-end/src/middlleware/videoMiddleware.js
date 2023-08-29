const express = require("express");

const validateUpload = (req, res, next) => {
    if (!req.files) {
      return res
          .status(400)
          .json({ message: "No files were uploaded"});
    }
    console.log(req.files)
    if (!(req.files.file instanceof Array)) {
      if (!req.files.file.mimetype.startsWith("video")) {
        return res
          .status(400)
          .json({message: "Only image files are allowed" });
      }
    } else {
      if (!req.files || !req.files["file"] || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: "No files were uploaded" });
      }
  
      req.files["file"].forEach((file) => {
        // Check if each uploaded file is an image (MIME types)
        if (!file.mimetype.startsWith("video")) {
          return res
            .status(400)
            .json({ message: "Only video file are allowed" });
        }
      });
    }
    next();
  };

  module.exports = {
    validateUpload
  }