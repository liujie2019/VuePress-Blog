---
title: Koa 基础入门
---

## 基本用法
>Koa 必须使用7.6以上版本的Node。如果你的版本低于这个要求，就要先升级 Node。
### 搭建开发环境
新建一个项目文件夹，命令如下：

```js
mkdir koa2 //创建koa2文件夹
cd koa2  //进入koa2文件夹
```

进入之后，我们初始化生产`package.json`文件。

```
npm init -y
```
生成`package.json`后，安装`koa`包，我们这里使用`npm`来进行安装。

```
npm install --save koa
```

如果你安装错误，一般都是网速问题，可以使用`cnpm`来进行安装。
### 启动http服务
``` js
const Koa = require('koa');
const app = new Koa();

app.listen(3000);
```
### Context对象
Koa提供一个Context对象，表示一次对话的上下文(包括HTTP请求和HTTP响应)。通过加工这个对象，就可以控制返回给用户的内容。

``` js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    ctx.response.body = 'hello world';
});

app.listen(3000);
```
>ctx.response代表 HTTP Response。同样地，ctx.request代表 HTTP Request。ctx则是Koa所提供的 Context对象(上下文)， ctx.body则是 ctx.response.body的alias(别名)，这是响应体设置的API。

### HTTP Response 的类型
Koa 默认的返回类型是text/plain，如果想返回其他类型的内容，可以先用ctx.request.accepts判断一下，客户端希望接受什么数据（根据 HTTP Request 的Accept字段），然后使用ctx.response.type指定返回类型。

## Koa路由
### 原生路由实现
可以根据 `ctx.request.url`或者 `ctx.request.path`获取用户请求的路径，来实现简单的路由。
### ctx.request.url
要想实现原生路由，需要得到地址栏输入的路径，然后根据路径的不同进行跳转。用`ctx.request.url`就可以实现。我们通过一个简单的例子了解一下如何获得访问路径。

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
  const url = ctx.request.url;
  ctx.body = url
})
app.listen(3000);
```
这时候访问`http://127.0.0.1:3000/test/123`页面会输出`/test/123`。这样一来，我们就可以根据输出的不同，实现的页面结果。

```js
const Koa = require('koa');
const fs = require('fs');
const app = new Koa();

function render(page) {
        return  new Promise((resolve, reject) => {
            let pageUrl = `./page/${page}`;
            fs.readFile(pageUrl, 'utf-8', (err,data) => {
                console.log(444);
                if(err) {
                    reject(err)
                } else {
                    resolve(data);
                }
            })
        });
}

const route = async (url) => {
    let page = 'index.html';
    switch(url) {
        case '/':
            page ='index.html';
            break;
        case '/about':
            page = 'about.html';
            break;
        case '/404':
            page = '404.html';
            break;
        default:
            break;
    }
    const html = await render(page);
    return html;
}

app.use(async(ctx) => {
    const url = ctx.request.url;
    const html = await route(url);

    ctx.body = html;
})
app.listen(3000);
console.log('starting at 3000');
```
>原生路由的实现需要引入`fs`模块来读取文件。然后再根据路由的路径去读取，最后返回给页面，进行渲染。

