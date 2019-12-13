const fs = require('fs');
const Koa = require('koa');
const koaOnerror = require('koa-onerror');
const json = require('koa-json');
const koaBody = require('koa-body');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const uploadRouter = require('./src/router/upload');
const index = require('./src/router/index');

const app = new Koa();

// 错误捕获
koaOnerror(app);

// middleware

app.use(json());
app.use(logger());

//  使用ctx.body解析中间件
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))

app.use(koaBody({
  multipart: true, // 支持文件上传
  formLimit: '5mb',
  encoding: 'utf8',
  formidable: {
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    
    onFileBegin:(name,file) => { // 文件上传前的设置
      console.log(`name: ${name}`);
      console.log(file);
    },
  }
}));


// routers
app.use(uploadRouter.routes(), uploadRouter.allowedMethods());
app.use(index.routes(), index.allowedMethods());












module.exports = app;
