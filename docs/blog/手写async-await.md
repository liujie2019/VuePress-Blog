---
title: 手写async-await
---
我们都知道async是generaotr的语法糖。generator函数是不会自动执行的，每一次调用它的next方法，**会停留在下一个yield的位置**。利用这个特性，我们只要编写一个**自动执行的函数**，就可以让这个generator函数完全实现async函数的功能。

既然是实现async函数，首先必须返回一个函数，而且我们知道async函数的返回值是一个Promise，所以说返回的这个函数执行结果也必须是Promise，那么代码的实现结构大体如下：
```js
// 基于generator实现async函数，接收一个generator函数
function generatorToAsync(genFn) {
    return function() {
        return new Promise((resolve, reject) => {});
    }
}
```
关键就在于：里面用yield来划分的异步流程，应该如何自动执行。

### 手动执行generator
在功能实现之前，我们先模拟手动去调用这个generator函数去一步步的把流程走完，有助于后面的代码实现。
```js
const getData = () => new Promise((resovle, reject) => {
    setTimeout(() => {
        resovle('data');
    }, 1000);
});

function* testGen() {
    const data = yield getData();
    console.log('data111:', data);
    const data2 = yield getData();
    console.log('data222:', data2);
    return 'success';
}

// 返回了一个迭代器
const gen = testGen();
gen.next();
gen.next();
gen.next();
```
```js
// 返回了一个迭代器
testGen();
```
然后开始执行第一次next：
```js
// 第一次调用next 停留在第一个yield的位置，返回的promise里 包含了data需要的数据
var dataPromise = gen.next();
```
这里返回了一个promise，就是第一次getData()所返回的promise，注意
```js
const data = yield getData();
```
这段代码要切割成左右两部分来看，第一次调用next，其实只是停留在了`yield getData()`这里，data的值并没有被确定。

那么什么时候data的值会被确定呢？答案是：下一次调用next的时候。

**下一次调用next的时候，传入next函数的参数会被作为上一个yield表达式前面变量的值。**

也就是说，我们再次调用gen.next('赋给data变量的值')的时候，data的值才会被确定为'赋给data变量的值'。
```js
gen.next('赋给data变量的值')

// 然后这里的data才有值
const data = yield getData();

// 然后打印出data
console.log('data: ', data);

// 然后继续走到下一个yield
const data2 = yield getData();
```
然后往下执行，直到遇到下一个yield，继续这样的流程...具体实现如下：
```js
function generatorToAsync(genFn) {
    // 返回一个函数
    return function() {
        const gen = genFn.apply(this, arguments);
        // 返回函数执行结果为Promise，特性与async函数保持一致
        return new Promise((resovle, reject) => {
            function step(key, args) {
                let genResult;
                try {
                    // 获取next函数执行的结果
                    genResult = gen[key](args);
                } catch (error) {
                    return reject(error);
                }
                const {done, value} = genResult;
                // 执行结束
                if (done) {
                    return resovle(value);
                } else {
                    // 递归循环执行
                    return Promise.resolve(value).then(val => step('next', val), err => step('throw', err));
                }
            }
            step('next');
        });
    }
}
```
这里需要注意：`Promise.resolve()`方法。
1. 参数是一个 Promise 实例
如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
2. 参数不是具有then方法的对象，或根本就不是对象

如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
```js
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```
上面代码生成一个新的 Promise 对象的实例p。由于字符串Hello不属于异步操作（判断方法是字符串对象不具有 then 方法），返回 Promise 实例的状态从一生成就是resolved，所以回调函数会立即执行。Promise.resolve方法的参数，会同时传给回调函数。
3. 不带有任何参数

Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。

所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用Promise.resolve()方法。
```js
const p = Promise.resolve();

p.then(function () {
  // ...
});
```
上面代码的变量p就是一个 Promise 对象。
需要注意的是，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。

## 参考文档
1. [手写async await的 20 行最简实现](https://mp.weixin.qq.com/s/_5JlgxWbKjDhRkO9labYfA)