

//== Start Server ==============================================================

//-- Dependencies --------------------------------
const webserver = require('./webserver.js');

//-- Project Constants ---------------------------
const PORT = process.env.PORT;

//------------------------------------------------
webserver.listen(PORT, () => {
    console.log("War Games server open on port:", PORT);
});
