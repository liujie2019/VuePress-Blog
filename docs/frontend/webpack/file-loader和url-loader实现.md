---
title: file-loader和url-loader实现
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::

## 装包
```js
yarn add mime loader-utils
```
[mime](https://github.com/broofa/node-mime#readme)主要作用是：设置某种扩展名的文件的响应程序类型。

创建my-file-loader.js：
```js
const loaderUtils = require('loader-utils');

function loader(source) {
    // '[name].[ext]'
    const filename = loaderUtils.interpolateName(this, '[name].[hash:8].[ext]', {content: source});
    // 将文件发射出去
    this.emitFile(filename, source);
    // console.log('my-file-loader');
    return `module.exports='${filename}'`;
}
loader.raw = true; // 二进制
module.exports = loader;
```
<img :src="$withBase('/webpack/file-loader2.png')" alt="">

my-url-loader.js：
```js
// 拿到loader的参数 需要工具包loaderUtils
const loaderUtils = require('loader-utils');
const mime = require('mime');  // 作用是设置某种扩展名的文件的响应程序类型

function loader(source) {  // loader的参数就是源代码
    const {limit} = loaderUtils.getOptions(this);
    // console.log(this.resourcePath);
    // 如果图片小于limit，则使用base64编码
    if (limit && limit > source.length) {
        return `module.exports="data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
    } else {
        return require('./my-file-loader').call(this, source);
    }
}
loader.raw = true; // 二进制
module.exports = loader;
```
<img :src="$withBase('/webpack/url-loader2.png')" alt="">
<img :src="$withBase('/webpack/url-loader.png')" alt="">

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
                test: /\.(ico|gif|png|jpg|jpeg|webp)$/i,
                // use: 'my-file-loader'
                use: {
                    loader: 'my-url-loader',
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