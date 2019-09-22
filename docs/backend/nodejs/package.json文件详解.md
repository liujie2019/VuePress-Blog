---
title: package.json文件详解
---
## 概述
每个项目的根目录下，一般都有一个`package.json`文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。`npm install`命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境。

下面是一个最简单的`package.json`文件，只定义两项元数据：项目名称和项目版本。
```js
{
  "name" : "xxx",
  "version" : "0.0.0",
}
```
`package.json`文件就是一个`JSON`对象，该对象的每一个成员就是当前项目的一项设置。比如`name`就是项目名称，`version`是版本（遵守`大版本.次要版本.小版本`的格式）。
>下面是一个更完整的`package.json`文件：
```js
{
	"name": "Hello World",
	"version": "0.0.1",
	"author": "张三",
	"description": "第一个node.js程序",
	"keywords":["node.js","javascript"],
	"repository": {
		"type": "git",
		"url": "https://path/to/url"
	},
	"license":"MIT",
	"engines": {"node": "0.10.x"},
	"bugs":{"url":"http://path/to/bug","email":"bug@example.com"},
	"contributors":[{"name":"李四","email":"lisi@example.com"}],
	"scripts": {
		"start": "node index.js"
	},
	"dependencies": {
		"express": "latest",
		"mongoose": "~3.8.3",
		"handlebars-runtime": "~1.0.12",
		"express3-handlebars": "~0.5.0",
		"MD5": "~1.2.0"
	},
	"devDependencies": {
		"bower": "~1.2.8",
		"grunt": "~0.4.1",
		"grunt-contrib-concat": "~0.3.0",
		"grunt-contrib-jshint": "~0.7.2",
		"grunt-contrib-uglify": "~0.2.7",
		"grunt-contrib-clean": "~0.5.0",
		"browserify": "2.36.1",
		"grunt-browserify": "~1.3.0",
	}
}
```
>下面详细解释`package.json`文件的各个字段：

### scripts字段
`scripts`指定了运行脚本命令的`npm`命令行缩写，比如`start`指定了运行`npm run start`时，所要执行的命令。

下面的设置指定了`npm run preinstall、npm run postinstall、npm run start、npm run test`时，所要执行的命令。
```js
"scripts": {
    "preinstall": "echo here it comes!",
    "postinstall": "echo there it goes!",
    "start": "node index.js",
    "test": "tap test/*.js"
}
```
### dependencies和devDependencies

* `dependencies`字段指定了项目运行所依赖的模块；
* `devDependencies`指定项目开发所需要的模块。

它们都指向一个对象。该对象的各个成员，分别由模块名和对应的版本要求组成，表示依赖的模块及其版本范围。
```js
{
  "devDependencies": {
    "browserify": "~13.0.0",
    "karma-browserify": "~5.0.1"
  }
}
```
对应的版本可以加上各种限定，主要有以下几种：

* **指定版本**：比如`1.2.2`，遵循“**大版本.次要版本.小版本**”的格式规定，安装时只安装指定版本；
* **波浪号(tilde)+指定版本**：比如`~1.2.2`，表示安装`1.2.x`的最新版本（不低于`1.2.2`），但是不安装`1.3.x`，也就是说安装时不改变大版本号和次要版本号；
* **插入号(caret)+指定版本**：比如`ˆ1.2.2`，表示安装`1.x.x`的最新版本（不低于`1.2.2`），但是不安装`2.x.x`，也就是说安装时不改变大版本号。需要注意的是：**如果大版本号为0，则插入号的行为与波浪号相同**。这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。
* **latest**：安装最新版本。

>`package.json`文件可以手工编写，也可以使用`npm init`命令自动生成。
```js
npm init
```
这个命令采用互动方式，要求用户回答一些问题，然后在当前目录生成一个基本的`package.json`文件。所有问题之中，只有项目名称（`name`）和项目版本（`version`）是必填的，其他都是选填的。
```js
// 或者采用
npm init -y
```
有了`package.json`文件，直接使用`npm install`命令，就会在当前目录中安装所需要的模块。
```js
npm install
```
如果一个模块不在`package.json`文件之中，可以单独安装这个模块，并使用相应的参数，将其写入`package.json`文件之中。
```js
npm install express --save
npm install express --save-dev
```
>上面代码表示单独安装`express`模块，`--save`参数表示将该模块写入`dependencies`属性，`--save-dev`表示将该模块写入`devDependencies`属性。

### peerDependencies
有时，我们的项目和所依赖的模块，都会**同时依赖另一个模块**，但是所依赖的版本不一样。比如：我们的项目依赖`A`模块和`B`模块的`1.0`版，而`A`模块本身又依赖`B`模块的`2.0`版。

大多数情况下，这不构成问题，`B`模块的两个版本可以并存，同时运行。但是，有一种情况会出现问题，就是这种依赖关系将暴露给用户。

