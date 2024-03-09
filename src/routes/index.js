const Router = require('koa-router');
const homeRoutes = require('./home');
const userRoutes = require('./user');
const articleRoutes = require('./article');
const uploadRoutes = require('./upload')

const configRoutes = () => {
    // 创建主路由
    const mainRouter = new Router();

    // 将各个路由文件组合到主路由
    mainRouter.use('/home', homeRoutes);
    mainRouter.use('/user', userRoutes);
    mainRouter.use('/article', articleRoutes);
    mainRouter.use('/upload', uploadRoutes)

    return mainRouter;
};

module.exports = configRoutes;