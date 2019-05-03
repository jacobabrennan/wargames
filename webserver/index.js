

//== War Games Web Server ======================================================

//-- Dependencies --------------------------------
require('dotenv').config();
const express = require('express');
const error = require('./error.js');

//-- Project Constants ---------------------------
const PORT = process.env.PORT;

//-- Configure Server ----------------------------
const server = express();
server.listen(PORT, () => {
    console.log("War Games server open on port:", PORT);
});

//-- Middleware ----------------------------------

//-- Routing -------------------------------------
server.use("/auth", function(request, response, next){
    throw error.httpError(404, "Not Found");
});

//-- Error Handling ------------------------------
server.use(error.handler);