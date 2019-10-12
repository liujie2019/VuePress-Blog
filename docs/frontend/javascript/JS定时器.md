---
title: JS定时器
lang: zh
---
::: tip
写作不易，Star是最大鼓励，感觉写的不错的可以给个Star⭐，请多多指教。[本博客的Github地址](https://github.com/liujie2019/VuePress-Blog)。
:::

JavaScript提供定时执行代码的功能，叫做定时器（timer），主要由`setTimeout()`和`setInterval()`这两个函数来完成。它们向任务队列添加定时任务。

js是运行于单线程的环境中的，**定时器仅仅只是计划代码在未来的某个时间执行(但是并不保证在该时间点一定执行)**。**执行时机是不能保证的**，因为在页面的生命周期中，不同时间可能有其他代码在控制js进程。在页面下载完后的代码运行、事件处理程序、Ajax回调函数都必须使用同样的线程来执行。实际上，浏览器负责进行排序，指派某段代码在某个时间点运行的优先级。

<img :src="$withBase('/js/setInterval2.png')" alt="">

如上图所示：我们可以把`javascript`想象成在时间线上运行的。当页面载入时，首先执行是任何包含在`<script>`元素中的代码，通常是页面生命周期后面要用到的一些简单的函数和变量的声明，有时候也包含一些初始数据的处理。在这之后，`javascript`进程将等待更多代码执行，当进程空闲时，下一个代码会被触发并立刻执行。例如：当点击某个按钮时，`onclick`事件处理程序会立刻执行，只要`javascript`进程处于空闲状态。

除了`javascript主执行进程`外，还有一个需要在进程下一次空闲时执行的**代码队列**。随着页面在其生命周期中的推移，代码会按照执行顺序添加到队列中。例如：当某个按钮被按下，它的事件处理程序代码就会被添加到队列中，并在下一个可能的时间里执行。当接收到某个Ajax响应时，回调函数的代码会被添加到队列。在`javascript`中没有任何代码是立刻执行的，但是一旦进程空闲则尽快执行。

**定时器对队列的工作方式是：** 当特定时间过去后将代码插入。注意，给队列添加代码并不意味着对它立刻执行，而只能表示它会尽快执行。例如：设定一个150ms后执行的定时器不代表到了150ms代码就立刻执行，**它表示代码会在150ms后被加入到队列中**。如果在这个时间点，队列中没有其他东西，那么这段代码就会被执行，表面上看上去就好像代码就在精确的时间点上执行了。其他情况，代码可能明显等待更长时间才执行。

<img :src="$withBase('/js/setInterval3.png')" alt="">

在上图中：给按钮设置了一个事件处理程序，该事件处理程序设置了一个`250ms`后调用的定时器。点击该按钮后，首先将`onclick`事件处理程序加入队列。该事件处理程序执行后才设置定时器，再有`250ms`后，指定的代码才被添加到队列中**等待执行**。

对于定时器而言：我们要记住指定的时间间隔表示何时将定时器的代码添加到队列，而不是何时实际执行代码。如果上图中的`onclick`事件处理程序执行了`300ms`，那么定时器的代码至少要在定时器设置之后的`300ms`后才会被执行。队列中所有的代码都要等到`js`进程空闲之后才能执行，而不管它们是如何添加到队列中的。

上图中，尽管在`255ms`处添加了定时器代码，但是这个时候不能执行，因为`onclick`事件处理程序还在运行。定时器代码最早的执行时机在`300ms`处，即`onclick`事件处理程序结束之后。

::: warning
需要注意：
1. 定时器并不能保证真正的定时执行，一般会延迟一点(可以接受)，也有可能延迟很长时间(不能接受)。
2. 定时器的回调函数是在主线程上执行的，因为js是单线程的
3. 定时器的实现依赖于事件循环模型。
:::
```js
document.querySelector('#btn').onclick = function() {
     let start = Date.now();
     console.log('启动定时器前');
     setTimeout(function() {
         console.log('定时器执行了', Date.now() - start);
     }, 300);
     console.log('启动定时器后');

     // 增加一个耗时的操作
     for (let i = 0; i < 1000000000; i++) {}
}
```
<img :src="$withBase('/js/setTimeout.png')" alt="">
<img :src="$withBase('/js/setTimeout2.png')" alt="">

## setTimeout
>`setTimeout`函数用来指定某个函数或某段代码，在多少毫秒之后执行。它返回一个整数，表示定时器的编号，以后可以用来取消这个定时器。

```js
const timer = setTimeout(func|code, delay);
```
上面代码中，`setTimeout`函数接受两个参数，第一个参数`func|code`是将要推迟执行的函数名或者一段代码，第二个参数`delay`是推迟执行的毫秒数。
### demo1(第一个参数是code)
```js
console.log(111);
setTimeout('console.log(222)', 2000);
console.log(333);
// 运行结果：
111
333
222
```
>上面代码会先输出111和333，然后等待2秒再输出222。特别注意：`console.log(2)`必须以字符串的形式，作为`setTimeout`的参数。

### demo2(第一个参数是函数)
如果推迟执行的是函数，就直接将函数名作为setTimeout的参数。
```js
const fn = () => {
    console.log(222);
}

console.log(111);
setTimeout(fn, 2000);
console.log(333);
// 运行结果：
111
333
222
```
>特别注意：`setTimeout`的第二个参数如果省略，则默认为0。

```js
setTimeout(f);
// 等同于
setTimeout(f, 0);
```
### setTimeout参数
除了前面提到的两个参数，setTimeout还允许更多的参数。它们将依次传入推迟执行的函数（回调函数）。

```js
console.log(111);
setTimeout((a,b) => {
    console.log(a + b);
}, 1000, 1, 2);
console.log(333);
// 运行结果：
111
333
3
```
>上面代码中，setTimeout共有4个参数。最后那两个参数(1和2)，将在1秒之后回调函数执行时，作为回调函数的参数。

### setTimeout的回调函数是对象的方法
>特别注意：如果回调函数是对象的方法，那么`setTimeout`使得方法内部的this关键字指向全局环境，而不是定义时所在的那个对象。

```js
var x = 1;

var obj = {
  x: 2,
  y: function () {
    // 这里this指向window
    console.log(this.x);
  }
};

setTimeout(obj.y, 1000); // 1
```
上面代码输出的是1，而不是2。因为当`obj.y`在1秒后运行时，`this`所指向的已经不是`obj`了，而是全局环境`window`。

#### 解决方法一(将`obj.y`放入一个函数)
```js
var x = 1;

var obj = {
  x: 2,
  y: function () {
    console.log(this.x);
  }
};

setTimeout(function () {
  console.log(this); // window
  obj.y(); // 2
}, 1000);
```
>上面代码中，`obj.y`放在一个匿名函数之中，这使得`obj.y`在`obj`的作用域执行，而不是在全局作用域内执行，所以能够显示正确的值。
#### 解决方法二(使用`bind`方法，将`obj.y`这个方法绑定在obj上面)
```js
var x = 1;

var obj = {
  x: 2,
  y: function () {
    console.log(this.x);
  }
};

setTimeout(obj.y.bind(obj), 1000); // 2
```
>自己在总结的时候，自己用ES6声明全局变量x和obj。这样导致输出`undefined`。原因在于：`let命令、const命令、class命令`声明的全局变量，**不属于顶层对象的属性**。也就是说，从ES6开始，全局变量将逐步与顶层对象的属性脱钩，这一点要特别注意。

```js
const x = 1;

const obj = {
  x: 2,
  y: () => {
    console.log(this); // window
    console.log(this.x);
  }
};

setTimeout(obj.y, 1000); // undefined
```
#### ES6声明变量的六种方法
>`ES5`只有两种声明变量的方法：`var命令和function命令`。`ES6` 除了添加`let和const`命令，后面章节还会提到，另外两种声明变量的方法：`import命令和class`命令。所以，`ES6`一共有`6`种声明变量的方法。

#### 顶层对象的属性
顶层对象，在浏览器环境指的是`window`对象，在`Node`中指的是`global`对象。需要注意的是在`ES5`中，顶层对象的属性与全局变量是等价的。

```js
window.a = 1;
a // 1

a = 2;
window.a // 2
```
上面代码中，顶层对象的属性赋值与全局变量的赋值，是一回事。

>需要注意的是：在`ES6`中改变了这一点，一方面规定，为了保持兼容性，`var命令和function命令`声明的全局变量，依旧是顶层对象的属性；另一方面规定，`let命令、const命令、class命令`声明的全局变量，不属于顶层对象的属性。也就是说，从`ES6`开始，全局变量将逐步与顶层对象的属性脱钩。

```js
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```
>上面代码中，全局变量a由var命令声明，所以它是顶层对象的属性；全局变量b由let命令声明，所以它不是顶层对象的属性，返回undefined。

## setInterval(重复的定时器)
>使用`setInterval`创建的定时器确保了定时器代码规则地插入队列中。**但是该方法的问题在于：** 定时器代码可能在代码再次被添加到队列之前还没有执行完成，结果导致定时器代码连续运行好几次，而之间没有任何停顿。然而，`javascript`引擎够聪明，能避免这个问题。**当使用`setInterval`时，仅当没有该定时器的任何其他代码实例时**，才将定时器代码添加到队列中。这确保了定时器代码加入到队列中的最小时间间隔为指定间隔。

>`setInterval`函数的用法与`setTimeout`完全一致，区别仅仅在于：`setInterval`指定某个任务每隔一段时间就执行一次，也就是无限次的定时执行。

```js
var timer = setInterval(function() {
  console.log(2);
}, 1000)
```
>上面代码中，每隔1秒就输出一个2，会无限运行下去，直到关闭当前窗口。与`setTimeout`一样，除了前两个参数，`setInterval`方法还可以接受更多的参数，它们会传入回调函数。

```js
// 通过setInterval方法实现网页动画的例子。
var div = document.querySelector('#box');
var opacity = 1;
var fader = setInterval(() => {
  opacity -= 0.1;
  if (opacity >= 0) {
    div.style.opacity = opacity;
  }
  else {
    clearInterval(fader);
  }
}, 100);
```
>上面代码每隔100毫秒，设置一次div元素的透明度，直至其完全透明为止。

>`setInterval`的一个常见用途是：**实现轮询**。
```js
// 轮询URL的Hash值是否发生变化
var hash = window.location.hash;
var hashWatcher = setInterval(function() {
  if (window.location.hash != hash) {
    updatePage();
  }
}, 1000);
```
需要注意的是：`setInterval`指定的是函数**开始执行**之间的间隔，**并不考虑每次任务执行本身所消耗的时间**。因此实际上，**两次执行之间的间隔会小于指定的时间**。比如：`setInterval`指定某个函数每`100ms`执行一次，函数每次执行需要`5ms`，那么第一次执行结束后`95`毫秒，第二次执行就会开始。如果某次执行耗时特别长，比如需要105毫秒，那么它结束后，下一次执行就会立即开始。

<img :src="$withBase('/js/setInterval.png')" alt="">

如上图所示：重复定时器有两个问题：1.某些间隔会被跳过；2.多个定时器的代码执行之间的间隔可能会比预期的小。假设，某个`onclick`事件处理程序使用`setInterval`设置了一个`200ms`间隔的重复定时器。如果事件处理程序花费了`300ms`多一点的时间完成，同时定时器代码也花费了差不多的时间，就会跳过一个间隔同时运行着一个定时器代码。

在上图的例子中：第一个定时器在`205ms`时被添加到队列中，但是直到过了`300ms`处才能够执行。当执行这个定时器代码时，在`405ms`处又给队列添加了另外一个副本。在下一个间隔，即`605ms`处。第一个定时器代码扔在运行，同时在队列中已经存在一个定时器代码的实例。结果导致在这个时间点上的定时器代码不会被添加到队列中。同时，当`5ms`处添加的定时器代码结束后，`405ms`处添加的定时器代码就立刻执行。

为了避免`setInterval`的这两个缺点，确保两次执行之间有固定的间隔，可以使用链式`setTimeout`，即每次执行结束后，使用`setTimeout`指定下一次执行的具体时间。

```js
// 主要用于重复定时器
var timer = setTimeout(function () {
  // 处理中
  timer = setTimeout(arguments.callee, 2000);
}, 2000);
```
上述代码中，链式调用了`setTimeout`。每次函数执行的时候都会创建一个新的定时器。第二个`setTimeout`调用使用了`arguments.callee`来获取对当前执行的函数的引用，并为其设置另外一个定时器。这样做的好处是：在前一个定时器代码执行完成之前，不会向队列中插入新的定时器代码，确保不会有任何缺失的间隔。而且，可以保证在下一次定时器代码执行之前，至少要等待指定的间隔，避免连续的运行。**上面代码可以确保，下一次执行总是在本次执行结束之后的2秒开始**。

## clearTimeout和clearInterval
>`setTimeout和setInterval`函数，都返回一个整数值，表示计数器编号。将该整数传入`clearTimeout和clearInterval`函数，就可以取消对应的定时器。

```js
var id1 = setTimeout(f, 1000);
var id2 = setInterval(f, 1000);

clearTimeout(id1);
clearInterval(id2);
```
>上面代码中，回调函数f不会再执行了，因为两个定时器都被取消了。

>`setTimeout和setInterval`返回的整数值是连续的，也就是说，第二个`setTimeout`方法返回的整数值，将比第一个的整数值大1。

```js
function f() {}
setTimeout(f, 1000) // 10
setTimeout(f, 1000) // 11
setTimeout(f, 1000) // 12
```
>上面代码中，连续调用三次setTimeout，返回值都比上一次大了1。

利用这一点，可以写一个函数，取消当前所有的setTimeout定时器。

```js
(function() {
  var gid = setInterval(clearAllTimeouts, 0);

  function clearAllTimeouts() {
    var id = setTimeout(function() {}, 0);
    while (id > 0) {
      if (id !== gid) {
        clearTimeout(id);
      }
      id--;
    }
  }
})();
```
>上面代码中，先调用`setTimeout`，得到一个计算器编号，然后把编号比它小的计数器全部取消。

## 实例应用：debounce(防抖)
>有时，我们不希望回调函数被频繁调用。比如：用户填入网页输入框的内容，希望通过Ajax方法传回服务器，`jQuery`的写法如下：

```js
$('textarea').on('keydown', ajaxAction);
```
>这样写有一个很大的缺点是：如果用户连续击键，就会连续触发`keydown`事件，造成大量的`Ajax`通信。这是不必要的，而且很可能产生性能问题。正确的做法应该是，设置一个门槛值，表示两次`Ajax`通信的最小间隔时间。如果在间隔时间内，发生新的`keydown`事件，则不触发`Aja` 通信，并且重新开始计时。如果过了指定时间，没有发生新的`keydown`事件，再将数据发送出去。这种做法叫做**debounce**（防抖动）。假定两次`Ajax`通信的间隔不得小于2500毫秒，上面的代码可以改写成下面这样。

```js
$('textarea').on('keydown', debounce(ajaxAction, 2500));

function debounce(fn, delay){
  var timer = null; // 声明计时器
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
```
>上面代码中，只要在2500毫秒之内，用户再次击键，就会取消上一次的定时器，然后再新建一个定时器。这样就保证了回调函数之间的调用间隔，至少是2500毫秒。

##  运行机制
`setTimeout`和`setInterval`的运行机制，是将指定的代码**移出本轮事件循环**，等到下一轮事件循环，再检查是否到了指定时间。如果到了，就执行对应的代码；如果不到，就继续等待。

这意味着：`setTimeout和setInterval`指定的回调函数，必须等到本轮事件循环的所有同步任务都执行完，才会开始执行。由于前面的任务到底需要多少时间执行完，是不确定的。所以，没有办法保证`setTimeout和setInterval`指定的任务一定会按照预定时间执行。

```js
setTimeout(someTask, 100);
veryLongTask();
```
>上面代码的`setTimeout`，指定`100ms`以后运行一个任务。但是，如果后面的`veryLongTask`函数（同步任务）运行时间非常长，过了`100ms`还无法结束，那么被推迟运行的`someTask`就只有等着，等到`veryLongTask`运行结束，才轮到它执行。

```js
setInterval(function () {
  console.log(2);
}, 1000);

sleep(3000);

function sleep(ms) {
  var start = Date.now();
  while ((Date.now() - start) < ms) {
  }
}
```
>上面代码中，`setInterval`要求每隔1秒，就输出一个2。但是，紧接着的`sleep`语句需要3秒才能完成，那么`setInterval`就必须推迟到3秒之后才开始生效。**特别注意：** 生效后`setInterval`不会产生累积效应，即不会一下子输出三个2，而是只会输出一个2。

##  setTimeout(f,0)
### 含义
`setTimeout`的作用是：将代码推迟到指定时间执行，如果指定时间为0，即`setTimeout(f, 0)`，那么会立刻执行吗？

答案是不会。因为`setTimeout`指定的回调函数f，必须要等到当前脚本的同步任务全部处理完以后才会执行。也就是说，`setTimeout(f, 0)`会在下一轮事件循环一开始就执行。

```js
setTimeout(() => {
  console.log(1);
}, 0);
console.log(2);
// 2
// 1
```
>上面代码先输出2，再输出1。因为2是同步任务，在本轮事件循环执行，而1是下一轮事件循环执行。总之，`setTimeout(f, 0)`这种写法的目的是，尽可能早地执行f，但是并不能保证立刻就执行f。

### 应用
`setTimeout(f, 0)`有几个非常重要的用途。**它的一大应用是：可以调整事件的发生顺序。** 比如：网页开发中，某个事件先发生在子元素，然后冒泡到父元素，即子元素的事件回调函数，会早于父元素的事件回调函数触发。如果想让父元素的事件回调函数先发生，就要用到`setTimeout(f, 0)`。

<img :src="$withBase('/js/click.png')" alt="">

```js
<body>
    <input id="btn" type="button" value="click">
    <script>
        var btn = document.querySelector('#btn');
        btn.addEventListener('click', function() {
            btn.value += ' input';
        }, false);
        document.body.addEventListener('click', function() {
            btn.value += ' body';
        }, false);
    </script>
</body>
```
上面代码按照常规的事件冒泡机制触发。

<img :src="$withBase('/js/click2.png')" alt="">

```js
<body>
    <input id="btn" type="button" value="click">
    <script>
        var btn = document.querySelector('#btn');
        btn.addEventListener('click', function() {
            setTimeout(function() {
                btn.value += ' input';
            })
        }, false);
        document.body.addEventListener('click', function() {
            btn.value += ' body';
        }, false);
    </script>
</body>
```
>上面代码在点击按钮后，`setTimeout`将子元素的回调函数推迟到下一轮事件循环执行，这样就起到了先触发父元素的回调函数的目的了。

>另一个应用是：用户自定义的回调函数，通常在浏览器的默认动作之前触发。比如，用户在输入框输入文本，`keypress`事件会在浏览器接收文本之前触发。因此，下面的回调函数是达不到目的的。如下图所示：

<img :src="$withBase('/js/keypress.png')" alt="">

```js
<body>
    <input type="text" id="txt">
    <script>
        var txt = document.querySelector('#txt');
        function handleKeyPress(e) {
            e.target.value = e.target.value.toUpperCase();
        }
        txt.addEventListener('keypress', handleKeyPress, false);
    </script>
</body>
```
>上面代码想在用户每次输入文本后，立即将字符转为大写。但是实际上，它只能将本次输入前的字符转为大写，因为浏览器此时还没接收到新的文本，所以`this.value`取不到最新输入的那个字符。只有用`setTimeout`改写，上面的代码才能发挥作用。如下图所示：

<img :src="$withBase('/js/keypress2.png')" alt="">

```js
<body>
    <input type="text" id="txt">
    <script>
        var txt = document.querySelector('#txt');
        function handleKeyPress(e) {
            setTimeout(function() {
                e.target.value = e.target.value.toUpperCase();
            }, 0);
        }
        txt.addEventListener('keypress', handleKeyPress, false);
    </script>
</body>
```
>上面代码将代码放入`setTimeout`之中，就能使得它在浏览器接收到文本之后触发。

>由于`setTimeout(f, 0)`实际上意味着：将任务放到浏览器最早可得的空闲时段执行，所以那些计算量大、耗时长的任务，常常会被放到几个小部分，分别放到`setTimeout(f, 0)`里面执行。
```js
<body>
    <div id="box" style="width: 100px;height: 100px;"></div>
    <script>
        var box = document.querySelector('#box');
        // 写法一
        for (var i = 0xA00000; i < 0xFFFFFF; i++) {
            div.style.backgroundColor = '#' + i.toString(16);
        }
        // 写法二
        var timer = null;
        var i = 0x100000;
        function fn() {
            timer = setTimeout(fn, 0);
            box.style.backgroundColor = '#' + i.toString(16);
            if(i++ === 0xFFFFFF) clearTimeout(timer);
        }
        timer = setTimeout(fn, 0);
    </script>
</body>
```
>上面代码有两种写法都是改变一个网页元素的背景色。写法一会造成浏览器堵塞，因为JavaScript执行速度远高于DOM，会造成大量DOM操作堆积，而写法二就不会，这就是`setTimeout(f, 0)`的好处。

>另一个使用这种技巧的例子是：代码高亮的处理。如果代码块很大，一次性处理，可能会对性能造成很大的压力，那么将其分成一个个小块，一次处理一块，比如写成`setTimeout(highlightNext, 50)`的样子，性能压力就会减轻。

## 参考文档
1. [顶层对象的属性](http://es6.ruanyifeng.com/#docs/let#const-%E5%91%BD%E4%BB%A4)
2. [定时器](https://wangdoc.com/javascript/async/timer.html)