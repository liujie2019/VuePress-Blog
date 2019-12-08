---
title: Node模块系统
---
## 基本规则
### 导出多个成员
main.js
```js
const testExports = require('./test');

console.log(testExports);
```
test.js
```js
const a = '123';
const add = (x, y) => x + y;

// exports.a = a;
// exports.add = add;
// 等价于
module.exports.a = a;
module.exports.add = add;
```
::: tip
总结：`module.exports`或者`exports`都是一个对象，我们可以通过多次为这个对象添加成员来实现对外导出多个内部成员。
:::

导出多个成员的另外一个方法：
```js
const a = '123';
const add = (x, y) => x + y;

module.exports = {
    a,
    add
};
```
### 导出单个成员
main.js
```js
const testExports = require('./test');

console.log(testExports);
```
test.js
```js
const a = '123';
module.exports = a;
// 这种写法不可以
exports = a;
```
需要注意：导出单个成员只能使用`module.exports`。

```js
const testExports = require('./test');
```
在导出多个成员时，`testExports`是一个对象，里面包含了导出的多个成员，想使用某个具体成员时，需要使用`testExports.成员名`的形式；导出单个成员时，导出什么，`testExports`就是什么，比如导出一个字符串，`testExports`就是字符串的值。

## 模块原理
### 原理解析(exports和module.exports区别)
```js
var module = {
    exports: {
        foo: 'bar',
        add: (x, y) => x + y;
    }
};
```
在Node中，每个模块内部都有一个自己的module对象，该module对象中，有一个exports成员也是一个对象。也就是说，如果我们需要对外导出成员，只需要把导出的成员挂载到`module.exports`中就可以了。因为，默认在代码的最后有一句：
```js
return module.exports;
```
通过require文件，就会得到该文件对应的`module.exports`对象。**一定要记住，最后`return`的是`module.exports`而不是`exports`，所以给`exports`重新赋值不管用**。**一定要记住，最后`return`的是`module.exports`而不是`exports`，所以给`exports`重新赋值不管用**。**一定要记住，最后`return`的是`module.exports`而不是`exports`，所以给`exports`重新赋值不管用**。

我们发现，每次导出内部成员的时候都通过`module.exports.xxx = xxx`的方式很麻烦，`.`的太多了
。所以，`Node`为了简化操作，专门提供了一个变量：`exports`，改变量等于`module.exports`。也就是说在模块中还有这么一句代码：
```js
// 即exports和module.exports指向相同的引用
var exports = module.exports;
```
```js
// test.js
console.log(exports === module.exports); // true
```
### demo说明
```js
// main.js
const testExports = require('./test');
console.log(testExports);
```
```js
// test.js
// console.log(exports === module.exports); // true

// exports.a = 123;
// module.exports.add = (x, y) => x + y;

// exports = {};
// exports.b = 456;

// module.exports = '断开联系';
// // 重新建立关系
// exports = module.exports;
exports.c = 789;
module.exports.fn = () => console.log(111);

// 给exports重新赋值，即断开exports和module.exports相同引用关系
// 此后再对exports增加成员或者修改其成员的值将跟module.exports没有关系
exports = {x: 222};
module.exports.c = 987;

// 这里并不会对module.exports造成影响
exports.d = 11111;
// 重新建立关系
exports = module.exports;
exports.fn = '我是一个变量';

// 结果：{ c: 987, fn: '我是一个变量' }
// 前面再牛逼，在这里都全部推翻了，重新赋值，最终得到的是[Function]
module.exports = () => console.log('我是一个函数');
```
### exports和export default区别

## 模块加载和导出
在Node中，**没有全局作用域**，**只有模块作用域**(简单来讲就是文件作用域)。模块作用域：文件外部访问不到内部，内部也访问不到外部。

在Node中，只能通过require方法来加载执行多个js脚本文件
。require加载只能是执行其中的代码，文件与文件之间由于是模块作用域，所以不会有污染的问题。

* 模块完全是封闭的
* 外部无法访问内部
* 内部也无法访问外部

