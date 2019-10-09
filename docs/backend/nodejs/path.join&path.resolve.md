---
title: 路径相关总结
---
## 路径分类
node中的路径大致分5类，dirname，filename，process.cwd()，./，../，其中dirname，filename，process.cwd()为绝对路径。

## path.join与path.resolve区别
### path.join
path.join()方法使用**平台特定的分隔符**作为定界符将所有给定的path片段连接在一起，然后规范化生成的路径。

零长度的path片段会被忽略。 如果连接的路径字符串是零长度的字符串，则返回 '.'，表示当前工作目录。
```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```
### path.resolve()
>path.resolve()方法将路径或路径片段的序列解析为绝对路径。除了根目录，该方法的返回值都不带尾部的斜杠。

给定的路径序列**从右到左进行处理**，每个后续的path前置，**直到构造出一个绝对路径**。 例如，给定的路径片段序列：/foo、 /bar、 baz，调用 path.resolve('/foo', '/bar', 'baz') 将返回 /bar/baz。

如果在处理完所有给定的path片段之后还未生成绝对路径，**则再加上当前工作目录(即__dirname)**。

生成的路径已规范化，并且除非将路径解析为根目录，否则将删除尾部斜杠。

零长度的path片段会被忽略。

如果没有传入path片段，则 path.resolve() 将返回当前工作目录的绝对路径。
```js
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
## demo
```js
const path = require('path');

const path1 = path.join(__dirname, '/static/test.js');
const path2 = path.join(__dirname, './static/test.js');
const path3 = path.join(__dirname, '/Demo', './static/test.js');
const path4 = path.resolve(__dirname, '/static/test.js');
const path5 = path.resolve(__dirname, './static/test.js');
const path6 = path.resolve(__dirname, '/Demo', './static/test.js');

console.log(path1); // /Users/liujie26/static/test.js
console.log(path2); // /Users/liujie26/static/test.js
console.log(path3); // /Users/liujie26/Demo/static/test.js
console.log(path4); // /static/test.js
console.log(path5); // /Users/liujie26/static/test.js
console.log(path6); // /Demo/static/test.js
```
## 两者区别

* join是把各个path片段简单连接在一起。
* resolve是解析路径并返回，直到

## 参考文档
1. [作为一个前端工程师也要掌握的几种文件路径知识](https://mp.weixin.qq.com/s/CPYa7YjQDJGYWzKwTox5Rg)