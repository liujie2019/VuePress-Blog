---
title: 编译和处理CSS
---
众所周知，在`HTML`中引入`CSS`的方法有`<link>`标签和`<style>`标签两种，下面结合`webpack`来实现以下功能：

1. 将`CSS`通过`link`标签引入；
2. 将`CSS`放在`style`标签里；
3. 动态加载和卸载`css`；
4. 页面加载`CSS`前的`transform`。

>安转需要用到的loader：
```js
npm install css-loader style-loader file-loader -D
```

## CSS通过<link>标签引入
通过`link`标签引用`css`文件，这需要借助`file-loader`来将`css`处理为文件。具体配置如下：
```js
const path = require('path');

module.exports = {
    mode: 'none',
    entry:  './src/index.js',
    output: {
        publicPath: __dirname + '/dist/', // js引用路径或者CDN地址
        path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader/url'
                    },
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    }
};
```
>入口文件index.js
```js
let clickFlag = false;
// 点击页面上的按钮后，页面会引入相应的样式
document.querySelector('#btn').addEventListener('click', () => {
    if (!clickFlag) {
        import('./style/common.css');
    }
});
```

>点击加载前：

![19e84b44805267e313ba1e75f31d923d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p549)
>点击加载后：

![23ad09ee062589d9a9ba24c147d6ba1a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p550)
>从上图可以看出，对应的css被插入了相应的`link`标签中。

## CSS放在<style>标签里
通常来说，`css`放在`style`标签里可以减少网络请求次数，缩短响应时间。需要注意的是，在老式`IE`浏览器中，对`style`标签的数量是有要求的。具体配置如下：
```js
const path = require('path');

module.exports = {
    mode: 'none',
    entry:  './src/index.js',
    output: {
        publicPath: __dirname + '/dist/', // js引用路径或者CDN地址
        path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            singleton: true // 处理为单个style标签
                        }
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    }
};
```
>点击加载前：

![19e84b44805267e313ba1e75f31d923d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p549)
>点击加载后：

![8dcb6fdf048f16348cfbfd88180c9131.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p551)

## 动态卸载和加载CSS
`style-loader`为`css`对象提供了`use()和unuse()`两个方法，借助这两个方法，可以方便快捷地加载和卸载`css`样式。具体配置如下：
```js
const path = require('path');

module.exports = {
    mode: 'none',
    entry:  './src/index.js',
    output: {
        publicPath: __dirname + '/dist/', // js引用路径或者CDN地址
        path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader/useable',
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    }
};
```
>入口文件:
```js
import style from './style/common.css';
let flag = false;
setInterval(() => {
    // use和unuse是style上的方法
    if (flag) {
        style.unuse();
    }
    else {
        style.use();
    }
    flag = !flag;
}, 1000);
```
样式不会添加在`import/require()`上，而是在调用`use/ref`时添加，在调用 `unuse/unref`时删除。

## 页面加载css前的transform
对于`css`的`transform`，简单来说：在加载`css`样式前，可以更改`css`。这样，方便开发者根据业务需要，对`css`进行相关处理。

需要对`style-loader`增加`options.transform`属性，值为指定的`js`文件，具体的`webpack.config.js`配置如下：
```js
const path = require('path');

module.exports = {
    mode: 'none',
    entry:  './src/index.js',
    output: {
        publicPath: __dirname + '/dist/', // js引用路径或者CDN地址
        path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            transform: './src/transform.js'
                        }
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    }
};
```
>transform.js
```js
module.exports = function (css) { // 传入的参数是css字符串本身
    console.log(css);
    const transformed = css.replace('yellow', 'green')
    // 如果屏幕宽度小于800，则替换背景颜色
    return window.innerWidth < 800 ? transformed : css;
}
```
>在index.js中引入`css`文件即可：
```js
import style from './style/common.css';
```
打开控制台，如下图所示，当屏幕宽度小于`800`时候，`css`中的`yellow`已经被替换为了`green`。
![6f6e00f1cbd90129d1e963a28403bfd7.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p552)
>需要注意的是：`transform`是在`css`引入前根据需要修改，所以之后是不会改变的。所以上方代码不是响应式，当把屏幕宽度拉长到大于`800`时候，依旧是绿色。重新刷新页面，才会是黄色。
