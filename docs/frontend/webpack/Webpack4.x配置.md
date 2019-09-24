---
title: Webpack4.x配置
---
`webpack`是一个强大的模块打包工具，之所以强大的一个原因在于它拥有灵活、丰富的插件机制。`webpack`本质上是一个打包工具，它会根据代码的内容解析模块依赖，帮助我们把多个模块的代码打包。`webpack`会把我们项目中使用到的多个代码模块（可以是不同文件类型），打包构建成项目运行仅需要的几个静态文件。

>webpack优势在于：

1. `webpack`是以`commonJS`的形式来书写脚本滴，但对`AMD/CMD`的支持也很全面，方便旧项目进行代码迁移；
2. 能被模块化的不仅仅是`JS`了；
3. 开发便捷，能替代部分`grunt/gulp`的工作，比如打包、压缩混淆、图片转`base64`等；
4. 扩展性强，插件机制完善。

## webpack核心概念
1. **Entry：** 入口文件配置，`Webpack`执行构建的第一步将从 `Entry`开始，可抽象成输入。
2. **Module：** 模块，在`Webpack`里一切皆模块，一个模块对应一个文件。`Webpack`会从配置的`Entry`开始递归找出所有依赖的模块。最常用的是`rules`配置项，功能是匹配对应的后缀，从而针对代码文件完成格式转换和压缩合并等指定的操作。
3. **Chunk：** 代码块，一个`Chunk`由多个模块组合而成，用于代码合并与分割。
4. **Loader：** 模块转换器，用于把模块原内容按照需求转换成新内容，配合`Module`模块中的`rules`中的配置项来使用。。
5. **Plugin：** 扩展插件，在`Webpack`构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
6. **Output：** 输出结果，在`Webpack`经过一系列处理并得出最终想要的代码后输出结果。

>特别注意：`webpack 4`不是必须要有配置文件。它将查找`./src/index.js`作为默认入口点。 而且，它会在`./dist/main.js`中输出模块包。

## webpack执行流程
webpack启动后会在entry里配置的module开始递归解析entry所依赖的所有module，每找到一个module, 就会根据配置的loader去找相应的转换规则，对module进行转换后，再解析当前module所依赖的module，这些模块会以entry为分组，一个entry和所有相依赖的module也就是一个chunk，最后webpack会把所有chunk转换成文件输出，在整个流程中webpack会在恰当的时机执行plugin的逻辑。

## 安装和使用
```js
// npm全局安装
npm install webpack webpack-cli -g

// yarn安装
yarn global add webpack webpack-cli

// 全局执行webpack命令
webpack --help

// 在项目目录中安装
npm install webpack webpack-cli -D
```
**特别注意：** `webpack-cli` 是使用 `webpack` 的命令行工具，在 `webpack4.x` 版本之后不再作为 `webpack` 的依赖了，我们使用时需要单独安装这个工具。

引入了`mode`配置项，开发者可在`none，development（开发 ） 以及 production（产品）`三种模式间选择。该配置项缺省情况下默认使用`production` 模式。

>**webpack4有两种模式：development和production，默认为production。**

```js
// 生产环境
webpack --mode production

// 开发环境
webpack --mode development
```
>**在`package.json`文件中的`scripts`字段中进行如下配置：**

```
"scripts": {
    "build": "webpack --mode production --config webpack.production.config.js",
    "dev": "webpack-dev-server --mode development --open"
  }
```
## 入口(entry)
webpack 在构建时需要有入口文件。webpack 会读取这个文件，并从它开始解析依赖，然后进行打包。`webpack4` 默认从项目根目录下的 `./src/index.js` 中加载入口模块。默认的入口文件就是 `./src/index.js`。

我们常见的项目中，如果是单页面应用，那么可能入口只有一个；如果是多个页面的项目，那么经常是一个页面会对应一个构建入口。

入口可以使用 `entry` 字段来进行配置，`webpack` 支持配置多个入口来进行构建：

