---
title: JS手写代码
---
## 1. Object.create实现
Object.create(obj)基本原理：接收一个obj对象，然后创建一个空对象，让空对象的`__proto__`指向obj，最终返回这个空对象。
实现思路：
1. 接收一个要作为原型的对象；
2. 返回一个原型指向该对象的空对象
```js
Object.create = function(obj) {
    let o = {};
    // 理论上是可以的，但是__proto__在ie中不支持
    o.__proto__ = obj;
    return o;
}

Object.create = function(obj) {
    function Fn() {};
    Fn.prototype = obj;
    // new Fn()就是一个空对象，因为没有任何私有属性和方法
    return new Fn();
}
```