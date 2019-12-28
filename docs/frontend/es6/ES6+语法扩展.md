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
1. Array.from(): 将类数组对象或可遍历对象转换为真数组。
2. Array.of(): 将一系列值转换成数组。
3. find(function(value, index, arr){return true}): 找出**第一个**满足条件的元素，找到后就停止遍历。
4. findIndex(function(value, index, arr){return true}): 找出第一个满足条件的元素下标，找到后就停止遍历。
5. some：数组只要有一项符合就返回true，否则返回false，找到后就停止遍历。
6. every：数组中所有项都符合要求才返回true，否则返回false，有一项不满足就停止遍历。

::: warning
需要注意：Array.from和Array.of都不是数组原型上的方法，是类的静态方法。
:::
```js
const arr = Array.of('a', 123, true);
console.log(arr); // [ 'a', 123, true ]
```
### Array.from
`arguments`对象转数组：
```js
function sum() {
    return Array.from(arguments).reduce((pre, cur) => pre + cur, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15
```
字符串转数组：
```js
const str = 'hello';
console.log(Array.from(str)); // [ 'h', 'e', 'l', 'l', 'o' ]
```
NodeList转数组：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <ul>
        <li>篮球</li>
        <li>足球</li>
        <li>乒乓球</li>
    </ul>
    <script>
        const liList = document.querySelectorAll('li');
        // Array.from的第二个参数相当于数组的map方法
        const res = Array.from(liList, item => item.textContent);
        console.log(res); // ["篮球", "足球", "乒乓球"]
    </script>
</body>
</html>
```
### Array.of
Array.of方法主要用来弥补new Array()方式的不足。
new Array()方法根据传入参数的不同其表现形式是不一样的，而Array.of不管传入的参数个数是多少，返回的都是由参数组成的数组。
![](https://github.com/liujie2019/static_data/blob/master/img/20191223224238.png?raw=true)
### find(返回找到的元素)
```js
const arr = [6, 4, 8];

// 找到后停止遍历
const res = arr.find(item => {
    console.log(item); // 6 4
    return item === 4;
});
console.log(res); // 4
```
### findIndex(返回找到的元素的下标)
```js
const arr = [6, 4, 8];
// 找到后停止遍历
const res = arr.findIndex(item => {
    console.log(item); // 6 4
    return item === 4;
});
console.log(res); // 1
```
### some
```js
const arr = [6, 4, 8];

arr.some(item => {
    console.log(item); // 6
    // 找到符合要求的元素就停止遍历
    if (item > 5) {
        return true;
    }
    return false;
});
```
### every
```js
const arr = [6, 4, 8];

arr.every(item => {
    console.log(item); // 6 4
    // 有一项不符合要求就停止遍历
    if (item > 5) {
        return true;
    }
    return false;
});
```
### Array.prototype.entries()
Array.prototype.entries方法返回的是一个遍历器对象。类似的，Array.prototype.keys和Array.prototype.values都是返回的遍历器对象。
## 扩展运算符
作用：
* 快速生成一个新的数组
* 将类数组或者字符串转为数组
* 将数组参数快速扩展到数组或者函数参数中

### 扩展运算符在数组中的应用
```js
const arr = [1, 2, 3];
const arr2 = [4, 5, 6];

const all = [...arr, 10, ...arr2];
console.log(all); // [ 1, 2, 3, 10, 4, 5, 6 ]
// 这里的赋值是将all的地址值赋值给all2，导致all2改了，all也会变化
const all2 = all;
console.log(all2); // [ 1, 2, 3, 10, 4, 5, 6 ]
all2[0] = 100;
console.log(all2); // [ 100, 2, 3, 10, 4, 5, 6 ]
console.log(all); // [ 100, 2, 3, 10, 4, 5, 6 ]
```
```js
const arr = [1, 2, 3];
const arr2 = [4, 5, 6];

const all = [...arr, 10, ...arr2];
console.log(all); // [ 1, 2, 3, 10, 4, 5, 6 ]
// 这里all2是基于all生成的新数组(concat方法会返回一个新的数组)
// const all2 = [].concat(all);
// 也可以基于扩展运算符来生成一个新的数组
const all2 = [...all];
console.log(all2); // [ 1, 2, 3, 10, 4, 5, 6 ]
all2[0] = 100;
console.log(all2); // [ 100, 2, 3, 10, 4, 5, 6 ]
console.log(all); // [ 1, 2, 3, 10, 4, 5, 6 ]
```
实现数组元素的删除：
```js
const person = [
    {name: 'lisi', age: 22},
    {name: 'wangwu', age: 23},
    {name: 'zhaoliu', age: 24}
];

const deleteIndex = person.findIndex(({name}) => name === 'wangwu');
console.log(deleteIndex); // 1
// slice方法不改变原数组，是基于原数组生成一个新的数组
const newPersons = [...person.slice(0, deleteIndex), ...person.slice(deleteIndex + 1)];
console.log(newPersons); // [ { name: 'lisi', age: 22 }, { name: 'zhaoliu', age: 24 } ]

// 当然也可以使用splice方法删除对应元素，但是会改变原数组。
console.log(person); // [ { name: 'lisi', age: 22 },{ name: 'wangwu', age: 23 },{ name: 'zhaoliu', age: 24 } ]
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        body {
            background-color: aqua;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
            color: pink;
            text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
        }
        .head span {
            cursor: pointer;
            display: inline-block;
            transition: transform 0.5s;
        }
        .head span:hover {
            transform: translateY(-30px) rotate(20deg) scale(2);
        }
    </style>
</head>
<body>
    <h2 class="head">HelloWorld!</h2>
    <script>
        const head = document.querySelector('.head');
        head.innerHTML = warpWithSpan(head.textContent);
        function warpWithSpan(str) {
            return [...str].map(letter => `<span>${letter}</span>`).join('');
        }
    </script>
</body>
</html>
```
### 扩展运算符在函数中的应用
```js
const arr = [1, 2, 3];
const arr2 = [4, 5, 6];

// arr2.push(arr);
// console.log(arr2); // [ 4, 5, 6, [ 1, 2, 3 ] ]

arr2.push.apply(arr2, arr);
console.log(arr2); // [ 4, 5, 6, 1, 2, 3 ]
```
```js
const arr = [1, 2, 3];
const arr2 = [4, 5, 6];

// 基于扩展运算符给push函数传递参数
arr2.push(...arr);
console.log(arr2); // [ 4, 5, 6, 1, 2, 3 ]
```
```js
const dateFilds = [2019, 12, 23, 23, 40, 50];
const date = new Date(...dateFilds);
console.log(date); // 2020-01-23T15:40:50.000Z
```
## 对象
### 对象字面量简写
```js
const keys = ['name', 'age'];
const values = ['lisi', 12];

const person = {
    [keys.shift()]: values.shift(),
    [keys.shift()]: values.shift()
};
console.log(person); // { name: 'lisi', age: 12 }
```
### 对象扩展
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