```js
module.exports = {
  entry: './src/index.js'
}

// 上述配置等同于
module.exports = {
  entry: {
    main: './src/index.js'
  }
}

// 或者配置多个入口
module.exports = {
  entry: {
    foo: './src/page-foo.js',
    bar: './src/page-bar.js',
    // ...
  }
}

// 使用数组来对多个文件进行打包
// 可以理解为多个文件作为一个入口，webpack 会解析两个文件的依赖后进行打包
module.exports = {
  entry: {
    main: [
      './src/foo.js',
      './src/bar.js'
    ]
  }
}
```
## 输出(output)
webpack 的输出即指 webpack 最终构建出来的静态文件，可以看看上面 webpack 官方图片右侧的那些文件。当然，构建结果的文件名、路径等都是可以配置的，使用 `output` 字段：

```js
module.exports = {
  // ...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'http://cdn.eaxmple.com/assets/'
  },
}

// 或者多个入口生成不同文件
module.exports = {
  entry: {
    foo: './src/foo.js',
    bar: './src/bar.js',
  },
  output: {
    filename: '[name].js', //[name]是entry里的key
    path: __dirname + '/dist',
  },
}

// 路径中使用 hash，每次构建时会有一个不同 hash 值，避免发布新版本时线上使用浏览器缓存
module.exports = {
  // ...
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/[hash]',
  },
}
```
### publicPath属性
**publicPath属性：** 指定了在浏览器中用什么地址来引用静态文件，包括图片、js脚本以及css样式加载的地址，一般用于线上发布以及CDN部署的时候使用。具体例子如下：

```html
<link href="http://cdn.eaxmple.com/assets/main.css" rel="stylesheet"></head>
<body>
    <div id="root"></div>
	<script type="text/javascript" src="http://cdn.eaxmple.com/assets/bundle.7e74c10f3f0fabe41a65.js">
	</script>
</body>
```
之所以会自动使用`publicPath`属性中设置的值，主要在于使用了`html-webpack-plugin`插件来自动生成项目首页文件，这样一来，**link中的href属性和script中的src属性**都会被自动替换。
## 安装项目需要用到的工具包
### bable相关依赖包
```js
// 在项目目录下安装相关包
npm install babel-loader babel-core babel-preset-env babel-preset-react -D
```
### 在项目根目录新建`.babelrc`文件
进行如下配置：

```js
{
  "presets": ["env", "react"]
}
```
### 安装react相关工具包
```js
npm install --save-dev react react-dom
```
## loader
`webpack` 中提供一种处理多种文件格式的机制，便是使用 `loader`。我们可以把 `loader` 理解为是一个转换器，负责把某种文件格式的内容转换成 `webpack` 可以支持打包的模块。

在没有添加额外插件的情况下，webpack 会默认把所有依赖打包成 js 文件，如果入口文件依赖一个 `.hbs` 的模板文件以及一个 `.css` 的样式文件，那么我们需要 `handlebars-loader` 来处理 `.hbs` 文件，需要 `css-loader` 和 `style-loader`来处理 `.css` 文件，最终把不同格式的文件都解析成 `js` 代码，以便打包后在浏览器中运行。

当我们需要使用不同的 loader 来解析处理不同类型的文件时，我们可以在 `module.rules` 字段下来配置相关的规则。
### css相关loader
#### postcss-loader
`postcss-loader`用来自动给css属性加浏览器兼容性前缀。需要注意的是`webpack4.x`版本后，`postcss-loader`需要结合`postcss-cssnext`来使用，而不是`autoprefixer`。在此之前，需要先在根目录下创建一个`postcss.config.js`文件(类似于`.babelrc`文件)。

```js
// postcss.config.js相关配置
module.exports = {
    plugins: [
        require('postcss-cssnext')
    ]
}
```
```js
// 处理scss文件
// 特别注意除了安装sass-loader之外，还需要安装node-sass
npm install sass-loader node-sass postcss-loader postcss-cssnext -D
```
```js
// 相关配置
rules:[
    {
        test: /\.css$/,
        use: [
            'style-loader',
            {
                loader:'css-loader',
                options:{
                    modules:true, //css模块化
                    minimize: true //在开发环境下压缩css
                }
            }
        ],
        include: path.resolve(__dirname, 'src'), //限制范围，提高打包速度
        exclude: /node_modules/ //排除打包目录
    }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', {
            loader:'less-loader',
            options:{
                modifyVars:{
                    "color":"#ccc"  //设置变量
                }
            }
        }]
    },
    {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', {
                loader: 'postcss-loader',
                options: {
                    config: {
                      path: './postcss.config.js'//得在项目根目录创建此文件
                    }
                }
            }, 'sass-loader']
        }),
        include: path.resolve(__dirname, 'src'), //限制范围，提高打包速度
        exclude: /node_modules/ //排除打包目录
    }
]
```
## 处理图片
### file-loader和url-loader的区别
其实`url-loader`封装了`file-loader`。`url-loader`不依赖于`file-loader`。我们在使用`url-loader`的时候，只需要安装`url-loader`，因为`url-loader`内置了`file-loader`。

