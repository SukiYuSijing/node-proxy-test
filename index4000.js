/*
 * @Author: your name
 * @Date: 2021-03-15 09:38:21
 * @LastEditTime: 2021-03-16 00:20:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \代理转发\index.js
 */
const Koa = require('koa'); // Koa 为一个class
const Router = require('koa-router'); // koa 路由中间件
const app = new Koa();
const router = new Router(); // 实例化路由
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
// 添加url
router.get('/hello', async (ctx, next) => {
  var name = ctx.query.name; // 获取请求参数
  ctx.response.body = `<h5>Hello,here is port 4000,${name}!</h5>`;
});
router.post('/hello', async (ctx, next) => {
  var name = ctx.request.body.name; // 获取请求参数
  console.log(ctx.request.body.name);
  ctx.response.body = `<h5>Hello,here is port 4000,${name}!</h5>`;
});

router.get('/', async (ctx, next) => {
  ctx.response.body = '<h5>Index 4000</h5>';
});

app.use(router.routes());

app.listen(4000, () => {
  console.log('This server is running at http://localhost:' + 4000);
});
