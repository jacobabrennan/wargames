

//== War Games Web Server ======================================================

//-- Dependencies --------------------------------
require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const auth = require('./auth.js');
const error = require('./error_handler.js');

//-- Configure Server ----------------------------
// Create server
const server = module.exports = express();
// Configure templating engine
server.engine('handlebars', exphbs({defaultLayout: 'theme'}));
server.set('view engine', 'handlebars');

//-- Middleware ----------------------------------
server.use(express.json());

//-- Work around cache issues in development -----
// TO DO: Remove this later
server.use(function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

//-- Routing -------------------------------------
server.use('/rsc', express.static(path.join(__dirname, 'rsc')));
server.use('/auth', auth);

//-- Error Handling ------------------------------
server.use(function (request, response, next) {
    next(error.httpError(404, 'Resource not found'));
});
server.use(error.handler);
