---
title: 闭包与作用域
lang: zh
---
## 变量声明提升
### demo1
```js
var bar = 1;
function test() {
    console.log(bar); // undefined
    var bar = 2;
    console.log(bar); // 2
}
test();
```
>相当于：
```js
var bar = 1;
function test() {
    var bar;
    console.log(bar); // undefined
    bar = 2;
    console.log(bar); // 2
}
test();
```
### demo2
```js
function test(bar) {
    console.log(bar); // 3
    var bar = 2;
    console.log(bar); // 2
}
test(3);
```
```js
function test(bar) {
    function bar() {
        return '1';
    }
    console.log(bar); // [Function: bar]
    var bar = 2;
    // 后面的函数声明会覆盖前面的
    function bar() {
        return '2';
    }
}
test(3);
```
>输出：
```js
ƒ bar() {
        return '2';
    }
```
// 优先级顺序
// 函数声明提升 > 参数 > 变量声明提升
```js
function test(bar) {
    function bar() {
        return '1';
    }
    console.log(bar); // [Function: bar]
    var bar = 2;
    function bar() {
        return '2';
    }
}
test(3);
```
### demo3
```js
var foo = function() {
    console.log(1);
}
function foo() {
    console.log(2);
}

foo(); // 1
```
>相当于：
```js
function foo() {
    console.log(2);
}
var foo;
foo = function() {
    console.log(1);
}
foo(); // 1
```

## 执行上下文
![2571a54198a2a21ab9899a316e258a66.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1047)

* 范围：一段`<script>`或者一个函数
* 全局：变量定义、函数声明 (一段`<script>`)
* 函数：变量定义、函数声明、this、arguments
### this
>重要的事情说三遍：this要在执行时才能确认，定义时无法确认。this要在执行时才能确认，定义时无法确认。this要在执行时才能确认，定义时无法确认。

![b3a16651c2e07117780f4db8e20e6ce0.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1049)
### this使用场景

* 作为构造函数执行；
* 作为对象属性执行；
* 作为普通函数执行；
* call、apply、bind

>bind:

![3abf92e4e1122529fe48aad498f10058.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1051)
```js
function Foo() {
    getName = function() {
        console.log(1);
    }
    return this;
}
Foo.getName = function() {
    console.log(2);
}
Foo.prototype.getName = function() {
    console.log(3);
}
var getName = function() {
    console.log(4);
}
function getName() {
    console.log(5);
}

Foo.getName(); // 2
getName(); // 4
Foo().getName(); // 1
getName(); // 1
new Foo().getName(); // 3
```
### 作用域
>需要注意：

* JS没有块级作用域；
* 只有函数和全局作用域；
* 内部作用域可以访问外部作用域，外部的不能访问内部；
* 优先在内部作用域查找，找不到的话沿着作用域链向上查找。

![1755a52d83b86876e0114e3468410d0a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1053)
>无块级作用域：在花括号中定义变量和在花括号外面定义变量是一样。

```js
function c() {
    var b = 1;
    function a() {
        console.log(b); // undefined
        var b = 2;
        console.log(b); // 2
    }
    a();
    console.log(b); // 1
}
c();
```
## 作用域链
![7b487df1c40ba51956a2023d09d9829c.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1054)
>自由变量：当前作用域中没有定义的变量。当前作用域没有，就去父级作用域中找。父级作用域是**函数定义时**的作用域，而不是函数调用的时候的作用域。

![87f68eb10a0c5e0fc3ac4af388a21cbf.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1055)

## 闭包
>什么是闭包（Closure）？

简单来说，闭包就是指有权访问另一个函数作用域中的变量的函数。MDN上面这么说：闭包是一种特殊的对象。

它由两部分构成：函数，以及创建该函数的环境。环境由闭包创建时在作用域中的任何局部变量组成。
```js
// 看一个闭包的例子
function outer() {
    var a = 1; // 定义一个内部变量
    return function() {
        return a; // 返回a
    };
}

var fn = outer();
console.log(fn()); // 1
```
### 产生一个闭包
创建闭包最常见方式，就是在一个函数内部创建另一个函数。
```js
// 生成闭包
function outer() {
    var a = 1, b = 2;
    function closure() { // 闭包
        return a + b;
    }
    return closure; // 返回闭包函数
}
```
闭包的作用域链包含着它自己的作用域，以及包含它(即定义它)的函数的作用域和全局作用域。
### 闭包的注意事项
通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。但是，在创建了一个闭包以后，这个函数的作用域就会一直保存到闭包不存在为止。
```js
function outer(a) {
    return function(b) {
        return a + b;
    }
}
var add = outer(1);
var add2 = outer(2);

console.log(add(3)); // 4
console.log(add(4)); // 5
// 释放对闭包的引用
add = null;
add2 = null;
```
从上述代码可以看到add和add2都是闭包。它们共享相同的函数定义，但是保存了不同的环境。在add的环境中，a为 1。而在add2中，a则为2。最后通过null释放了add和 add2对闭包的引用。

在javascript中，如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收；

如果两个对象互相引用，而不再被第3者所引用，那么这两个互相引用的对象也会被回收。

>闭包只能取得包含函数中的任何变量的最后一个值。

```js
function fn() {
    var arr = [];
    for (var i = 0; i < 10; i++) {
        arr[i] = function() {
            return i;
        }
    }
    return arr;
}

fn().forEach(item => {
    console.log(item());
});
```
![25e13938c92e00f56aa079ae20df6e30.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1068)
上述代码中，arr数组中包含了10个匿名函数，每个匿名函数都能访问外部函数的变量i，那么i是多少呢？

