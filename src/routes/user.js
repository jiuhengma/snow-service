const Router = require('koa-router');
const router = new Router();
const { successResponse, errorResponse } = require('../utils/index');
const { ObjectId } = require('mongodb');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义集合模型
const UserSchema = new Schema({
    name: String,
    instrod: String
    // age: Number,
    // email: String
}, { versionKey: false });

// 创建集合模型
const UserModel = mongoose.model('User', UserSchema);

// 登录
router.get('/login', async ctx => {
    try {
        const { email, password } = ctx.request.body;
        const user = await collection.findOne({ email });
        if (!user || user.password !== password) {
            errorResponse(ctx, 401, '无效账户！');
            return;
        }
        successResponse(ctx, '登录成功！')
    } catch (error) {
        errorResponse(ctx)
    }
})

// 注册
router.post('/register', async ctx => {
    try {
        const requestBody = ctx.request.body;
        console.log(requestBody, '[requestBody]');
        const { username, email, password } = ctx.request.body;
        // 查询用户是否存在
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            errorResponse(ctx, 400, '用户已存在！');
            return;
        }
        // 新用户
        const newUser = { username, email, password };
        await collection.insertOne(newUser);
        if (result?.acknowledged) {
            successResponse(ctx)
        }
    } catch (error) {
        errorResponse(ctx, error.message)
    }
})

// 列表
router.get('/list', async ctx => {
    try {
        // 查询所有用户
        const users = await UserModel.find();
        successResponse(ctx, users)
    } catch (error) {
        errorResponse(ctx, error.message)
    }
})

// 新增
router.post('/add', async ctx => {
    const userData = ctx.request.body;
    try {
        // 创建用户并保存到数据库
        const newUser = await UserModel.create(userData);
        successResponse(ctx, newUser)
    } catch (error) {
        errorResponse(ctx, error.message)
    }
});

// 编辑
router.post('/modify/:id', async ctx => {
    try {
        const userId = ctx.params.id;
        console.log(userId, '[userId]');
        const updateData = ctx.request.body;
        console.log(updateData, '[requestBody]');
        // 更新数据
        // 查找用户并更新信息
        const updatedUser = await UserModel.findByIdAndUpdate(new ObjectId(userId), updateData, { new: true });
        console.log(updatedUser, '[updatedUser]');
        if (!updatedUser) errorResponse(ctx, '更新失败！')
        successResponse(ctx)
    } catch (error) {
        errorResponse(ctx, error.message)
    }
})

module.exports = router.routes();