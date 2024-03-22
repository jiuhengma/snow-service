// authMiddleware.js
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/index');

const authMiddleware = async (ctx, next) => {
    const authorizationHeader = ctx.request.header.authorization;
    if (!authorizationHeader) {
        errorResponse(ctx, 401, '请您先登录！')
        return;
    }

    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme.toLowerCase() !== 'bearer') {
        errorResponse(ctx, 401, '请您先登录！')
        return;
    }

    if (!token) {
        errorResponse(ctx, 401, '请您先登录！')
        return;
    }

    try {
        const decoded = jwt.verify(token, 'secret_key');
        console.log(decoded, '[decoded]');
        ctx.state.user = decoded;
        await next();
    } catch (error) {
        errorResponse(ctx, 401, '身份已过期，请重新登录！')
    }
};

module.exports = authMiddleware;