当fn执行完毕后，其作用域被销毁，但它的变量对象仍保存在内存中，得以被匿名访问，这时i的值为10。要想保存在循环过程中每一个i的值，需要在匿名函数外部再套用一个匿名函数，在这个匿名函数中定义另一个变量并且立即执行来保存i的值。

```js
function fn() {
    var arr = [];
    for (var i = 0; i < 10; i++) {
        arr[i] = (function(num) {
            return function() {
                return num;
            }
        })(i);
    }
    return arr;
}

fn().forEach(item => {
    console.log(item());
});
```
![3fdc21629107d3d51121b6f4f70a848f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1069)
这时最内部的匿名函数访问的是num的值，所以数组中10个匿名函数的返回值就是0-9。
### 闭包中的this对象
>牢牢记住，this指向只有在函数调用时才能确定，跟定义时没关系。

```js
// 闭包中的this
var name = 'window';
var obj = {
    name: 'object',
    getName: function() {
        return function() {
            return this.name;
        }
    }
}
// 这里最后是在全局作用域中调用的，因此this指向window
console.log(obj.getName()()); // window
```
```js
var name = 'window';
var obj = {
    name: 'object',
    getName: function() {
        var that = this;
        return function() {
            return that.name;
        }
    }
}
console.log(obj.getName()()); // object
```
在闭包中，arguments与this也有相同的问题。下面的情况也要注意：
```js
var name = 'window';
var obj = {
    name: 'object',
    getName: function() {
        return this.name;
    }
}
console.log(obj.getName()); // object
console.log((obj.getName = obj.getName)()); // window
```
obj.getName();这时getName()是在对象obj的环境中执行的，所以this指向obj。

(obj.getName = obj.getName)赋值语句返回的是等号右边的值，在全局作用域中返回，所以(obj.getName = obj.getName)();的this指向全局。要把函数名和函数功能分割开来。

## 内存泄漏
闭包会引用包含函数的整个变量对象，如果闭包的作用域链中保存着一个HTML元素，那么就意味着该元素无法被销毁。所以我们有必要在对这个元素操作完之后主动销毁。
![8908ade47ef691c4ec4682836613e4a0.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1070)
### 函数内部的定时器
当函数内部的定时器引用了外部函数的变量对象时，该变量对象不会被销毁。
![abaadb41ce2d2e506172fb6d6e63803f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1071)
### 闭包的应用
应用闭包的主要场合是：**设计私有的方法和变量**。

任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数外部访问这些变量。私有变量包括函数的参数、局部变量和函数内定义的其他函数。

把有权访问私有变量的公有方法称为特权方法（privileged method）。
![34e90c2b45da68f008432232fcde5625.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1072)

>在这里，我们需要理解两个概念：

模块模式（The Module Pattern）：为单例创建私有变量和方法。

单例（singleton）：指的是只有一个实例的对象。JavaScript 一般以对象字面量的方式来创建一个单例对象。
![466259c6903b591e2762811b293a11ce.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1073)
上面是普通模式创建的单例，下面使用模块模式创建单例：
![ee045babfbfb35b71d912fc29b295c1b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1074)
>匿名函数最大的用途是：创建闭包，并且还可以构建命名空间，以减少全局变量的使用。从而使用闭包模块化代码，减少全局变量的污染。

![c87fa465b53f80fa8eb2053acf44075b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1075)
在这段代码中函数 addEvent 和 removeEvent 都是局部变量，但我们可以通过全局变量 objEvent 使用它，这就大大减少了全局变量的使用，增强了网页的安全性。

### 运用闭包的关键

* 闭包引用外部函数变量对象中的值；
* 在外部函数的外部调用闭包。
##### 闭包的缺陷
闭包的缺点就是：常驻内存会增大内存使用量，并且使用不当很容易造成内存泄露。

如果不是因为某些特殊任务而需要闭包，在没有必要的情况下，在其它函数中创建函数是不明智的，因为闭包对脚本性能具有负面影响，包括处理速度和内存消耗。

### 题目
```js
function fn(n, o) {
    console.log(o);
    return {
        fn: function(m) {
            return fn(m, n);
        }
    }
}

var a = fn(0); // undefined
a.fn(1); // 0
a.fn(2); // 0
a.fn(3); // 0

var b = fn(0).fn(1).fn(2).fn(3); // undefined 0 1 2
var c = fn(0).fn(1);// undefined 0

c.fn(2); // 1
c.fn(3); // 1
```

![b6471c20cd0b12d736377fa3d5c03e10.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1056)
>执行f1的时候，会在**f1函数定义**的作用域中查找a，即F1作用域中查找。

### 闭包使用场景

* 函数作为返回值
* 函数作为参数传递

![943ad6a8dd85db116717e2da91cb1665.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1058)
## 函数作为参数传递
![4bad04f33c4c935a7b030488424acc78.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1059)

## 题目
![cc900a3c4967bb4ebe73c85c96c9e3e8.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1045)
![681bda35e65b2e85e47ec27fb6f0f695.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1060)

![597503f7962a2a8a583376487558ef86.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1061)
![88c3ed42c7863fd7d4d1502a73f6a1e2.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1066)
>这里父作用域即全局作用域，因为js没有块级作用域。

![e6c15cfc6cbc52d4f6e8bdf309d2fadd.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1062)
>click回调中的i是自由变量。

![8fe34287951577033bf7e4a714468bdb.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1063)
>10次循环，生成了10个不同的函数作用域。

![fb4093f9ded6681dce7e7299e9995e83.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1064)

### 闭包实际开发中的应用
![0c08f31a334bacba613dbef00997a3c5.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1065)

## 函数声明和函数表达式
![7ad867950de9565752c4e4f03203884e.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1067)

>函数表达式不存在函数声明提示。

<Valine></Valine>