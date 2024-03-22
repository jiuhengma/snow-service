const Router = require('koa-router');
const router = new Router();
const { successResponse, errorResponse } = require('../utils/index');
// const { Binary } = require('mongodb');
const fs = require('fs')
const mkdirp = require('mkdirp')

const authMiddleware = require('./authMiddleware');

const UserModel = require('./models/userModel');
const ArticleModel = require('./models/articleModel');

// 文章列表
router.get('/list', async ctx => {
    try {
        const { page = 1, pageSize = 10 } = ctx.query;
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);
        const total = await ArticleModel.countDocuments();
        const articles = await ArticleModel.find()
            .skip(skip)
            .limit(limit);
        successResponse(ctx, {
            total,
            currentPage: page,
            list: articles
        })
    } catch (error) {
        errorResponse(ctx, 500, error.message)
    }
})

// 创建/新建
router.post('/add', authMiddleware, async ctx => {
    // 获取请求体中的文字内容
    const { title, content } = ctx.request.body;

    // 获取上传的图片文件信息
    const { files } = ctx.request;
    // const fileName = files.file.newFilename;
    const uploadPath = "/uploads";
    const isExist = fs.existsSync(uploadPath);
    // 文件夹不存在的话创建一个
    if (!isExist) {
        mkdirp.sync(uploadPath)
    }
    console.log(files.file);
    // const fileData = await readFileAsync(files.file.path);
    // const fileData = await fs.readFileSync(files.file.filepath);

    const images = [];
    // 保存上传的图片文件
    if (files && files.file) {
        if (Array.isArray(files.file)) {
            for (const file of files.file) {
                const filePath = `${uploadPath}/${file.newFilename}`;
                images.push(filePath);
            }
        } else {
            const filePath = `${uploadPath}/${files.file.newFilename}`;
            images.push(filePath);
        }
    }

    const { userId } = ctx.state.user;
    // 返回结果排除password
    const userInfo = await UserModel.findById(userId, { password: 0 });

    try {
        // 将文章内容保存到数据库
        ArticleModel.create({
            title,
            content,
            images,
            author: userInfo.username,
        });
        successResponse(ctx)
    } catch (error) {
        errorResponse(ctx, 500, error.message)
    }
})

router.get('/detail/:id', async ctx => {
    const articleId = ctx.params.id;
    try {
        const article = await ArticleModel.findById(articleId);
        successResponse(ctx, article)
    } catch (error) {
        errorResponse(ctx, 404, error.message)
    }
})

module.exports = router.routes();