``` js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    let _html = '404 NotFound';
    switch (ctx.url) {
        case '/':
            _html = '<h1>Index</h1>';
            break;
        case '/about':
            _html = '<h1>About</h1>';
            break;
        case '/hello':
            _html = '<h1>world</h1>';
            break;
        default:
            break;
    }
    ctx.body = _html;
});
app.listen(3000);
```
### koa-route模块
``` js
const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();

const home = async (ctx) => {
    ctx.response.body = 'Hello Koa';
}

const about = async (ctx) => {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">跳转到首页</a>';
}

// 根路径/的处理函数是home
app.use(route.get('/', home));
// 路径/about的处理函数是about
app.use(route.get('/about', about));
app.listen(3000);
```
### koa-router模块
```js
// 安装
npm i -S koa-router
```
```js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.body = 'Hello Koa';
})
.get('/todo', (ctx, next) => {
    ctx.body = "Todo page"
});

app
  .use(router.routes())
  .use(router.allowedMethods());
  app.listen(3000, () => {
      console.log('starting at port 3000');
  });
```
``` js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
    ctx.body = `
        <ul>
            <li><a href="/hello">hello world</a></li>
            <li><a href="/about">hello about</a></li>
        </ul>
    `;
}).get('/hello', async (ctx) => {
    ctx.body = 'hello world';
}).get('/about', async (ctx) => {
    ctx.body = 'hello about';
});

app.use(router.routes(), router.allowedMethods());
app.listen(3000);
```
##### 2.2.2 设置路由前缀
>有时候我们想把所有的路径前面都再加入一个级别，比如原来我们访问的路径是`http://127.0.0.1:3000/todo`，现在我们希望在所有的路径前面都加上一个`project`层级，把路径变成`http://127.0.0.1:3000/project/todo`。这时候就可以使用层级来完成这个功能。路由在创建的时候是可以指定一个前缀的，这个前缀会被至于路由的最顶层，也就是说，这个路由的所有请求都是相对于这个前缀的。
```js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
// 设置路由前缀
const router = new Router({
    prefix:'/project'
})

router.get('/', (ctx) => {
    ctx.body = 'Hello Koa';
})
.get('/todo', (ctx) => {
    ctx.body = 'Todo page';
});

app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3000,() => {
    console.log('starting at port 3000');
});
// 访问http://127.0.0.1:3000/project/todo
```
##### 2.2.3 设置路由层级
>设置前缀一般都是全局的，并不能实现路由的层级，如果你想为单个页面设置层级，也是很简单的。只要在use时使用路径就可以了。
```js
// 这里声明了两个路由，第一个是home，第二个是page，然后通过use赋予不同的前层级。

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const home = new Router();
home.get('/liujie', async(ctx) => {
    ctx.body = 'Home liujie';
}).get('/todo',async(ctx) => {
    ctx.body = 'Home ToDo';
})

const page = new Router();
page.get('/liujie', async(ctx) => {
    ctx.body = 'Page liujie';
}).get('/todo', async(ctx) => {
    ctx.body = 'Page ToDo';
});

// 装载所有子路由
const router = new Router();
router.use('/home', home.routes(), home.allowedMethods());
router.use('/page', page.routes(), page.allowedMethods());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log('[demo] server is starting at port 3000');
});
```
##### 2.2.4 Koa-router中间件参数
>获取GET请求参数：ctx.query。
```js
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
    ctx.body = ctx.query;
});
app
  .use(router.routes())
  .use(router.allowedMethods());
  app.listen(3000,() => {
      console.log('starting at port 3000');
  });
// 访问http://127.0.0.1:3000/?name=liujie&age=23
{
  "name": "liujie",
  "age": "23"
}
```
#### 2.3 静态资源(图片、字体、样式表、脚本)
>koa-static -> 静态资源中间件。

```js
// 安装
npm i -S koa-static
```
``` js
const Koa = require('koa');
const app = new Koa();
const path = require('path');
const static = require('koa-static');

app.use(static(path.join(__dirname)));
app.listen(3000);
```
```
运行该脚本文件，访问 http://127.0.0.1:3000，在浏览器里就可以看到该目录下的所有静态资源。
```
```js
const Koa = require('koa');
const path = require('path');
const static = require('koa-static');

const app = new Koa();
const staticPath = './static';

app.use(static(
  path.join( __dirname,  staticPath)
));

app.use(async (ctx) => {
  ctx.body = 'hello world111';
});

app.listen(3000, () => {
  console.log('[demo] static-use-middleware is starting at port 3000');
});
// 访问http://localhost:3000/test.js，即可看到test.js脚本的结果。
```
#### 2.4 重定向
在项目的某些场景下，服务器需要重定向（redirect）访问请求。比如，用户登陆以后，将他重定向到登陆前的页面。`ctx.response.redirect()`方法可以发出一个302跳转，将用户导向另一个路由。

``` js
const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');

const redirect = async (ctx) => {
    console.log('重定向了');
    ctx.response.redirect('/');
};

const home = async (ctx) => {
    ctx.response.body = '<a href="/">我是首页</a>'
};

app.use(route.get('/', home));
app.use(route.get('/redirect', redirect));

app.use(home);
app.listen(3000);
```
#### 3. 中间件
`Koa`的最大特色，也是最重要的一个设计，就是中间件（middleware）Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。Koa中使用`app.use()`用来加载中间件，基本上`Koa`所有的功能都是通过中间件实现的。每个中间件默认接受两个参数，第一个参数是`Context` 对象，第二个参数是`next`函数。只要调用`next`函数，就可以把执行权转交给下一个中间件。

