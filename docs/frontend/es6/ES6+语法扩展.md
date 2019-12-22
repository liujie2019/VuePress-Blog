---
title: ES6+语法扩展
---
## 数值语法扩展
1. 二进制与八进制数值表示法: 二进制用`0b`，八进制用`0o`
2. Number.isFinite(i): 判断是否是有限大的数
3. Number.isNaN(i): 判断是否是NaN
4. Number.isInteger(i): 判断是否是整数
5. Number.parseInt(str): 将字符串转换为对应的数值
6. Math.trunc(i): 直接去除小数部分

```js
console.log(Number.isFinite(NaN)); // false
console.log(Number.isFinite(1)); // true

console.log(Number.isNaN(NaN)); // true

console.log(Number.isInteger(1.12)); // false
console.log(Number.isInteger(1.0)); // true
console.log(Number.isInteger(1)); // true

// 将字符串转换为对应的数值
console.log(Number.parseInt('123abc')); // 123
console.log(Number.parseInt('a123abc')); // NaN

console.log(Math.trunc(3.1415926)); // 3
```
## 字符串语法扩展
1. includes(str): 判断是否包含指定的字符串
2. startsWith(str): 判断是否以指定字符串开头
3. endsWith(str): 判断是否以指定字符串结尾
4. repeat(count): 重复指定次数
```js
const str = 'test';
console.log(str.startsWith('t')); // true
console.log(str.endsWith('a')); // false
console.log(str.includes('b')); // false
console.log(str.repeat(2)); // testtest
```
## 数组扩展
1. Array.from(): 将伪数组对象或可遍历对象转换为真数组
2. Array.of(): 将一系列值转换成数组
3. find(function(value, index, arr){return true}): 找出第一个满足条件返回true的元素
4. findIndex(function(value, index, arr){return true}): 找出第一个满足条件返回true的元素下标
```js
const arr = Array.of('a', 123, true);
console.log(arr); // [ 'a', 123, true ]
```
## 对象扩展
1. Object.is(a, b): 判断2个数据是否完全相等
2. Object.assign(target, source1, source2..): 将源对象的属性复制到目标对象上
3. 直接操作`__proto__`属性

```js
console.log(Object.is(NaN, NaN)); // true
console.log(NaN === NaN); // false
console.log(NaN == NaN); // false

console.log(Object.is(-0, +0)); // false
console.log(-0 === +0); // true
console.log(-0 == +0); // true
```
```js
const name = 'lisi';
const age = 9;
// 对象属性名和属性值相同，可以简写
const obj = {name, age};
console.log(obj);

const obj1 = {name: 'lisi'};
const obj2 = {name: 'lisi2'};
const obj3 = {};
// 给obj3设置原型
Object.setPrototypeOf(obj3, obj1); // 等同于obj3.__proto__ === obj1
console.log(obj3.name); // lisi
console.log(obj3.__proto__ === obj1); // true

// super
const obj1 = {
    name: 'lisi',
    getFood() {
        return '面条';
    }
};
const obj2 = {
    __proto__: obj1,
    getFood() {
        // super.getFood()读取父类的getFood方法
        return '大米' + super.getFood();
    }
};
console.log(obj2.getFood());
```
## 指数运算符(幂): **
```js
console.log(2 ** 3); // 8
```