/*
 * @Author: your name
 * @Date: 2021-03-15 09:38:21
 * @LastEditTime: 2021-03-16 00:31:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \代理转发\index.js
 */
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router'); // koa 路由中间件
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const bodyParser = require('koa-bodyparser');
const router = new Router();

app.use(bodyParser());
/**
 * 使用http代理请求转发，用于代理页面当中的http请求
 * 这个代理请求得写在bodyparse的前面，
 *
 */
var bobyParams = {};
app.use(async (ctx, next) => {
  if (ctx.req.method == 'POST') bobyParams = ctx.request.body;
  await next();
});
function onProxyReq(proxyReq, req, res) {
  if (req.method == 'POST') {
    console.log(bobyParams);
    if (req.body) delete req.body;
    bobyParams.name = 'reports/statistics/summary_2016.pdf'; //修改其中的参数
    let body = Object.keys(bobyParams)
      .map(function (key) {
        return (
          encodeURIComponent(key) + '=' + encodeURIComponent(bobyParams[key])
        );
      })
      .join('&');
    // Update header
    proxyReq.setHeader('content-type', 'application/x-www-form-urlencoded');
    proxyReq.setHeader('content-length', body.length);
    proxyReq.write(body);
    proxyReq.end();
  }
}
app.use(async (ctx, next) => {
  ctx.respond = true; // 绕过koa内置对象response ，写入原始res对象，而不是koa处理过的response
  await k2c(
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
      onProxyReq: onProxyReq,
      pathRewrite: async function (path, req) {
        if (req.method !== 'GET') return path;
        console.log(123, req.url);
        let base = req.url.split('?')[0];
        let params = req.url.split('?')[1];
        console.log(123, params);
        params = params.split('&');
        console.log(123, params);
        for (let i in params) {
          params[i] = params[i].replace(/(?:(^name\=))(.*$)/g, '$18888');
        }
        console.log(base + '?' + params.join('&'));
        return base + '?' + params.join('&');
      },
    })
  )(ctx, next);
  await next();
});
router.get('/', async (ctx, next) => {
  // ctx.body = 2;
});
router.get('/hello', async (ctx, next) => {
  // ctx.body = 1;
});

router.post('/hello', async (ctx, next) => {
  // console.log('123456', ctx.request);
  // console.log('123456', ctx.req);
  // ctx.body = 2;
});

app.use(router.routes());

app.listen(3000, () => {
  console.log('This server is running at http://localhost:' + 3000);
});
