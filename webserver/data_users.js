

/*== Database Access, User Credentials =========================================

Register:
    Is Username Formatted Correctly?
    Is Password Formatted Correctly?
    Is Username available?
    Store Username and Password
    Return ID

Login:
    Retrieve Password associated with Username
    Does provided password match retrieved password?
    Return ID

*/

//-- Dependencies --------------------------------
const database = require('./database/index.js');

//-- Project Constants ---------------------------
const saltRounds = 10;
const TABLE_CREDENTIALS = 'credentials';
const FIELD_ID = 'id';
const FIELD_USERNAME = 'username';
const FIELD_HASH = 'hash';

//-- Temp Scaffolding ----------------------------
const databaseTemp = module.exports = {
    users: {},
    async hash(password) {
        return await bcrypt.hash(password, saltRounds);
    },
    checkFormatUsername(username) {
        return username;
    },
    checkFormatPassword(password) {
        return password;
    },
    async checkAvailableUsername(username) {
        const entry = await database
            .select(FIELD_ID)
            .from(TABLE_CREDENTIALS)
            .where({[FIELD_USERNAME]: username})
            .first();
        if (!entry) {
            return true;
        }
    },
    async storeCredentials(username, password) {
        userId = (await database
            .insert(entryData)
            .into(TABLE_CREDENTIALS)
        )[0];
        return userId;
    },
    // Register
    async addUser(username, password) {
        // Check if provided username and password are formatted correctly
        username = this.checkFormatUsername(username);
        password = this.checkFormatPassword(password);
        if (!username || !password) {
            throw Error("Invalid username / password");
        }
        // Check if requested username is available
        const nameAvailable = await this.checkAvailableUsername(username);
        if (!nameAvailable) {
            throw Error("Username already exists");
        }
        // Store credentials and return user id
        const userId = await this.storeCredentials(username, password);
        return userId;
    },
    // Login
    async authenticateUser(username, password) {
        // Retrieve stored hash
        await database
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
        const result = await bcrypt.compare(password, hashStored);
        if (!result) {
            return false;
        }
        // Return user id
        return entry[FIELD_ID];
    },
};
