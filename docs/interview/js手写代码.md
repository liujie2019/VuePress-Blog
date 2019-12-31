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
## 2. new操作符实现
new操作符做了什么：

1. 创建了一个全新的对象。
2. 这个对象会被执行`[[Prototype]]`(也就是`__proto__`)链接。
3. 使得this指向新创建的对象。
4. 通过new创建的每个对象将最终被`[[Prototype]]`链接到这个函数的prototype对象上。
5. 如果函数没有返回对象类型Object(包含Functoin，Array，Date，RegExg，Error)，那么new表达式中的函数调用会自动返回这个新的对象。
```js
function myNewOperator() {
    if (typeof ctor !== 'function') {
        throw new Error('newOperator function the first param must be a function');
    }
    // new.target是指向构造函数的
    myNewOperator.target = ctor;
    // 新建一个对象，并指向构造函数原型
    var newObj = Object.create(ctor.prototype);
    var argsArr = Array.prototype.slice.call(arguments, 1);
    // 获取构造函数的结果
    var ctorRes = ctor.apply(newObj, argsArr);
    // 判断构造函数结果是否为函数或者对象类型
    var isObject = typeof ctorRes === 'object' && ctorRes !== null;
    var isFunction = typeof ctorRes === 'function';
    // 为函数或者对象类型，直接返回该结果
    if (isObject || isFunction) {
        return ctorRes;
    }
    // 否则返回新建的实例对象
    return newObj;
}
```
## 3. 观察者模式实现
```js
class Subject {
    constructor(name) {
        this.name = name;
        this.observers = []; // 存放观察者
        this.state = '心情很美丽';
    }
    // 被观察者添加观察者的方法(观察者和被观察者建立关系)
    attach(observer) {
        this.observers.push(observer);
    }
    // 更改被观察者的状态
    setState(newState) {
        this.state = newState;
        this.notify(); // 被观察者状态发生变化时，通知观察者
    }
    notify() {
        this.observers.forEach(o => {
            o.update(this.state);
        });
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }
    update(newState) {
        console.log(`${this.name}说：小公主${newState}`);
    }
}
// 创建一个被观察者
const sub = new Subject('小公主');
// 创建两个观察者
const o1 = new Observer('爸爸');
const o2 = new Observer('妈妈');
// 被观察者添加观察者
sub.attach(o1);
sub.attach(o2);
// 被观察者更新状态，并通知观察者
sub.setState('不开心了');
```
Vue的依赖收集就是基于观察者模式(基于watcher)。观察者模式包含发布订阅模式。
## 4. 发布订阅模式实现
```js

```
## 5. 实现一个sleep函数
```js
function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}
```
## 6. 判断是否为Promise对象
```js
function isPromise(p) {
  return p && typeof p.then === 'function' && typeof p.catch === 'function';
}
// 判断是否是Generator对象
function isGenerator(obj) {
  return obj && 'function' === typeof obj.next && 'function' === typeof obj.throw;
}
```