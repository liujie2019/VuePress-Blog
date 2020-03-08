---
title: Cookie和Session关系和区别
---
## HTTP协议
首先要先介绍什么是HTTP，HTTP:超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是一种用于分布式、协作式和超媒体信息系统的应用层协议。HTTP是万维网的数据通信的基础。设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。通过HTTP或者HTTPS协议请求的资源由统一资源标识符（Uniform Resource Identifiers，URI）来标识。

**HTTP 是无状态协议，说明它不能以状态来区分和管理请求和响应**。也就是说，服务器单从网络连接上无从知道客户身份。

可是怎么办呢？就给客户端们颁发一个通行证吧，每人一个，无论谁访问都必须携带自己通行证。这样服务器就能从通行证上确认客户身份了。这就是Cookie的工作原理。
## Cookie
Cookie是客户端保存用户信息的一种机制，用来记录用户的一些信息，实际上Cookie是服务器在本地机器上存储的一小段文本，并随着每次请求发送到服务器。

Cookie：通过请求和响应报文中写入Cookie信息来控制客户端的状态。
### Cookie应用
1. 实现购物车：比如京东，不登陆的情况可以向购物车添加商品，页面关闭后，再次打开，购物车中的商品还存在。
2. 邮箱用户名自动填充、10天记住用户名和密码。

![](https://github.com/liujie2019/static_data/blob/master/img/20200304002456.png?raw=true)
## Session

## Cookie与Session的区别
1. Cookie数据存放在客户的浏览器（客户端）上，Session数据放在服务器上，但是服务端的Session的实现对客户端的Cookie有依赖关系的；
2. Cookie不是很安全，别人可以分析存放在本地的Cookie并进行Cookie欺骗，考虑到安全应当使用Session；
3. Session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能。考虑到减轻服务器性能方面，应当使用Cookie；
4. 单个Cookie在客户端的限制是3K，就是说一个站点在客户端存放的Cookie不能超过3K；

## 参考文档
1. [Cookie 和 Session 关系和区别](https://juejin.im/post/5aa783b76fb9a028d663d70a#heading-4)