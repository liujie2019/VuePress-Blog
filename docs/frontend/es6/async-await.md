---
title: Async/Await
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::

`Async/Await`是`ECMAScript`新引入的语法，能够极大地简化异步程序的编写，本文详细介绍了`Async/Await`的用法以及与传统方式的对比，通过样例体现了`Async/Await`的优势。

`async`函数是`Generator`函数的语法糖。使用关键字`async`来表示，在函数内部使用`await`来表示异步。相较于`Generator`，`async`函数的改进在于下面几点：

1. **内置执行器**：`Generator`函数的执行必须依靠执行器，而 `async`函数自带执行器，**调用方式跟普通函数的调用一样**；
2. **更好的语义**：`async和await`相较于`* 和yield`更加语义化；
3. **更广的适用性**：co模块约定，`yield`命令后面只能是`Thunk`函数或`Promise`对象。而`async`函数的`await`命令后面则可以是`Promise`或者原始类型的值(Number，string，boolean，但这时等同于同步操作)；
4. **返回值是Promise**：`async`函数返回值是`Promise`对象，比 `Generator`函数返回的`Iterator`对象方便，可以直接使用`then()`方法进行调用。
5. **代码逻辑更清晰**：`async/await`的优势在于能更好的处理`then`链，特别是有多个`Promise`组成的`then`链的时候，优势就体现出来了。

>`async`是ES7新出的特性，**表明当前函数是异步函数**，不会阻塞线程导致后续代码停止运行。

```js
const asyncFn = async () => {
    return '我后执行'
}
asyncFn().then(result => {
    console.log(result);
})
console.log('我先执行');
// 运行结果：
我先执行
我后执行
```
>虽然是上面`asyncFn()`先执行，但是已经被定义异步函数了，不会影响后续函数的执行。

```js
const asyncFn = async () => {
    return '我后执行'
};
console.log(asyncFn());
```
>运行结果：
```js
Promise {<resolved>: "我后执行"}
```
>需要注意：`async`函数返回的是一个`Promise`对象。`async`函数（包含函数语句、函数表达式、Lambda表达式）会返回一个`Promise`对象，如果在函数中`return`一个直接量，`async`会把这个直接量通过`Promise.resolve()`封装成`Promise`对象。该Promise对象，最终resolve的值就是在函数中return的直接量的内容。

## async和await
先从字面意思来理解，`async`是异步的简写，而`await`可以认为是`async wait`的简写。所以应该很好理解，`async`用于申明一个函数是异步的，而`await`用于等待一个异步方法执行完成。
## async-await和Promise的关系
`async-await`是`promise`和`generator`的语法糖。只是为了让我们书写代码时更加流畅，当然也增强了代码的可读性。简单来说：`async-await`是建立在`promise`机制之上的，并不能取代其地位。
## 基本语法
```js
async function fn() {
 	// await会把结果转化为一个Promise对象
    const result = await Math.random();
    console.log(result);
}

fn();
```
### async
`async`用来声明函数是异步的，定义的函数会返回一个`Promise`对象，可以使用`then`方法添加回调函数。

```js
async function demo1(params) {
    return 'demo1';
}

demo1().then(val => {
    console.log(val); // 'demo1'
});
```
```js
async function fn(params) {
    console.log('111');
}
fn().then(v => console.log(v));
```
>运行结果：
```js
111
undefined
```
>若`async`定义的函数有返回值，`return 123;`相当于`Promise.resolve(123)`，没有声明式的`return`则相当于执行了`Promise.resolve(undefined)`;

### await
`await`可以理解为是`async wait`(异步等待)的简写。`await`关键字只能出现在`async`函数内部，不能单独使用。任何`async`函数都会默认返回`Promise`，并且这个`Promise`解析的值都将会是这个函数的返回值，而`async`函数必须等到内部所有的`await`命令的`Promise`对象执行完，才会发生状态改变。

```

```
`await`后面可以跟任何的JS表达式。虽然说`await`可以等很多类型的东西，但是它最主要的意图是用来等待`Promise`对象的状态被`resolved`。如果`await`的是`Promise`对象会造成异步函数停止执行并且等待`Promise`的解决，如果等的是正常的表达式则立即执行。

## Async函数的错误处理
```js
let a;

const testFn = async () => {
    await Promise.reject('error');
    a = await 1; // 这行代码不会被执行
}

testFn().then(v => console.log(a));
```
>如上面代码所示：当`async`函数中只要一个`await`出现`reject`状态，则后面的`await`都不会被执行。解决办法：可以添加`try/catch`。

```js
let a;

const testFn = async () => {
    try {
        await Promise.reject('error');
    } catch(error) {
        console.error(error);
    }
    a = await 1;
}

testFn().then(v => console.log(a));
```
```js
const testError = async () => {
    throw new Error('has Error');
}
testError()
    .then(success => console.log('成功', success))
    .catch(error => console.log('失败', error)); // 失败 Error: has Error
```