`url-loader`在处理图片资源时分两种情况：

1. **图片大小小于limit参数：**`url-loader`将会把文件转为base64编码字符串`DataURL`；
2. **图片大小大于limit参数：**`url-loader`会调用`file-loader`进行处理。

```js
// file-loader：在输出目录生成对应的图片，解决css等文件中引入图片路径的问题
{
    module:{
        rules:[
            {
                test: /\.(png|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    }
}

// url-loader
{
    module:{
        rules:[
            {
                test:/\.(jpg|gif|jpeg|gif|png)$/,
	            use:[
                    {
                        loader: 'url-loader',
                        options: {
                            outputPath: 'images/', // 图片会被打包在 dist/images 目录下
                            limit: 1024 * 10, //小于10kb进行base64转码引用
                            name: '[hash:8].[name].[ext]'//打包后图片的名称，在原图片名前加上8位hash值
                        }
                    }
                ]
            }
        ]
    }
}
```
## plugin
在 webpack 的构建流程中，plugin 用于处理更多其他的一些构建任务。可以这么理解，模块代码转换的工作由 loader 来处理，除此之外的其他任何工作都可以交由 plugin 来完成。

### extract-text-webpack-plugin
该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象。

```js
// 安装
npm install extract-text-webpack-plugin --save-dev 或 -D

// 特别注意：webpack4.x，现在要安装一下版本
npm install extract-text-webpack-plugin@next -D
```
```js
// 引入插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', {
                loader: 'postcss-loader',
                options: {
                    config: {
                      path: './postcss.config.js'//需要在项目根目录创建此文件
                    }
                }
            }, 'sass-loader']
        }),
        include: path.resolve(__dirname, 'src'), //限制范围，提高打包速度
        exclude: /node_modules/ //排除打包目录
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].css' //放到dist/css/下
    })
  ]
}
```
>**该插件有三个参数：**

* **use：** 指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader；
* **fallback：** 编译后用什么loader来提取css文件；
* **publicfile：** 用来覆盖项目路径,生成该css文件的文件路径
### uglifyjs-webpack-plugin(压缩js)
```js
// 如果是生产模式下，会自动压缩，不需要使用该插件进行压缩
webpack --mode production

// 开发环境下
// 安装该插件
npm install uglifyjs-webpack-plugin -D
// 引入插件
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
// 调用插件
plugins: [
    new UglifyjsWebpackPlugin()
]
```
### 清空打包输出目录
```
// 安装
npm install clean-webpack-plugin -D

// 引入插件
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 调用插件
new CleanWebpackPlugin('./dist/bundle.*.js')
```
###  DefinePlugin
`webpack.DefinePlugin`相当于是给配置环境定义了一组全局变量，业务代码可以直接使用定义在里面的变量。
### ProvidePlugin(自动加载模块，而不必到处import或require)
```js
new webpack.ProvidePlugin({
  identifier: 'module1',
  // ...
})
```
```js
// 自动加载lodash和jquery，可以将两个变量($和_)都指向对应的 node 模块：

new webpack.ProvidePlugin({
  $: 'jquery',
  _: 'lodash'
})
```
### copy-webpack-plugin(复制静态资源)
```js
// 安装
npm install copy-webpack-plugin

// 引入插件
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 调用
new CopyWebpackPlugin([
  {
    from: path.resolve(__dirname, 'static'),
    to: path.resolve(__dirname, 'pages/static'),
    ignore: ['.*']
  }
])
```
## webpack-dev-server配置
### 安装相应的依赖包
```js
// react-hot-loader用来支持react热加载
npm install webpack-dev-server react-hot-loader -D
```
### 配置文件中进行相关配置
```js
// 在webpack配置文件中添加devServer相应的配置
devServer: {
      contentBase: './dist',//本地服务器所加载的页面所在的目录
      historyApiFallback: true, // 不跳转
      inline: true, // 实时刷新,
      compress: true,
      port: 8088,
      hot: true // 热加载
}
```
>**还需要在`.babelrc`文件中进行插件项配置：**

