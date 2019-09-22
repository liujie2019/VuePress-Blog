---
title: 原型与原型链
lang: zh
---
![c6e7f00c71975016a186478f8ceb9633.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1153)
>原型关系图：

![7f7344379ba2cbd4c2c37268b2b696a3.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1154)
![46db724a7f569b355459d4ac7c51fec4.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1172)

## 知识点
### 构造函数
![8be6373bce78cb84a1aef839fe882159.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1019)
### 构造函数-扩展
![5de292bb314c322d9d9381b0e1c6bf72.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1021)
### 原型规则(5条)和示例
![c317502a11c21811184dfdf5e551a613.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1022)
![9a049141607abe841c8c66513b5f7a95.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1023)
![e46f9377ab1fa4c92b2ae58a199e6ce3.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1024)
`__proto__`称为隐式原型。

![61c3c2cd45c7b6e5e13bd4b02806df8b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1026)
![59dfa9a353dda31fe37c3e06635f4f79.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1027)
![acf561b41f2867dc5acab60218c3b808.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1030)
>对象的隐式原型和对象的构造函数的显式原型其实是一回事。

![dfac3d0f75503ca65b3f7cd60179f6e4.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1031)
![1696642060451372786eb145ab4aeadc.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1033)
### 原型链
![6dac3d52c192a8f433cac114ebd53d3b.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1034)
![077289a685c07ca6101b63b154f75e8c.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1035)
>Foo.prototype是原型对象，对象的构造函数即Object，`Foo.prototype.__proto__`是Foo.prototype的隐式原型，指向其构造函数Object的显式原型，即Object.prototype。

### instanceof
![31bd4cc7a505d49b0c5660be24c9885f.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1036)
![d8cf3caad238c451e776ed8409ce4f21.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1037)
![51c7b77dd554dbd80518821fb0b79c65.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1044)

## 题目
![93c61e2403b5a853ad6189bfe158c5e1.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1016)

### 如何判断一个变量是数组类型
```js
[1, 2] instanceof Array // true
```
![9f12dd76bdce4bdb8d17e5d86d5686ab.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1038)
### 封装DOM查询
![cee0542f501101904ef197fff207faaa.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1039)
![9f39a4d84942580075b5652c38afd944.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1042)
![1aab145e300336684f459386973dae3d.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1043)

###
![8a7a67c81751fcd368fcd49ecf6b1ac3.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1040)
![70de269f064a96f6155e02ee92dd87d2.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1041)

## 参考文档
1. [深度解析原型中的各个难点](https://github.com/KieSun/Dream/issues/2)
2. [JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)