``` js
const Koa = require('koa');
const app = new Koa();

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-response-time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response
app.use(async ctx => {
    ctx.body = 'hello world';
});

app.listen(3000);
```
>上面的执行顺序就是：请求 ==> x-response-time中间件 ==> logger中间件 ==> 响应中间件 ==> logger中间件 ==> response-time中间件 ==> 响应。 通过这个顺序我们可以发现这是个栈结构以"先进后出"（first-in-last-out）的顺序执行。

##### 3.1 Logger功能(打印日志)
``` js
const Koa = require('koa');
const app = new Koa();

const main = async (ctx) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  ctx.response.body = 'Hello World';
};

app.use(main);
app.listen(3000);
```

``` js
// 输出
1534731922607 GET /
```
##### 3.2 中间件的概念
``` js
const Koa = require('koa');
const app = new Koa();

const logger = async (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next();
}

const home = async (ctx) => {
  ctx.response.body = 'Hello World';
};

app.use(logger);
app.use(home);
app.listen(3000);
```
>上面代码中的logger函数就叫做"中间件"（middleware），因为它处在 HTTP Request 和 HTTP Response 中间，用来实现某种中间功能。app.use()用来加载中间件。基本上，Koa 所有的功能都是通过中间件实现的，前面例子里面的main也是中间件。每个中间件默认接受两个参数，第一个参数是 Context 对象，第二个参数是next函数。只要调用next函数，就可以把执行权转交给下一个中间件。

##### 3.3 中间件栈
>多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。

1. 最外层的中间件首先执行。
2. 调用next函数，把执行权交给下一个中间件。
3. ...
4. 最内层的中间件最后执行。
5. 执行结束后，把执行权交回上一层的中间件。
6. ...
7. 最外层的中间件收回执行权之后，执行next函数后面的代码。

``` js
const Koa = require('koa');
const app = new Koa();

const one = async (ctx, next) => {
    console.log('>> one');
    next();
    console.log('<< one');
}

const two = async (ctx, next) => {
    console.log('>> two');
    next();
    console.log('<< two');
}

const three = async (ctx, next) => {
    console.log('>> three');
    next();
    console.log('<< three');
}

app.use(one);
app.use(two);
app.use(three);

app.listen(3000);
```
``` js
// 运行结果
>> one
>> two
>> three
<< three
<< two
<< one
```

>特别注意：如果中间件内部没有调用`next`函数，那么执行权就不会传递下去。

##### 3.4 异步中间件
如果有异步操作（比如读取数据库），中间件就必须写成 async 函数。

``` js
const fs = require('fs.promised');
const Koa = require('koa');
const app = new Koa();

const main = async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = await fs.readFile('./template.html', 'utf8');
};

app.use(main);
app.listen(3000);
```
``` js
// 需要安装fs.promised
npm i -S fs.promised
```
##### 3.5 中间件的合成
`koa-compose`模块可以将多个中间件合成为一个。

``` js
const Koa = require('koa');
const compose = require('koa-compose');
const app = new Koa();

const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next();
}

const main = ctx => {
  ctx.response.body = 'Hello World';
};

// 合成中间件
const middlewares = compose([logger, main]);

app.use(middlewares);
app.listen(3000);
```
#### 4. 错误处理
##### 4.1 500错误
如果代码运行过程中发生错误，我们需要把错误信息返回给用户。HTTP 协定约定这时要返回500状态码。Koa 提供了`ctx.throw()`方法，用来抛出错误，ctx.throw(500)就是抛出500错误。

``` js
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  ctx.throw(500);
};

app.use(main);
app.listen(3000);
```
##### 4.2 404错误
如果将`ctx.response.status`设置成404，就相当于`ctx.throw(404)`，返回404错误。

``` js
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  ctx.response.status = 404;
  ctx.response.body = 'Page Not Found';
};

app.use(main);
app.listen(3000);
```
##### 4.3 封装处理错误的中间件
为了方便处理错误，最好使用try...catch将其捕获。但是，为每个中间件都写try...catch太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

``` js
const Koa = require('koa');
const app = new Koa();

const handler = async (ctx, next) => {
  try {
    await next();
  }
  catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    };
  }
};

const main = ctx => {
  ctx.throw(404);
};

app.use(handler);
app.use(main);
app.listen(3000);
```
``` js
访问 http://127.0.0.1:3000 ，你会看到一个500页，里面有报错提示 {"message": "Not Found"}。
```
##### 4.4 error 事件的监听
运行过程中一旦出错，Koa 会触发一个error事件。监听这个事件，也可以处理错误。

