const Router = require('koa-router');

const router = new Router();

const authMiddleware = require('./authMiddleware');


// 模拟轮播图数据
const carouselData = [
    { id: 1, image: 'https://picsum.photos/200/300', caption: 'Caption 1' },
    { id: 2, image: 'https://picsum.photos/200/300', caption: 'Caption 2' },
    // 添加更多轮播图数据...
];

// 模拟首页资讯数据
const candyData = [
    { id: 1, title: 'Candy 1', content: 'Content 1' },
    { id: 2, title: 'Candy 2', content: 'Content 2' },
    // 添加更多资讯数据...
];

// 首页信息接口
router.get('/list', authMiddleware, (ctx) => {
    console.log(ctx.state.user, '[user]');
    // 返回轮播图和首页资讯数据
    try {
        // 构造返回的数据
        const responseData = {
            status: 'success',
            code: 200,
            message: 'Homepage data retrieved successfully',
            data: {
                carousel: carouselData,
                candy: candyData,
            },
        };

        // 设置响应体
        ctx.body = responseData;
    } catch (error) {
        // 如果发生错误，返回错误信息
        ctx.status = 500;
        ctx.body = {
            status: 'error',
            code: 500,
            message: 'Internal Server Error',
            data: null,
        };
    }
});

module.exports = router.routes();
