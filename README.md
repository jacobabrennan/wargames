# Social Media Wargames - Web Server
## About Social Media Wargames
Social Media Wargames (SMWG) is a project aimed at fostering healthy online communities by putting moderation strategies to the test. Model websites are purpose built to implement specific strategies, and then subjected to simulated attacks. Results of tests are collected, analyzed, and published. The goal of the project is to promote the widespread replacement of ineffective strategies with ones that have been proven effective.
## About the Web Server
The SMWG Web Server performs two functions:

* First, it acts as a normal website, offering a landing page, an about page, and reports on the results of previously completed wargames.
* Second, it houses and provides authentication for wargames in progress.

Providing authentication through an outer "wrapper" website provides several benefits:

* Users can participate in multiple wargames without having to manage credentials across multiple models.
* More accurate attacks can be simulated more easily, such as providing a tool to automatically generate multiple fake accounts.
* Testing infrastructure can be clearly separated from intended attack targets. 
## Installation
To install and run the webserver, do the following:
1. Clone this repo locally
2. Install via npm: `npm install`
3. Create a file named `.env` in the root of the directory, with contents in this format:
```
PORT=8080
JSONWEBTOKEN_SECRET="any string"
```
4. Initialize database: `npm run knex migrate:latest`
5. Start the server: `npm start`
