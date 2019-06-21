

/*== Authentication Route Handler ==============================================

Exports an Express router which handles user registration and login. The
following endpoints are provided:

POST /register
POST /login
GET /testget

The GET endpoint is provided to test authentication via automated testing.
For both POST endpoints, data must be supplied in the body of the request, in
the following format:
{
    "username": "some name string",
    "password": "secret password"
}

An authentication middleware is also provided via module.exports.authenticate.
This middleware will invoke the next middleware when a user is logged in, and
will throw an error (block access) otherwise.

Note: Logout function not provided, and not strictly possible with stateless
web tokens.

*/

//-- Dependencies --------------------------------
const express = require('express');
const errorHandler = require('./error_handler.js');

//-- Project Constants ---------------------------
const MESSAGE_ERROR_INTERNAL = 'Internal Error';
const URL_WRAPPER_INDEX    = '/';
const URL_WRAPPER_ABOUT    = '/about';
const URL_WRAPPER_WARGAME  = '/wargame';
const URL_WRAPPER_LOGIN    = '/login';
const URL_WRAPPER_LOGOUT   = '/logout';
const VIEW_SPLASH = 'splash';
const VIEW_STATUS = 'status';
const pathViews = {
    [URL_WRAPPER_ABOUT   ]: 'about',
    [URL_WRAPPER_WARGAME ]: 'wargame',
    [URL_WRAPPER_LOGIN   ]: 'login',
    [URL_WRAPPER_LOGOUT  ]: 'logout',
}

//-- Router Configuration ------------------------
const router = module.exports = express.Router();
router.use(handleDefault);
router.get(URL_WRAPPER_INDEX, handleIndex);


//== Route Handling ============================================================

//-- Handle Splash and Status (index) ------------
function handleIndex(request, response, next) {
    try {
        // Determine if user is logged in
        
        //
        response.render(VIEW_SPLASH, {
            title: 'Social Media Wargames',
            auth: request.auth,
        });
    }
    catch (error) {
        next(errorHandler.httpError(500, MESSAGE_ERROR_INTERNAL));
    }
}

//-- Default Route Handler -----------------------
function handleDefault(request, response, next) {
    try {
        // Determine page to be rendered. Bail if none found.
        let view = pathViews[request.path.toLowerCase()];
        if (!view) {
            next();
            return;
        }
        // Construct rendering context
        const renderingContext = {
            title: `Social Media Wargames - ${view}`,
            auth: request.auth,
        };
        // Render Page
        response.render(view, renderingContext);
    }
    catch (error) {
        next(errorHandler.httpError(500, MESSAGE_ERROR_INTERNAL));
    }
}
