---
title: BFC
---
## BFC是什么
BFC（Block Formatting Context）即块级格式化上下文，是网页CSS视觉渲染的一部分，并用于决定块盒子的布局，在定位体系中它属于常规流。

简记：BFC就是用来形成一个独立的空间，让空间里的子元素不会影响到外面的布局。
## 如何触发BFC
一个BFC就是一个HTML盒子，它至少满足以下条件之一：

1. 浮动：float属性不为none；
2. 绝对定位：position属性为absolute或fixed(不为relative和static)；
3. overflow不为visible的元素(即overflow为auto、scroll和hidden)；
4. 行内块元素display:inline-block、表格单元格display:table-cell、表格标题 display:table-caption；
5. 根元素或其它包含它的元素；
6. 弹性盒flex box(display:flex或inline-flex)；

>需要注意：尽管上述条件都可以触发BFC，但也会产生一些其他效果，如：

 - display: table;可能引发响应性问题
 - overflow: scroll;可能产生多余的滚动条
 - float: left;将把元素移至左侧，并被其他元素环绕
 - overflow: hidden;将裁切溢出元素

所以无论何时，当要创建一个BFC时，我们要基于需求选择最恰当的样式。
## BFC可以解决什么问题
### 清除浮动
解决浮动元素使得父元素高度塌陷的问题。

我们知道给父元素设置overflow:hidden可以清除子元素的浮动，但是不知道原理是什么。现在学习了BFC后，理解了**其原理：** 当在父元素中设置**overflow:hidden时就会触发BFC**，所以父元素内部的子元素就不会影响外面的布局，BFC就把浮动的子元素高度当做了自己内部的高度去处理溢出，所以外面看起来是清除了浮动。
**Demo:**
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>清除浮动</title>
	<style type="text/css">
		.wrap{
			padding: 5px;
			border: 1px solid blue;
			overflow: hidden;
		}
		.box{
			width: 100px;
			height: 100px;
			background-color: red;
			margin-bottom: 5px;
			float: left;
		}
	</style>
</head>
<body>
	<div class="wrap">
		<div class="box">浮动div1</div>
		<div class="box">浮动div2</div>
		<div class="box">浮动div3</div>
	</div>
</body>
</html>
```
除了给父元素设置overflow:hidden，设置如下的任意一个都可以触发BFC，达到清除浮动的效果。
```css
// position
position: absolute;
position: fixed;
// display
display: table-cell;
display: table-caption;
display: inline-block;
// overflow
overflow: hidden;
overflow: auto;
overflow: scroll;
overflow: overlay;
```

### 解决自适应布局的问题(两栏自适应布局)

### 解决外边距垂直方向重合问题
### 消除垂直margin合并
同一个块格式化上下文中的相邻块级盒之间的**垂直margin**会合并，**水平方向上margin不合并**。
margin会产生合并(**经测试只会发生垂直margin的合并，左右的margin不会发生合并**)的情况有2种：一种是兄弟元素之间，一种是父元素和子元素之间。
#### 方法1(解决兄弟元素之间的margin合并)
给发生margin重叠的元素添加一个父元素，并触发父元素的BFC。
<img :src="$withBase('/css/bfc.png')" alt="">

```html
<style>
    .outer {
        border: 1px solid #000;
    }
    .inner {
        background: red;
        width: 200px;
        height: 100px;
        margin: 10px;
    }
    .item {
        overflow: hidden;
    }
</style>
</head>
<body>
    <div class="outer">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="item">
            <div class="inner"></div>
        </div>
    </div>
</body>
```
#### 方法2(解决父子元素之间的margin合并)
父元素和子元素产生margin合并的条件是：处于同一个**块级格式上下文**中，且两者之间没有padding，border和空隙。

当然我们可以通过给父元素和子元素增加border，padding的方法来消除，但是有时候我们可能不需要border和padding。所以还有另一种好的方法是：可以给父元素设置新的块级格式上下文，加一个overflow:hidden。这样父元素就不会和子元素的margin发生重叠了。

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>消除margin合并</title>
	<style type="text/css">
		.wrap{
			width: 200px;
			height: 200px;
			background-color: red;
			margin: 10px;
			/*可以通过给父元素和子元素同时设置border属性来消除marhin的合并*/
			/*border: 1px solid #000;*/
			overflow: hidden;
		}
		.box{
			width: 100px;
			height: 100px;
			background-color: blue;
			margin: 10px;
			/*border: 1px solid #000;*/
		}
	</style>
</head>
<body>
	<div class="wrap">
		<div class="box">我是子元素</div>
	</div>
</body>
</html>
```
## 小结
当我们在进行盒模型布局的时候，如果一个元素符合了成为BFC的条件，该元素将成为一个隔离的**独立容器**，内部元素会垂直的沿着其父元素的边框排列，和外部元素互不影响。

## 参考文档
1. [学习BFC](http://web.jobbole.com/83274/)
2. [什么是BFC](http://web.jobbole.com/84808/)
3. [前端精选文摘：BFC 神奇背后的原理](http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html)