

//==============================================================================

//-- Dependencies --------------------------------
const webserver = require('./webserver.js');
const request = require('supertest');

//-- Test auth.js - Authentication ---------------
describe('Test Authentication', () => {
    test('responds with status code 201', async function () {
        let response = await request(webserver).post('/auth/register').send({
            'username': 'Jacob',
            'password': '12345',
        });
        expect(response.status).toBe(201);
    });
});
