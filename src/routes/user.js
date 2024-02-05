const Router = require('koa-router');
const router = new Router();
const db = require('../db')
const { successResponse, errorResponse } = require('../utils/index');
const { ObjectId } = require('mongodb');

const collection = db.collection('user')

// const User = mongoose.model('User', {
//     username: String,
//     password: String,
// });

router.get('/login', async ctx => {
    try {
        const userData = await collection.find().toArray()
        successResponse(ctx, userData)
    } catch (error) {
        errorResponse(ctx)
    }
})

// 编辑用户信息
router.post('/register', async ctx => {
    const requestBody = ctx.request.body;
    console.log(requestBody, '[requestBody]');

    // 通过ID来更新数据
    const result = await collection.insertOne({ _id: new ObjectId() }, { $set: requestBody });

    console.log(result, 'result');

    if (result?.acknowledged) {
        successResponse(ctx)
    }
})

router.get('/list', async ctx => {
    try {
        const userData = await collection.find().toArray()
        successResponse(ctx, userData)
    } catch (error) {
        errorResponse(ctx)
    }
})

// 编辑用户信息
router.post('/modify/:id', async ctx => {
    const userId = ctx.params.id;
    console.log(userId, '[userId]');
    const requestBody = ctx.request.body;
    console.log(requestBody, '[requestBody]');

    // 通过ID来更新数据
    const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: requestBody });

    console.log(result, 'result');

    if (result?.acknowledged) {
        successResponse(ctx)
    }
})

module.exports = router.routes();