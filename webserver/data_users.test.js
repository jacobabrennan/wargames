

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
    test('Creates User', async function () {
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
    })
});