模块作用域固然带来了一些好处，可以加载执行多个文件，可以完全避免变量命名冲突污染的问题。但是某些情况下，模块与模块之间是需要进行通信的，在每个模块中，都提供了一个对象：`exports`，默认是一个空对象；我们要做的就是把需要被外部访问的成员手动挂载到`exports`接口对象中。这样一来，require这个模块后，就可以得到模块内部的exports接口对象了。
### 加载和导出基本规则
```js
// a.js
var foo = 'aaa';
function add(a, b) {
    return a + b;
}
console.log('a start');
// require('./b.js'); // 加载并执行b.js
// require('b'); // 报错，表示引用核心模块
require('./b');  // 省略后缀名可以，默认是.js
console.log('a end');

// 虽然在a.js中加载并执行了b.js且b.js中也定义了变量foo，var foo = 'aaa';
// 但是a.js中的foo变量值并不会改变
console.log('foo的值是：', foo); // foo的值是： aaa
```
```js
// b.js
var foo = 'bbb';
// 执行node a.js，会报ReferenceError: add is not defined
// 也就说b.js中访问不到a.js中定义的函数
// console.log(add(1, 2));
console.log('b start');
require('./c.js'); // 加载并执行c.js
console.log('b end');
```
```js
// c.js
console.log('c start');
```
### 优先从缓存加载
```js
// main.js
// 加载并执行a.js
require('./a');

// 因为已经在a中加载过b了，在这里优先从缓存加载b.js，不会重复加载
// 可以拿到其中的接口对象，但是不会重复执行里面的代码
// 这样做的目的是为了避免重复加载，提高模块加载效率
const b = require('./b');
console.log(b);
```
```js
// a.js
console.log('a.js被加载了');
// 加载并执行b.js
const b = require('./b');

console.log(b);
```
```js
// b.js
console.log('b.js被加载了');

module.exports = () => console.log('我是一个函数');
```
## require标识符分析
* 核心模块(即node内置模块，如fs、path等)
    * 模块名
* 第三方模块(需要通过npm安装)
    * 模块名
* 用户自定义模块
    * 需要指定好模块路径

* 核心模块：核心模块的本质也是文件，只不过被编译到了二进制文件中了，我们只需要按照名字来加载就可以了。
* 第三方模块：凡是第三方模块都必须通过npm来下载安装，使用的时候就可以通过require('包名')的方式来进行加载才可以使用。

### 第三方模块加载规则
第三方模块既不是核心模块、也不是路径形式的模块(用户自定义模块)，且必须通过npm来下载。使用的时候就可以通过`require('包名')`的方式来进行加载才可以使用，不可能有任何一个第三方包和核心模块的名字是一样的。
```js
const template = require('art-template');
```

查找规则如下：

* 先找到当前文件所处目录中的node_modules目录；
* 找到node_modules/art-template;
* 找到node_modules/art-template/package.json;
* 找到node_modules/art-template/package.json文件中的main属性;
* main属性的值就是该模块的入口模块；
* 如果package.json文件不存在或者main属性指定的入口文件也是错的；
* 则node会自动找该目录下的index.js，也就是说index.js会作为一个默认备选项。
* 如果以上所有任何一个条件都不成立，则会进入上一级目录中的node_modules目录查找，规则如上；
* 如果上一级还没有找到，则继续往上上一级查找；直到找到当前磁盘根目录为止，还没找到则报错。

### 模块查找机制
* 优先从缓存加载；
* 核心模块
* 路径形式的文件模块
* 第三方模块
    * node_modules/art-template/
    * node_modules/art-template/package.json
    * node_modules/art-template/package.json main
    * index.js 备选项
    * 进入上一级目录找node_modules
    * 按照这个规则依次往上找，直到磁盘根目录还找不到，最后报错：Can not find moudle xxx

需要注意：我们一个项目有且只有一个`node_modules`，放在项目根目录中，这样的话项目中所有的子目录中的代码都可以加载到第三方包。
