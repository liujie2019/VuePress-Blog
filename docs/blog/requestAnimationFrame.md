---
title: requestAnimationFrame
---
[TOC]
首先总结一下在前端开发中实现动画的方式：

 - CSS3的`animation+keyframes`;
 - CSS3的`transition`过渡效果;
 - 通过在`canvas`上作图来实现动画;
 - 借助`jQuery`动画相关的API方便地实现;
 - 使用`window.setTimout()`或者`window.setInterval()`通过不断改变元素的状态位置等来实现动画，前提是画面的更新频率要达到每秒60次(因为大多数显示器的刷新频率是60Hz)才能让肉眼看到流畅的动画效果;
 - 使用`window.requestAnimationFrame()`方法。

## 初识requestAnimationFrame
requestAnimationFrame**解决了浏览器不知道javascript动画什么时候开始、不知道最佳循环间隔时间的问题**。它是跟着浏览器的绘制走的，如果浏览器绘制间隔是`16.7ms`，它就按这个间隔绘制；如果浏览器绘制间隔是10ms, 它就按10ms绘制。这样就不会存在过度绘制的问题，动画不会丢帧。
>**内部是这么运作的：** 浏览器页面每次要重绘，就会通知`requestAnimationFrame`，这是资源非常高效的一种利用方式。怎么讲呢？有以下两点：

 - 就算很多个`requestAnimationFrame()`要执行，浏览器只要通知一次就可以了。而`setTimeout`是多个独立绘制。
 - 一旦页面不处于当前页面(比如：页面最小化了)，页面是不会进行重绘的，自然`requestAnimationFrame`也不会触发(因为没有通知)。页面绘制全部停止，资源高效利用。

>**编写动画循环的关键：** 是要知道延迟时间多长合适。一方面，循环间隔必须足够短，这样才能保证不同的动画效果显得更平滑流畅；另一方面，循环间隔还要足够长，这样才能保证浏览器有能力渲染产生的变化。大多数显示器的刷新频率是`60Hz`，相当于每秒重绘`60`次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过了这个频率，用户体验也不会有提升。

因此，最平滑动画的最佳循环间隔是`1000ms/60`，约等于`17ms`。以这个循环间隔重绘的动画是平滑的，因为这个速度最接近浏览器的最高限速。为了适应`17ms`的循环间隔，多重动画可能需要加以节制，以便不会完成得太快。

虽然与使用多组`setTimeout`相比，使用`setInterval`的动画循环效率更高。但是无论`setTimeout`还是`setInterval`都不十分精确。为它们传入的第二个参数，**实际上只是指定了把动画代码添加到浏览器UI线程队列以等待执行的时间**。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务执行完成后再执行。**如果UI线程繁忙，比如忙于处理用户操作，那么即使把代码加入队列也不会立即执行**。

因此，**知道什么时候绘制下一帧是保证动画平滑的关键**。然而，面对不十分精确的`setTimeout和setInterval`，开发人员至今都没有办法确保浏览器按时绘制下一帧。以下是几个浏览器的计时器精度：

* IE8及其以下版本浏览器：15.6ms；
* IE9及其以上版本浏览器：4ms；
* Firefox和Safari：10ms；
* Chrome：4ms。

更为复杂的是：浏览器开始限制后台标签页或不活动标签页的计数器。因此，即使你优化了循环间隔，可能仍然只能接近你想要的效果。

CSS3动画的优势在于**浏览器知道动画什么时候开始**，因此会计算出正确的循环间隔，在适当的时候刷新UI。而对于JavaScript动画，浏览器就无从知晓什么时候开始。

在JS中，我们可以**通过requestAnimationFrame( )方法告诉浏览器某些代码将要执行动画**。这样浏览器可以在运行某些代码后进行适当的优化。

与`setTimeout`和`setInterval`方法不同，**`requestAnimationFrame`不需要调用者指定帧速率，浏览器会自行决定最佳的帧效率**。

>`requestAnimationFrame`是浏览器用于**定时循环操作**的一个接口，类似于setTimeout，主要用途是：**按帧对网页进行重绘**。

**设置这个API的目的是：**为了让各种网页动画效果（DOM动画、Canvas动画、SVG动画、WebGL动画）能够有一个**统一的刷新机制**，从而节省系统资源，提高系统性能，改善视觉效果。代码中使用这个API，就是**告诉浏览器希望执行一个动画，让浏览器在下一个动画帧安排一次网页重绘**。

