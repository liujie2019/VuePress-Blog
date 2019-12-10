---
title: CSS基础知识总结
---
[TOC]
## 1. 列举CSS选择器，哪些属性可以继承？选择器优先级如何计算？
CSS选择器：
* id：#
* class：.
* 标签：div p
* 相邻：ul+div
* 子选择器：ul>li
* 后代选择器：ul li
* 属性选择器：a[href='xxx']
* 伪类选择器：a:fater a:hover
* 通配符：*

### 选择器优先级
!important > 行内样式 > id > 类 > 标签。
### CSS可继承属性
* color
* font-size

## 2. 盒子模型
包括：margin->border->padding->content。

* 标准模型：宽高计算不包含padding和border；通过 `box-sizing: content-box;`来设置（浏览器默认）。
* IE模型：宽高计算包含 padding 和 border ;通过 box-sizing: border-box; 来设置。

## 3. BFC(块状格式化上下文)
特点：
* 是一个独立的容器，里面的元素和外面的元素互不影响；
* BFC垂直方向的margin会发生重叠；
* BFC区域不会与浮动元素区域重叠；
* 计算BFC高度时，浮动元素也参与计算。

触发方式：
* float值不为none;
* position的值不为static或relative;
* display为inline-block, table, table-cell 等；
* overflow不为visible。

作用：
* 清除浮动
* 防止同一BFC容器中的相邻元素间的外边距重叠问题

## 4. 实现垂直水平居中布局
### 宽高固定
```css
div.parent {
    position: relative;
}
div.child {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
}
或
div.child {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```
### 宽高不固定
```css
div.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
或
div.parent{
  display:flex;
}
div.child{
  margin:auto;
}
或
div.parent {
    position: relative;
}
div.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
或
div.parent {
    display: grid;
}
div.child {
    justify-self: center;
    align-self: center;
}
```
更多[干货!各种常见布局实现+知名网站实例分析](https://juejin.im/post/5aa252ac518825558001d5de)

## 5. 分析比较opacity: 0、visibility: hidden、display: none优劣和适用场景
* 结构上：
    * display:none会从渲染树中消失，元素不占据空间且无法点击；
    * visibility: hidden 不会从渲染树中消失，元素继续占据空间但无法点击；
    * opacity: 0 不会从渲染树消失，元素占据空间且可点击。
* 继承性：
    * display: none和opacity: 0是非继承属性；父元素设置了 display:none 或 opacity: 0，子元素无论怎么设置都无法显示；visibility: hidden 会被子元素继承，并且子元素可以通过设置设置 visibility: visible; 来取消隐藏。
* 性能上：
    * display: none;会引起重排，性能消耗较大；
    * visibility: hidden 会引起重绘，性能消耗相对较小；
    * opacity: 0 会重建图层，性能较高

## 6. link标签和import标签的区别
1. link属于html标签，而@import是CSS提供的；
2. 页面被加载时，link会同时被加载，而@import引用的 CSS会等到页面加载结束后加载；
3. link标签样式的权重高于@import的；
4. link可以使用js动态引入(通过动态创建link标签，并为其指定src属性值)，@import不行；
5. link标签没有兼容性要求，而@import要求IE5以上才能识别。

## 7. flex布局的应用场景

## 8. 移动端Retina，1px像素问题的解决方案

* viewport + rem
* background-image
* 伪元素 + transform scale()
* box-shadow
[7 种方法解决移动端 Retina 屏幕 1px 边框问题](https://juejin.im/entry/584e427361ff4b006cd22c7c)

## 9. 文本显示行数控制
### 单行
```css
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
```
### 多行
```css
overflow: hidden;
text-overflow: ellipsis; // 超出显示'...'
display: -webkit-box; // 将元素作为弹性伸缩盒子模型显示 。
-webkit-line-clamp: 2; // 用来限制在一个块元素显示的文本的行数
-webkit-box-orient: vertical; // 设置或检索伸缩盒对象的子元素的排列方式
```
## 10. 清除浮动的方式
* :after伪类
```css
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
```
```css
clear: both
```
* 基于BFC原理
```css
overflow: hidden
```
## 11. transition和animate有何区别?
* transition：用于做过渡效果，没有帧概念，只有开始和结束状态，性能开销较小
* animate：用于做动画，有帧的概念，可以重复触发且有中间状态，性能开销较大

## 12. 纯css实现一个扇形
```css
.sector {
  width: 0;
  height: 0;
  border-width: 50px;
  border-style: solid;
  border-color: red transparent transparent;
  border-radius: 50px;
}
```