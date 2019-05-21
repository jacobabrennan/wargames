

//== Testing: Web Server =======================================================

//-- Dependencies --------------------------------
const request = require('supertest');
const webserver = require('./webserver.js');
const dataUsers = require('./data_users.js');


//== Test Suites ===============================================================

//-- Test Error Handling -------------------------
describe('Test Error Handling', () => {
    test('routes and formats errors correctly', async function () {
        let response = await request(webserver)
            .get('/404');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            'error': 'Resource not found',
        });
    });
});

//-- Test auth.js - Authentication ---------------
/*
Test Authorization
    token existence
    token validity
    user info is set
Test Registration
    username present
    password present
    username unique
    result correct
Test Login
    username present
    password present
    credentials valid
    result correct
*/

describe('Test Authentication Module', () => {
    // Constants and Values
    const urlRegister = '/auth/register';
    const urlLogin = '/auth/login';
    const urlTestGet = '/auth/testget';
    const credentialsRegister = {
        'username': 'register',
        'password': '12345',
    };
    const credentialsLogin = {
        'username': 'login',
        'password': '67890',
    };
    let testHeaders;
    // Setup & Cleanup
    beforeAll(async function () {
        let response = await request(webserver)
            .post(urlRegister)
            .send(credentialsLogin);
        testHeaders = {Authorization: response.body.token};
    });
    afterAll(async function () {
        await dataUsers.deleteUser(credentialsLogin.username);
        await dataUsers.deleteUser(credentialsRegister.username);
    });
    // Tests
    describe('Test Authorization', () => {
        test('handles authorized requests', async function () {
            let response = await request(webserver)
                .get(urlTestGet)
                .set(testHeaders);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                'message': 'test complete',
            });
        });
        test('rejects bad tokens', async function () {
            let response = await request(webserver)
                .get(urlTestGet)
                .set({Authorization: "bad token"});
            expect(response.status).toBe(401);
        });
    });
    describe('Test Registration', () => {
        afterAll(async function () {
            await dataUsers.deleteUser(credentialsRegister.username);
        });
        test('checks for valid username and password', async function () {
            let response = await request(webserver)
                .post(urlRegister)
                .send({});
            expect(response.status).toBe(401);
        });
        test('enforce unique username', async function () {
            let response = await request(webserver)
                .post(urlRegister)
                .send(credentialsLogin);
            expect(response.status).toBe(401);
        });
        test('handles proper request', async function () {
            let response = await request(webserver)
                .post(urlRegister)
                .send(credentialsRegister);
            expect(response.status).toBe(201);
        });
    });
    describe('Test Login', () => {
        test('handles proper request', async function () {
            let response = await request(webserver)
                .post(urlLogin)
                .send(credentialsLogin);
            expect(response.status).toBe(200);
            expect(response.body.token).toBeTruthy();
        });
        test('fails with bad credentials', async function () {
            let badCredentials = {};
            let response = await request(webserver)
                .post(urlLogin)
                .send({});
            expect(response.status).toBe(401);
            Object.assign(badCredentials, credentialsLogin);
            badCredentials.password = "bad password";
            response = await request(webserver)
                .post(urlLogin)
                .send(badCredentials);
            expect(response.status).toBe(401);
        });
    });
});
