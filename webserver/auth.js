

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
const express      = require('express');
const jsonWebToken = require('jsonwebtoken');
const errorHandler = require('./error_handler.js');
const dataUsers    = require('./data_users.js');

//-- Project Constants ---------------------------
const JSONWEBTOKEN_SECRET = process.env.JSONWEBTOKEN_SECRET;
const URL_AUTHENTICATION_REGISTER = '/register';
const URL_AUTHENTICATION_LOGIN    = '/login';
const URL_AUTHENTICATION_TEST     = '/testget';
const TIME_TOKEN_EXPIRATION = '1m';
const MESSAGE_AUTHENTICATION_FAILURE = 'Unauthorized Access';


//== Router Configuration ======================================================

//-- Export Route Handler ------------------------
const router = module.exports = express.Router();
router.protect = protect;
router.authenticate = authenticate;

//-- Route Definitions ---------------------------
router.use(authenticate);
router.get(URL_AUTHENTICATION_REGISTER, getRegister);
router.get(URL_AUTHENTICATION_LOGIN   , getLogin   );
router.get(URL_AUTHENTICATION_TEST, protect, getTest);
router.post(URL_AUTHENTICATION_REGISTER, handleRegistration);
router.post(URL_AUTHENTICATION_LOGIN   , handleLogin       );


//== Middleware for Export =====================================================

//-- Route Protection ----------------------------
async function protect(request, response, next) {
    // Check if user is logged in
    if (request.auth) {
        next();
    } else {
        next(errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE));
    }
}


//== Route Handlers ============================================================

//-- Register New User ---------------------------
async function handleRegistration(request, response, next) {
    try {
        // Attempt to register a new user
        const username = request.body.username;
        const password = request.body.password;
        const userId = await dataUsers.addUser(username, password);
        const user = {
            id: userId,
            username: username,
        };
        // Login User
        loginUser(response, user);
        // Respond with success, and redirect to home page
        response.location('/');
        response.status(303).end();
    } catch(error) {
        next(errorHandler.httpError(401, error.message));
    }
}

//-- User Log In ---------------------------------
async function handleLogin(request, response, next) {
    try {
        // Check if supplied username and password are valid
        const username = request.body.username;
        const password = request.body.password;
        const userId = await dataUsers.authenticateUser(username, password);
        // Handle failed authentication
        if (!userId) {
            throw errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE);
        }
        // Login User and respond with success
        const user = {
            id: userId,
            username: username,
        };
        loginUser(response, user);
        response.location('/');
        response.status(303).end();
    } catch(error) {
        next(errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE));
    }
}

//-- Get Registration Page -----------------------
async function getRegister(request, response, next) {
    // Redirect if already logged in
    if (request.auth) {
        response.location('/');
        response.status(303).end();
        return;
    }
    // Determine view
    let view = 'register';
    // Construct rendering context
    const renderingContext = {
        title: `Social Media Wargames - Register`,
    };
    // Render Page
    response.render(view, renderingContext);
}

//-- Get Login Page ------------------------------
async function getLogin(request, response, next) {
    // Redirect if already logged in
    if (request.auth) {
        response.location('/');
        response.status(303).end();
        return;
    }
    // Determine view
    let view = 'login';
    // Construct rendering context
    const renderingContext = {
        title: `Social Media Wargames - Login`,
    };
    // Render Page
    response.render(view, renderingContext);
}

//-- Automated Testing of Authorized Get ---------
async function getTest(request, response, next) {
    response.status(200).json({
        'message': 'test complete',
    });
}


//== Utilities =================================================================

//-- Login ---------------------------------------
function loginUser(response, user) {
    // Compile User data
    const tokenData = {
        id      : user.id,
        username: user.username,
    };
    // Compile Token Options
    const options = {
        expiresIn: TIME_TOKEN_EXPIRATION,
    };
    // Generated token
    const loginToken = jsonWebToken.sign(
        tokenData, JSONWEBTOKEN_SECRET, options,
    );
    // Store token in cookie
    response.cookie('auth', loginToken, {
        // expires: Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
        // maxAge: Convenient option for setting the expiry time relative to the current time in milliseconds.
        httpOnly: true, // cannot be accessed by client scripts
        // secure: true, // https
    });
}

//-- Authentication Middleware -------------------
async function authenticate(request, response, next) {
    request.auth = false;
    // Fail if no token present
    const token = request.cookies.auth;
    if (!token) {
        return next();
    }
    // Setup Callback on Promise
    let validationCallback;
    const validationPromise = new Promise(function (resolve, reject) {
        validationCallback = function (error, result) {
            if (error) { reject(error);}
            resolve(result);
        }
    });
    // Fail if token not valid
    jsonWebToken.verify(
        token,
        JSONWEBTOKEN_SECRET,
        validationCallback,
    );
    let tokenData;
    try {
        tokenData = await validationPromise;
    } catch(error) {
        return next();
    }
    // Set login status on user
    request.auth = true;
    console.log(tokenData)
    return next();
}
