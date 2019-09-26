---
title: 原生JS研究和总结
---
## 数据类型

* **基本类型值包括：** `undefined，null，Boolean，Number和String`，这些类型分别在内存中**占有固定的大小空间**，它们的值保存在**栈空间**，我们通过**按值**来访问的。
* **引用类型包括：** 对象、数组、函数等。

**对于引用类型的值**，则必须在**堆内存**中为这个值分配空间。由于引用类型值的**大小不固定**（对象有很多属性和方法，而且还可以动态的添加属性和方法），因此不能把他们保存到栈内存中。但**内存地址大小是固定的**，因此可以**将内存地址保存在栈内存中**。

**简而言之：** 栈内存中存放的是基本数据类型值，堆内存中存放的是引用类型值，引用类型值在内存中的地址存放在栈中，也就是我们常说的对象对象引用(指针)。
![这里写图片描述](http://img.blog.csdn.net/20160809100356773)
### 变量复制
```js
var a = 5;
var b = a;
console.log(a+"---"+b); // 5---5
b = 6; // 这里重新给b赋值，a值并没有改变
console.log(a+"---"+b); // 5---6

var obj = {name:"lisi"};
var obj2 = obj; // 这里是引用赋值，obj和obj2指向同一个对象
console.log(obj.name + "---" + obj2.name); // lisi---lisi
obj2.name = "wangwu";
console.log(obj.name + "---" + obj2.name); // wangwu---wangwu
```
从上面例子可以看出：在变量复制方面，基本类型和引用类型也有所不同，基本类型复制的是**值本身**，而引用类型复制的是内存地址。
## 函数
### this 的工作原理(5种情况)
#### 全局作用域内
当在全局作用域内使用this时，它将会指向全局对象，即window对象。
#### 函数调用
挡在全局作用域内调用函数时，this 也会指向全局对象。
#### 方法调用
this指向调用该方法的对象。
#### 调用构造函数
在构造函数内部，this 指向新创建的对象。
#### 显式的设置this指向
当使用call或者apply方法时，函数内的this将会被显式设置为函数调用的第一个参数。
**更详细用法请见之前的博客：**[传送门](http://blog.csdn.net/liujie19901217/article/details/51297782)

### 匿名函数
在javascript里**任何匿名函数都是属于window对象**。在定义匿名函数时候它会返回自己的内存地址，如果此时有个变量接收了这个内存地址，那么匿名函数就能在程序里被使用了(可以通过在这个变量后面加一对圆括号来调用这个匿名函数)，因为匿名函数也是在全局执行环境构造时候定义和赋值，所以匿名函数的this指向也是window对象。
```html
<script type="text/javascript">
(function(){
	console.log(this == window);//true
})();
</script>
```
### 参数传递
```html
<script type="text/javascript">
     function test(num){//按值传递
         num+=5;
         console.log(num);
         return num;
     }
     var num = 5;
     var result = test(num);
     console.log(result);// 10 如果是按引用传递，那么函数里的num会成为类似全局变量，把外面的num覆盖掉
     console.log(num);// 5 也就是说，最后应该输出20（这里输出10）
</script>
```
js中不存在引用传递，如果存在引用传递的话，那么函数内的变量将是全局变量，在外部也可以访问，但这明显是不可能的。
**再看一个例子：**
```html
<script type="text/javascript">
function setName(obj){//obj = person
	obj.name = "lisi";
	obj = new Object();
	obj.name = "wangwu";
}
var person = new Object();
setName(person);
alert(person.name);
console.log(obj.name);//Uncaught ReferenceError: obj is not defined
</script>
```
在将person传递给obj后，其name属性就被设置成了"lisi"。又将obj重新定义了一个对象，另一行代码为该对象定义了一个带有不同值的name属性。
如果person是按引用传递的，那么person就会自动被修改为指向其name属性值为"wangwu"的新对象，但事实上并没有，其name属性依然是"lisi"。
**这就说明：**即使在函数内部修改了参数的值，但原始的引用仍然保持不变。实际上，当在函数内重写obj时，这个变量引用的就是一个局部对象了。而这个局部对象会在函数执行完毕后立即被销毁。
## 执行环境及作用域
### 执行环境
**执行环境**定义了变量或函数有权访问其他数据，可以分为全局执行环境和局部执行环境。
全局执行环境是最外层的执行环境，在浏览器中，全局执行环境是window对象，因此，所有的全局变量的函数都是作为window的属性和方法创建的。
**注意：**对于局部执行环境，其内部的代码执行完毕后，该环境将被销毁，保存其中的变量和函数也随之销毁，如果是全局执行环境，需所有程序执行完毕或网页完毕后才会销毁。
## 需要注意的小细节
### 去掉var的局部变量
```html
<script type="text/javascript">
      var name = "wangwu";
      function setName(){
          name = "lisi";//去掉var变成了全局变量，会覆盖全局中的name
      }
      setName();
      console.log(name);//lisi
</script>
```
### 形参也是局部变量
```html
<script type="text/javascript">
      var name = "wangwu";
      function setName(name){//形参也是局部变量
          console.log(name);
      }
      setName("￼lisi");//lisi
      console.log(name);//wangwu
</script>
```
### 作用域
当代码在一个环境中执行的时候，就会形成作用域链，它的作用是保证对执行环境中有访问权限的变量和函数进行**有序访问**（内部深层环境可以访问外层环境，反之不成立），作用域链的前端，就是执行环境的变量对象。
**详见之前博客：**[传送门](http://blog.csdn.net/liujie19901217/article/details/50709336)
## 内存泄漏常见情况
javascript具有自动垃圾回收机制，一旦数据不再使用，可以将其设为"null"来释放引用。
### 循环引用
分为两种情况：不同对象之间相互引用和
**一个经典的例子：**一个DOM对象被一个Javascript对象引用，与此同时又引用同一个或其它的Javascript对象，这个DOM对象可能会引发内存泄露。这个DOM对象的引用**将不会在脚本停止的时候被垃圾回收器回收。**要想破坏循环引用，引用DOM元素的对象或DOM对象的引用需要被赋值为null。
```js
var oBox = document.getElementById("box");
var obj = {};
oBox.name = obj;
obj.age = oBox;//这样就发生了循环引用
```
### 闭包(常见)
通过闭包引用其包含函数的局部变量，当闭包结束后该局部变量无法被垃圾回收机制回收，造成内存泄漏。
### DOM泄漏
当原有的DOM被移除时，子结点引用没有被移除则无法回收。
```js
var select = document.querySelector;
var treeRef = select('#tree');
//在COM树中leafRef是treeFre的一个子结点
var leafRef = select('#leaf');
var body = select('body');
body.removeChild(treeRef);
//#tree不能被回收入，因为treeRef还在
//解决方法:
treeRef = null;
//tree还不能被回收，因为叶子结果leafRef还在
leafRef = null;
//现在#tree可以被释放了。
```
### 定时器泄漏
```js
for (var i = 0; i < 1000; i++) {
  var obj = {
    fn: function() {
      var that = this;
      var val = setTimeout(function() {
        that.fn();
      }, 500);
    }
  }
  obj.fn();
  //虽然你想回收但是timer还在
  obj = null;
}
```
## 垃圾回收
### 标记清除
js中最常用的垃圾回收方式就是标记清除。垃圾收集器在运行的时候回给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记（闭包）。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后，垃圾收集器完成内存清除工作，消除那些带标记的值并回收它们所占用的内存空间。
例如:在函数中声明一个变量，就将这个变量标记为"进入环境"。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到它们。而当变量离开环境时，则将其标记为"离开环境"。
```js
function test(){
 var x = 10 ; //被标记 ，进入环境
 var y = 20 ; //被标记 ，进入环境
}
test(); //执行完毕后 x、y又被标离开环境，被回收。
```
### 引用计数
引用计数就是：跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型值赋给该变量时，则这个值的引用次数就是1。如果同一个值又被赋给另一个变量，则该值的引用次数加1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数减1。当这个值的引用次数变成0时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间回收回来。这样，当垃圾回收器下次再运行时，它就**会释放那些引用次数为0的值所占用的内存**。
```js
function test(){
 var x = {} ; //x的引用次数为0
 var y = x ; //x的引用次数加1，为1
 var z =x; //x的引用次数再加1，为2
 var y ={}; //x的引用次数减1，为1
}
```
### 引用计数策略的问题(循环引用)
```js
function test() {
 var a = {};
 var b = {};
 a.name = b;
 b.name = a;
}
test();
```
以上代码a和b的引用次数都是2，fn()执行完毕后，两个对象都已经离开环境，在标记清除方式下是没有问题的，但是在引用计数策略下，因为a和b的引用次数不为0，所以不会被垃圾回收器回收内存，如果fn函数被大量调用，就会造成内存泄露。在IE7与IE8上，内存直线上升。
我们知道，IE中**有一部分对象**并不是原生js对象。例如，其BOM和DOM中的对象就是使用C++以**COM对象**的形式实现的，而COM对象的垃圾回收机制采用的就是引用计数策略。因此，即使IE的js引擎采用标记清除策略来实现，但js访问的COM对象依然是基于引用计数策略的。换句话说，**只要在IE中涉及COM对象，就会存在循环引用的问题**。
```js
var element = document.getElementById("some_element");
var myObject = new Object();
myObject.element = element;
element.someObject = myObject;//产生了循环引用
```
这个例子在一个DOM元素（element)与一个原生js对象（myObject)之间创建了**循环引用**。其中，变量myObject有一个名为element的属性指向element对象；而变量element也有一个someObject属性指向myObject。由于存在这个循环引用，即使例子中的DOM从页面中移除，它也永远不会被回收。
```js
myObject.element = null;
element.someObject = null;
```
为了避免类似这样的循环引用问题，最好在不使用它们的时候手工断开原生js对象与DOM元素之间的连接。将变量设置为null意味着切断变量与它此前引用的值之间的连接。当垃圾收集器下次运行时，就会删除这些值并回收它们占用的内存。

**注意：** 为了解决上述问题，IE9把BOM和DOM对象都转换成了真正的js对象。这样，就避免了两种垃圾收集算法并存导致的问题，也消除了常见的内存泄漏现象。