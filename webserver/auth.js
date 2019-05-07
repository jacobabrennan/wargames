
//-- Temp Scaffolding ----------------------------
const databaseTemp = {
    users: {},
    hash(password) {
        if(password != '') {
            return 'asdf';
        }
    },
    validateUsername(username) { return username;},
    validatePassword(password) { return password;},
    async addUser(username, password) {
        username = this.validateUsername(username);
        password = this.validatePassword(password);
        if(!username || !password) {
            throw Error("Invalid username / password");
        }
        if(this.users[username]) {
            throw Error("Username already exists");
        }
        this.users[username] = this.hash(password);
        return {
            id: 1,
            username: username,
        };
    },
    async authenticate(username, password) {
        const hashTest = this.hash(password);
        const hashStored = this.users[username];
        if(hashTest === hashStored) {
            return {
                id: 1,
                username: username,
            }
        }
    },
};

/*== Authentication Route Handler ==============================================

Exports an Express router which handles user registration and login. The
following endpoints are provided:

POST /register
POST /login

For both endpoints, data must be supplied in the body of the request, in the
following format:
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

//-- Project Constants ---------------------------
const JSONWEBTOKEN_SECRET = process.env.JSONWEBTOKEN_SECRET;
const URL_AUTHENTICATION_REGISTER = '/register';
const URL_AUTHENTICATION_LOGIN    = '/login';
const TIME_TOKEN_EXPIRATION = '1m';
const MESSAGE_AUTHENTICATION_SUCCESS = 'Login Successful';
const MESSAGE_AUTHENTICATION_FAILURE = 'Unauthorized Access';


//== Router Configuration ======================================================

//-- Export Route Handler ------------------------
const router = module.exports = express.Router();
router.authenticate = authenticate;

//-- Route Definitions ---------------------------
router.post(URL_AUTHENTICATION_REGISTER, handleRegistration);
router.post(URL_AUTHENTICATION_LOGIN   , handleLogin       );


//== Utility Functions =========================================================

//-- Login ---------------------------------------
function loginUser(user) {
    // Compile User data
    const tokenData = {
        id      : user.id,
        username: user.username,
    };
    // Compile Token Options
    const options = {
        expiresIn: TIME_TOKEN_EXPIRATION,
    };
    // Return generated token
    return jsonWebToken.sign(tokenData, JSONWEBTOKEN_SECRET, options);
}

//-- Authentication Middleware -------------------
async function authenticate(request, response, next) {
    try {
        // Fail if no token provided
        const token = request.headers.authorization;
        if(!token){
            throw errorHandler.httpError(401, ERROR_AUTHENTICATION_FAILURE);
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
    }
    catch(error) {
        throw errorHandler.httpError(401, ERROR_AUTHENTICATION_FAILURE);
    }
};


//== Route Handlers ============================================================

//-- Register New User ---------------------------
async function handleRegistration(request, response, next) {
    try {
        // Attempt to register a new user
        const username   = request.body.username;
        const password   = request.body.password;
        const user = await databaseTemp.addUser(username, password);
        // Login User and respond with success
        const loginToken = loginUser(user);
        response.status(201).json({
            'message': MESSAGE_AUTHENTICATION_SUCCESS,
            'token': loginToken,
        });
        // Move to next middleware
        next();
    } catch(error) {
        next(errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE));
    }
}

//-- User Log In ---------------------------------
async function handleLogin(request, response, next) {
    try {
        // Check if supplied username and password are valid
        const username = request.body.username;
        const password = request.body.password;
        const user = await databaseTemp.authenticate(username, password);
        // Handle failed authentication
        if(!user) {
            throw errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE);
        }
        // Login User and respond with success
        const loginToken = loginUser(user);
        response.status(200).json({
            'message': MESSAGE_AUTHENTICATION_SUCCESS,
            'token': loginToken,
        });
        // Move to next middleware
        next();
    } catch(error) {
        next(errorHandler.httpError(401, MESSAGE_AUTHENTICATION_FAILURE));
    }
}
