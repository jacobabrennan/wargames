

//== Testing: Web Server =======================================================

//-- Dependencies --------------------------------
const dataUsers = require('./data_users.js');


//== Test Suites ===============================================================

//-- Test Register -------------------------------
describe('Test Registration', () => {
    const testUsername = "Test";
    const testPassword = "12345";
    afterEach(async function () {
        await dataUsers.deleteUser(testUsername);
    });
    test('Creates User, returns ID', async function () {
        const userId = await dataUsers.addUser(testUsername, testPassword);
        expect(userId).toBeTruthy();
    });
    test('Detects duplicate user names', async function () {
        await dataUsers.addUser(testUsername, testPassword);
        let errorDuplicate;
        try {
            await dataUsers.addUser(testUsername, testPassword);
        } catch(error) {
            errorDuplicate = error;
        }
        expect(errorDuplicate).toBeTruthy();
    });
});

//-- Test Authentication -------------------------
describe('Test Authentication', () => {
    const testUsername = "Test";
    const testPassword = "12345";
    let TestUserId;
    beforeAll(async function () {
        TestUserId = await dataUsers.addUser(testUsername, testPassword);
    });
    afterAll(async function () {
        await dataUsers.deleteUser(testUsername);
    });
    test('Responds to valid password with valid userId', async function () {
        const userId = await dataUsers.authenticateUser(testUsername, testPassword);
        expect(userId).toBe(TestUserId);
    });
    test('Returns false for non-existant users', async function () {
        const userId = await dataUsers.authenticateUser("derp", testPassword);
        expect(userId).toBe(false);
    });
    test('Returns false for invalid passwords', async function () {
        const userId = await dataUsers.authenticateUser(testUsername, "derp");
        expect(userId).toBe(false);
    });
});
