---
title: ES6使用技巧
---
### 1. 交换元素
利用数组解构来实现值的互换
```js
let a = 'world', b = 'hello'
[a, b] = [b, a]
console.log(a) // -> hello
console.log(b) // -> world
```
### 2. 调试
我们经常使用`console.log`来进行调试，`console.table`也可以。
```js
const a = 5, b = 6, c = 7
console.log({ a, b, c });
console.table({a, b, c, m: {name: 'xixi', age: 27}})
```
### 3. 单条语句
ES6中操作数组的语句将会更加的紧凑
```js
// 寻找数组中的最大值
const max = (arr) => Math.max(...arr);
max([123, 321, 32]) // outputs: 321
// 计算数组的总和
const sum = (arr) => arr.reduce((a, b) => (a + b), 0)
sum([1, 2, 3, 4]) // output: 10
```
### 4. 数组拼接
展开运算符可以取代concat的地位了
```js
const one = ['a', 'b', 'c']
const two = ['d', 'e', 'f']
const three = ['g', 'h', 'i']

const result = [...one, ...two, ...three]
```
### 5. 制作副本
我们可以很容易的实现数组和对象的浅拷贝拷贝
```js
const obj = { ...oldObj }
const arr = [ ...oldArr ]
拷贝 = 深拷贝 ? 浅拷贝 ？
好像有些朋友对这里我说的浅拷贝有些质疑，我也能理解大家所说的。下面数组为例：

// 数组元素为简单数据类型非引用类型
const arr = [1, 2, 3, 4];
const newArr = [...arr];
// 数组元素为引用类型
const person01 = {name: 'name01', age: 1};
const person02 = {name: 'name01', age: 2};
const person03 = {name: 'name03', age: 3};

const arr = [person01, person02, person03];
const newArr = [...arr];
console.log(newArr[0] === person01);
// true
```
### 6. 命名参数
解构使得函数声明和函数的调用更加可读
```js
// 我们尝尝使用的写法
const getStuffNotBad = (id, force, verbose) => {
  ...do stuff
}
getStuffNotBad(150, true, true);

const getStuffAwesome = ({id, name, force, verbose}) => {
  // ...do stuff
}
// 完美
getStuffAwesome({ id: 150, force: true, verbose: true })
```
### 7. Async/Await结合数组解构
数组解构非常赞!结合Promise.all和解构和await会使代码变得更加的简洁
```js
const [user, account] = await Promise.all([
  fetch('/user'),
  fetch('/account')
])
```
### 8. **(幂运算)操作符
```js
2 ** 3; // 8
//相当于
Math.pow(2, 3); // 8
```
```js
// **运算符是右结合的
2 ** 2 ** 0 // 2
// 上述代码相当于
2 ** (2 ** 0)
(2 ** 2) ** 0 // 1
```