---
title: var、let及const区别
---
主要涉及：什么是提升(变量&函数)？什么是暂时性死区？

var的特点：
1. 变量/函数声明提升；
2. var可以重复赋值；
3. ES6之前并没有块级作用域，var声明的变量会污染全局变量，但是let声明的变量不会污染全局变量。

我们先来看下变量声明提升(hoisting)：
```js
console.log(a); // undefined
var a = 1;
// 相当于
var a;
console.log(a);
a = 1;
```
var变量重复声明：
```js
var a = 10;
var a;
console.log(a); // 10
```
::: warning
需要注意：上述例子中，打印输出的值不是undefined而应该是10，对于上述情况，可以这样来看代码：需要牢牢记住，提升的永远都是声明，赋值在声明之后。
:::
```js
var a;
var a;
a = 10;
console.log(a); // 10
```
看到这里，相信大家已经了解了var声明的变量会发生提升的情况，除了变量之外，函数声明也会被提升。
```js
console.log(a); // ƒ a() {}
function a() {}
var a = 1;
```
对于上述代码，打印结果会是`ƒ a() {}`，即使变量声明在函数之后，这也说明了函数会被提升，并且优先于变量提升。
::: tip
总结：使用var声明的变量会被提升到作用域的顶部。
:::
ES5没有块级作用域：
```js
var a = 1;
{
    var a = 2; // es5没有块级作用域，这里的声明会覆盖花括号上面的声明
}
console.log(a); // 2
```

```js
var a = 1;
let b = 1;
const c = 1;
console.log(window.a); // 1
console.log(window.b); // undefined
console.log(window.c); // undefined

function test() {
  console.log(a); // 在声明a之前如果使用了a报错，暂时性死区
  let a;
}
test();
```
全局作用域下var声明的变量默认挂载到全局对象window上，而let和const则不会被挂载到window上。
![](https://github.com/liujie2019/static_data/blob/master/img/20191210224718.png?raw=true)
```js
let b = 2;
{
    console.log(b); // 报错，暂时性死区
    let b = 3; // 这里的b和花括号外面的b不一样，可以用babel编译一下就可以看出来
}
console.log(b); // 2
```
上述代码编译后：
```js
var b = 2;
{
  var _b = 3;
}
console.log(b); // 2
```
为什么要存在提升？其实提升存在的根本原因就是为了解决函数间互相调用的情况
```js
function fn1() {
    fn2();
}
function fn2() {
    fn1();
}
fn1();
```
假如不存在提升这个情况，那么就实现不了上述的代码，因为不可能存在fn1在fn2前面然后fn2又在fn1前面。
::: tip
总结如下：
1. 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部；
2. var存在提升，可以在声明之前使用。let、const因为存在暂时性死区，不能在声明前使用；
3. var在全局作用域下声明的变量会被挂载到window上，let和const不会；
4. let和const作用基本一致，但是后者声明的变量不能再次赋值，在项目中尽可能使用const，如果这个值需要更改才使用let。
:::
### let应用
```js
for (let i = 0; i < 10; i++) {
    // 作用域链
    setTimeout(() => {
        console.log(i); // 打印出0-9
    }); // 最小延迟4ms
}
```
```js
for (var i = 0; i < 10; i++) {
    // 作用域链
    // 打印出10个10，var声明的i为全局变量。
    setTimeout(() => {
        console.log(i); // 这里访问的是for循环结束后的i
    }); // 最小延迟4ms
}
```