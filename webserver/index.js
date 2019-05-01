

//== War Games Web Server ======================================================

//-- Dependencies --------------------------------
const express = require('express');

//-- Project Constants ---------------------------
const PORT = 3000;

//-- Configure Server ----------------------------
const server = express();
server.listen(PORT, () => {
    console.log("War Games server open on port:", PORT);
});

//-- Middleware ----------------------------------

//-- Routing -------------------------------------
