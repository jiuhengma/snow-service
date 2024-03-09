const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { koaBody } = require('koa-body');
const path = require('path');
const app = new Koa();
const configRoutes = require('./src/routes/index');

// 要放在路由挂载之前
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/uploads'), // 上传文件保存的目录
        keepExtensions: true, // 保留文件扩展名
    }
}));
app.use(bodyParser());

// 获取配置的路由
const mainRouter = configRoutes();

// 将主路由应用到 Koa 实例
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log('Koa server is running on http://localhost:3001');
});
