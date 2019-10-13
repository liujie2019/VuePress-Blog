---
title: 装饰器(Decorator)
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::

装饰器是一种函数，格式为`@ + 函数名`。它可以放在类和类方法的定义前面。修饰器对类的行为的改变，是**代码编译时**发生的，而**不是在运行时**。

装饰器作用：不仅增加了代码的可读性，清晰地表达了意图，而且提供一种方便的手段，增加或修改类的功能。

## babel配置在命令行编译并运行
>装包：
```bash
yarn add @babel/core @babel/cli @babel/preset-env @babel/node @babel/plugin-proposal-decorators --dev
```
>.babelrc文件：
```bash
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        ["@babel/plugin-proposal-decorators", {"legacy": true}]
    ]
}
```
>运行: npx babel-node xxx.js

## 类的修饰
>使用修饰器`Decorator`函数来修改类的行为。装饰器函数的**第一个参数，就是所要装饰的目标类**。

### 添加静态属性
```js
@testable
class myTestableClass {}

function testable(target) {
    target.isTestable = true;
}

console.log(myTestableClass.isTestable);
```
>上述代码中：`@testable`就是一个修饰器。它修改了`MyTestableClass`这个类的行为，为它加上了静态属性`isTestable`。`testable`函数的参数`target`是`MyTestableClass`类本身。

基本上，修饰器的行为就是下面这样：
```js
@decorator
class A {}

// 等同于
class A {}
A = decorator(A) || A;
```
>也就是说，修饰器是一个对类进行处理的函数。修饰器函数的第一个参数，就是所要修饰的目标类。
```js
function testable(target) {
  // ...
}
```
>上面代码中，testable函数的参数target，就是会被修饰的类。

### 添加原型属性
可以通过对目标类的prototype对象操作来添加实例属性。
```js
@testable
class myTestableClass {}

function testable(target) {
    target.prototype.isTestable = 'true';
}
const obj = new myTestableClass();
console.log(obj.isTestable); // true 在实例上访问原型属性
```
### 带参数的类装饰器
```js
function mixins(list) {
    return target => {
        console.log(target); // [Function: Myclass]
        // 批量给类的原型添加方法
        Object.assign(target.prototype, list);
    }
}

const Foo = {
    foo: () => {
        console.log('我是Foo的函数');
    },
    bar: () => {
        console.log('我是Bar的函数');
    }
};

@mixins(Foo)
class Myclass {}

const obj = new Myclass();
obj.foo(); // 我是Foo的函数
obj.bar(); // 我是Bar的函数
```
## 方法的修饰
修饰器不仅可以修饰类，还可以修饰类的属性。
### 修改writable
```js
function readOnly(target, name, descriptor) {
    console.log(target); // Person {}
    console.log(name); // sayName
    console.log(descriptor);
    /*
    descriptor对象原来的值如下
    {
      value: [Function: sayName],
      enumerable: false,
      configurable: true,
      writable: true
    };
    */
    descriptor.writable = false;
    return descriptor;
}

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    @readOnly
    sayName() {
        return `${this.name} ${this.age}`;
    }
}

const person = new Person('lisi', 22);
// person.sayName = () => {
//     return `${this.name}`;
// };
console.log(person.sayName());
```
修饰器函数readOnly一共可以接受三个参数：

* 第一个参数是类的原型对象，上例是Person.prototype，修饰器的本意是要修饰类的实例，但是这个时候实例还没生成，所以只能去修饰原型（这不同于类的修饰，那种情况时target参数指的是类本身）；
* 第二个参数是所要修饰的属性名，上例中是sayName；
* 第三个参数是该属性的描述对象。

另外，上面代码说明，修饰器（readOnly）会修改属性的描述对象（descriptor），然后被修改的描述对象再用来定义属性。

>如果在实例中重新定义sayName方法，则会报错：

![cd735bb332ce66d15a6b715863ffb04a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p859)
### 修改enumerable
```js
// 使得原型属性可遍历
// target 当前类Person
// name 当前装饰器修饰的属性名，这里是sayName
// descriptor是当前属性的描述器对象
function doenumerable(target, name, descriptor) {
    descriptor.enumerable = true;
    return descriptor;
}

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    @doenumerable
    sayName() {
        return `${this.name}`;
    }
}
// 本身应该为false
console.log(Object.getOwnPropertyDescriptor(Person.prototype, 'sayName').enumerable); // true
const person = new Person('lisi');
for (let key in person) {
    console.log(key);
    // name
    // age
    // sayName
}
```
有四个操作会忽略`enumerable`为false的属性：

* for...in循环：只遍历对象自身的和继承的可枚举的属性。
* Object.keys()：返回对象自身的所有可枚举的属性的键名。
* JSON.stringify()：只串行化对象自身的可枚举的属性。
* Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。
### log
```js
function log(target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function () {
        console.log(`Calling ${name} with`, arguments);
        return oldValue.apply(this, arguments);
    };
    return descriptor;
}
class Math {
    @log
    add(a, b) {
        return a + b;
    }
}

const math = new Math();
math.add(1, 2);
```
上面代码中，@log修饰器的作用就是在执行原始的操作之前，执行一次console.log，从而达到输出日志的目的。

### 修饰器作用
修饰器有注释的作用。
```js
@testable
class Person {
  @readonly
  @nonenumerable
  name() {
    return `${this.first} ${this.last}`;
  }
}
```
从上面代码中，我们一眼就能看出，Person类是可测试的，而name方法是只读和不可枚举的。
### 同一个方法有多个修饰器
如果同一个方法有多个修饰器，会像剥洋葱一样，**先从外到内进入，然后由内向外执行**。
```js
// 多个修饰器的情况
function test(num) {
    console.log('evaluated:', num);
    return (target, property, descriptor) => {
        console.log('executed:', num);
    };
}

class Person {
    @test(1) // 先进后出
    @test(2) // 后进先出
    add(a, b) {
        return a + b;
    }
}
```
```js
evaluated: 1
evaluated: 2
executed: 2
executed: 1
```
## 为什么修饰器不能用于函数
**修饰器只能用于类和类的方法**，不能用于函数，因为存在函数提升。

## core-decorators.js
core-decorators.js是一个第三方模块，提供了几个常见的修饰器，通过它可以更好地理解修饰器。

### @autobind
autobind修饰器使得方法中的this对象，绑定原始对象。
```js
import { autobind } from 'core-decorators';

class Person {
  @autobind
  getPerson() {
    return this;
  }
}

let person = new Person();
let getPerson = person.getPerson;
console.log(getPerson());
console.log(getPerson() === person); // true
```

## 参考文档
1. [ES7装饰器实用入门指南](https://mp.weixin.qq.com/s?__biz=MzIzNjcwNzA2Mw==&mid=2247485883&idx=1&sn=729d6a1ed2d44983d3a16d1af6f2b4f2&chksm=e8d28423dfa50d358ebe10672848b5954ebd3740e67734065033cd1e8e71b5c8d199cb0b00dd#rd)
2. [解决：对修饰器的实验支持是一项将在将来版本中更改的功能。设置+"experimentalDecorators"+选项以删除此警告。](https://www.jianshu.com/p/4c2bc81b75f0)
3. [http://es6.ruanyifeng.com/#docs/decorator](http://es6.ruanyifeng.com/#docs/decorator)
4. [https://blog.csdn.net/ixygj197875/article/details/79249752](https://blog.csdn.net/ixygj197875/article/details/79249752)