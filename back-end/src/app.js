const express = require("express");
const path = require("path");
const cors = require('cors');
const fileUpload = require('express-fileupload')
const route = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

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

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
