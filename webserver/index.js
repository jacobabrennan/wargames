

//== War Games Web Server ======================================================

//-- Dependencies --------------------------------
require('dotenv').config();
const express = require('express');
const auth = require('./auth.js');
const error = require('./error.js');

//-- Project Constants ---------------------------
const PORT = process.env.PORT;

//-- Configure Server ----------------------------
const server = express();
server.listen(PORT, () => {
    console.log("War Games server open on port:", PORT);
});

//-- Middleware ----------------------------------
server.use(express.json());

//-- Routing -------------------------------------
server.use("/auth", auth);

//-- Error Handling ------------------------------
server.use(error.handler);