---
title: ES6基础知识点汇总
---
## 1. var、let及const区别
## 2. 原型继承和Class继承
主要涉及：原型如何实现继承？Class如何实现继承？ES5继承与ES6继承的区别？Class 本质是什么？

1. ES5的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面(Parent.apply(this))。ES6的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面(所以必须先调用super方法)，然后再用子类的构造函数修改this。
```js
class Person {}
console.log(Person instanceof Function); // true
```
## 3. 前端模块化
主要涉及：为什么要使用模块化？前端实现模块化的方式有哪几种，各有什么特点？
使用一个技术肯定是有原因的，那么使用模块化可以给我们带来以下好处

1. 解决命名冲突；
2. 提高代码复用性；
3. 提高代码可维护性。

## 4. Proxy
主要涉及：Proxy可以实现什么功能？相比于Object.defineProperty的优势在哪里？

## 5. 箭头函数与普通函数的区别是什么？
主要涉及：构造函数可以使用new生成实例，那么箭头函数可以吗？为什么？
箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1. 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用rest参数代替。
3. 不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
4. 不可以使用 new 命令，因为：

* 没有自己的 this，无法调用 call，apply。
* 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 __proto__。
new 过程大致是这样的：
```js
function newFunc(father, ...rest) {
  var result = {};
  result.__proto__ = father.prototype;
  var result2 = father.apply(result, rest);
  if (
    (typeof result2 === 'object' || typeof result2 === 'function') &&
    result2 !== null
  ) {
    return result2;
  }
  return result;
}
```
## 6. Set、Map、WeakSet和WeakMap的区别？