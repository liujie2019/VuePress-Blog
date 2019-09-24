---
title: Webpack4.x配置总结
---
## 常用依赖
```bash
# css
npm i style-loader css-loader postcss-loader -D
# less
npm i less less-loader -D
# sass
npm i node-sass sass-loader -D
# es6
npm i babel-core babel-loader babel-preset-env -D
# 插件
npm install extract-text-webpack-plugin@next -D
npm i file-loader url-loader -D
npm i html-webpack-plugin -D
npm i clean-webpack-plugin -D
npm i copy-webpack-plugin -D
```
## 安装webpack
>webpack4把命令行工具抽离成了独立包webpack-cli：
```js
npm install webpack webpack-cli -D
```

## webpack4的零配置
项目中没有webpack.config.js情况下，命令行直接运行webpack，webpack4不再像webpack3一样，提示未找到配置文件：
<img :src="$withBase('/webpack/1.png')" alt="">
>而是提示：

<img :src="$withBase('/webpack/2.png')" alt="">
>修改后可以发现零配置下系统的默认配置为：

1. 入口文件为：`/src/index.js`，打包输出文件为：`/dist/main.js`；
2. 未传`--mode`参数时，默认是`--mode production`，会进行压缩混淆。传入`--mode development`指定为开发环境打包。
<img :src="$withBase('/webpack/3.png')" alt="">
<img :src="$withBase('/webpack/4.png')" alt="">

## webpack cli执行
如果命令行直接`webpack`会运行**全局安装**的`webpack`，如果想要运行当前目录下的`webpack`，可以采取以下方法，不嫌麻烦当然也可以每次都`./node_modules/.bin/webpack`：

