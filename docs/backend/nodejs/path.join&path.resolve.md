---
title: 1. 路径知识点总结
---
## 路径分类
node中的路径大致分5类：
* dirname
* filename
* process.cwd()
* ./
* ../

上述路径中dirname、filename、process.cwd()都是绝对路径。

代码目录如下：
```js
├── path-test
│   ├── fs.js
│   └── path.js
└── spider
```
```js
// path.js
const path = require('path');
console.log(__dirname);
console.log(__filename);
console.log(process.cwd());
console.log(path.resolve('./'));
```
首先在Node目录下运行命令`node ./path-test/path.js`，结果如下：
```js
node ./path-test/path.js
/Users/liujie/study/Blog/前端相关/手写代码/Node/path-test
/Users/liujie/study/Blog/前端相关/手写代码/Node/path-test/path.js
/Users/liujie/study/Blog/前端相关/手写代码/Node
/Users/liujie/study/Blog/前端相关/手写代码/Node
```
然后/Node/path-test目录下运行命令`node path.js`，运行结果如下：
```js
node path.js
/Users/liujie/study/Blog/前端相关/手写代码/Node/path-test
/Users/liujie/study/Blog/前端相关/手写代码/Node/path-test/path.js
/Users/liujie/study/Blog/前端相关/手写代码/Node/path-test
/Users/liujie/study/Blog/前端相关/手写代码/Node/path-test
```
对比上述结果，**暂时**得到的结论是：

* __dirname: 返回当前被执行的js文件所在文件夹的绝对路径；
* __filename: 返回当前被执行的js文件的绝对路径；
* process.cwd(): 返回运行node命令时所在的文件夹的绝对路径；
* ./: 跟process.cwd()一样，返回node命令时所在的文件夹的绝对路径。

```js
// fs.js
const fs = require('fs');

fs.readFile('./path.js', (err, data) => {
    console.log(data.toString());
});
```
执行命令`node ./path-test/fs.js`，会报错。因为当前是在./path-test目录下运行的node命令，会在./path-test目录下寻找`path.js`文件，那肯定是找不到的。

在path.js中添加如下代码：
```js
exports.a = 123;
```
fs.js代码修改为：
```js
const a = require('./path.js');
console.log(a);
```
执行命令`node ./path-test/fs.js`，结果如下：
```js
/Users/liujie26/study/Blog/前端相关/手写代码/Node/path-test
/Users/liujie26/study/Blog/前端相关/手写代码/Node/path-test/path.js
/Users/liujie26/study/Blog/前端相关/手写代码/Node
/Users/liujie26/study/Blog/前端相关/手写代码/Node
{ a: 123 }
```
从上述结果可以看出：`require('./path.js')`会执行path.js中的代码，而且能够正常执行。

::: tip
关于`./`正确的结论是：在require()中使用是跟__dirname的效果相同，不会因为启动脚本的目录不一样而改变，在其他情况下(例如fs.readFile('./path.js'))跟process.cwd()效果相同，是相对于启动脚本所在目录的路径。
:::

### 路径知识总结
* __dirname：获得当前执行文件所在目录的完整目录名；
* __filename：获得当前执行文件的带有完整绝对路径的文件名；
* process.cwd()：获得当前执行node命令时候的文件夹目录名；
*./：不使用require时候，./与process.cwd()一样，使用require时候，与__dirname一样。

只有在require()时才使用相对路径(./, ../) 的写法，其他地方一律使用绝对路径，如下代码所示：
```js
// 当前目录下
path.dirname(__filename) + '/path.js';
// 相邻目录下
path.resolve(__dirname, '../regx/regx.js');
```
## path.normalize
path.normalize作用：规范化路径，把不规范的路径规范化。
```js
const path = require('path');

console.log(path.normalize('/Users/liujie//study/Blog/前端相关/手写代码/Node/..'));
// 结果：/Users/liujie/study/Blog/前端相关/手写代码
```
## path.join
path.join()方法使用**平台特定的分隔符**作为定界符将所有给定的path片段连接在一起，然后规范化生成的路径。

零长度的path片段会被忽略。 如果连接的路径字符串是零长度的字符串，则返回 '.'，表示当前工作目录。
```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```
## path.resolve
path.resolve方法将路径或路径片段的序列解析为绝对路径。除了根目录，该方法的返回值都不带尾部的斜杠。

给定的路径序列**从右到左进行处理**，每个后续的path前置，**直到构造出一个绝对路径**。 例如，给定的路径片段序列：/foo、 /bar、 baz，调用 path.resolve('/foo', '/bar', 'baz') 将返回 /bar/baz。如果在处理完所有给定的path片段之后还未生成绝对路径，**则再加上当前工作目录(即__dirname)**。

零长度的path片段会被忽略。

如果没有传入path片段，则path.resolve将返回当前工作目录的绝对路径。
```js
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
```js
const path = require('path');
console.log(path.resolve('/foo/bar', '/bar/faa', '..', 'a/../c')); // /bar/c
```
path.resolve就相当于是shell下面的cd操作，从左到右运行一遍`cd path`命令，最终获取的绝对路径/文件名，就是这个接口所返回的结果了。但是resolve操作和cd操作还是有区别的，resolve的路径可以没有，而且最后进入的可以是文件。具体cd步骤如下：
```bash
cd /foo/bar/ // 这是第一步，现在的位置是/foo/bar/
cd /bar/faa  // 这是第二步，这里和第一步有区别，他是从/进入的，也就是根目录，现在的位置是/bar/faa
cd ..  // 第三步，从faa退出来，现在的位置是/bar
cd a/../c // 第四步，进入a，然后在退出，再进入c，最后位置是/bar/c
```

### path.join与path.resolve区别
```js
const path = require('path');

const path1 = path.join(__dirname, '/static/test.js');
const path2 = path.join(__dirname, './static/test.js');
const path3 = path.join(__dirname, '/Demo', './static/test.js');
const path4 = path.resolve(__dirname, '/static/test.js');
const path5 = path.resolve(__dirname, './static/test.js');
const path6 = path.resolve(__dirname, '/Demo', './static/test.js');

console.log(path1); // /Users/liujie/static/test.js
console.log(path2); // /Users/liujie/static/test.js
console.log(path3); // /Users/liujie/Demo/static/test.js
console.log(path4); // /static/test.js
console.log(path5); // /Users/liujie/static/test.js
console.log(path6); // /Demo/static/test.js
```
* join是把各个path片段简单连接在一起。
* resolve把`／`当成根目录，解析路径并返回。

## 参考文档
1. [作为一个前端工程师也要掌握的几种文件路径知识](https://juejin.im/post/5d1a3328e51d4510727c80e4)