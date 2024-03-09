// uploadRouter.js
const Router = require('koa-router');
const koaBody = require('koa-body');
const fs = require('fs');
const db = require('../db')
const { successResponse, errorResponse } = require('../utils/index');
const router = new Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义集合模型
const FileSchema = new Schema({
    name: String,
    data: Buffer,
    contentType: String
}, { versionKey: false });

// 创建集合模型
const FileModel = mongoose.model('File', FileSchema);


// 使用 koa-body 中间件来处理文件上传
router.post('/upload', async (ctx) => {
    // 检查是否有文件上传
    if (ctx.request.files && ctx.request.files.file) {
        const file = ctx.request.files.file; // 获取上传的文件对象
        console.log(file, 'file');

        const data = fs.readFileSync(file.path);

        const newFile = new FileModel({
            name: file.name,
            path: filePath, // 保存文件的路径
            data: data,
            contentType: file.type
        });

        await newFile.save();

        // 返回上传成功的信息，包括文件路径
        ctx.body = {
            status: 'success',
            message: 'File uploaded successfully',
            data: {
                filename: file.name,
                path: filePath // 返回文件的路径
            }
        };
    } else {
        ctx.status = 400;
        ctx.body = {
            status: 'error',
            message: 'No file uploaded',
        };
    }
});

module.exports = router.routes();
