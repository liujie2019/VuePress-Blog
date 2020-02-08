---
title: DOM的重绘(Repaint)和回流(Reflow)
---
[TOC]
![c87db65739b11ff1a8e80f02dbc83439.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1341)
![fd0504585284bab1078cc97a4460ee2d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1342)

>为什么采用Vue？数据驱动视图模式好处？
Vue和React基于virtual dom和dom diff最大限制减少了重绘和回流。比我们之前的直接操作dom开发模式，性能好很多。

## 回流(Reflow)，也叫重排

## 重绘(Repaint)
重绘：通知GPU重新绘制。
### 分离读写(现代浏览器有批处理渲染机制)
![41ff96f0801b1896bae481014d06735f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1343)
读取样式和设置样式分开写。

![27aa27599c5a93d5f1ff97c68998fc21.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1344)
这样会导致两次回流。

![8186ab9afc6bc0ffbba7200ab7320a1d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1345)
![8139f73c81408a7e75b93501663d5ce3.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1346)
### 缓存处理
![584989a497ae006a6bceb284d938a55a.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1347)

### 文档碎片
![442bb7495a3774a875941d384438c100.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1350)
![bae9fa620d83ac7826811fb36bc3605b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1352)
### 动画效果应用到position属性为absolute或fixed的元素上
absolute或fixed使得当前元素脱离文档流，不会对文档流中的其他元素产生影响。还是会发生重绘和回流，但是大大减小影响。
![d0eff1f6d8ca867c4e76e55b908c8f2b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1354)
### CSS3硬件加速(GPU加速)会规避回流

### 避免table布局

![81a24c6492155aa0fa64d10359446fc6.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1362)
![584f3d49631e0d5a45a8deb978f3053c.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1355)
![c2a3a80e3f6d7a7dc4b7e4561a64a93d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1356)
![1b80cae587ff687e0dd781361339b126.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1357)
![669fc7f52f3a4fef4368e750f574f9d9.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1358)
![f718d1d09a6ea601622f2aff93bf24d2.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1359)
![76926229ac0f4af993f8b6bce41731cd.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1360)
![0c7db06d17c482b96b60e717eab4474b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1361)
