const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');

app.use(bodyParser()); // 要放在路由挂载之前

// 创建主路由
const mainRouter = new Router();

// 将各个路由文件组合到主路由
mainRouter.use('/home', homeRoutes);
mainRouter.use('/user', userRoutes);
mainRouter.use('/article', articleRoutes);


// 将主路由应用到 Koa 实例
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log('Koa server is running on http://localhost:3001');
});
