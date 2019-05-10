

//== Testing: Web Server =======================================================

//-- Dependencies --------------------------------
const webserver = require('./webserver.js');
const request = require('supertest');


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
    const urlRegister = '/auth/register';
    const urlLogin = '/auth/login';
    const urlTestGet = '/auth/testget';
    const credentials = {
        'username': 'Test',
        'password': '12345',
    };
    describe('Test Authorization', () => {
        let testHeaders;
        beforeAll(async function () {
            let response = await request(webserver)
                .post(urlRegister)
                .send(credentials);
            testHeaders = {Authorization: response.body.token};
        });
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
        test('checks for valid username and password', async function () {
            let response = await request(webserver)
                .post(urlRegister)
                .send({});
            expect(response.status).toBe(401);
        });
        test('enforce unique username', async function () {
            await request(webserver)
                .post(urlRegister)
                .send(credentials);
            let response = await request(webserver)
                .post(urlRegister)
                .send(credentials);
            expect(response.status).toBe(401);
        });
        test('handles proper request', async function () {
            const credentialsUnique = {
                username: 'unique',
                password: '12345',
            };
            let response = await request(webserver)
                .post(urlRegister)
                .send(credentialsUnique);
            expect(response.status).toBe(201);
        });
    });
    describe('Test Login', () => {
        beforeAll(async function () {
            await request(webserver)
                .post(urlLogin)
                .send(credentials);
        });
        test('handles proper request', async function () {
            let response = await request(webserver)
                .post(urlLogin)
                .send(credentials);
            expect(response.status).toBe(200);
            expect(response.body.token).toBeTruthy();
        });
        test('fails with bad credentials', async function () {
            let badCredentials = {};
            let response = await request(webserver)
                .post(urlLogin)
                .send({});
            expect(response.status).toBe(401);
            Object.assign(badCredentials, credentials);
            badCredentials.password = "bad password";
            response = await request(webserver)
                .post(urlLogin)
                .send(badCredentials);
            expect(response.status).toBe(401);
        });
    });
});
