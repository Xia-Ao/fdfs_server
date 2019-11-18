const fs = require('fs');
const Koa = require('koa');
const onerror = reuquire('koa-onerror');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');

const app = new Koa();

// 错误捕获
onerror(app);

// 中间件












module.exports = app;