``` js
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  ctx.throw(500);
};

app.on('error', (err, ctx) => {
  console.error('server error', err);
});

app.use(main);
app.listen(3000);
```
``` js
访问 http://127.0.0.1:3000 ，你会在命令行窗口看到"server error xxx"。
```
#### 4.5 释放 error 事件
需要注意的是，如果错误被`try...catch`捕获，就不会触发error事件。这时，必须调用`ctx.app.emit()`，手动释放error事件，才能让监听函数生效。

```js
const Koa = require('koa');
const app = new Koa();

const handler = async (ctx, next) => {
  try {
    await next(); // 没有错误则将执行权交给下一个中间件
  }
  catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.type = 'html';
    ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
    ctx.app.emit('error', err, ctx);
  }
};

const main = ctx => {
  ctx.throw(500);
};

app.on('error', function(err) {
  console.log('logging error ', err.message);
  console.log(err);
});

app.use(handler);
app.use(main);
app.listen(3000);
```

上面代码中，main函数抛出错误，被handler函数捕获。catch代码块里面使用ctx.app.emit()手动释放error事件，才能让监听函数监听到。
#### 5. Web App 的功能
##### 5.1 Cookies
`ctx.cookies`用来读写 Cookie。

```js
const Koa = require('koa');
const app = new Koa();

const main = (ctx) => {
  const n = Number(ctx.cookies.get('view') || 0) + 1;
  ctx.cookies.set('view', n);
  ctx.response.body = n + ' views';
}

app.use(main);
app.listen(3000);
```
```js
访问 http://127.0.0.1:3000 ，你会看到1 views。刷新一次页面，就变成了2 views。再刷新，每次都会计数增加1。
```
#### 5.2 表单
Web 应用离不开处理表单。本质上，表单就是 POST 方法发送到服务器的键值对。`koa-body`模块可以用来从 POST 请求的数据体里面提取键值对。

```js
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

const main = async (ctx) => {
  const body = ctx.request.body;
  if (!body.name) ctx.throw(400, '.name required');
  ctx.body = { name: body.name };
};

app.use(koaBody());
app.use(main);
app.listen(3000);
```
>上面代码使用 POST 方法向服务器发送一个键值对，会被正确解析。如果发送的数据不正确，就会收到错误提示。

```js
curl -X POST --data "name=liujie" 127.0.0.1:3000
{"name":"liujie"}

curl -X POST --data "name" 127.0.0.1:3000
.name required
```
#### 5.3 文件上传
`koa-body`模块还可以用来处理文件上传。

```js
const os = require('os');
const path = require('path');
const Koa = require('koa');
const fs = require('fs');
const koaBody = require('koa-body');

const app = new Koa();

const main = async (ctx) => {
  const tmpdir = os.tmpdir();
  const filePaths = [];
  const files = ctx.request.body.files || {};

  for (let key in files) {
    const file = files[key];
    const filePath = path.join(tmpdir, file.name);
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(filePath);
    reader.pipe(writer);
    filePaths.push(filePath);
  }

  ctx.body = filePaths;
};

app.use(koaBody({ multipart: true }));
app.use(main);
app.listen(3000);
```
```js
打开另一个命令行窗口，运行下面的命令，上传一个文件。注意，/path/to/file要更换为真实的文件路径。

$ curl --form upload=@/path/to/file http://127.0.0.1:3000
["/tmp/file"]
```
#### 6. 模板引擎(ejs)
``` js
// 安装koa模板相关中间件
$ npm i -S koa-views

// 安装ejs模板引擎
$ npm i -S ejs
```
```js
const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
const app = new Koa();

// 加载模板引擎，模板放在views目录中
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

app.use(async (ctx) => {
    const title = 'Koa2';
    await ctx.render('index', {
        title
    });
});

app.listen(3000);
```
```html
// ./view/index.ejs 模板
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <p>EJS Welcome to <%= title %></p>
</body>
</html>
```
#### 7. 请求数据的获取
##### 7.1 GET请求参数的获取
>在koa2中，获取GET请求数据需要使用request对象中的query方法或querystring方法。两者的区别在于：query返回是格式化好的参数对象，querystring返回的是请求字符串。

