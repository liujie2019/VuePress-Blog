---
title: 从零实现Koa2
---
基本目录结构如下：
```js
tree ./koa
./koa
├── application.js
├── context.js
├── request.js
└── response.js
```
```js
// application.js
// Koa的入口文件为application.js
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Koa {
    constructor() {
        this.callbackFn;
        this.middlewares = [];
        // 将这些变量统一放到实例属性上，方便调用
        this.context = context;
        this.request = request;
        this.response = response;
    }
    // 常用的use方法
    use(cb) {
        this.middlewares.push(cb);
    }
    // 常用的监听服务端口方法
    listen() {
        // bind方法绑定this
        const server = http.createServer(this.handleRequest.bind(this));
        // 剩余运算符接收传递的参数(包括端口号和服务启动后的回调函数)
        server.listen(...arguments);
    }
    handleRequest(req, res) {
        res.statusCode = 404; // 默认页面找不到
        const ctx = this.createContext(req, res);
        // compose => 组合
        const composeMiddleware = this.compose(ctx, this.middlewares);
        // 当回调函数执行后，ctx.body值就会发生变化
        // 当此promise执行完成后，再去执行res.end()
        composeMiddleware.then(() => {
            const body = ctx.body;
            if (typeof body === 'undefined') {
                res.end('Not Found');
            } else if (typeof body === 'string') {
                // 响应
                res.end(body);
            }
        });
    }
    // 创建上下文对象
    createContext(req, res) {
        // 希望ctx可以拿到context的属性，但是不修改context
        // req是http模块原生的
        // request对象是koa自己实现的，response也同理
        const ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.req = ctx.request.req = req;
        ctx.response = Object.create(this.response);
        ctx.res = ctx.response.res = res;
        return ctx; // 返回上下文对象
    }
    // compose方法返回一个Promise
    compose(ctx, middlewares) {
        function dispatch(index) {
            // 越界说明都执行完毕了
            if (middlewares.length === index) return Promise.resolve();
            // 先取出第一个中间件，让其执行，将索引递增，调用next，就是将下一个中间件，继续执行
            const middleware = middlewares[index];
            // () => dispatch(index + 1)就是next方法
            // 返回一个Promise
            // 递归创建 套起来的promise
            return Promise.resolve(middleware(ctx, () => dispatch(index + 1)));
        }
        // dispatch方法返回的也是Promise
        return dispatch(0); // 让第一个中间件执行
    }
}

module.exports = Koa;
```
```js
// context.js
// 源码里也叫proto
const proto = {};
// proto.url = proto.request.url
// 获取proto.url，就去找proto.request的url

// 取值代理
function defineGetter(property, name) {
    // 自定义获取器 代理
    // __defineGetter__原生方法
    // 取值的时候，会调用回调函数
    // 获取proto.url，就去找proto.request的url
    proto.__defineGetter__(name, function() {
        // this指向proto，也就是ctx
        return this[property][name];
    });
}
// 针对ctx.body = ctx.response.body做代理
// 设置值代理
// ctx.body = 'hello' 就相当于 ctx.response.body = 'hello'
function defineSetter(property, name) {
    proto.__defineSetter__(name, function(value) {
        this[property][name] = value;
    });
}
defineGetter('request', 'url');
defineGetter('request', 'path');
defineGetter('response', 'body');
// 设置代理：ctx.body 等价于 ctx.response.body
defineSetter('response', 'body');
module.exports = proto;
```
```js
// request.js
const url = require('url');
// const qs = require('querystring');

const request = {
    get url() {
        // 我们调用url方法的方式：ctx.request.url，因此this指向ctx.request
        // 而ctx.request.req.url是可以获取到url的，因此可以写成this.req.url
        return this.req.url;
    },
    // url是带有查询字符串的，path不带
    get path() {
        // 通过解析this.req.url来获取path属性
        return url.parse(this.req.url).pathname;
    }
    // get query() {
    //     console.log(url.parse(this.req.url));
    //     return url.parse(this.req.url).path;
    // }
};

module.exports = request;
```
```js
// response.js
const response = {
    // 调用的时候：ctx.response.body = 'hello'
    set body(value) {
        this.res.statusCode = 200; // 只要调用了ctx.body = 'xxx'就会成功
        this._body = value;
    },
    get body() {
        return this._body;
    }
};
module.exports = response;
```
## 测试用例
```js
// Koa源码中入口引用的也是lib/application.js
const Koa = require('./koa/application');
const app = new Koa();

app.use((ctx) => {
    console.log(ctx.req.url); // /a
    console.log(ctx.request.url); // /a
    console.log(ctx.request.req.url); // /a
    console.log(ctx.url); // /a  ctx会代理ctx.requets上的属性

    console.log(ctx.req.query);

    console.log(ctx.req.path); // undefined  ctx.req = req
    console.log(ctx.request.path); // /a ctx.request是koa自己封装的属性
    console.log(ctx.request.req.path); // undefined  ctx.request.req = req
    console.log(ctx.path);// /a 用ctx来代理一下ctx.request属性
    ctx.body = 'hello koa 666';
});

app.listen(3000);
```
模拟洋葱模型：
```js
function app() {}
app.middlewares = [];
app.use = function(callback) {
    app.middlewares.push(callback);
}

// 模拟洋葱模型
app.use((ctx, next) => {
    console.log('hello koa1');
    next();
    console.log('hello koa2');
});
app.use((ctx, next) => {
    console.log('hello koa3');
    next(); // 假如这里没有next，将不会向下执行了
    console.log('hello koa4');
});
app.use((ctx, next) => {
    console.log('hello koa5');
    next();
    console.log('hello koa6');
});

function dispatch(index) {
    // 防止越界
    if (app.middlewares.length === index) return;
    // 先取出第一个中间件，让其执行，将索引递增，调用next，就是将下一个中间件，继续执行
    const middleware = app.middlewares[index];
    // () => dispatch(index + 1)就是next方法，dispatch(index + 1)即执行下一下中间件
    // 执行取出的中间件
    middleware({}, () => dispatch(index + 1));
}
// 让第一个中间件执行
dispatch(0);
```
Koa洋葱模型实现依赖compose方法：
```js
const Koa = require('./koa/application');
const app = new Koa();

// koa可以使用async await
const log = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('ok了');
            resolve();
        }, 1000);
    });
}
// 这些中间件会形成一个promise
app.use(async (ctx, next) => {
    console.log('hello koa1');
    // await会等待下一个中间件执行完毕后再继续执行
    await next();
    console.log('hello koa2');
});
app.use(async (ctx, next) => {
    console.log('hello koa3');
    await log(); // 调用await就会等待异步操作执行完毕后再继续执行
    await next();
    console.log('hello koa4');
});
app.use(async (ctx, next) => {
    console.log('hello koa5');
    await next();
    console.log('hello koa6');
});

app.listen(3000, () => {
    console.log('server run 3000');
});
// 输出如下：
/*
hello koa1
hello koa3
ok
hello koa5
hello koa6
hello koa4
hello koa2
*/
```