---
title: Vue之nextTick机制
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::
## Vue中DOM的异步更新策略(异步更新队列)
来看个🌰：
```js
const template = `
    <div>
        <h1 ref="title">{{num}}</h1>
        <button @click="handleClick">点击</button>
    </div>
`;
var app = new Vue({
    el: '#root',
    template,
    data() {
        return {
            num: 1
        }
    },
    methods: {
        handleClick() {
            this.num = 6;
            // DOM 还没有更新
            console.log(this.$refs.title.innerText); // 1
            // 虽然使用Vue.$nextTick()也可以，但是在组件内使用vm.$nextTick()实例方法特别方便，因为它不需要全局Vue，并且回调函数中的this将自动绑定到当前的 Vue 实例上
            this.$nextTick()
                .then(() => { // 该回调将在DOM更新后执行
                    // DOM 更新了
                    console.log(this.$refs.title.innerText); // 6
                });
        }
    }
})
```
如果不使用nextTick，获取到的结果是1而不是我们设置的6，这就说明Vue中DOM的更新是异步的。

Vue官方文档中是这样解释的：
::: tip
可能你还没有注意到，Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。**如果同一个 watcher 被多次触发，只会被推入到队列中一次**。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个事件循环的“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作，这也是一个“批处理”的过程。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。
:::

当我们设置`this.num = 6`，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环的“tick”中更新。大多数情况我们不需要关心这个过程，但是如果我们想要基于更新后的DOM状态来做点什么，这就可能会有些棘手。虽然Vue通常鼓励开发人员使用“数据驱动”的方式思考，避免直接接触DOM，但是有时我们必须要这么做。

为了在数据变化之后等待Vue完成更新 DOM，可以在数据变化之后立即使用 Vue.nextTick(callback)。这样回调函数将在DOM更新完成后被调用。
因为$nextTick()返回一个 Promise 对象，所以也可以使用新的ES2017 async/await语法完成相同的事情：
```js
async handleClick() {
    this.num = 8;
    // DOM 还没有更新
    console.log(this.$refs.title.innerText); // 2
    await this.$nextTick();
    // DOM 更新了
    console.log(this.$refs.title.innerText); // 6
}
```
## 静态方法Vue.nextTick挂载
Vue.nextTick定义于`src/core/global-api/index.js`:
```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // ...
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick
  // ...
}
```
我们很少在全局中使用nextTick处理业务，但要知道Vue在初始化globalApi的时候暴露了这个方法。
## 实例方法 Vue.prototype.$nextTick
构造函数位于src/core/instance/index.js:
```js
import { renderMixin } from './render'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```
在renderMixin(Vue)中定义了实例方法：
```js
export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }
  // ...
}
```
实例方法在我们的业务代码中相对常见。用来解决在数据发生变化后，立即获取DOM更新后的结果。