## demo
### 基础示例
```js
// demo1
const axios = require('axios');

const getZhihuColumn = async (id) => {
	// 获取知乎小管家的专栏信息
    const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
    const response = await axios({
        url: url,
        method: 'GET'
    });
    console.log(`Name: ${response.data.name}`);
    console.log(`Intro: ${response.data.intro}`);
}

getZhihuColumn('zhihuadmin');
```
### 将任意函数定义成async风格
```js
// demo2
// 将函数的结果做为一个Promise返回
const axios = require('axios');

const getZhihuColumn = async (id) => {
    const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
    return await axios({
        url: url,
        method: 'GET'
    });
}

getZhihuColumn('zhihuadmin')
    .then(response => {
        console.log(`Name: ${response.data.name}`);
        console.log(`Intro: ${response.data.intro}`);
    });
```
```js
// demo3
const axios = require('axios');

class ApiClient {
    // 将class中的函数定义成async风格
    async getZhihuColumn(id) {
        const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
        return await axios({
            url: url,
            method: 'GET'
        });
    }
}
// 将立即执行函数定义为async风格
(async () => {
    const client = new ApiClient();
    client.getZhihuColumn('zhihuadmin')
        .then(response => {
            console.log(`Name: ${response.data.name}`);
            console.log(`Intro: ${response.data.intro}`);
            console.log(`Description: ${response.data.description}`)
        });
})();
```
### async函数中的错误处理
```js
const axios = require('axios');

const getZhihuColumn = async (id) => {
    const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
    const response = await axios({
        url: url,
        method: 'GET'
    });
    console.log(response.status, response.statusText); // 200 'OK'
    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    return await response;
}

// 处理async函数中的错误
const showColunmInfo = async (id) => {
    try {
        const response = await getZhihuColumn(id);
        console.log(`Name: ${response.data.name}`);
        console.log(`Intro: ${response.data.intro}`);
    } catch (err) {
        console.error(err);
    }
}

showColunmInfo('zhihuadmin11');
```
### 多个await串行
```js
const axios = require('axios');

const sleep = (timeout = 2000) => new Promise(resolve => {
    setTimeout(resolve, timeout);
});

const getZhihuColumn = async (id) => {
    await sleep(3000);
    const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
    return await axios({
        url: url,
        method: 'GET'
    });
}

// 正确处理多个await操作的串行
const showColumnInfo = async () => {
    console.time('showColumnInfo');
    const feweekly = await getZhihuColumn('feweekly');
    const response = await getZhihuColumn('zhihuadmin');

    console.log(`NAME: ${feweekly.data.name}`);
    console.log(`INTRO: ${feweekly.data.intro}`);

    console.log(`NAME: ${response.data.name}`);
    console.log(`INTRO: ${response.data.intro}`);
    console.timeEnd('showColumnInfo');
}

showColumnInfo();
// 运行结果：
NAME: 前端周刊
INTRO: 在前端领域跟上时代的脚步，广度和深度不断精进
NAME: 知乎小管家说
INTRO: 知乎社区管理团队官方专栏，不定期更新社区管理工作…
showColumnInfo: 6653.686ms
```
### 多个await并行
```js
const fetch = require('node-fetch');
const sleep = (timeout = 2000) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};
const getZhihuColumn = async id => {
    // 延迟2秒
    await sleep(2000);
    const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
    // 获取到专栏数据
    const response = await fetch(url);
    // 进行错误处理
    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    // 将获取到的数据转为json
    // async函数的返回值是一个Promise
    return await response.json();
}
// 处理async函数中的错误
const getColumnInfo = async () => {
    console.time('getColumnInfo');
    try {
        // 多个await并行
        // 先发送请求再await
        const feweeklyPromise = getZhihuColumn('feweekly');
        const toolingtipsPromise = getZhihuColumn('toolingtips');
        const column = await feweeklyPromise;
        const toolingtips = await toolingtipsPromise;
        console.log(`Title: ${column.title}`);
        console.log(`Intro: ${column.intro}`);

        console.log(`Title: ${toolingtips.title}`);
        console.log(`Intro: ${toolingtips.intro}`);
    } catch (error) {
        console.error(error);
    }
    console.timeEnd('getColumnInfo');
};

getColumnInfo();
```
<img :src="$withBase('/es6/async2.png')" alt="">
>总结：对于多个请求，一般采用并行，即先发送请求在await，加快响应速度。

