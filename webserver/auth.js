

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
const MESSAGE_AUTHENTICATION_SUCCESS = 'Login Successful';
const MESSAGE_AUTHENTICATION_FAILURE = 'Unauthorized Access';


//== Router Configuration ======================================================

//-- Export Route Handler ------------------------
const router = module.exports = express.Router();
router.authenticate = authenticate;

//-- Route Definitions ---------------------------
router.get (URL_AUTHENTICATION_REGISTER, handleGetRegister);
router.post(URL_AUTHENTICATION_REGISTER, handleRegistration);
router.post(URL_AUTHENTICATION_LOGIN   , handleLogin       );
router.get (URL_AUTHENTICATION_TEST, authenticate, handleTest);


//== Utility Functions =========================================================

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
    try {
        // Fail if no token present
        const token = request.cookies.auth;
        // const token = request.headers.authorization;
        if(!token){
            throw errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE);
        }
        // Setup Callback on Promise
        let validationCallback;
        const validationPromise = new Promise(function (resolve, reject) {
            validationCallback = function (error, result) {
                if(error) { reject(error);}
                resolve(result);
            }
        });
        // Fail if token not valid
        jsonWebToken.verify(
            token,
            JSONWEBTOKEN_SECRET,
            validationCallback,
        );
        let decodedToken = await validationPromise;
        // Set token on request
        request.token = decodedToken;
        // Move to next middleware
        next();
    } catch(error) {
        next(errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE));
    }
};


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
        response.status(301).json({
            'message': MESSAGE_AUTHENTICATION_SUCCESS
        });
        // Move to next middleware
        next();
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
        if(!userId) {
            throw errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE);
        }
        // Login User and respond with success
        const user = {
            id: userId,
            username: username,
        };
        loginUser(response, user);
        response.status(200).json({
            'message': MESSAGE_AUTHENTICATION_SUCCESS,
        });
        // Move to next middleware
        next();
    } catch(error) {
        next(errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE));
    }
}

//-- Get Registration Page -----------------------
async function handleGetRegister(request, response, next) {
    // Determine view
    let view = 'register';
    // Construct rendering context
    const renderingContext = {
        title: `Social Media Wargames - Register`,
    };
    // Render Page
    response.render(view, renderingContext);
}

//-- Automated Testing of Authorized Get ---------
async function handleTest(request, response, next) {
    response.status(200).json({
        'message': 'test complete',
    });
    next();
}