::: warning
注意：这里为callback传入了上下文this，也就是当前Vue实例。所以在下面的例子中可以直接访问Vue实例内容。
:::
```js
handleClick() {
    this.num = 6;
    // 虽然使用Vue.$nextTick()也可以，但是在组件内使用vm.$nextTick()实例方法特别方便，因为它不需要全局Vue，并且回调函数中的this将自动绑定到当前的Vue实例上
    this.$nextTick()
        .then(() => {
            console.log(this.$refs.title.innerText);
        });
}
```
## nextTick源码分析
源码详见：[next-tick.js](https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js)
这里是2.6.10版本：
```js
/* @flow */
/* globals MutationObserver */

// noop 空函数，可用作函数占位符
import { noop } from 'shared/util';
// Vue 内部的错误处理函数
import { handleError } from './error';
// 判断是否是IE/IOS/内置函数
import { isIE, isIOS, isNative } from './env';

// 使用 MicroTask 的标识符
export let isUsingMicroTask = false;

// 设置一个存放执行函数的数组
const callbacks = [];
// nextTick执行状态
let pending = false;

function flushCallbacks() {
  pending = false;
  // 将callbacks拷贝一份
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  // 循环遍历数组里面的函数，并且执行
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

/**
接下来是核心的 异步延迟函数。这里不同的 Vue 版本采用的策略其实并不相同。
2.6 版本优先使用 microtask 作为异步延迟包装器。
2.5 版本则是 macrotask 结合 microtask。然而，在重绘之前状态改变时会有小问题（如 ＃6813）。此外，在事件处理程序中使用 macrotask 会导致一些无法规避的奇怪行为（如＃7109，＃7153，＃7546，＃7834，＃8109）。
所以 2.6 版本现在又改用 microtask 了，为什么是又呢。因为2.4版本及之前也是用的 microtask。
microtask 在某些情况下也是会有问题的，因为 microtask 优先级比较高，事件会在顺序事件（如＃4521，＃6690 有变通方法）之间甚至在同一事件的冒泡过程中触发（＃6566）。
 */

// 核心的异步延迟函数，用于异步延迟调用 flushCallbacks 函数
let timerFunc;

/* istanbul ignore next, $flow-disable-line */

// 不同的 Vue 版本采用的策略其实并不相同。根据判断，在不同环境下使用不同的异步延迟函数

// nextTick采用了微任务队列，可以通过原生Promise.then或MutationObserver对其进行访问。
// timerFunc优先使用原生Promise
// 其实MutationObserver拥有更广泛的支持，但在 iOS >= 9.3.3 的 UIWebView 中，触摸事件处理程序中触发时会产生严重错误。
// 所以原生Promise可用的时候，优先使用原生Promise。
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.

    // IOS 的 UIWebView，Promise.then 回调被推入 microtask 队列，但是队列可能不会如期执行。
    // 因此，添加一个空计时器强制执行 microtask 队列。
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver)
  // PhantomJS and iOS 7.x
  || MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // 当原生 Promise 不可用时，timerFunc 使用原生 MutationObserver
  // 如 PhantomJS，iOS7，Android 4.4
  // issue #6466 MutationObserver 在 IE11 并不可靠，所以这里排除了IE
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
  // 如果上面两种情况都不能用，且原生setImmediate可用，timerFunc 使用原生 setImmediate
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
  // 如果上面的都不能用，timerFunc使用setTimeout
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
// 优先级：microtask优先(Promise和MutationObserver都是microtask)。
// Promise > MutationObserver > setImmediate > setTimeout

/**
 * nextTick函数。接受两个参数：
 * @param {*} cb 回调函数：是要延迟执行的函数；
 * @param {*} ctx 指定 cb 回调函数 的 this 指向；
 * Vue 实例方法 $nextTick 做了进一步封装，把ctx设置为当前Vue实例。
 */
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // cb回调函数会经统一处理并压入callbacks数组
  callbacks.push(() => {
    if (cb) {
      // 给cb回调函数执行添加try-catch错误处理
      try {
        cb.call(ctx);
      } catch (e) {
          // 错误处理
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  // 执行异步延迟函数 timerFunc
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  // 当nextTick没有传入回调函数参数的时候，返回一个Promise化的调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```
### 为什么优先使用microtask？
如果放入 macrotask 中，则会在当前脚本执行完后清空一次 microtask，然后执行 render 渲染页面，此时还未执行更新操作，因为更新操作在下一轮事件循环中的 macrotask，所以此时 DOM 并未修改，如果要渲染成功就需要两次事件循环。所以异步更新 DOM 操作要放到 microtask 中。尽可能的用 microtask，如果浏览器不支持，再用 macrotask。

设置Promise最优先是因为Promise.resolve().then回调函数属于一个微任务，浏览器在一个Tick中执行完macroTask后会清空当前Tick所有的microTask再进行UI渲染，把DOM更新的操作放在Tick执行microTask的阶段来完成，相比使用setTimeout生成的一个macroTask会少一次UI的渲染。
## nextTick在派发更新的流程中，是如何调用的？
```js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```
当我们改变了数据时，watcher并不会立即出发，而是会放到队列里。以防重复触发一个watcher，造成的不必要的 dom 更新。并且当前 tick 的变更会在 nextTick 去响应，在nextTick的流程里更新 dom。

