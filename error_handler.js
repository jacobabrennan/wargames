

/*== Error Handler =============================================================

This module provides utilities and middleware for generating and displaying http
error codes. It exports a function to configure an Express server, which must be
invoked after all route handlers. The invokation should take the following form:

const error = require('./error_handler.js');
error(expressServerInstance);

A utility is also exported to generate httpErrors with both a status code and an
message. Use it in middleware / route handlers as in the following example:

const error = require('./error_handler.js');
expressServerInstance.get(path, function (request, response, next) {
    const errorNotFound = error.httpError(404, 'Error Message');
    next(errorNotFound);
});

*/

//-- Exports -------------------------------------
const error = module.exports = function (expressServer) {
    // Generate 404 errors for otherwise unhandled requests
    expressServer.use(function (request, response, next) {
        next(httpError(404, 'Resource not found'));
    });
    // Render Error page for http errors
    expressServer.use(errorHandler)
};
error.httpError = httpError;


//== Utilities =================================================================

//-- Error Generator -----------------------------
function httpError(status, message) {
    return {
        status: status,
        message: message,
    };
}

//-- Error Handler -------------------------------
async function errorHandler(error, request, response, next) {
    if (response.headersSent) {
        return next(error)
    }
    if (!(error && error.message && error.status)) {
        error = httpError(500, 'Internal Error');
    }
    const renderData = {
        title: `Error ${error.status}`,
        error: error.status,
        message: error.message,
        auth: request.auth,
    };
    response.status(error.status).render(
        'error',
        renderData,
    );
}
