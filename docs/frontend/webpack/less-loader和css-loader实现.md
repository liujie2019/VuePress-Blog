---
title: less-loader、css-loader和style-loader实现
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::

## 装包
```js
yarn add less
```
在loaders目录下，分别创建my-style-loader.js、my-css-loader.js、my-less-loader.js。
my-style-loader.js：
```js
const loaderUtils = require('loader-utils');
function loader(source) {
    // 最后一个loader要返回一个脚本
    const str = `
        const style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(style);
    `;
    return str;
}

// 在style-loader上写了pitch，有返回，后面的跳过，自己的写也不会执行
// remainingRequest：剩余的请求
loader.pitch = function (remainingRequest) {
    // /Users/xxxx/study/Blog/前端相关/Webpack学习总结/webpack4-study/code/webpack手写/less-loader&css-loader/loaders/my-css-loader.js!/Users/xxxx/study/Blog/前端相关/Webpack学习总结/webpack4-study/code/webpack手写/less-loader&css-loader/loaders/my-less-loader.js!/Users/liujie26/study/Blog/前端相关/Webpack学习总结/webpack4-study/code/webpack手写/less-loader&css-loader/src/style/index.less
    // 剩余的请求 my-css-loader!my-less-loader!./index.less
    // console.log(remainingRequest);
    // require路径 返回的就是css-loader处理好的结果require('!!css-loader!less-loader!./index.less')
    console.log(loaderUtils.stringifyRequest(this, '!!' + remainingRequest)); // "!!../../loaders/my-css-loader.js!../../loaders/my-less-loader.js!./index.less"
    const str = `
       let style = document.createElement('style')
       style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)})
       document.head.appendChild(style)
   `;
    // stringifyRequest方法用来将绝对路径转为相对路径
    return str;
}

module.exports = loader;
```
my-css-loader.js：
```js
function loader(source) {
    const reg = /url\((.+?)\)/g;
    let pos = 0;
    let current;
    let arr = ['let list = []'];
    while(current = reg.exec(source)) {
        const [matchUrl, g] = current;
        // console.log(matchUrl, g);// url('./avatar.jpg') './avatar.jpg'
        // 拿到css从开始到地址链接之前的部分的索引值
        let lastIndex = reg.lastIndex - matchUrl.length;
        arr.push(`list.push(${JSON.stringify(source.slice(pos, lastIndex))})`); // 获取css开始和地址之前的代码
        pos = reg.lastIndex;
        // 把g替换成require的写法
        arr.push(`list.push('url('+ require(${g}) +')')`); // 拼入图片地址
    }
    arr.push(`list.push(${JSON.stringify(source.slice(pos))})`); // 拼入地址到结尾的代码
    arr.push(`module.exports = list.join('')`);
    // console.log(arr.join('\r\n'));
    /**
    let list = []
    list.push("body {\n  background-color: green;\n  background: ")
    list.push('url('+ require('./avatar.jpg') +')')
    list.push(";\n}\n")
    module.exports = list.join('')
    */
    return arr.join('\r\n');
}

module.exports = loader;
```
my-less-loader.js：
```js
const less = require('less');

function loader(source) {
    let css = '';
    less.render(source, (err, output) => {
        css = output.css;
    });
    return css;
}

module.exports = loader;
```
webpack配置如下：
```js
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }, {
                test: /\.less$/,
                use: ['my-style-loader', 'my-css-loader', 'my-less-loader']
            }, {
                test: /\.(ico|gif|png|jpg|jpeg|webp)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100 * 1024 // 小于100k的图片采用base64编码
                    }
                }
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    }
};
```
index.js
```js
import './style/index.less';
```
index.less
```css
@color: green;
body {
    background-color: @color;
    background: url('./avatar.jpg')
}
```