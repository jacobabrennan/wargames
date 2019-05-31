

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
const URL_WRAPPER_HOME     = '/';
const URL_WRAPPER_ABOUT    = '/about';
const URL_WRAPPER_WARGAME  = '/wargame';
const URL_WRAPPER_REGISTER = '/register';
const URL_WRAPPER_LOGIN    = '/login';
const URL_WRAPPER_LOGOUT   = '/logout';
const MESSAGE_ERROR_INTERNAL = 'Internal Error';

//-- Router Configuration ------------------------
const router = module.exports = express.Router();
router.use(defaultHandler);


//== Route Handling ============================================================

//-- Utilities -----------------------------------
const pathViews = {
    [URL_WRAPPER_HOME    ]: 'home',
    [URL_WRAPPER_ABOUT   ]: 'about',
    [URL_WRAPPER_WARGAME ]: 'wargame',
    [URL_WRAPPER_REGISTER]: 'register',
    [URL_WRAPPER_LOGIN   ]: 'login',
    [URL_WRAPPER_LOGOUT  ]: 'logout',
}

//-- Default Route Handler -----------------------
function defaultHandler(request, response, next) {
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
        };
        // Render Page
        response.render(view, renderingContext);
    }
    catch (error) {
        next(errorHandler.httpError(500, MESSAGE_ERROR_INTERNAL));
    }
}
