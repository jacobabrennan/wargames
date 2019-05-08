

//== Database Access, User Credentials =========================================

//-- Temp Scaffolding ----------------------------
const databaseTemp = module.exports = {
    users: {},
    hash(password) {
        return password;
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
        if(!this.users.hasOwnProperty(username)) {
            return false;
        }
        if(hashTest !== hashStored) {
            return false;
        }
        return {
            id: 1,
            username: username,
        };
    },
};
