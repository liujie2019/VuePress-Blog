---
title: 19. AOP
---

JS面向切面编程(AOP)。

面向切面编程AOP（Aspect-oriented programming）的主要作用是：把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。

把这些功能抽离出来之后，再通过动态植入的方式掺入业务逻辑模块中。这样做的好处首先是可以保持业务逻辑模块的纯净和高内聚性，其次是可以很方便地复用日志统计等功能模块。

通常，在JS中实现AOP，都是指把一个函数动态植入到另外一个函数之中，具体的实现技术有很多，下面的例子通过扩展 Function.prototype 配合高阶函数来做到这一点。

```js
Function.prototype.before = function(cb) {
    const that = this;
    return function(...arguments) { // 剩余运算符，将形参转为数组
        cb();
        console.log(arguments); // [ 1, 2 ]
        that(...arguments); // 展开运算符，将数组元素展开作为形参
    }
}

const fn = (a, b) => {
    console.log(a, b); // 1, 2
    console.log('fn called');
}

const newFn = fn.before(() => {
    console.log('我先执行');
});

newFn(1, 2);

/*
我先执行
[ 1, 2 ]
1 2
fn called
*/
```