```js
{
    "presets": ["env", "react"],
    "plugins": ["react-hot-loader/babel"] //新增加
}
```
## 配置文件
### 开发环境配置文件webpack.config.js
```js
// rules是一个规则数组，每一项是一个对象，配置loader
rules:[
    {
        test:'匹配文件正则',
        include:'在哪个目录匹配',
        exclude:'排除哪个目录',
        use:[
            //配置多个loader，从右往左依次执行
            {
                loader:"需要的loader",
                options:{
                    //loader的相关配置项
                }
            }
        ]
    }
]
```
```js
const path = require('path');
const webpack = require('webpack'); // 用于访问内置插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }, {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            }, {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        contentBase: './dist',//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true, //实时刷新,
        compress: true,
        port: 8088,
        hot: true //热加载
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        //每次打包都会先清除当前目录中dist目录下的文件
        new CleanWebpackPlugin('./dist/bundle.*.js'),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
    ],
    //由于压缩后的代码不易于定位错误, 配置该项后发生错误时即可采用source-map的形式直接显示你出错代码的位置
    devtool: 'eval-source-map',
    resolve: {
        //配置简写, 配置过后, 书写该文件路径的时候可以省略文件后缀。
        extensions: ['.js', '.jsx', '.coffee', '.css', './scss']
    }
};
```
### 生产环境配置文件`webpack.production.config.js`
```js
const path = require('path');
const webpack = require('webpack'); // 用于访问内置插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env', 'react']
                        }
                    }
                ]
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                              path: './postcss.config.js'  // 得在项目根目录创建此文件
                            }
                        }
                    }, 'sass-loader']
                }),
                include: path.resolve(__dirname, 'src'), //限制范围，提高打包速度
                exclude: /node_modules/ //排除打包目录
            }, {
                test: /\.html$/,
                use: {
                        loader: 'html-loader',
                        options: {
                            minimize: true
                        }
                }
            }, {
                test:/\.(jpg|gif|jpeg|gif|png)$/,
	            use:[
                    {
                        loader: 'url-loader',
                        options: {
                            outputPath: 'images/', // 图片会被打包在 dist/images 目录下
                            limit: 10240, //小于10kb进行base64转码引用
                            name: '[hash:8].[name].[ext]'//打包后图片的名称，在原图片名前加上8位hash值
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'webpack实战练习',
            template: './src/index.html'
        }),
        //每次打包都会先清除当前目录中dist目录下的文件
        new CleanWebpackPlugin('./dist/bundle.*.js'),
        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ],
    //由于压缩后的代码不易于定位错误, 配置该项后发生错误时即可采用source-map的形式直接显示你出错代码的位置
    devtool: 'eval-source-map',
    resolve: {
        //配置简写, 配置过后, 书写该文件路径的时候可以省略文件后缀。
        extensions: ['.js', '.jsx', '.coffee', '.css', '.scss']
    }
};
```
webpack 的配置其实是一个Node.js的脚本，这个脚本对外暴露一个配置对象，webpack 通过这个对象来读取相关的一些配置。因为是 Node.js 脚本，所以可玩性非常高，你可以使用任何的 Node.js 模块，如上述用到的 path 模块，当然第三方的模块也可以。

创建了 webpack.config.js 后再执行 webpack 命令，webpack 就会使用这个配置文件的配置了。

## 脚手架中的 webpack 配置
现今，大多数前端框架都提供了简单的工具来协助快速生成项目基础文件，一般都会包含项目使用的 webpack 的配置，如：

