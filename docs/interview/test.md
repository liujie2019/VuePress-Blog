### 13. 如何居中一个浮动元素?
父元素和子元素同时左浮动，然后父元素相对左移动 50%，再然后子元素相对右移动 50%，或者子元素相对左移动-50%也就可以了。
```html
<style type="text/css">
  .box {
    position: relative;
    left: 50%;
    float: left;
  }
  .c {
    position: relative;
    float: left;
    right: 50%; /*或设置left: -50%;*/
  }
</style>
<div class="box">
  <h1 class="c">Test Float Element Center</h1>
</div>
```
### 14. css实现水平垂直居中
#### 14.1 绝对定位实现
#### 14.2 Flex 实现
#### 14.3 Table-cell
```html
<style type="text/css">
    .align-center{
        /*
    	负边距+定位：水平垂直居中
   	 	使用绝对定位将content的定点定位到body的中心，然后使用负margin（content宽高的一半），将content的中心拉回到body的中心，已到达水平垂直居中的效果。
        */
        position:absolute;
        left:50%;
        top:50%;
        width:400px;
        height:400px;
        margin-top:-200px;(可以使用css3的translate属性来实现)
        margin-left:-200px;
        border:1px dashed #333;
    }
```
### 15. CSS 实现三栏布局，中间自适应
#### 15.1 自身浮动法：左栏左浮动，右栏右浮动
```
.left, .right {
    height: 300px;
    width: 200px;
}
.right {
    float: right;
    background-color: red;
}
.left {
    float: left;
    background-color: #080808;
}
.middle {
    height: 300px;
    margin: 0 200px;//没有这行，当宽度缩小到一定程度的时候，中间的内容可能换行
    background-color: blue;
}
```
#### 15.2 margin 负值法
```html
<style>
  body {
    margin: 0;
    padding: 0;
  }
  .left,
  .right {
    height: 300px;
    width: 200px;
    float: left;
  }
  .right {
    margin-left: -200px;
    background-color: red;
  }
  .left {
    margin-left: -100%;
    background-color: #080808;
  }
  .middle {
    height: 300px;
    width: 100%;
    float: left;
    background-color: blue;
  }
</style>
<!--放第一行-->
<div class="middle">middle</div>
<div class="left">left</div>
<div class="right">right</div>
```
#### 15.3 绝对定位法
左右两栏采用绝对定位，分别固定于页面的左右两侧，中间的主体栏用左右 margin 值撑开距离。
```html
<style>
    body{
        margin: 0;
        padding: 0;
    }
    .left , .right{
        top: 0;
        height: 300px;
        width: 200px;
        position: absolute;
    }
    .right{
        right: 0;
        background-color: red;
    }
    .left{
        left: 0;
        background-color: #080808;
    }
    .middle{
        margin: 0 200px;
        height: 300px;
        background-color: blue;
    }
</style>
<div class="left">left</div>
<!--这种方法没有严格限定中间这栏放置何处-->
<div class="middle">middle</div>
<div class="right">right</div>
```
### 16. Sass、Less是什么？为什么要使用它们？
它们都是是CSS预处理器。是CSS上的一种抽象层。它们是一种特殊的语法/语言编译成CSS。
例如Less是一种动态样式语言. 将 CSS 赋予了动态语言的特性，如变量，继承，运算，函数，混合宏。 Less既可以在客户端上运行 (支持 IE 6+, Webkit, Firefox)，也可一在服务端运行 (借助 Node.js)。

**为什么要使用它们?**

- 结构清晰，便于扩展。
- 可以方便地屏蔽浏览器私有语法差异。这个不用多说，封装对浏览器语法差异的重复处理，减少无意义的机械劳动。
- 可以轻松实现多重继承。
- 完全兼容 CSS 代码，可以方便地应用到老项目中。LESS 只是在 CSS 语法上做了扩展，所以老的 CSS 代码也可以与 LESS 代码一同编译。

### 17. rgba(CSS3 中的新特性)和 opacity 的透明效果有什么不同？
`rgba()`和`opacity`都能实现透明效果，但最大的不同是`opacity`作用于元素，以及元素内的所有内容的透明度。

而`rgba()`只作用于元素的颜色或其背景色。（设置 rgba 透明的元素的子元素不会继承透明效果！）

### 18. 左侧定宽，右侧自适应
#### 18.1 浮动实现
```html
<style>
div {
    height: 300px;
}
.left {
    float: left;
    width: 200px;
    background-color: brown;
}
.right {
    margin-left: 200px;
    background-color: blue;
}
</style>
<body>
    <div class="left">left</div>
    <div class="right">right</div>
</body>
```
#### 18.2 flex 布局实现
```html
<style>
body {
    display: flex;
}
div {
    height: 300px;
}
.left {
    width: 200px;
    background-color: brown;
}
.right {
    flex: 1;
    margin-left: 200px;
    background-color: blue;
}
</style>
<body>
    <div class="left">left</div>
    <div class="right">right</div>
</body>
```
### 19. 水平垂直居中
```css
// 方法一
#container{
    position:relative;
}

#center{
    width:100px;
    height:100px;
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}
```
```css
// 方法二
#container{
    position:relative;
}

#center{
    width:100px;
    height:100px;
    position:absolute;
    top:50%;
    left:50%;
    margin:-50px 0 0 -50px;
}
```
```css
// 方法三
#container{
    position:relative;
}

#center{
    position:absolute;
    margin:auto;
    top:0;
    bottom:0;
    left:0;
    right:0;
}
```
```css
// 方法四
#container{
    display:flex;
    justify-content:center;
    align-items: center;
}
```
### 20. 实现一个不定宽高的div垂直水平居中
```css
// 方法一(使用Flex)
<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 500px;
    border: 1px solid blue;
}
.box {
    background-color: red;
    color: #ffffff;
}
</style>
<body>
    <div class="container">
        <div class="box">
            我要实现垂直水平居中
        </div>
    </div>
</body>
```
```css
// 方法二(使用CSS3中的transform)
<style>
.container {
    position: relative;
    width: 500px;
    height: 500px;
    border: 1px solid blue;
}
.box {
    background-color: red;
    color: #ffffff;
    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: 50%;
}
</style>
<body>
    <div class="container">
        <div class="box">
            我要实现垂直水平居中
        </div>
    </div>
</body>
```
```css
// 方法三(采用display:table-cell)
<style>
.container {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    width: 500px;
    height: 500px;
    border: 1px solid blue;
}
.box {
    background-color: red;
    color: #ffffff;
    display: inline-block;
    vertical-align: middle;
}
</style>
<body>
    <div class="container">
        <div class="box">
            我要实现垂直水平居中hahah
        </div>
    </div>
</body>
```
