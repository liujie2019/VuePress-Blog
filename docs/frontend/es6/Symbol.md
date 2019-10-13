---
title: Symbol
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::
Symbol 基本数据类型，独一无二(永远不相等)
```js
let s1 = Symbol(); // 可以接收一个标识参数
let s2 = Symbol();
// symbol中可以增加标识
console.log(s1 === s2); // false
```
```js
let s3 = Symbol('test'); // symbol中的标识一般为number或者string
let s4 = Symbol('test');

console.log(s3 === s4); // false
```
```js
let obj = {
    name: 'lisi',
    [s2]: 1 // 如果对象的属性为Symbol类型的话，该属性不可枚举
}
console.log(obj); // { name: 'lisi', [Symbol()]: 1 }
console.log(obj[s2]);
console.log(s1 === s2); // false
```
```js
for (let key in obj) {
    console.log(obj[key]); // 'name'
}
console.log(Object.keys(obj)); // [ 'name' ]
// getOwnPropertySymbols获取对象中symbol类型的key
console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol() ]
```
## Symbol.for
```js
// 没有这个变量，就声明一个
let s5 = Symbol.for('lisi');
// 如果已经存在了，可以直接获取对应的symbol
// 所以s5和s6是相等的
let s6 = Symbol.for('lisi');

console.log(Symbol.keyFor(s5)); // lisi
console.log(s5 === s6); // true
```
## Symbol.iterator
Symbol内置对象 Symbol.iterator 实现对象的遍历
实现元编程 可以对原生js的操作进行修改
```js
let instance = {
    // 改写对象的instanceof方法
    [Symbol.hasInstance](value) {
        return 'a' in value;
    }
};
console.log({a: 1} instanceof instance); // true
```