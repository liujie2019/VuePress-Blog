---
title: Cookie和Session关系和区别
---
[TOC]
## HTTP协议
首先要先介绍什么是HTTP，HTTP:超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是一种用于分布式、协作式和超媒体信息系统的**应用层协议**。HTTP是万维网数据通信的基础，设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。通过HTTP或者HTTPS协议请求的资源由统一资源标识符（Uniform Resource Identifiers，URI）来标识。

**HTTP是无状态协议，说明它不能以状态来区分和管理请求和响应**。也就是说，服务器单从网络连接上无法知道用户的身份。

可是怎么办呢？就给客户端们颁发一个通行证吧，每人一个，无论谁访问都必须携带自己通行证。这样服务器就能从通行证上确认用户身份了。这就是Cookie的工作原理。
## Cookie
Cookie翻译过来是`小甜饼`，Cookie是**客户端保存用户信息的一种机制**，用来记录用户的一些信息，实际上Cookie是服务器在本地机器上存储的一小段文本，并随着每次请求发送到服务器。

Cookie的作用就是为了解决HTTP协议无状态。Cookie通过请求和响应报文中写入Cookie信息来控制客户端的状态。

Cookie是存在浏览器端的，可以用来存储用户信息。Cookie会根据响应报文里的一个叫做`Set-Cookie`的首部字段信息，通知客户端保存Cookie。当客户端再次向服务端发起请求时，客户端会自动在请求报文中加入Cookie值之后发送出去。服务端发现客户端发送过来的Cookie后，会检查是哪个客户端发送过来的请求，然后对服务器上的记录，最后得到了之前的状态信息。

Cookie是保存在本地终端的数据。Cookie由服务器生成，通过响应头发送给浏览器，浏览器把Cookie以kv对形式保存到某个目录下的文本文件内，下一次请求同一网站时会把该Cookie发送给服务器。由于Cookie是存储在客户端上的，所以浏览器加入了一些限制，确保Cookie不会被恶意使用，同时不会占据太多磁盘空间，所以每个域的Cookie数量是有限的。

