

//== War Games Web Server ======================================================

//-- Dependencies --------------------------------
require('dotenv').config();
const express = require('express');

//-- Project Constants ---------------------------
const PORT = process.env.PORT;

//-- Configure Server ----------------------------
const server = express();
server.listen(PORT, () => {
    console.log("War Games server open on port:", PORT);
});

//-- Middleware ----------------------------------

//-- Routing -------------------------------------