最典型的场景就是插件，比如`A`模块是`B`模块的插件。用户安装的`B`模块是`1.0`版本，但是`A`插件只能和`2.0`版本的`B`模块一起使用。这时，用户要是将`1.0`版本的`B`的实例传给`A`，就会出现问题。因此，需要一种机制，在模板安装的时候提醒用户，如果`A和B`一起安装，那么`B`必须是`2.0`模块。

>**peerDependencies字段，就是用来供插件指定其所需要的主工具的版本。**
```js
{
  "name": "chai-as-promised",
  "peerDependencies": {
    "chai": "1.x"
  }
}
```
上面代码指定，安装`chai-as-promised`模块时，主程序`chai`必须一起安装，而且`chai`的版本必须是`1.x`。如果你的项目指定的依赖是`chai`的`2.0`版本，就会报错。

>注意：从`npm 3.0`版开始，`peerDependencies`不再会默认安装了。

### bin字段
许多包有一个或多个可执行文件希望被安装到系统路径。在`npm`下要这么做非常容易(事实上，`npm`就是这么运行的)。

这需要在`package.json`中提供一个`bin`字段，它是一个命令名和本地文件名的映射。在安装时，如果是全局安装，`npm`将会使用**符号链接**把这些文件链接到`prefix/bin`；如果是本地安装，会链接到`./node_modules/.bin/`。

比如，要使用`myapp`作为命令时可以这么做：
```js
{
	"bin" : {
	 	"myapp" : "./cli.js"
	}
}
```
这么一来，当我们安装`myapp`，`npm`会从`cli.js`文件创建一个到`/usr/local/bin/myapp`的符号链接(这使你可以直接在命令行执行`myapp`)。
`bin`项用来指定各个内部命令对应的可执行文件的位置。
```js
"bin": {
  "someTool": "./bin/someTool.js"
}
```
上面代码指定，`someTool`命令对应的可执行文件为`bin`子目录下的 `someTool.js`。Npm会寻找这个文件，在`node_modules/.bin/`目录下建立符号链接。在上面的例子中，`someTool.js`会建立符号链接`npm_modules/.bin/someTool`。由于`node_modules/.bin/`目录会在运行时加入系统的`PATH`变量，因此在运行`npm`时，就可以不带路径，直接通过命令来调用这些脚本。

因此，像下面这样的写法可以采用简写。
```js
scripts: {
  start: './node_modules/someTool/someTool.js build'
}

// 简写为
scripts: {
  start: 'someTool build'
}
```

所有`node_modules/.bin/`目录下的命令，都可以用`npm run [命令]`的格式运行。在命令行下，键入`npm run`，然后按`tab`键，就会显示所有可以使用的命令。

### main字段
`main`字段指定了加载的入口文件，`require('moduleName')`就会加载这个文件。这个字段的默认值是模块根目录下面的`index.js`。

### config字段
`config`字段用于添加命令行的环境变量。

下面是一个`package.json`文件。
```js
{
  "name" : "foo",
  "config" : { "port" : "8080" },
  "scripts" : { "start" : "node server.js" }
}
```
然后，在`server.js`脚本就可以引用`config`字段的值。
```js
http
  .createServer(...)
  .listen(process.env.npm_package_config_port)
```
用户执行`npm run start`命令时，这个脚本就可以得到值。
```js
npm run start
```
用户可以改变这个值。
```js
npm config set foo:port 80
```
### browser字段
`browser`指定该模板供浏览器使用的版本。`Browserify`这样的浏览器打包工具，通过它就知道该打包那个文件。
```js
"browser": {
  "tipso": "./node_modules/tipso/src/tipso.js"
}
```
### engines字段
`engines`字段指明了该模块运行的平台，比如`Node`的某个版本或者浏览器。
```js
{ "engines" : { "node" : ">=0.10.3 <0.12" } }
```
该字段也可以指定适用的`npm`版本。
```js
{ "engines" : { "npm" : "~1.0.20" } }
```
### man字段
`man`用来指定当前模块的`man`文档的位置。
```js
"man" :[ "./doc/calc.1" ]
```
### preferGlobal字段
`preferGlobal`的值是布尔值，表示当用户不将该模块安装为全局模块时（即不用–global参数），要不要显示警告，表示该模块的本意就是安装为全局模块。

### style字段
`style`指定供浏览器使用时，样式文件所在的位置。样式文件打包工具`parcelify`，通过它知道样式文件的打包位置。
```js
"style": [
  "./node_modules/tipso/src/tipso.css"
]
```

## 参考文档
1. [npm package.json属性详解](https://www.cnblogs.com/tzyy/p/5193811.html#_h1_1)
2. [(译)package.json详解](https://www.cnblogs.com/nullcc/p/5829218.html)
3. [【npm】伙计，给我来一杯package.json！不加糖](https://www.cnblogs.com/penghuwan/p/7134046.html)
4. [对package.json的理解和学习](https://www.cnblogs.com/whkl-m/p/6617540.html)