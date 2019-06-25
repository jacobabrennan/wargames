

/*== Database Access, User Credentials =========================================

This file provides the data access layer for the server_auth middleware. It
exports an object with the following attributes and methods:
    ERROR_NAME_CONFLICT,
    ERROR_INVALID_PARAMS: error messages, for handling thrown errors.
    deleteUser(username): deletes the given username from the database. This
        is currently for internal use only, but should eventually be exposed
        through an API.
    addUser(username, password): adds a new user to the database with the given
        credentials, and returns the new user's userId. Will throw
        ERROR_NAME_CONFLICT is a user with that name already exists. Will throw
        ERROR_INVALID_PARAMS is the given username or password are invalid.
    authenticateUser(username, password): checks if the given credentials match
        any users in the database. Will return the user's userId if they do, and
        false otherwise.

*/

//-- Dependencies --------------------------------
const bcrypt = require('bcryptjs');
const database = require('../database/index.js');

//-- Project Constants ---------------------------
const saltRounds = 10;
const TABLE_CREDENTIALS = 'credentials';
const FIELD_ID = 'id';
const FIELD_USERNAME = 'username';
const FIELD_HASH = 'hash';
const ERROR_NAME_CONFLICT = "Username already exists";
const ERROR_INVALID_PARAMS = "Invalid username / password";

//== User Database Access ======================================================

module.exports = {
    // "exported" values for use outside module
    ERROR_NAME_CONFLICT: ERROR_NAME_CONFLICT,
    ERROR_INVALID_PARAMS: ERROR_INVALID_PARAMS,
    // Delete User
    async deleteUser(username) {
        // WARNING: Currently a utility method, not public facing
        return await database
            .from(TABLE_CREDENTIALS)
            .where({[FIELD_USERNAME]: username})
            .del();
    },
    // Register
    async addUser(username, password) {
        // Check if provided username and password are formatted correctly
        username = checkFormatUsername(username);
        password = checkFormatPassword(password);
        if (!username || !password) {
            throw Error(this.ERROR_INVALID_PARAMS);
        }
        // Check if requested username is available
        const nameAvailable = await checkAvailableUsername(username);
        if (!nameAvailable) {
            throw Error(this.ERROR_NAME_CONFLICT);
        }
        // Store credentials and return user id
        const userId = await storeCredentials(username, password);
        return userId;
    },
    // Login
    async authenticateUser(username, password) {
        // Retrieve stored user data
        const entry = await database
            .select(FIELD_HASH, FIELD_ID)
            .from(TABLE_CREDENTIALS)
            .where({[FIELD_USERNAME]: username})
            .first();
        // Bail if user doesn't exist
        if (!entry) {
            return false
        }
        // Compare stored hash to password
        const hashStored = entry[FIELD_HASH];
        const result = await hashCompare(password, hashStored);
        if (!result) {
            return false;
        }
        // Return user id
        return entry[FIELD_ID];
    }
};


//== Utilities =================================================================

//-- Format Validators ---------------------------
function checkFormatUsername(username) {
    return username;
}
function checkFormatPassword(password) {
    return password;
}

//-- Hash Handlers -------------------------------
async function hashGenerate(password) {
    return await bcrypt.hash(password, saltRounds);
}
async function hashCompare(password, hashStored) {
    return await bcrypt.compare(password, hashStored);
}

//-- Database utilities --------------------------
async function checkAvailableUsername(username) {
    const entry = await database
        .select(FIELD_ID)
        .from(TABLE_CREDENTIALS)
        .where({[FIELD_USERNAME]: username})
        .first();
    if (!entry) {
        return true;
    }
}
async function storeCredentials(username, password) {
    // Hash Password
    const passwordHash = await hashGenerate(password);
    // Package user data to be stored in database
    const entryData = {
        [FIELD_USERNAME]: username,
        [FIELD_HASH]: passwordHash,
    };
    // Insert into database
    userId = (await database
        .insert(entryData)
        .into(TABLE_CREDENTIALS)
    )[0];
    // Return resultant userId
    return userId;
}
