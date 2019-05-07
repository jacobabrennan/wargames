

//==============================================================================

//-- Dependencies --------------------------------
const webserver = require('./webserver.js');
const request = require('supertest');
const jsonWebToken = require('jsonwebtoken');


//== Tests =====================================================================

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
    describe('Test Authorization', () => {

    });
    describe('Test Registration', () => {
        const testUrl = '/auth/register';
        const testCredentials = {
            'username': 'Test',
            'password': '12345',
        };
        test('handles proper request', async function () {
            let response = await request(webserver)
                .post(testUrl)
                .send(testCredentials);
            expect(response.status).toBe(201);
        });
        test('checks for valid username and password', async function () {
            let response = await request(webserver)
                .post(testUrl)
                .send({});
            expect(response.status).toBe(401);
        });
        test('enforce unique username', async function () {
            await request(webserver)
                .post(testUrl)
                .send(testCredentials);
            let response = await request(webserver)
                .post(testUrl)
                .send(testCredentials);
            expect(response.status).toBe(401);
        });
    });
    describe('Test Login', () => {
        
    });
});
