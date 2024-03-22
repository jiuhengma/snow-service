const Router = require('koa-router');
const router = new Router();
const { successResponse, errorResponse } = require('../utils/index');
const { ObjectId } = require('mongodb');

const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const UserModel = require('./models/userModel');

// 登录
router.post('/login', async ctx => {
    const { username, password } = ctx.request.body;
    try {
        const user = await UserModel.findOne({ username });
        console.log(user, '-user');
        if (!user || user.password !== password) {
            errorResponse(ctx, 401, '无效账户！');
            return;
        }
        // 用户验证成功，生成 JWT
        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
        successResponse(ctx, { token }, '登录成功！')
    } catch (error) {
        errorResponse(ctx, 500, 'Internal server error!')
    }
})

// 注册
router.post('/register', async ctx => {
    const { username, password } = ctx.request.body;
    try {
        // 查询用户是否存在
        const existingUser = await UserModel.findOne({ username });
        console.log(existingUser, 'existingUser');
        if (existingUser) {
            errorResponse(ctx, 400, '用户已存在！');
            return;
        }
        // 新用户
        const newUser = new UserModel({ username, password });
        await newUser.save();
        successResponse(ctx)
    } catch (error) {
        errorResponse(ctx, 500, 'Internal server error!');
    }
})

// 获取用户信息
router.get('/info', authMiddleware, async ctx => {
    try {
        console.log(ctx.state.user, '[]user');
        const { userId } = ctx.state.user;
        // 返回结果排除password
        const userInfo = await UserModel.findById(userId, { password: 0 });
        console.log(userInfo);
        if (userInfo) {
            successResponse(ctx, userInfo)
        }
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
        // 查找用户并更新信息
        const updatedUser = await UserModel.updateOne({ _id: userId }, updateData);
        console.log(updatedUser, '[updatedUser]');
        if (!updatedUser.acknowledged) errorResponse(ctx, '更新失败！')
        successResponse(ctx)
    } catch (error) {
        errorResponse(ctx, 404, error.message)
    }
})

module.exports = router.routes();