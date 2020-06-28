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


## 基于ES6的proxy实现数据劫持(即双向绑定)

## 参考文档
1. [实现双向绑定Proxy比defineproperty优劣如何?](https://juejin.im/post/5acd0c8a6fb9a028da7cdfaf)
