const express = require("express");
const path = require("path");
const cors = require('cors');
const fileUpload = require('express-fileupload')
const route = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const recommenderService = require("../src/service/recommenderService");
const io = require("../src/utils/socket/socket")
const {databaseInit} = require("../src/utils/database/index")
const connectMongoDB = require("../src/utils/database/mongo");
const {on} = require("./utils/socket/socket");
const app = express();
const port = 3000;
const UPDATE_RECOMMEND_MINUTE = 30;
app.use(cors()) // Use this after the variable declaration

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Above our `app.get("/users")` handler


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerOptions: {
    authAction: {
      Basic: {
        name: "user1",
        schema: {
          type:"application/json",
          in: "header",
          name: "Authorization",
        },
        value: "Basic bG9naW46cGFzc3dvcmQ="
      }
    }
  },
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'],
};


const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

databaseInit();
route(app);
connectMongoDB();

setInterval(() => {
  console.info("Reseting utility matrix");
  recommenderService.resetMatrix();
}, 1000 * 60);

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  io.emit('message', {message: 'welcome ' + socket.id})
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

