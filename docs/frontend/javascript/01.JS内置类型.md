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
## 强制类型转换
>强制类型转换场景：

* 字符串拼接
* ==运算符
* if语句
* 逻辑运算符
* 三元运算符

```js
// 字符串拼接
console.log(100 + 10); // 110
console.log(100 + '10'); // '10010'
console.log(100 - '10'); // 90
```
```js
// ==运算符(慎用)
// 数字100会转换为字符串'100'
console.log(100 == '100'); // true
// 0和''都会转换为false
console.log(0 == ''); // true
// null和undefined都会转换为false
console.log(null == undefined); // true
```
![d71a3616b15cdf16789fe64a14dfd6fe.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1166)
### 转Boolean
在条件判断时，除了undefined，null，false，NaN， ''，0，-0，其他所有值都转为true，包括所有对象。

![e66930f118ca1a1a8b00621f65cdfb02.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1167)
```js
// 逻辑运算符
console.log(100 && 0); // 0
```
### 对象转基本类型
对象在转换基本类型时，首先会调用 valueOf 然后调用 toString。并且这两个方法你是可以重写的。
```js
let a = {
    valueOf() {
    	return 0
    }
}
```
当然你也可以重写 Symbol.toPrimitive，该方法在转基本类型时调用优先级最高。
```js
let a = {
  valueOf() {
    return 0;
  },
  toString() {
    return '1';
  },
  [Symbol.toPrimitive]() {
    return 2;
  }
}
1 + a // => 3
'1' + a // => '12'
```
### 四则运算符
只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。其他运算只要其中一方是数字，那么另一方就转为数字。并且加法运算会触发三种类型转换：将值转换为原始值，转换为数字，转换为字符串。
```js
1 + '1' // '11'
2 * '2' // 4
[1, 2] + [2, 1] // '1,22,1'
// [1, 2].toString() -> '1,2'
// [2, 1].toString() -> '2,1'
// '1,2' + '2,1' = '1,22,1'
```
对于加号需要注意这个表达式 'a' + + 'b'
```js
'a' + + 'b' // -> "aNaN"
// 因为 + 'b' -> NaN
// 你也许在一些代码中看到过 + '1' -> 1
```
### == 操作符
![1a0c6739b68861b525c0aec239a79c5f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1170)
上图中的 toPrimitive 就是对象转基本类型。

这里来解析一道题目 [] == ![] // -> true ，下面是这个表达式为何为 true 的步骤：
```js
// [] 转成 true，然后取反变成 false
[] == false
// 根据第 8 条得出
[] == ToNumber(false)
[] == 0
// 根据第 10 条得出
ToPrimitive([]) == 0
// [].toString() -> ''
'' == 0
// 根据第 6 条得出
0 == 0 // -> true
```
### 比较运算符

* 如果是对象，就通过 toPrimitive 转换对象；
* 如果是字符串，就通过 unicode 字符索引来比较

## 何时使用===何时使用==
```js
if (obj == null) {
    // 这里相当于 obj === null || obj === undefined 的简写形式
    // 这是jQuery源码中的推荐写法
}
```
>只有在判断变量是否为null或者undefined的时候用`==`，其他情况一律用`===`。

* `==`会发生强制类型转换，`===`不会。

### ES6中Object.is
<Valine></Valine>