* 请求对象ctx.query(或ctx.request.query)，返回如 { a:1, b:2 };
* 请求字符串`ctx.querystring(或ctx.request.querystring)`，返回如 a=1&b=2

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    const url = ctx.url;
    const query = ctx.query;
    const querystring = ctx.querystring;
    ctx.body = {
        url,
        query,
        querystring
    };
});
app.listen(3000, () => {
    console.log(server is starting at port 3000);
});
```
```js
访问：http://localhost:3000/demo?name=liujie&age=18
结果如下：
{
  "url": "/demo?name=liujie&age=18",
  "query": {
    "name": "liujie",
    "age": "18"
  },
  "querystring": "name=liujie&age=18"
}
```
>总结：获得GET请求的方式有两种，一种是从ctx.request对象中获得，另一种是直接从从上下文对象ctx中获得。获得的格式也有两种：query和querystring。

##### 7.2 POST请求数据获取
###### 7.2.1 POST请求数据获取
>获取Post请求的步骤：

1. 解析上下文ctx中的原生node.js对象req。
2. 将POST表单数据解析成querystring-字符串。(例如:user=liujie&age=20)
3. 将字符串转换成JSON格式。

ctx.request和ctx.req的区别：

1. ctx.request:是Koa2中context经过封装的请求对象，它用起来更直观和简单。
2. ctx.req:是context提供的node.js原生HTTP请求对象。这个虽然不那么直观，但是可以得到更多的内容，适合我们深度编程。

##### ctx.method(获取请求类型)
>Koa2中提供了ctx.method属性，可以获取到请求的类型，然后根据请求类型编写不同的相应方法，这在工作中非常常用。

```js
const Koa = require('koa');
const app = new Koa();
app.use(async ctx => {
    //当请求时GET请求时，显示表单让用户填写
    if(ctx.url === '/' && ctx.method === 'GET') {
        const html =`
            <h1>Koa2 request post demo</h1>
            <form method="POST"  action="/">
                <p>userName</p>
                <input name="userName" /> <br/>
                <p>age</p>
                <input name="age" /> <br/>
                <p>webSite</p>
                <input name='webSite' /><br/>
                <button type="submit">submit</button>
            </form>
        `;
        ctx.body = html;
    //当请求时POST请求时
    }
    else if(ctx.url === '/' && ctx.method === 'POST') {
        ctx.body = '接收到请求';
    }
    else {
        //其它请求显示404页面
        ctx.body = '<h1>404 not found!</h1>';
    }
})

app.listen(3000, () => {
    console.log('[demo] server is starting at port 3000');
});
```
```js
const Koa = require('koa');
const app = new Koa();
app.use( async (ctx) => {
    //当请求时GET请求时，显示表单让用户填写
    if(ctx.url === '/' && ctx.method === 'GET') {
        const html =`
            <h1>Koa2 request post demo</h1>
            <form method="POST"  action="/">
                <p>userName</p>
                <input name="userName" /> <br/>
                <p>age</p>
                <input name="age" /> <br/>
                <p>webSite</p>
                <input name='webSite' /><br/>
                <button type="submit">submit</button>
            </form>
        `;
        ctx.body = html;
    //当请求时POST请求时
    }
    else if(ctx.url === '/' && ctx.method === 'POST') {
        const pastData = await parsePostData(ctx);
        ctx.body = pastData;
    }
    else {
        //其它请求显示404页面
        ctx.body = '<h1>404 not found!</h1>';
    }
});

// 解析Node原生POST参数
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = '';
            ctx.req.on('data', (data) => {
                postdata += data
            });
            ctx.req.addListener('end', () => {
                const parseData = parseQueryStr(postdata);
                resolve(parseData);
            });
        } catch (error) {
            reject(error);
        };
    });
}
// POST字符串解析JSON对象
function parseQueryStr(queryStr) {
    let queryData = {};
    let queryStrList = queryStr.split('&');
    console.log(queryStrList);
    for ( let [index,queryStr] of queryStrList.entries() ) {
        let itemList = queryStr.split('=');
        console.log(itemList);
        queryData[itemList[0]] = decodeURIComponent(itemList[1]);
    }
    return queryData;
}