### npx webpack
`npx`是`npm 5.2.0`及以上内置的包执行器，`npx webpack --mode development`会直接找项目的`/node_modules/.bin/`里面的命令执行，方便快捷。
### npm run dev
使用`npm`脚本，配置好之后直接`npm run xxx`
```js
// package.json
"scripts": {
    "dev": "webpack --mode development" // 启动开发环境
}
```
## 配置结构
>webpack.config.js:
```js
module.exports = {
    mode: 'development', // development|production
	entry: '', // 入口配置
	output: {}, // 输出配置
	module: {}, // 放置loader加载器，webpack本身只能打包commonjs规范的js文件，用于处理其他文件或语法
	plugins: [], // 插件，扩展功能
	// 以下内容进阶篇再涉及
	resolve: {}, // 为引入的模块起别名
	devServer: {} // webpack-dev-server
};
```
>[更多配置详见](https://webpack.docschina.org/configuration/#%2525E9%252580%252589%2525E9%2525A1%2525B9)

## 基本的项目脚手架功能
一个入口文件对应输出一个出口文件，因为太简单，不再赘述。这里讲下多对一、多对多。
这里涉及到`webpack`配置中的灵魂成员：`entry`及`output`。
### 多入一出
`entry`传入数组相当于将数组内所有文件都打包到`bundle.js`中。
```js
const path = require('path');

module.exports = {
	entry: ['./src/index.js', './src/index2.js'], // 入口文件
	output: {
		filename: 'bundle.js', // 打包输出文件名
		path: path.join(__dirname, './dist') // 打包输出路径（必须绝对路径，否则报错）
	}
};
```
### 5.3 多入多出

1. `entry`传入对象，`key`称之为`chunk`，将不同入口文件分别打包到不同的js；
2. `output.filename`改为用中括号占位来命名，从而生成多个文件，`name`是`entry`中各个`chunk`。
```js
const path = require('path');

module.exports = {
    entry: { //入口文件，传入对象，定义不同的chunk（如app, utils）
        app: './src/index.js',
        utils: './src/utils.js'
    },
    output: {
        // filename: 'bundle.js', // 此时因为有多个chunk，因此不能只定义一个输出文件，否则报错
        filename: '[name].[hash].js',
        path: path.join(__dirname, './dist')
    }
};
```
## 编译ES6
```js
npm install -D babel-core babel-loader babel-preset-env babel-preset-stage-0
```

* babel-core：核心包
* babel-loader
* babel-preset-env：定案内语法编译(babel-preset-es2015已废弃)
* babel-preset-stage-0：预案内语法编译
>新建`.babelrc`文件
```js
{
    //【重要】顺序右到左，先处理高级或特殊语法
    "presets": ["env", "stage-0"]
}
```
```js
// webpack.config.js
module: {
	rules: [
		{
	        test: /\.js$/,
	        exclude: /node_modules/, //忽略node_modules目录
	        include: /src/, //只处理src目录
	        use: {
	            loader: 'babel-loader'
            }
        }
	]
}
```
## 处理css(内联)
处理`less和css`等非`js`资源，需要安装相对应的`loader`：

```js
// 处理其中的@import和url()
npm install -D css-loader
// 将css内联到页面中
npm install -D style-loader
// less编译，处理less文件
npm install -D less c
```
```js
// index.js
import './style/index.css';
import './style/test.less';

// webpack.config.js
module.exports = {
	...
	module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'less-loader']// 从右到左，loader安装后无需引入可直接使用
            }
        ]
    }
};
```
>如下图所示：最终`css`以`style`的形式内联进页面。

![0562c2f848ceb6889964963ac6d44405.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p42)
## 图片(字体/svg)处理
对于图片、字体这些资源的处理。我们希望做到：

1. 图片能正确被`webpack`打包，小于一定大小的图片直接`base64`内联；
2. 打包之后各个入口（css/js/html）还能正常访问到图片，图片引用路径不乱。
>以下以图片为例：
```js
// 安装对应的loader
npm install -D url-loader file-loader
```
>`url-loader`: 小于`limit`值时，直接`base64`内联，大于`limit`不处理，直接扔给`file-loader`处理，不装直接报错，之前还以为会自动调用，所以这两者都得装上。

### 不同入口（css/js/html）引用图片
#### html
`html`模板文件通过`html-wepback-plugin`生成的，如果希望`webpack`能够正确处理打包之后图片的引用路径，需要在模板文件中这样引用图片。
```html
// 正确：会交给url-loader 或 file-loader
// require让图片和html产生依赖引用关系
<img src="<%= require('./images/sett1.png') %>" alt="">

// 错误：原样输出，不做任何处理
<img src="./images/sett1.png" alt="">
```
#### css
```css
/* 图片作为背景图 */
#main {
    background: url("../images/test.jpg") #999;
    color: #fff
}
```
#### js
```js
// app.js
import sett1 from './images/test.png';
const img = document.createElement('img');
img.src = sett1;
document.body.appendChild(img);
```
### 配置
```js
// webpack.config.js
module.exports = {
	...
	modules: {
		rules: [
			{
				test: /\.(png|jpe?g|gif)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 1024 * 10, // 10k以下的base64内联，不产生图片文件
						fallback: 'file-loader', // 10k以上，用file-loader抽离（非必须，默认就是file-loader）
						name: '[name].[ext]?[hash]', // 文件名规则，默认是[hash].[ext]
						outputPath: 'images/', // 输出路径
						publicPath: ''  // 可访问到图片的引用路径(相对/绝对)
					}
				}
			}
		]
	}
};
```
>上述配置除了`limit`和`fallback`是`url-loader`的参数以外，其他配置项如`name`, `outputPath`都会透传给`file-loader`。

### 关于name, outputPath, publicPath
1. 图片最终的输出路径：`path.join(outputPath, name)`；
2. 图片的引用路径：指定了`publicPath`：`path.join(publicPath, name)`，这里会忽略掉`outputPath`；
否则用默认的`output.publicPath`：`path.join(__webpack_public_path__, outputPath, name)`。
### 打包
![735a036354c8eb870a18b2e7daad647b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p43)
![1ed05ab6f0f4e21b4a740cd0bfa23452.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p44)
>由上图可以发现，打包之后的css放在了style目录下(style.css)，与images不同级。导致无法正确访问到images目录下的图片。

要解决上面的问题，可以在抽离css时设定publicPath：
```js
extractCSS.extract({
	fallback: 'style-loader',
	use: 'css-loader',
	publicPath: '../' // 默认取output.publicPath
})
```
#### output.publicPath
`publicPath`的值会作为前缀附加在`loaders`生成的所有`URL`前面。
```js
output: {
     path: path.resolve(__dirname, 'dist'),
     filename: '[name].[chunkhash].js',
     publicPath: '../'
 }
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>webpack配置指南</title>
<link href="../style/style.css?cebba7d6ffb2308426a7" rel="stylesheet"></head>
<body>
<div class="box">
    hello webpack
</div>
<div class="container">
</div>
<script type="text/javascript" src="../app.e526cd961fd59aec06c2.js?cebba7d6ffb2308426a7"></script></body>
</html>
```
>比如上面的`images/mvvm.png`，如果设置了`output.publicPath:'../'`，那最终打包之后就会变成`../images/mvvm.png`。

`output.publicPath`指定了`output`目录的访问路径，也就是浏览器怎样找到`output`目录。比如设置了`output.publicPath:'../'`，就说明output目录在html所在目录的上一级。

如果这样设置的话，`css和html`的目录层级关系并不符合要求，所以单独在`extractCSS.extract`中设置`publicPath`起到了覆盖`output.publicPath`的作用。
## webpack-dev-server配置
### 依赖安装
```js
npm install -D webpack-dev-server
```
