

//== War Games Web Server ======================================================

//-- Dependencies --------------------------------
require('dotenv').config();
const express = require('express');
const auth = require('./auth.js');
const error = require('./error_handler.js');

//-- Configure Server ----------------------------
const server = module.exports = express();

//-- Middleware ----------------------------------
server.use(express.json());

//-- Routing -------------------------------------
server.use("/auth", auth);

//-- Error Handling ------------------------------
server.use(function (request, response, next) {
    next(error.httpError(404, 'Resource not found'));
});
server.use(error.handler);