app.listen(3000, () => {
    console.log('[demo] server is starting at port 3000');
});
// 运行结果：
{
  "userName": "liujie",
  "age": "20",
  "webSite": "www.baidu.com"
}
```
##### 7.2.2 POST请求数据获取-koa-bodyparser
对于POST请求的处理，koa2没有封装获取参数的方法，需要通过自己解析上下文context中的原生node.js请求对象req，将POST表单数据解析成querystring（例如：a=1&b=2&c=3），再将querystring 解析成JSON格式（例如：`{"a":"1","b":"2","c":"3"}`），我们来直接使用`koa-bodyparser`模块从 `POST` 请求的数据体里面提取键值对。

```
// 安装(-S是因为需要在生产环境使用)
npm i -S koa-bodyparser
```
```js
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');

// 使用koa-bodyparser中间件
app.use(bodyParser());

app.use(async (ctx) => {
    if(ctx.url === '/' && ctx.method === 'GET') {
        // 当GET请求时返回表单页面
        ctx.body = `
            <h1>koa-bodyparser</h1>
            <form method="post" action="/">
                姓名：<input name="name" />

                年龄：<input name="age" />

                邮箱：<input name="email" />

                <button type="submit">提交</button>
            </form>
        `;
    }
    else if(ctx.url === '/' && ctx.method === 'POST') {
        // 当POST请求的时候，中间件koa-bodyparser解析POST表单里面的数据，并展示出来
        ctx.body = ctx.request.body;
    }
    else {
        ctx.body = '<h1>404 Not Found</h1>';
    }
});

app.listen(3000);
```
```js
// 提交结果展示：
{
  "name": "liujie",
  "age": "18",
  "email": "123456@qq.com"
}
```
#### 8. Koa中使用cookie
>开发中制作登录和保存用户信息在本地，最常用的就是cookie操作。比如我们在作一个登录功能时，希望用户在接下来的一周内都不需要重新登录就可以访问资源，这时候就需要我们操作cookie来完成我们的需求。koa的上下文（ctx）直接提供了读取和写入的方法。

* `ctx.cookies.get(name,[optins])`:读取上下文请求中的cookie。
* `ctx.cookies.set(name,value,[options])`：在上下文中写入cookie。

##### 8.1 写入Cookie操作
```js
const Koa  = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    if(ctx.url === '/index'){
        ctx.cookies.set(
            'name','liujie'
        );
        ctx.body = 'cookie is ok';
    }
    else {
        ctx.body = 'hello world';
    }
});

app.listen(3000, () => {
    console.log('[demo] server is starting at port 3000');
})
```
>写好后预览，打开控制台，可以在Application中找到Cookies选项。就可以找到我们写入的name和value了。

##### 8.2 Cookie选项

* domain：写入cookie所在的域名；
* path：写入cookie所在的路径；
* maxAge：Cookie最大有效时长；
* expires：cookie失效时间；
* httpOnly：是否只用http请求中获得；
* overwirte：是否允许重写。

```js
const Koa  = require('koa');
const app = new Koa();

app.use(async(ctx) => {
    console.log(ctx.url);
    if(ctx.url === '/index') {
        ctx.cookies.set(
            'age','22', {
                domain: '127.0.0.1', // 写cookie所在的域名
                path: '/index',       // 写cookie所在的路径
                maxAge: 1000*60*60*24,   // cookie有效时长
                expires: new Date('2019-12-31'), // cookie失效时间
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            }
        );
        ctx.body = 'cookie is ok222';
    }
    else {
        ctx.body = 'hello world'
    }
});

app.listen(3000, () => {
    console.log('[demo] server is starting at port 3000');
});
```
>特别注意：127.0.0.1和localhost是两个不同的domain。

##### 8.3 读取Cookie
```js
const Koa  = require('koa');
const app = new Koa();

app.use(async(ctx) => {
    if (ctx.url === '/index') {
        ctx.cookies.set(
            'name','liujie', {
                domain:'127.0.0.1', // 写cookie所在的域名
                path:'/index',       // 写cookie所在的路径
                maxAge:1000*60*60*24,   // cookie有效时长
                expires:new Date('2018-12-31'), // cookie失效时间
                httpOnly:false,  // 是否只用于http请求中获取
                overwrite:false  // 是否允许重写
            }
        );
        ctx.body = 'cookie is ok';
    }
    else {
        if (ctx.cookies.get('name')) {
            ctx.body = ctx.cookies.get('name');
        }
        else {
            ctx.body = 'Cookie is not found';
        }
    }
});

app.listen(3000, () => {
    console.log('[demo] server is starting at port 3000');
})
```
<Valine></Valine>