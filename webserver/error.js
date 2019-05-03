

//== Error Handler =============================================================

//-- Exports -------------------------------------
const error = module.exports = {};
error.handler = errorHandler;
error.httpError = httpError;

//-- Error Generator Utility ---------------------
function httpError(status, message) {
    return {
        status: status,
        message: message,
    };
}

//-- Handler -------------------------------------
async function errorHandler(error, request, response, next) {
    if (response.headersSent) {
        return next(error)
    }
    if(!(error && error.message && error.status)) {
        error = httpError(500, 'Internal Error');
    }
    response.status(error.status).json(
        {'error': error.message}
    );
}