除了在数据变化时会调用nextTick，另外一种场景是手动调用 nextTick。我们仍以上面的例子为例：
```js
handleClick() {
    this.num = 6;
    console.log(this.$refs.title.innerText); // 1
    this.$nextTick()
        .then(() => {
            console.log(this.$refs.title.innerText); // 6
        });
}
```
当我们改变了this.num时，会调用nextTick，最终更新dom。如果以同步访问的形式是拿不到变更后的dom的。所以，需要新开一个nextTick来做 dom更新之后的操作。
## 简易的nextTick实现
Vue为了适应各种不同的应用环境做出大量的适配以及兼容考虑。假如我们不考虑这些情况。我们就使用效率最低的setTimeout来进行异步延迟（Vue的最后方案也是用的setTimeout）。简易的nextTick实现如下：
```js
let callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  // 循环遍历数组里面的函数，并且执行
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
// 设置导出nextTick的函数，把方法添加到callbacks数组中，并执行上一步的flushCallback方法。
function nextTick (cb) {
    callbacks.push(cb)

    if (!pending) {
        pending = true
        setTimeout(flushCallback, 0)
    }
}
 // 当 nextTick 没有传入函数参数的时候，返回一个 Promise 化的调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
```
## 为什么要异步更新视图
来看个🌰：
```js
// 创建一个Vue实例
const template = `
    <div>
        <h1 ref="title">{{num}}</h1>
    </div>
`;
var app = new Vue({
    el: '#root',
    template,
    data() {
        return {
            num: 0
        }
    },
    mounted() {
        for(let i = 0; i < 1000; i++) {
            this.num++;
        }
    },
    watch: {
        num() {
            console.log(this.num); // 只会输出1次，值是1000
        }
    }
})
```
如上述代码所示，mounted的时候num的值会被循环执行1000次++。每次++时，都会根据响应式触发`setter->Dep->Watcher->update->run`。如果不采用异步更新视图，那么每次++操作都会直接导致DOM更新视图，这是非常消耗性能的。

所以，Vue实现了一个queue队列，在下一个Tick（或者是当前Tick的微任务阶段）的时候，统一执行queue中Watcher的run。同时，拥有相同id的Watcher不会被重复加入到该queue中去，所以不会执行1000次Watcher的run。最终更新视图只会直接将num对应的DOM从0变成1000。保证更新视图操作DOM的动作是在当前栈执行完以后下一个Tick（或者是当前Tick的微任务阶段）的时候调用，大大优化了性能。
## 应用场景
### 场景1
点击按钮显示原本以 v-show = false 隐藏起来的输入框，并获取焦点。
```js
showsou(){
  this.showit = true //修改 v-show
  document.getElementById("keywords").focus()  //在第一个 tick 里，获取不到输入框，自然也获取不到焦点
}
```
```js
showsou(){
  this.showit = true
  this.$nextTick(function () {
    // DOM 更新了
    document.getElementById("keywords").focus()
  })
}
```
### 场景2
点击获取元素宽度。
```js
<div id="app">
    <p ref="myWidth" v-if="showMe">{{ message }}</p>
    <button @click="getMyWidth">获取p元素宽度</button>
</div>

getMyWidth() {
    this.showMe = true;
    //this.message = this.$refs.myWidth.offsetWidth;
    //报错 TypeError: this.$refs.myWidth is undefined
    this.$nextTick(()=>{
        //dom元素更新后执行，此时能拿到p元素的属性
        this.message = this.$refs.myWidth.offsetWidth;
  })
}
```
## 参考文档
1. [异步更新队列](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)
2. [【Vue源码】Vue中DOM的异步更新策略以及nextTick机制](https://funteas.com/topic/5a8dc7c8f7f37aa60a177bb7)
3. [Vue.nextTick 的原理和用途](https://segmentfault.com/a/1190000012861862)
4. [[vue源码][nextTick]原理以及源码解析](https://mp.weixin.qq.com/s/YnhpWy0oyf3IPoxFL8blPw)
5. [Vue.nextTick 源码解析](https://ruirui.me/2019/01/24/vue-nextTick/)
6. [vue方法nextTick源码分析](https://copyfuture.com/blogs-details/20190919232115493dn9vbhvgsabfzvb)