### 使用Promise.all实现多个await并行
```js
const fetch = require('node-fetch');
const sleep = (timeout = 2000) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};
const getZhihuColumn = async id => {
    // 延迟2秒
    await sleep(2000);
    const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
    // 获取到专栏数据
    const response = await fetch(url);
    // 进行错误处理
    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    // 将获取到的数据转为json
    // async函数的返回值是一个Promise
    return await response.json();
}
// 处理async函数中的错误
const getColumnInfo = async () => {
    console.time('getColumnInfo');
    try {
        // 使用Promise.all实现多个await并行
        const feweeklyPromise = getZhihuColumn('feweekly');
        const toolingtipsPromise = getZhihuColumn('toolingtips');
        const [column, toolingtips] = await Promise.all([feweeklyPromise, toolingtipsPromise]);
        console.log(`Title: ${column.title}`);
        console.log(`Intro: ${column.intro}`);

        console.log(`Title: ${toolingtips.title}`);
        console.log(`Intro: ${toolingtips.intro}`);
    } catch (error) {
        console.error(error);
    }
    console.timeEnd('getColumnInfo');
};

getColumnInfo();
```
## bluebird使用
```js
const bluebird = require('bluebird');

//结合 await 和任意兼容 .then() 的代码
const main = async () => {
  console.log('waiting...');
  await bluebird.delay(2000);
  console.log('done!');
}

main();
```
## 在循环中使用await
### 串行
```js
const fetch = require('node-fetch');
const bluebird = require('bluebird');

async function getZhihuColumn(id) {
  await bluebird.delay(1000);
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const getColumnInfo = async () => {
  console.time('getColumnInfo');
  const names = ['feweekly', 'toolingtips'];
  //在 for 循环中正确的使用 await
  // 串行
  for (const name of names) {
    const column = await getZhihuColumn(name);
    console.log(`Name: ${column.title}`);
    console.log(`Intro: ${column.intro}`);
  }
  console.timeEnd('getColumnInfo');
};

getColumnInfo();
```
### 并行
```js
const fetch = require('node-fetch');
const bluebird = require('bluebird');

async function getZhihuColumn(id) {
  await bluebird.delay(1000);
  const url = `https://zhuanlan.zhihu.com/api/columns/${id}`;
  const response = await fetch(url);
  return await response.json();
}

const getColumnInfo = async () => {
  console.time('getColumnInfo');
  const names = ['feweekly', 'toolingtips'];
  const promises = names.map(x => getZhihuColumn(x));
  //在 for 循环中正确的使用 await
  // 并行，先发送请求再await
  for (const promise of promises) {
    const column = await promise;
    console.log(`Name: ${column.name}`);
    console.log(`Intro: ${column.intro}`);
  }
  console.timeEnd('getColumnInfo');
};

getColumnInfo();
```
<img :src="$withBase('/es6/async.png')" alt="">

```js
const sleep = (time = 100) => new Promise(resolve => {
    setTimeout(resolve(time + 200), timeout);
});

const step1 = async (time) => {
    console.log(`step1 with ${time}`);
    return sleep(time);
}

const step2 = async (time) => {
    console.log(`step2 with ${time}`);
    return sleep(time);
}

const step3 = async (time) => {
    console.log(`step3 with ${time}`);
    return sleep(time);
}

function test() {
    console.log('test start');
    console.time('test');
    const time1 = 500;
    step1(time1)
        .then(time2 => step2(time2))
        .then(time3 => step2(time3))
        .then(res => {
            console.log(`result is ${res}`);
            console.timeEnd('test');
        });
}

test();
// 运行结果：
test start
step1 with 500
step2 with 700
step2 with 900
result is 1100
test: 3.451ms
```
```js
const sleep = (time = 100) => new Promise(resolve => {
    setTimeout(resolve(time + 200), timeout);
});

const step1 = async (time) => {
    console.log(`step1 with ${time}`);
    return sleep(time);
}

const step2 = async (time) => {
    console.log(`step2 with ${time}`);
    return sleep(time);
}

const step3 = async (time) => {
    console.log(`step3 with ${time}`);
    return sleep(time);
}
// async和await方式更加清晰
const test = async () => {
    console.log('test start111');
    console.time('test');
    const time1 = 500;
    const time2 = await step1(time1);
    const time3 = await step1(time2);
    const res = await step1(time3);
    console.log(`result is ${res}`);
    console.timeEnd('test');
}

test();
```
## 参考文档
1. [理解 async/await](https://segmentfault.com/a/1190000010244279)
2. [ES6系列文章 异步神器async-await](https://segmentfault.com/a/1190000011526612)
3. [一次性让你懂async/await，解决回调地狱](https://juejin.im/post/5b1ffff96fb9a01e345ba704)
4. [理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)
5. [为什么说Async/Await让代码更简洁？](https://mp.weixin.qq.com/s/LwV_5Bjgp5mzzSbWz-xwSg)
6. [async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
