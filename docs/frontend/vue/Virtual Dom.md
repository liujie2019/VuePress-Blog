---
title: Virtual Dom
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::
Virtual DOM是对DOM的抽象，本质上是JavaScript对象，这个对象就是更加轻量级的对DOM的描述。
## 为什么需要Virtual DOM
既然我们已经有了DOM,为什么还需要额外加一层抽象?

首先,我们都知道在前端性能优化的一个秘诀就是尽可能少地操作DOM,不仅仅是DOM相对较慢,更因为频繁变动DOM会造成浏览器的回流或者重回,这些都是性能的杀手,因此我们需要这一层抽象,在patch过程中尽可能地一次性将差异更新到DOM中,这样保证了DOM不会出现性能很差的情况.

其次,现代前端框架的一个基本要求就是无须手动操作DOM,一方面是因为手动操作DOM无法保证程序性能,多人协作的项目中如果review不严格,可能会有开发者写出性能较低的代码,另一方面更重要的是省略手动DOM操作可以大大提高开发效率.

最后,也是Virtual DOM最初的目的,就是更好的跨平台,比如Node.js就没有DOM,如果想实现SSR(服务端渲染),那么一个方式就是借助Virtual DOM,因为Virtual DOM本身是JavaScript对象.

## 参考文档
1. [snabbdom 源码阅读分析](https://github.com/steinslin/note/blob/master/2018-08-16__snabbdom%E9%98%85%E8%AF%BB.md)
2. [Vue 原理解读系列（一） 之 Virtual DOM and Diff](https://macsalvation.net/dive-deep-into-vue-part-1-vdom-and-diff/)
3. [虚拟DOM原理](https://www.cxymsg.com/guide/virtualDom.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81virtual-dom)
4. [Vitual DOM 的内部工作原理](https://efe.baidu.com/blog/the-inner-workings-of-virtual-dom/)