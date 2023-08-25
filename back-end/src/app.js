const express = require("express");
const path = require("path");
const cors = require('cors');
const fileUpload = require('express-fileupload')
const route = require('./routes/index');

const {databaseInit} = require("../src/utils/database/index")

const app = express();
const port = 3000;

app.use(cors()) // Use this after the variable declaration

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

databaseInit();
route(app);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
