

//== Database Access, User Credentials =========================================

//-- Temp Scaffolding ----------------------------
const databaseTemp = module.exports = {
    users: {},
    hash(password) {
        return password;
    },
    checkFormatUsername(username) {
        return username;
    },
    checkFormatPassword(password) {
        return password;
    },
    checkAvailableUsername(username) {
        // GET USER INFO FROM DATABASE
        if(!this.users[username]) {
            return true;
        }
    },
    validatePassword(username, password) {
        // Retrieve stored hash, bail if user doesn't exist
        // GET USER INFO FROM DATABASE
        if(!this.users.hasOwnProperty(username)) {
            return false;
        }
        const hashStored = this.users[username];
        // Compute hash from password
        const hashTest = this.hash(password);
        // Bail if hashes don't match
        if(hashTest !== hashStored) {
            return false;
        }
        // Return user id
        return 1;
    },
    async storeCredentials(username, password) {
        // STORE CREDENTIALS IN DATABASE
        this.users[username] = this.hash(password);
        return 1;
    },
    // Register
    async addUser(username, password) {
        // Check if provided username and password are formatted correctly
        username = this.checkFormatUsername(username);
        password = this.checkFormatPassword(password);
        if(!username || !password) {
            throw Error("Invalid username / password");
        }
        // Check if requested username is available
        const userPrevious = await this.getUser(username);
        if(userPrevious) {
            throw Error("Username already exists");
        }
        // Store credentials and return user id
        const userId = await this.storeCredentials(username, password);
        return userId;
    },
    // Login
    async authenticateUser(username, password) {
        const hashTest = this.hash(password);
        const hashStored = this.users[username];
        if(!this.users.hasOwnProperty(username)) {
            return false;
        }
        if(hashTest !== hashStored) {
            return false;
        }
        return 1;
    },
};

/*
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