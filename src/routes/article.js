const Router = require('koa-router');
const router = new Router();
const db = require('../db')
const { successResponse, errorResponse } = require('../utils/index');
const mongoose = require('mongoose');
// const { Binary } = require('mongodb');
const Schema = mongoose.Schema;
const fs = require('fs')
const mkdirp = require('mkdirp')

// 定义集合模型
const ArticleSchema = new Schema({
    images: [String],
    title: String,
    // author: String,
    // tags: Array,
    content: String,
}, { versionKey: false });

// 创建集合模型
const ArticleModel = mongoose.model('Article', ArticleSchema);

// 文章列表
router.get('/list', async ctx => {
    try {
        const articles = await ArticleModel.find();
        console.log(articles, '[articles]');
        ctx.type = 'image/jpeg';
        successResponse(ctx, articles)
    } catch (error) {
        errorResponse(ctx, 500, 'error')
    }
})

// 创建/新建
router.post('/add', async ctx => {
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

    try {
        // 将文章内容保存到数据库
        ArticleModel.create({
            title,
            content,
            images,
        });

        // // 返回成功消息和保存的文章信息
        successResponse(ctx)
    } catch (error) {
        errorResponse(ctx, 500, error.message)
    }
})

module.exports = router.routes();