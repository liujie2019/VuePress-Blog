---
title: Proxy比defineproperty
---
双向数据绑定是Vue的三要素之一，Vue三要素包括：
1. 数据响应式: 例如如何监听数据变化，其中的实现方法就是我们提到的双向数据绑定
2. 模板引擎解析: 如何解析模板
3. 页面渲染: Vue如何将监听到的数据变化和解析后的HTML进行渲染

可以实现双向数据绑定的方法有很多：
* KnockoutJS基于观察者模式的双向数据绑定
* Ember基于数据模型的双向绑定
* Angular基于脏检查的双向绑定
* Vue中基于数据劫持的双向数据绑定

这里主要来说一下面试中常见的基于数据劫持的双向数据绑定。

常见的基于数据劫持的双向绑定有两种实现，一个是目前Vue在用的Object.defineProperty，另一个是ES2015中新增的Proxy，而Vue3.0版本后加入Proxy从而代替Object.defineProperty，通过本文你也可以知道为什么Vue未来会选择Proxy。

严格来讲Proxy应该被称为『代理』而非『劫持』，不过由于作用有很多相似之处，我们在下文中就不再做区分，统一叫『劫持』。

## Object.defineProperty缺点
1. 无法直接监听对象，需要循环递归遍历监听对象的属性
2. 无法监听对象新增加的属性
3. 无法监听数组的push/shift/pop等方法

### 对于对象
Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的。例如：
```js
var vm = new Vue({
  data: {
    a: 1
  }
});

// `vm.a` 是响应式的

vm.b = 2
// `vm.b` 是非响应式的
```
对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式 property。例如，对于：
```js
Vue.set(vm.someObject, 'b', 2)
```
您还可以使用 vm.$set 实例方法，这也是全局 Vue.set 方法的别名：
```js
this.$set(this.someObject, 'b', 2)
```
### 异步更新队列
Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。
## 基于ES6的proxy实现数据劫持(即双向绑定)
Proxy优势：
1. 可以直接监听对象而非对象属性
2. 可以直接监听数组的变化
3. Proxy有多达13种拦截方法，不限于apply、ownKeys、deleteProperty、has等等是Object.defineProperty不具备的。
4. Proxy返回的是一个新对象，我们可以只操作新的对象达到目的，而Object.defineProperty只能遍历对象属性直接修改。

## 参考文档
1. [实现双向绑定Proxy比defineproperty优劣如何?](https://juejin.im/post/5acd0c8a6fb9a028da7cdfaf)
