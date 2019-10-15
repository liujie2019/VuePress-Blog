---
title: Proxy
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::

## 用Proxy进行预处理
什么是钩子函数？当我们在操作一个对象或者方法时会有几种动作，比如：在运行函数前初始化一些数据，在改变对象值后做一些善后处理。这些都算钩子函数，Proxy的存在就可以让我们给函数加上这样的钩子函数，你也可以理解为在执行方法前预处理一些代码。你可以简单的理解为他是函数或者对象的生命周期。

## 概述
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种`元编程`（meta programming），即对编程语言进行编程。

Proxy可以理解成，在目标对象之前架设一层拦截，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为`代理器`。

ES6原生提供Proxy构造函数，用来生成Proxy实例。
```js
const proxy = new Proxy(target, handler);
```
Proxy对象的所有用法，都是上面这种形式，不同的只是`handler`参数的写法。其中，new Proxy()表示生成一个Proxy实例，**target参数表示所要拦截的目标对象**，handler参数也是一个对象，用来定制拦截行为。

## Proxy拦截操作
### get(target, propKey, receiver(可选参数))
get方法用于：拦截对象某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和proxy实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

```js
const handler = {
    // 对设置属性进行拦截
    set: function(target, key, value, receiver) {
        if (key === 'name') {
            target[key] = receiver;
        } else {
            target[key] = value;
        }
    }
}

const proxy = new Proxy({}, handler);
const obj = {};
Object.setPrototypeOf(obj, proxy);

obj.name = 'lisi';
obj.age = 12;
console.log(obj.name === obj); // true
console.log(obj.age); // 12
```
### set(target, propKey, value, receiver)
```js
const handler = {
    // 对设置属性进行拦截
    set: function(target, key, value, receiver) {
        if (key === 'name') {
            target[key] = receiver;
        } else {
            target[key] = value;
        }
    }
}

const proxy = new Proxy({}, handler);
const obj = {};
Object.setPrototypeOf(obj, proxy);

obj.name = 'lisi';
obj.age = 12;
console.log(obj.name === obj); // true
console.log(obj.age); // 12
```
### apply
apply方法拦截函数的调用、call和apply操作。

apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。
```js
const handler = {
    apply(target, ctx, args) {
        console.log(target);
        console.log(ctx);
        console.log(args); // [1, 2]
        return Reflect.apply(...arguments) * 3;
    }
};

function sum(left, right) {
    return left + right;
}

let proxy = new Proxy(sum, handler);
// 执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截
console.log(proxy(1, 2)); // 9
console.log(proxy.call(null, 2, 3)); // 15
console.log(proxy.apply(null, [3, 4])); // 21
```
### has
has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。

has方法可以接受两个参数，分别是目标对象、需查询的属性名。
```js
const handler = {
    has(target, key) {
        // 隐藏私有属性
        if (key[0] === '_') {
            return false;
        }
        return key in target;
    }
};
const proxy = new Proxy({name: 'lisi', _age: 18}, handler);
console.log('_age' in proxy); // false
console.log('name' in proxy); // true
```
### construct
construct方法用于拦截new命令，下面是拦截对象的写法。
```js

```
### isExtensible
Object.isExtensible() 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。
```js
const obj = {name: 'lisi'};

console.log(Object.isExtensible(obj)); // true
// 设置obj不可扩展
Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false
```

## 应用
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
1. [Proxy](http://es6.ruanyifeng.com/#docs/proxy)
2. [ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)