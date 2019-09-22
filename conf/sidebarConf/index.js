// 介绍
const about = require('./about/index.js');

// 计算机
// const computer = require('./computer/index.js');

// 操作系统
// const linux = require('./os/linux/index.js');
// const manjaro = require('./os/manjaro/index.js');
// const ubuntu = require('./os/ubuntu/index.js');
// const centos = require('./os/centos/index.js');

// 前端
const html = require('./frontend/html/index.js');
const css = require('./frontend/css/index.js');
const javascript = require('./frontend/javascript/index.js');
const webpack = require('./frontend/webpack/index.js');
const babel = require('./frontend/babel/index.js');
const vue = require('./frontend/vue/index.js');

// 后端
const nodejs = require('./backend/nodejs/index.js');
const koa = require('./backend/koa/index.js');
const mongodb =require('./backend/mongodb/index.js');
const mysql = require('./backend/mysql/index.js');
const nginx = require('./backend/nginx/index.js');

// 工具
// const git = require('./tools/git/index.js');
// const github = require('./tools/github/index.js');
// const vscode = require('./tools/vscode/index.js');

// 更多
const git = require('./more/git/index.js');
const linux = require('./more/linux/index.js');
// const algorithm = require('./more/algorithm/index.js');
// const interview = require('./more/interview/index.js');


/**
 * 侧边栏的配置
 * 当路由深度越深时应当排序在更前方
 * 示例: /frontend 和 /frontend/css
 * 应当将 /frontend/css 写在更上方
 */
module.exports = {
  // 指南 guide
//   '/guide/': guide,

  // 计算机
//   '/computer/': computer,

//   // 操作系统 os
//   '/os/linux/': linux,
//   '/os/manjaro/': manjaro,
//   '/os/ubuntu/': ubuntu,
//   '/os/centos/': centos,

  // 前端 frontend
  '/frontend/html/': html,
  '/frontend/css/': css,
  '/frontend/javascript/': javascript,
  '/frontend/vue/': vue,
  '/frontend/webpack/': webpack,
  '/frontend/babel/': babel,

  // 后端 backend
  '/backend/nodejs/': nodejs,
  '/backend/koa/': koa,
  '/backend/mongodb/': mongodb,
  '/backend/mysql/': mysql,
  '/backend/nginx/': nginx,

  // 工具 tools
//   '/tools/git/': git,
//   '/tools/github/': github,
//   '/tools/vscode/': vscode,

  // 更多 more
  '/more/git/': git,
  '/more/linux/': linux
//   '/more/algorithm/': algorithm,
//   '/more/interview/': interview,
  // 根目录下的 sidebar, 对于所有未匹配到的都会应用该 sidebar
  // '/': [''] // 此处选择禁用
};