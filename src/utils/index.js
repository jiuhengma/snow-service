// responseHandler.js

const successResponse = (ctx, data, message = 'Success') => {
    ctx.status = 200;
    ctx.body = {
        code: 200,
        status: 'success',
        message,
        data,
    };
};

const errorResponse = (ctx, status, message) => {
    ctx.status = status;
    ctx.body = {
        status: 'error',
        message,
    };
};

module.exports = {
    successResponse,
    errorResponse,
};