* [create-react-app](https://github.com/facebook/create-react-app)

create-react-app 的 webpack 配置在这个项目下：[react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts)。

* [vue-cli](https://github.com/vuejs/vue-cli/)

vue-cli 使用 webpack 模板生成的项目文件中，webpack 相关配置存放在 build 目录下。

* [angular/devkit/build-webpack](https://github.com/angular/devkit/tree/master/packages/angular_devkit/build_webpack)

通常 angular 的项目开发和生产的构建任务都是使用 angular-cli 来运行的，但 angular-cli 只是命令的使用接口，基础功能是由 [angular/devkit](https://github.com/angular/devkit)来实现的，webpack 的构建相关只是其中一部分，详细的配置可以参考[webpack-configs](https://github.com/angular/devkit/tree/master/packages/angular_devkit/build_webpack/src/angular-cli-files/models/webpack-configs)。

```js
// webpack.config.js
const path = require('path');  //引入node的path模块
const webpack = require('webpack'); //引入的webpack,使用lodash
const HtmlWebpackPlugin = require('html-webpack-plugin')  //将html打包
const ExtractTextPlugin = require('extract-text-webpack-plugin')     //打包的css拆分,将一部分抽离出来
const CopyWebpackPlugin = require('copy-webpack-plugin')
// console.log(path.resolve(__dirname,'dist')); //物理地址拼接
module.exports = {
    entry: './src/index.js', //入口文件  在vue-cli main.js
    output: {       //webpack如何输出
        path: path.resolve(__dirname, 'dist'), //定位，输出文件的目标路径
        filename: '[name].js'
    },
    module: {       //模块的相关配置
        rules: [     //根据文件的后缀提供一个loader,解析规则
            {
                test: /\.js$/,  //es6 => es5
                include: [
                    path.resolve(__dirname, 'src')
                ],
                // exclude:[], 不匹配选项（优先级高于test和include）
                use: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                    'css-loader',
                    'less-loader'
                    ]
                })
            },
            {       //图片loader
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader' //根据文件地址加载文件
                    }
                ]
            }
        ]
    },
    resolve: { //解析模块的可选项
        // modules: []//模块的查找目录 配置其他的css等文件
        extensions: ['.js', '.json', '.jsx','.less', '.css'], //用到文件的扩展名
        alias: { // 模快别名列表
            utils: path.resolve(__dirname,'src/utils')
        }
    },
    plugins: [  //插进的引用, 压缩，分离美化
        new ExtractTextPlugin('[name].css'),  //[name] 默认  也可以自定义name  声明使用
        new HtmlWebpackPlugin({  //将模板的头部和尾部添加css和js模板,dist 目录发布到服务器上，项目包。可以直接上线
            file: 'index.html', //打造单页面运用 最后运行的不是这个
            template: 'src/index.html'  //vue-cli放在跟目录下
        }),
        new CopyWebpackPlugin([  //src下其他的文件直接复制到dist目录下
            { from:'src/assets/favicon.ico',to: 'favicon.ico' }
        ]),
        new webpack.ProvidePlugin({  //引用框架 jquery  lodash工具库是很多组件会复用的，省去了import
            '_': 'lodash'  //引用webpack
        })
    ],
    devServer: {  //服务于webpack-dev-server  内部封装了一个express
        port: '8080',
        before(app) {
            app.get('/api/test.json', (req, res) => {
                res.json({
                    code: 200,
                    message: 'Hello World'
                })
            })
        }
    }

}
```
## cross-env(跨平台设置环境变量)
```bash
npm install --save-dev cross-env
```
```js
"scripts": {
    "build": "cross-env NODE_ENV=production webpack --config webpack.production.config.js --mode production",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --mode development --open",
    "dll": "webpack --config webpack_dll.config.js --mode development"
  }
```

## 参考文档
1. [webpack 4 教程](https://blog.zfanw.com/webpack-tutorial/#%E6%9F%A5%E7%9C%8B-webpack-%E7%89%88%E6%9C%AC)
2. [精读《webpack4.0 升级指南》](https://juejin.im/post/5aafc6846fb9a028d936f97c)
3. [手写一个webpack4.0配置](https://juejin.im/post/5b4609f5e51d4519596b66a7)
4. [webpack详解](https://juejin.im/post/5aa3d2056fb9a028c36868aa)
5. [webpack中文文档](https://webpack.docschina.org/plugins/provide-plugin/)
6. [Webpack 实用技巧高效实战](https://cloud.tencent.com/developer/article/1033564)
7. [玩转webpack（一）上篇：webpack的基本架构和构建流程](https://cloud.tencent.com/developer/article/1006353)
8. [玩转webpack（二）：webpack的核心对象](https://cloud.tencent.com/developer/article/1030740)
9. [Webpack 持久化缓存实践](https://cloud.tencent.com/developer/article/1037440)
10. [cross-env](https://www.npmjs.com/package/cross-env)
11. [webpack4 中文文档](http://webpack.css88.com/)
