

/*== War Games Web Server ======================================================

This module defines the Social Media Wargames webserver, including functionality
for both "front end" (file serving) and "back end". It fully defines the outter
wrapper website, as well as hosting individual wargames defined elsewhere.

It exports a single Express server instance, which can be used as in any other
Express app:

server.listen(port);

*/

//-- Dependencies --------------------------------
require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressWs = require('express-ws');
const auth = require('./server_auth/index.js');
const wrapper = require('./wrapper.js');
const error = require('./error_handler.js');

//-- Configure Server ----------------------------
// Create server
const server = module.exports = express();
// Enable Websockets (for wargames that use them)
expressWs(server);
// Configure templating engine
server.engine('handlebars', exphbs({defaultLayout: 'theme'}));
server.set('view engine', 'handlebars');

//-- Middleware ----------------------------------
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(auth);

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
server.use('/', wrapper);

//-- Error Handling ------------------------------
error(server);
