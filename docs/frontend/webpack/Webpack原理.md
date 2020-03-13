---
title: Webpack原理
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::
[TOC]
## 基本概念
在学习Webpack原理前，我们需要掌握以下几个核心概念，以方便后面的理解：

* **Entry**：入口，Webpack执行构建的第一步将从`Entry`开始，可抽象成输入；
* **Module**：模块，在`Webpack`里一切皆模块，一个模块对应一个文件。`Webpack`会从配置的`Entry`开始，递归找出所有依赖的模块；
* **Chunk**：代码块，一个`Chunk`由多个模块组合而成，用于代码合并与分割；
* **Loader**：模块转换器，用于将模块的原内容按照需求转换成新内容；
* **Plugin**：扩展插件，在`Webpack`构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

## 流程概括
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. **初始化参数**：从配置文件和`Shell`语句中读取与合并参数，得出最终的参数；
2. **开始编译**：用上一步得到的参数初始化`Compiler`对象，加载所有配置的插件，通过执行对象的`run`方法开始执行编译；
3. **确定入口**：根据配置中的`entry`找出所有的入口文件；
4. **编译模块**：从入口文件出发，调用所有配置的`Loader`对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. **完成模块编译**：在经过第4步使用`Loader`翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. **输出资源**：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个`Chunk`转换成一个单独的文件加入到输出列表中，这是可以修改输出内容的最后机会；
7. **输出完成**：在确定好输出内容后，根据配置确定输出的路径和文件名，将文件的内容写入文件系统中。

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用`Webpack`提供的 API 改变 Webpack 的运行结果。

## 流程细节
Webpack 的构建流程可以分为以下三大阶段：
1. **初始化**：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2. **编译**：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
3. **输出**：将编译后的 Module 组合成 Chunk，将Chunk 转换成文件，输出到文件系统中。

如果只执行一次构建，以上阶段将会按照顺序各执行一次。但在开启监听模式下，流程将变为如下：
![dd23e0ad39a33fbd3d82332835fc6f0d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p103)
在每个大阶段中又会发生很多事件，Webpack 会将这些事件广播出来供`Plugin`使用，下面来一一介绍。

### 初始化阶段
![5e02721407ec083011da6e9018cec663.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p104)
### 编译阶段
![59ae734503c4e80839ab3e12ae177e43.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p105)

>在编译阶段中，最重要的要数 compilation 事件了，因为在 compilation 阶段调用了 Loader 完成了每个模块的转换操作，在 compilation 阶段又包括很多小的事件，它们分别是：

![e31d945ad2cc008e877e17a081422239.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p106)
### 输出阶段
![4878cb79aa108dec5e4674e7a67a2621.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p107)
>在输出阶段已经得到了各个模块经过转换后的结果和其依赖关系，并且把相关模块组合在一起形成一个个 Chunk。 在输出阶段会根据 Chunk 的类型，使用对应的模版生成最终要要输出的文件内容。

## 输出文件分析
```js
/******/ (function(modules) { // webpackBootstrap
            // modules即存放所有模块的数组，数组中的每个元素都是一个函数
/******/ 	// The module cache
            // 安装过的模块都存放在这里面
            // 作用是将已经加载过的模块缓存在内存中，提升性能
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
            // 去数组中加载一个模块，moduleId是要加载模块在数组中的index
            // 作用和Node.js中的require语句相似
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
                // 如果需要加载的模块已经被加载过，就直接从缓存中返回
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
                // 如果缓存中不存在需要加载的模块，就新建一个模块，并将它存在缓存中
/******/ 		var module = installedModules[moduleId] = {
                    // 模块在数组中的index
/******/ 			i: moduleId,
                    // 该模块是否已经加载完毕
/******/ 			l: false,
                    // 该模块的导出值
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
                // 从modules中获取index为moduleId的模块对应的函数
                // 再调用这个函数，同时将函数需要的参数传入
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
                // 将这个模块标记为已加载
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
                // 返回这个模块的导出值
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({
// modules其实就是一个对象，键是模块的路径，值就是模块的JS Function
/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("{test123567};console.log('hello webpack');\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });
```
以上看上去复杂的代码其实是一个立即执行函数，可以简写为如下：
```js
(function(modules) {

  // 模拟 require 语句
  function __webpack_require__() {
  }

  // 执行存放所有模块数组中的第0个模块
  __webpack_require__(0);

})([/*存放所有模块的数组*/])
```

## 参考文档
1. [Webpack运行机制](https://github.com/jerryOnlyZRJ/webpack-loader/blob/master/docs/webpack-principle.md)
2. [编写自定义webpack plugin](https://github.com/jerryOnlyZRJ/webpack-loader/blob/master/docs/webpack-plugin.md)
3. [编写自定义webpack loader](https://github.com/jerryOnlyZRJ/webpack-loader/blob/master/docs/webpack-loader.md)