![](https://github.com/liujie2019/static_data/blob/master/img/20200419145933.png?raw=true)

我们可以通过Cookie中的信息来和服务端进行通信。

Cookie支持跨域名访问，例如将domain属性设置为`.baidu.com`，则以`.baidu.com`为后缀的一切域名均能够访问该Cookie。跨域名Cookie如今被普遍用在网络中，例如Google、Baidu、Sina等。

### Cookie相关属性
```js
Set-Cookie: logcookie=3qjj; expires=Wed, 13-Mar-2019 12:08:53 GMT; Max-Age=31536000; path=/;domain=fafa.com;secure; HttpOnly;
```
* key&value：logcookie=3qjj => Cookie的名称和值，logcookie是名字，3qjj是值；
* expires：设置cookie有效期。当省略expires属性时，Cookie仅在关闭浏览器之前有效。可以通过覆盖已过期的Cookie，设置这个Cookie的过期时间是过去的时间，实现对客户端Cookie 的实质性删除操作；
* Max-Age：设置Cookie的有效期；
* path：是限制指定Cookie 的发送范围的文件目录。不过另有办法可避开这项限制，看来对其作为安全机制的效果不能抱有期待。
* domain：通过domain属性指定的域名可以做到与结尾匹配一致。比如，指定domain是fafa.com，除了fafa.com那么www.fafa.com等都可以发送Cookie
* secure：设置web页面只有在HTTPS安全连接时，才可以发送Cookie。HTTP则不可以进行回收。该属性为true时，只有在使用SSL连接时才发送Cookie到服务器(https)。
* HttpOnly：它使JavaScript 脚本无法获得Cookie，通过上述设置，通常从Web 页面内还可以对Cookie 进行读取操作。但使用JavaScript 的document.cookie就无法读取附加HttpOnly属性后的Cookie 的内容了。

![](https://github.com/liujie2019/static_data/blob/master/img/20200419223445.png?raw=true)
### 前后端协同使用
Cookie数据会自动在Web浏览器和Web服务器之间传输，在服务端通使用HTTP协议规定的set-cookie来让浏览器种下cookie，每次网络请求`Request headers`中都会带上cookie。所以如果cookie太多太大对传输效率会有影响。

因此服务端脚本就可以 读、 写存储在客户端的cookie的值。

前后端协同使用流程
![](https://github.com/liujie2019/static_data/blob/master/img/20200419223226.png?raw=true)
### Cookie应用
1. 实现购物车：比如京东，不登陆的情况可以向购物车添加商品，页面关闭后，再次打开，购物车中的商品还存在。
2. 用户名自动填充(比如邮箱)。比如你某次登陆过一个网站，下次登录的时候不想再次输入账号了，怎么办？这个信息可以写到Cookie里面，访问网站的时候，网站页面的脚本可以读取这个信息，就自动帮你把用户名给填了，能够方便一下用户。
3. 自动登录(比如：10天记住用户名和密码)。Cookie是浏览器保存信息的一种方式，可以理解为一个文件，保存到客户端，服务器可以通过响应浏览器的set-cookie的标头，得到Cookie的信息。你可以给这个文件设置一个期限，这个期限呢，不会因为浏览器的关闭而消失。

![](https://github.com/liujie2019/static_data/blob/master/img/20200304002456.png?raw=true)
### Cookie实战
![](https://github.com/liujie2019/static_data/blob/master/img/20200418154233.png?raw=true)
在响应头中通过Set-Cookie字段通知浏览器保存相关Cookie。
![](https://github.com/liujie2019/static_data/blob/master/img/20200418154601.png?raw=true)
在这里，name是会话级别的Cookie，age是持久化Cookie。

需要注意：持久化Cookie会在一定时间之后过期，到了过期时间浏览器会自动删除该Cookie。会话Cookie会在
## Session
session是一种基于cookie的让服务器能识别某个用户的「机制」，当然也可以特指服务器存储的 session数据。

Session不会支持跨域名访问，仅在它所在的域名内有效。

Cookie可以达到保持用户登录态的效果，但是Cookie中存储着用户信息，显然不是很安全。所以，这个时候我们需要存储一个唯一的标识。这个标识就像一把钥匙一样，比较复杂，看起来没什么规律，也没有用户的信息。只有我们自己的服务器可以知道用户是谁，但是其他人无法模拟。

这个时候Session就出现了，Session存储用户会话所需的信息。简单理解主要存储那把钥匙Session_ID，用这个钥匙Session_ID(是Session对象的唯一标识)再去查询用户信息。但是这个标识需要存在Cookie中，所以，Session机制需要借助于Cookie机制来达到保存标识Session_ID的目的。
如下图所示：
![](https://github.com/liujie2019/static_data/blob/master/img/20200419150627.png?raw=true)

首先需要知道的是，服务端执行session机制时候会生成session的id值，这个id值会发送给客户端，客户端每次请求都会把这个id值放到http请求的头部发送给服务端，而这个id值在客户端会保存下来，保存的容器就是cookie，因此当我们完全禁掉浏览器的cookie的时候，服务端的session也会不能正常使用。 

PHP中的Session，在默认情况下是使用客户端的Cookie来保存Session ID的，所以当客户端的cookie出现问题的时候就会影响Session了。

必须注意的是：Session不一定必须依赖Cookie，这也是Session相比Cookie的高明之处。当客户端的Cookie被禁用或出现问题时，PHP会自动把Session ID附着在URL中，这样再通过Session ID就能跨页使用Session变量了。

### session是什么
* 浏览器端：从浏览器打开到浏览器关闭是同一个会话
* 服务器端：是一个内存中的容器对象，用来存储特定的数据
### session运作流程
1. 一个新的浏览器访问服务器时，创建一个新的session对象，可以用session保存特定数据，如用户ID；
2. 而每个session对象都有唯一的id，服务器自动以会话cookie携带id值返回给浏览器；
3. 浏览器接收到响应后自动在内存中保存sessionID的cookie，后面发请求都会携带此cookie数据；
4. 服务器接收到此请求后，根据sessionID的cookie就可以找到前面创建的session对象，从而可以得到对应的数据。

需要注意：每个用户登录，服务端都会为该用户新生成一个session对象。也就是说每个用户都有自己的session对象，这个session对象有自己唯一的标识即sessionid。用户登录成功后，将自己的id值存储在session对象中，并将sessionid作为Cookie返回给浏览器。当浏览器再次请求时，会自动携带上这个sessionid，服务端根据这个sessionid就可以找到对应的session对象，进而可以获取到session对象中保存的用户id。

1. 用户在输入用户名密码提交给服务端，服务端验证通过后会创建一个session用于记录用户的相关信息的对象，这个session对象中放有生成的sessionid，也可以放一些非机密的userinfo。session对象可保存在服务器内存中（容易产生内存泄露），生产环境一般是保存在数据库中。
2. 创建session后，会把关联的session_id 通过setCookie 添加到http响应头部中。
浏览器在加载页面时发现响应头部有 set-cookie字段，就把这个cookie 种到浏览器指定域名下。
3. 客户端接收到从服务器端发来的 Session ID 后，会将其作为 Cookie 保存在本地。之后你发起刷新或者下单的请求时，浏览器会自动发送被种下sessionid的cookie，后端接受后去存session的地方根据sessionid查找是否有此session（有既证明处于登录状态的真实用户，否则拒绝此次请求），如果有，还可以读取登录时放的userinfo，获取用户身份（user_id）。

### 注意事项
1. 如果 Session ID 被第三方盗走，对方就可以伪装成你的身份进 行恶意操作了。因此必须防止 Session ID 被盗，或被猜出。为了做到 这点，Session ID 应使用难以推测的字符串，且服务器端也需要进行 有效期的管理（即使不幸被盗，之后也因有效期已过而失效），保证其安全性。
2. 另外，为减轻跨站脚本攻击（XSS）造成的损失，建议事先在 Cookie 内加上 httponly 属性。
3. 如果客户端的浏览器禁用了 Cookie 怎么办？一般这种情况下，会使用一种叫做URL重写的技术来进行会话跟踪，即每次HTTP交互，URL后面都会被附加上一个诸如 sid=xxxxx 这样的参数，服务端据此来识别用户。

### session使用
还是以express为例：
使用session中间件：
```js
yarn add express-session
```
```js
const session = require('express-session');
app.use(session({
    name: 'sessionId',
    secret: 'session_test',
    resave: true,
    saveUninitialized: true
}));
```
使用session对象：

* 创建session对象：req.session
* 得到session对象：res.session
* 向session对象中保存数据：session.xxx = value
* 读取session对象中的数据：session.xxx
* 删除session中的数据：delete session.xxx
#### demo
```js
app.use(session({
    name: 'sessionId',  // 对应cookie的名称，默认为connect.sid
    // 将对应的cookie设置为持久化cookie ==> 关闭浏览器再打开还是以前的session
    cookie: {maxAge: 1000 * 60 * 60 * 24}, // cookie的有效期
    secret: 'session_test', // 内部加密的密钥(cookie中携带的sessionid编码后的密文)
    resave: true, // 每次请求都重新指定cookie的有效期
    saveUninitialized: true // 在向session中保存数据前就生成cookie
}));
```
```js
cookie: {maxAge: 1000 * 60 * 60 * 24}, // cookie的有效期
```
如果不设置cookie有效期的话，默认是会话cookie。当浏览器关闭后再次重新打开浏览器访问页面时，将处于非登录状态。

而设置了持久化cookie，再cookie有效期之内，用户关闭浏览器再重新打开浏览器访问页面时，用户还是处于登录状态。

```js
/**
 * 退出登录
*/
router.get('/logout', (req, res) => {
    delete req.session.userId;
    res.redirect('/session_test.html');
});
```
当退出登录时，删除服务器端存储的session对象中存储的userId。再次获取用户信息时，即使请求中携带有cookie，也无法获取成功，因此cookie对应的session已经被删除了。

当用户登录成功后，清除浏览器中保存的sessionid，再次请求用户信息时也不会拿到对应的用户信息，因此cookie已经被删除了，请求的时候并没有携带对应的cookie信息，即便是服务端对应的session对象还存在，请求中没有cookie，服务端也无法判断你是谁。
## cookie + session 方式的局限性
1. 是存储式的有状态验证，由于一定时间内它是保存在服务器上的，当访问增多时，会较大地占用服务器的性能。
2. 如果web服务器做了负载均衡，那么下一个操作请求到了另一台服务器的时候session会丢失。
3. 有安全隐患：CSRF。因为是基于cookie来进行用户识别的，cookie如果被截获，用户就会很容易受到跨站请求伪造的攻击。

## Cookie与Session的区别
1. 存储位置不同：Cookie数据存放在客户的浏览器（客户端）上，Session数据存放在服务器上。但是服务端的Session的实现对客户端的Cookie有依赖关系的；
2. Cookie不是很安全，别人可以分析存放在本地的Cookie并进行Cookie欺骗，考虑到安全应当使用Session；
3. Session会在一定时间内保存在服务器上。当访问量增多时，会比较占用服务器的性能。考虑到减轻服务器性能方面，应当使用Cookie；
4. 单个Cookie在客户端的限制是4K，就是说一个站点在客户端存放的Cookie不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。

建议：
* 将登陆信息等重要信息存放为SESSION；
* 其他信息如果需要保留，可以放在COOKIE中。

## 【实战】登录验证
### 登录态保持总结
1. 浏览器第一次请求网站， 服务端生成 Session ID。
2. 把生成的 Session ID 保存到服务端存储中。
3. 把生成的 Session ID 返回给浏览器，通过 set-cookie。
4. 浏览器收到 Session ID， 在下一次发送请求时就会带上这个 Session ID。
5. 服务端收到浏览器发来的 Session ID，从 Session 存储中找到用户状态数据，会话建立。
6. 此后的请求都会交换这个 Session ID，进行有状态的会话。

![](https://github.com/liujie2019/static_data/blob/master/img/20200419150911.png?raw=true)
## 参考文档
1. [Cookie 和 Session 关系和区别](https://juejin.im/post/5aa783b76fb9a028d663d70a#heading-4)
2. [聊一聊cookie ,session](https://www.jianshu.com/p/45932e735517)
3. [Cookie&Session，登录的那些小事儿~](https://juejin.im/post/5cdcd5eff265da039d32a9b5)
4. [Cookie 与 Session 的区别](https://juejin.im/entry/5766c29d6be3ff006a31b84e)
5. [当浏览器全面禁用三方 Cookie](https://juejin.im/post/5e97124df265da47b27d97ff#heading-0)