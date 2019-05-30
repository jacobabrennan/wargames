

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

//-- Project Constants ---------------------------
const URL_WRAPPER_HOME     = '/';
const URL_WRAPPER_ABOUT    = '/about';
const URL_WRAPPER_WARGAME  = '/wargame';
const URL_WRAPPER_REGISTER = '/register';
const URL_WRAPPER_LOGIN    = '/login';
const URL_WRAPPER_LOGOUT   = '/logout';


//== Router Configuration ======================================================

//-- Export Route Handler ------------------------
const router = module.exports = express.Router();

//-- Route Definitions ---------------------------
router.use(defaultHandler);
