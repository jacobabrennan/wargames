

/*== Wrapper Route Handler =====================================================

Exports an Express router which handles the homepage and marketing pages for the
outter wrapper website. It handles get requests for the about and splash pages
by rendering simple templates; for logged in users, it replaces the splash page
with a status page, displaying the status of any currently running wargame. It
also provides a link to a currently running wargame.

*/

//-- Dependencies --------------------------------
const express = require('express');

//-- Project Constants ---------------------------
const URL_WRAPPER_INDEX    = '/';
const URL_WRAPPER_ABOUT    = '/about';
const URL_WRAPPER_WARGAME  = '/wargame';
const VIEW_SPLASH = 'splash';
const VIEW_STATUS = 'status';
const VIEW_ABOUT = 'about';
const VIEW_WARGAME = 'wargame';

//-- Router Configuration ------------------------
const router = module.exports = express.Router();
router.get(URL_WRAPPER_INDEX  , handleIndex  );
router.get(URL_WRAPPER_ABOUT  , handleAbout  );
router.get(URL_WRAPPER_WARGAME, handleWargame);


//== Route Handling ============================================================

//-- Handle Splash and Status (index) ------------
function handleIndex(request, response, next) {
    try {
        // Determine if user is logged in
        if (request.auth) {
            response.render(VIEW_STATUS, {
                title: 'Logged in',
                auth: request.auth,
                prop: request.auth.username
            })
        }
        // if request.auth
        else {
            response.render(VIEW_SPLASH, {
                title: 'Social Media Wargames',
                auth: request.auth,
            });
        }
    }
    catch (error) {
        next(errorHandler.httpError(500, MESSAGE_ERROR_INTERNAL));
    }
}

//-- About Handler -------------------------------
function handleAbout(request, response, next) {
    response.render(VIEW_ABOUT, {
        title: 'Social Media Wargames - About',
        auth: request.auth,
    });
}

//-- Wargame Handler -----------------------------
function handleWargame(request, response, next) {
    response.render(VIEW_WARGAME, {
        title: 'Social Media Wargames - Current Wargame',
        auth: request.auth,
    });
}
