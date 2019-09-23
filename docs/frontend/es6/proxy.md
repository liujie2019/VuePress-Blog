---
title: Proxy
---
[TOC]
## 用Proxy进行预处理
>什么是钩子函数？当我们在操作一个对象或者方法时会有几种动作，比如：在运行函数前初始化一些数据，在改变对象值后做一些善后处理。这些都算钩子函数，Proxy的存在就可以让我们给函数加上这样的钩子函数，你也可以理解为在执行方法前预处理一些代码。你可以简单的理解为他是函数或者对象的生命周期。

## 概述
>Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种`元编程`（meta programming），即对编程语言进行编程。

>Proxy 可以理解成，在目标对象之前架设一层`拦截`，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为`代理器`。

ES6原生提供Proxy构造函数，用来生成Proxy实例。
```js
const proxy = new Proxy(target, handler);
```
Proxy对象的所有用法，都是上面这种形式，不同的只是`handler`参数的写法。其中，new Proxy()表示生成一个Proxy实例，**target参数表示所要拦截的目标对象**，handler参数也是一个对象，用来定制拦截行为。

## demo
### demo1
```js
let obj = {
    a: 1,
    b: 2
};

const p = new Proxy(obj, {
    // target即obj
    get(target, key, value) {
        if(key in target) {
            return target[key]
        }
        else {
            return '自定义结果'
        }
    }
});

console.log(obj.a); // 1
console.log(obj.c); // undefined
console.log(p.a); // 1
console.log(p.c); // 自定义结果
```
### demo2
```js
const phoneNumber = new Proxy({}, {
    set(target, key, value) {
        target[key] = value.match(/[0-9]/g).join('');
    },
    get(target, key) {
        return target[key].replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
});
phoneNumber.home = '131 1122 9876';
phoneNumber.company = '134 342 96876';

// { home: '13111229876', company: '13434296876' }
// console.log(phoneNumber);
console.log(phoneNumber.home);
console.log(phoneNumber.company);
```
### demo3
```js
const safetyProxy = new Proxy({id: 2}, {
    set(target, key, value) {
        const likeKey = Object.keys(target).find(k => k.toLowerCase() === key.toLowerCase());
        if (!(key in target) && likeKey) {
            throw new Error('已经存在相似的key');
        }
        target[key] = value;
    }
});

// safetyProxy.Id = 3;
safetyProxy.name = 'lisi';
```

## 参考文档

1. [ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)