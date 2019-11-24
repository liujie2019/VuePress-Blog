---
title: webpack基础用法
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::
## webpack核心概念

* entry：指定打包入口
* output
    * 多入口的情况通过占位符来进行打包文件的区分
* mode
* module
* loaders
* plugins

### entry和output
```js
// 多入口的情况
const path = require('path');

module.exports = {
    entry: {
        main: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    mode: 'production'
};
```
### loaders
webpack开箱即用只支持js和json两种文件类型，通过loaders来支持其他文件类型并且把他们转化为有效的模块，并且可以添加到依赖图谱中。

loader本身就是一个函数，接受源文件作为参数，返回转换后的结果。
常见loader：

* babel-loader：转换ES6/ES7等js新特性语法
* css-loader：支持.css文件的加载和解析
* less-loader：将less文件转换成css
* ts-loader：将ts转换成js
* file-loader：进行图片、字体等的打包
* raw-loader：将文件以字符串的形式导入
* thread-loader：多进程打包js和css

### Plugins
插件用于bundle文件的优化，资源管理和环境变量注入，作用于整个构建过程。
### mode参数作用
mode用来指定当前的构建环境是：production、development还是none。
mode的内置函数功能：

| 选项        | 描述           |
| ------------- |:-------------:|
| development | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。这两个插件在开启模块热更新时有用，在命令行提示哪个模块更新了，以及模块路径是什么等。 |
| production | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 TerserPlugin |
| none | 不开启任何优化选项 |

## 文件指纹(就是文件名后缀)
![d4ff29b59bfb4a32340ad679ff17365a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1569)
文件指纹的好处：没有发生变更的文件可以利用浏览器缓存，提高页面的访问速度。
![68b453f852f80412740b1fc8dc66d54d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1570)
CSS文件一般采用contenthash。
![47829fa28b3b523441dc77713c8f0482.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1571)
![75983ed15b15e68ad06f288d8063818f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1572)
## 代码压缩
![52fa2b791eb09d0bf6a899942c4068f8.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1573)
![e0c79bff0ca60335c0f8fc69e54a9869.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1574)
![fa6e39e5e4af0a11cb3066dc21f12d5c.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1575)
## 自动清理构建目录产出
![ab556847e2a9b3509052da16737a8148.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1576)
## postcss自动补齐前缀
![a6f81d50280e1976f5d927d3245b70d1.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1577)
## 移动端css px转rem
![dfc08b6ce904b30529bec5ff9984bde6.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1578)
![0e529ab956bb714bafcd8975a8f4f51c.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1579)
## 静态资源内联
![1be9f06e4a8c64ac16bb299c5d460063.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1580)
## 多页面应用(MPA)打包
多页面应用优势：

* 各个页面之间是解耦的；
* 对SEO更加友好

![37036e52bbc508e97c7d6b0311c27cbb.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1591)
## 配置sourcemap
![ca7d8b1c1fdd9112814a319804568795.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1592)
线上环境一般不开启sourcemap，会暴露项目的源代码。
![cbdfea409f29553655613e0e647837bb.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1593)
各个source map关键字可以组合使用。

* eval：使用eval包裹模块代码，并使用sourceURL指定源码文件。
![7ce8c150f6b2d7d2e7560915a477f339.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1594)
* source-map：会生成单独的source map文件，并在打包后的文件(例如main.js)中指定使用哪个source map文件。

![498fe9721f49e2e6765e7126eb2f5118.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1596)
![03f6163369bc7678bf2a9c8d72276435.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1595)
* inline-source-map：不会生成单独的source map文件，source map文件的内容内联在打包后的文件中。因此，打包后的文件体积也会变大。
![a9b93ef271f17668c098b6da1df2f9f3.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1597)
![741356174fa7cdfab9b9e35301c44cee.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1598)
## 提取页面公共资源
![f671f2b579dab97b9658037d83fc69d4.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1599)
![2f951ea9ca26cfaa2ee5f6decb2b3123.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1600)
![e630a71e7f23860cb6b7c17ef5b5be74.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1601)
## tree shaking(摇树优化
![84d104e1d8008e62a092b0678a38d57a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1602)
![e999d863ceddb1fbb6701297d193095e.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1603)
![fa10ec17113fe0d7e2920d7c2701c08e.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1604)

tree shaking的代码不能有副作用，否则tree shaking会失效。
## ScopeHoisting使用和原理分析
![6010bbd6959760c20719b3756e9b381a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1605)
![008e6cfb8400f88b875fc4fd8d9cd5a4.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1606)
![28b950337adb8c56b38bb6436d1a72a6.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1607)
![be6aff96e796ccdef5f87eb667be1311.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1608)
## 代码分割和动态import
![8a8d8249b87f28a87ffab49ac1ebf514.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1609)
![e3e734b453aeb8e0c2eb5e2a3547dd96.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1610)
webpakc通过jsonp把需要懒加载的代码引入。
## webpack与eslint结合
![02f4bf2574216373486ce875cf84618f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1611)
![1a0d68349fad68c79256647d659eed24.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1612)
![3d2c32640ed62649a72fc25f4d659f4a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1613)
![bcbdda251bb1a3fded0c00290534c043.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1614)
## 方案二适合新项目，不适合老项目
因为老项目需要改动的点太多。
![5c11a4b059301c6be8e7cc1bba9823e8.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1615)
## webpack打包组件和基础库
![0973d7e21fc157fb440ecb002820846f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1616)
![15f8542c1bbf411e48db2dafaa54abfc.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1617)
![40636b004c5084f229c8cfaa47924682.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1618)
![4a4c6f8a18605bce94ee87d9b501c93f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1619)
![3686dea1b8d72ff997037cd955d86d3b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1620)

可以在script中配置一个prepublisj钩子，在运行npm publish的时候执行该钩子。
![d259907b45f879465c5e5e3de29c8c5b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1622)
![5fca3d1fb394bb62f69afa6acd174ccc.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1621)
