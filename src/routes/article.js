const Router = require('koa-router');
const router = new Router();
const db = require('../db')

const { successResponse, errorResponse } = require('../utils/index');

const collection = db.collection('articles')

router.get('/list', async ctx => {
    const articlesData = await collection.find().toArray()

    ctx.body = articlesData
    try {
        successResponse(ctx, articlesData, 'success')
    } catch (error) {
        errorResponse(ctx, 500, 'error')
    }
})

module.exports = router.routes();