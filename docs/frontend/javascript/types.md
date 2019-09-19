---
title: JS 内置类型
lang: zh
meta:
  - name: description
    content: JS 内置类型
  - name: keywords
    content: JS 内置类型
---
# JS内置类型
## 内置类型
JS中分为七种内置类型，七种内置类型又分为两大类型：基本类型和引用类型。

>基本类型有六种：null，undefined，boolean，number，string，symbol(ES6)。

其中JS的数字类型是浮点类型的，没有整型。并且浮点类型基于IEEE 754标准实现，在使用中会遇到某些Bug。**NaN也属于number类型**，并且NaN不等于自身(ES5)。

>需要注意：ES6中Object.is(NaN, NaN); // true

对于基本类型来说，如果使用字面量的方式，那么这个变量只是个字面量，只有在必要的时候才会转换为对应的类型
```js
let a = 111 // 这只是字面量，不是number类型
a.toString() // 使用时候才会转换为对象类型
```
对象（Object）是引用类型，在使用过程中会遇到浅拷贝和深拷贝的问题。
```js
let a = { name: 'FE' }
let b = a
b.name = 'EF'
console.log(a.name) // EF
```
### 变量类型
JS按照**存储方式**划分变量类型，分为值类型和引用类型。
```js
// 值类型
var a = 100;
var b = a;
a = 200;
console.log(b); // 100
```
![fa97ae3016949aa54c3cce9fa70957ec.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1161)

>a和b指向了内存空间中的同一区域。引用类型包括：对象、数组和函数等。为什么要这样设计呢？因为，加入a对象有很多属性(占用内存多)，又将a赋值给b，b也会占用很多内存空间，为了使得内存空间可以公用，设计了引用类型赋值指向同一内存区域。

![c27c8f809869f9911fdba9e1dc35ec92.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1162)
![6795a283400a014ff70965c1ba934275.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1163)

>需要注意：不仅对象可以有属性，数组和函数也可以有属性，都是公用内存空间。

## typeof运算符详解
typeof对于基本类型，除了null都可以显示正确的类型。
```js
typeof 1 // 'number'
typeof 'abc' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof a // 'undefined' a虽然没有声明，但是还会显示undefined
```
typeof对于引用类型，除了函数都会显示object。
```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```
>特别注意：对于null来说，虽然它是基本类型，但是会显示 object。`typeof null === 'object'`。所以，typeof只能用来判断基本数据类型，无法判断引用类型。
```js
typeof NaN  // number
typeof undefined // undefined
typeof null // null
typeof function fn(){} // "function"
// Object和Number都是构造函数
typeof Object // "function"
typeof Number // "function"
```
## 如何获取一个变量的正确类型
如果想获得一个变量的正确类型，可以通过 `Object.prototype.toString.call(xx)`。这样我们就可以获得类似`[object Type]`的字符串。

```js
Object.prototype.toString.call(12); // "[object Number]"
Object.prototype.toString.call({name: 'lisi'}); // "[object Object]"
Object.prototype.toString.call(null); // "[object Null]"
// 对于未声明的变量
Object.prototype.toString.call(a); // "[object Undefined]"
Object.prototype.toString.call(NaN); // "[object Number]"
```
<Valine></Valine>