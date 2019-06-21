

/*== Start Server ==============================================================

This is the start script for the wargames webserver. It is separated from the
webserver definition to allow automated testing.

*/

//-- Dependencies --------------------------------
const webserver = require('./webserver.js');

//-- Project Constants ---------------------------
const PORT = process.env.PORT;

//------------------------------------------------
webserver.listen(PORT, () => {
    console.log("War Games server open on port:", PORT);
});