>**requestAnimationFrame的优势在于：** 充分利用显示器的刷新机制，比较节省系统资源。显示器有固定的刷新频率（60Hz或75Hz），也就是说，每秒最多只能重绘60次或75次，`requestAnimationFrame`的基本思想就是与这个刷新频率保持同步，利用这个刷新频率进行页面重绘。此外，**使用这个API，一旦页面不处于浏览器的当前标签，就会自动停止刷新**。这就节省了CPU、GPU和电力。

`requestAnimationFrame`方法接收一个参数(一个函数)，即在重绘屏幕前调用这个函数。这个函数**负责改变下一次重绘时的DOM样式**。为了创建动画循环，可以像使用`setTimeout`一样，把多个对 `requestAnimationFrame`的调用**连起来**。如：
```js
function updateFrame() {
	//其他代码
	if(一定条件){
		//在满足一定条件的情况下，继续调用
		window.requestAnimationFrame(updateFrame);
	}
}
window.requestAnimationFrame(updateFrame);
```
>**特别注意：** requestAnimationFrame是在主线程上完成。这意味着，如果主线程非常繁忙，requestAnimationFrame的动画效果会大打折扣。

## 基本用法
```js
requestID = window.requestAnimationFrame(callback);
```
`requestAnimationFrame`使用一个回调函数作为参数。这个**回调函数会在浏览器重绘之前调用**。
### cancelAnimationFrame方法
cancelAnimationFrame方法用于取消重绘。
```js
window.cancelAnimationFrame(requestID);
```
它的参数是`requestAnimationFrame`返回的一个代表任务ID的整数值。
## requestAnimationFrame()兼容性
```js
 window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
```
首先判断各个浏览器是否支持这个API。如果不支持，则自行模拟部署该方法。上面的代码按照1秒钟60次（大约每16.7毫秒一次），来模拟`requestAnimationFrame`。
**Demo:**
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<style type="text/css">
		#anim{
			width: 200px;
			height: 200px;
			background-color: red;
			position: absolute;
		}
	</style>
</head>
<body>
<div id="anim">点击运行动画</div>
<script type="text/javascript">
//这里是兼容requestAnimationFrame
window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
var elem = document.getElementById("anim");
var startTime = undefined; //全局的
function render(time){ //time是局部的
  if (time === undefined)
    time = Date.now(); //获取到当前时间的毫秒数
  if (startTime === undefined)
     //第一次调用的时候startTime是undefined，之后就不是了
     //而time每次调用都等于当前时间的毫秒数
    startTime = time;
    //当是500的整数倍的时候，left值从0开始
  elem.style.left = ((time - startTime)/10%500) + "px";
}
elem.onclick = function(){
    (function animloop(){
      render();
      //这里利用requestAnimFrame方法来控制渲染的帧数
      requestAnimFrame(animloop);
    })();
};
</script>
</body>
</html>
```
**Demo2:**
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>模拟进度条</title>
	<style type="text/css">
	#box{
		height: 16px;
		background-color: #f00;
		color:#fff;
	}
	</style>
</head>
<body>
<div id="box">0%</div>
<input type="button" name="" value="加载" id="btn">
<script type="text/javascript">
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var oBox = document.getElementById("box"),
	oBtn = document.getElementById("btn"),
      progress = 0;
function requestAnim(timestamp){
	progress += 1;
	oBox.style.width = progress + 'px';
	oBox.innerHTML = progress + '%';
	if(progress<100){
		requestAnimationFrame(requestAnim);
	}
}
requestAnimationFrame(requestAnim);
oBtn.addEventListener('click',function(){
	oBox.style.width = "1px";
	progress = 0;
	requestAnimationFrame(requestAnim);
},false);
</script>
</body>
</html>
```
## 参考文档
1. [JavaScript 标准参考教程（alpha）](http://javascript.ruanyifeng.com/htmlapi/requestanimationframe.html)
2. [谈谈requestAnimationFrame的动画循环](http://www.tuicool.com/articles/ii2ieq6)
3. [requestAnimationFrame,Web中写动画的另一种选择](http://www.cnblogs.com/Wayou/p/requestAnimationFrame.html)
4. JS高级程序设计第3版