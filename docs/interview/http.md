---
title: HTTP知识点汇总.md
---
## 1. 什么是HTTP
HTTP是一个连接客户端，网关和服务器的一个协议。
### HTTP协议的主要特点
* 支持客户/服务器模式：可以连接客户端和服务端；
* 简单快速：请求只需传送请求方法，路径和请求主体；
* 灵活：传输数据类型灵活；
* 无连接：请求结束立即断开；
* 无状态：无法记住上一次请求。

### 怎么解决无状态和无连接
* 无状态：HTTP协议本身无法解决这个状态，只有通过cookie和session将状态做贮存，常见的场景是登录状态保持；
* 无连接：可以通过自身属性Keep-Alive。
## 2. HTTP报文的组成部分
请求报文：
* 请求行 (http方法 + 页面地址 + http协议 + 版本)
* 请求头(key + value值)
* 空行(服务端通过空行来判断下一部分不再是请求头，而当做请求体来解析)
* 请求体(数据部分)
响应报文：状态行 + 响应头 + 空行 + 响应体

## HTTP请求过程
在浏览器中输入url地址 -> 发起HTTP请求 → DNS 解析 → 三次握手 → 发送请求 → 四次挥手
![acebf9d12ea64f65e148f78395b323c0.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1477)
![f41c8443a642f9c4aa1c9c466d0c0773.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1478)

## TCP三次握手和四次挥手的理解
三次握手和四次挥手可以模拟成对讲机通话的过程
三次握手：
A：你好，我是A
B：收到，我是B
A：好的，我们可以开始通话啦

四次挥手：
A：我已经没什么话说了，结束通话吧
B：稍等，我还有最后一句话要说
B：我已经说完了
A：好的，你可以关掉对讲机了，不用回复了（然后A等待2MSL无回复，也关掉对讲机）
## HTTP1.x(1.0 1.1)、2.0有什么区别？http 1.0的keep-alive功能，http的长连接功能。
[基础-HTTP 0.9~HTTP 3.0(HTTP协议)](https://app.yinxiang.com/shard/s50/nl/10797539/cd306fca-4897-4b40-b33d-42f6fa75dac1/)
[简单讲解一下 http2 的多路复用](https://github.com/ravencrown/noteBook/issues/16)
在HTTP/1中，每次请求都会建立一次HTTP连接，也就是我们常说的3次握手4次挥手，这个过程在一次请求过程中占用了相当长的时间，即使开启了 Keep-Alive ，解决了多次连接的问题，但是依然有两个效率上的问题：

* 第一个：串行的文件传输。当请求a文件时，b文件只能等待，等待a连接到服务器、服务器处理文件、服务器返回文件，这三个步骤。我们假设这三步用时都是1秒，那么a文件用时为3秒，b文件传输完成用时为6秒，依此类推。（注：此项计算有一个前提条件，就是浏览器和服务器是单通道传输）
* 第二个：连接数过多。我们假设Apache设置了最大并发数为300，因为浏览器限制，浏览器发起的最大请求数为6，也就是服务器能承载的最高并发为50，当第51个人访问时，就需要等待前面某个请求处理完成。

HTTP/2的多路复用就是为了解决上述的两个性能问题。
在HTTP/2中，有两个非常重要的概念，分别是帧（frame）和流（stream）。
帧代表着最小的数据单位，每个帧会标识出该帧属于哪个流，流也就是多个帧组成的数据流。
多路复用，就是在一个 TCP 连接中可以存在多条流。换句话说，也就是可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。通过这个技术，可以避免 HTTP 旧版本中的队头阻塞问题，极大的提高传输性能。
### http请求中的keep-alive
在http1.1中默认开启keep-alive。

http2的多路复用，简单来说就是在同一个TCP连接，同一时刻可以传输多个HTTP请求。
http2之前是同一个连接只能用一次，如果开启了keep-alive，虽然可以用多次，但是同一时刻只能有一个HTTP请求。
## http2的多路复用
[第 15 题：简单讲解一下 http2 的多路复用 ](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/14)
HTTP2采用二进制格式传输，取代了HTTP1.x的文本格式，二进制格式解析更高效。
多路复用代替了HTTP1.x的序列和阻塞机制，所有的相同域名请求都通过同一个TCP连接并发完成。在HTTP1.x中，并发多个请求需要多个TCP连接，浏览器为了控制资源会有6-8个TCP连接都限制。
HTTP2中：
* 同域名下所有通信都在单个连接上完成，消除了因多个TCP连接而带来的延时和内存消耗。
* 单个连接上可以并行交错的请求和响应，之间互不干扰。

简单版回答：
HTTP/2复用TCP连接，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应。

举例来说，在一个TCP连接里面，服务器同时收到了A请求和B请求，于是先回应A请求，结果发现处理过程非常耗时，于是就发送A请求已经处理好的部分，接着回应B请求，完成后，再发送A请求剩下的部分。

历史原因解释：
1、HTTP/1.0版本
该版本主要缺点是，每个TCP连接只能发送一个请求。发送数据完毕，连接就关闭，如果还要请求其他资源，就必须再新建一个连接。为了解决这个问题，需要使用Connection: keep-alive这个字段。

2、HTTP/1.1 版本
该版本引入了持久连接（persistent connection），即TCP连接默认不关闭，可以被多个请求复用，**不用声明Connection: keep-alive**。还引入了管道机制（pipelining），即在同一个TCP连接里面，客户端可以同时发送多个请求。这样就进一步改进了HTTP协议的效率。

虽然1.1版允许复用TCP连接，但是同一个TCP连接里面，所有的数据通信是按次序进行的。**服务器只有处理完一个回应，才会进行下一个回应。要是前面的回应特别慢，后面就会有许多请求排队等着。这称为"队头堵塞"（Head-of-line blocking）**。
## HTTP1.x和2.0有什么区别？http 1.x的keep-alive 和 http2.0的多路复用的区别？
答案1：
* 线头阻塞（Head-of-Line Blocking），HTTP1.X虽然可以采用keep alive来解决复用TCP的问题，但是还是无法解决请求阻塞问题。
* 所谓请求阻塞意思就是一条TCP的链接在同一时间只能允许一个请求经过，这样假如后续请求想要复用这个链接就必须等到前一个完成才行，正如上图左边表示的。
* 之所以有这个问题就是因为HTTP1.x需要每条请求都是可是识别，按顺序发送，否则server就无法判断该相应哪个具体的请求。
* HTTP2采用多路复用是指，在同一个域名下，开启一个TCP的链接，每个请求以stream的方式传输，每个stream有唯一标识，链接一旦建立，后续的请求都可以复用这个链接并且可以同时发送，server端可以根据stream的唯一标识来相应对应的请求。
答案2：
* 在http1.1中 默认允许 connect： keep-alive 但是在一个TCP里面 数据通信时按次进行，也就是说第二次请求发送要在第一次响应后进行，若第一次响应慢，则要一直阻塞。这个问题就是对头阻塞。
* 在HTTP/2.0中，在一个TCP链接中，客户端和服务器可以同时发送多个请求和响应，则避免了对头阻塞， 实现了 双向 实时 多工。 在2.0中 采用了数据流，对同一个请求或响应的所有数据包做了一个独一无二的标识，所以可以不用等待发送。两端会根据标识组装数据流。
## HTTPS理解
HTTPS还是通过HTTP来传输信息，但是信息通过TLS协议进行了加密。
TLS中的加密：
* 对称加密：两边拥有相同的秘钥，两边都知道如何将密文加密解密。
* 非对称加密：有公钥私钥之分，公钥所有人都可以知道，可以将数据用公钥加密，但是将数据解密必须使用私钥解密，私钥只有分发公钥的一方才知道。

HTTPS握手过程：
* 第一步，客户端给出协议版本号、一个客户端生成的随机数（Client random），以及客户端支持的加密方法。
* 第二步，服务端确认双方使用的加密方法，并给出数字证书、以及一个服务器生成的随机数（Server random）。
* 第三步，客户端确认数字证书有效，然后生成一个新的随机数（Premaster secret），并使用数字证书中的公钥，加密这个随机数，发给服务端。
* 第四步，服务端使用自己的私钥，获取客户端发来的随机数（即Premaster secret）。
* 第五步，客户端和服务端根据约定的加密方法，使用前面的三个随机数，生成"对话密钥"（session key），用来加密接下来的整个对话过程。

## HTTP2.0的特性
* 二进制传输：将所有传输的信息分割为更小的消息和帧，并对它们采用二进制格式的编码
* 多路复用：一个 TCP 连接中可以发送多个请求
* Header 压缩
* 服务器推送：服务器可以额外的向客户端推送资源，而无需客户端明确的请求

三、304状态码原理，last-modified，Etag那些
四、缓存相关，强缓存协商缓存。max-age和expires的区别。缓存有哪些？
五、http2.0的特性，http2.0有没有最大数连接？
## 常见状态码
1xx：指示信息 —— 表示请求已接受，继续处理

2xx：成功 —— 表示请求已被成功接受

* 200：OK，表示从客户端发来的请求在服务器端被正确处理；
* 204：No content，表示请求成功，但响应报文不含实体的主体部分；
* 205：Reset Content，表示请求成功，但响应报文不含实体的主体部分，但是与 204 响应不同在于要求请求方重置内容
* 206：Partial Content，客户发送了一个带有Range头的GET请求，服务器完成了它（例如请求较大的文件，如用vedie标签或audio标签播放音视频地址）

3xx：重定向 —— 要完成请求必须进行更进一步操作

301：moved permanently，永久性重定向，表示资源已被分配了新的 URL
302：found，临时性重定向，表示资源临时被分配了新的 URL
303：see other，表示资源存在着另一个 URL，应使用 GET 方法获取资源
304：not modified，表示服务器允许访问资源，但因发生请求未满足条件的情况
307：temporary redirect，临时重定向，和302含义类似，但是期望客户端保持请求方法不变向新的地址发出请求

4xx：客户端错误——请求有语法错误或请求无法实现。

* 400：bad request(请求无效，请求报文存在语法错误)，出现这个请求无效报错说明请求没有进入到后台服务里。
原因：
1. 前端提交数据的字段名称或者是字段类型和后台的实体类不一致，导致无法封装；
2. 前端提交到后台的数据应该是json字符串类型，而前端没有将对象转化为字符串类型；
>解决方案：
1. 对照字段名称，类型保证一致性；
2. 使用stringify将前端传递的对象转化为字符串`data: JSON.stringify(param)`;

* 401：Unautorized(未授权)，表示发送的请求需要有通过HTTP认证的认证信息，需认证或认证失败；
* 403：Forbidden，表示对请求资源的访问被服务器拒绝，不允许访问资源
* 404：Not Found，表示在服务器上没有找到请求的资源，服务器上没有请求资源
* 405 Method Not Allowed
* 409：

5xx：服务端错误——服务器未能实现合法的请求

* 500：internal sever error，表示服务器端在执行请求时发生了错误
* 501：Not Implemented，表示服务器不支持当前请求所需要的某个功能
* 503：service unavailable，表明服务器暂时处于超负载或正在停机维护，无法处理请求

![4897162d8fe8340d8e90d299b4998110.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1479)
## 301和302的区别
http协议中，301代表资源的永久重定向，302代表资源的临时重定向，当时还举了一个Restful的例子，观察到很多的第三方授权，授权过后的回跳地址经常会使用301形式，改变浏览器的回跳地址。

* 301：永久重定向，浏览器会记住
* 302：临时重定向

## 如何通过服务器让客户端重定向？
1. statusCode：状态码设置为302临时重定向；
2. setHeader：在响应头中通过`Location`告诉客户端往哪儿重定向。

如果客户端发现收到服务器的响应的状态码是`302`就会自动去响应头中找`Location`，然后对该地址发起新的请求，所以就能看到客户端自动跳转了。

```js
res.statusCode = 302;
res.setHeader('Location', '/');
```
![faf2891319a18e1742150963d99706ee.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1789)

浏览器只要发现响应状态码是`302`，就会根据`Response Headers`中的`Location`字段去发起请求。
## 301和302的应用场景分别是什么
[Http 状态码 301 和 302 的应用场景分别是什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/249)
### 状态码400，bad-request请求有到了后端吗？跨域情况下请求到了后端吗？
请求没有到后端。
### 200From cache和200 ok
### 介绍下304过程
a.浏览器请求资源时首先命中资源的Expires 和 Cache-Control，Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效，可以通过Cache-control: max-age指定最大生命周期，状态仍然返回200，但不会请求数据，在浏览器中能明显看到from cache字样
b.强缓存失效，进入协商缓存阶段，首先验证ETagETag可以保证每一个资源是唯一的，资源变化都会导致ETag变化。服务器根据客户端上送的If-None-Match值来判断是否命中缓存。
c.协商缓存Last-Modify/If-Modify-Since阶段，客户端第一次请求资源时，服务服返回的header中会加上Last-Modify，Last-modify是一个时间标识该资源的最后修改时间。再次请求该资源时，request的请求头中会包含If-Modify-Since，该值为缓存之前返回的Last-Modify。服务器收到If-Modify-Since后，根据资源的最后修改时间判断是否命中缓存。
![b24ad531663f8114aebee0160545a484.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1481)

## 浏览器缓存
![bf89f21cfcc829ba7cc6db085dbbf48c.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1482)

按协议分为：协议层缓存和非http协议缓存：
* 协议层缓存：利用 http 协议头属性值设置；
* 非协议层缓存：利用 meta 标签的 http-equiv 属性值 Expires,set-cookie。
按缓存分为：强缓存和协商缓存
* 强缓存：利用 cache-control 和 expires 设置，直接返回一个过期时间，所以在缓存期间不请求，If-modify-since；
* 协商缓存：响应头返回 etag 或 last-modified 的哈希值，第二次请求头 If-none-match 或 IF-modify-since 携带上次哈希值，一致则返回 304。

### 协商缓存对比
etag优先级高于 last-modified；
etag精度高，last-modified精度是秒，1秒内etag修改多少次都会被记录；last-modified性能好，etag要得到 hash值。
### 浏览器读取缓存流程
会先判断强缓存；再判断协商缓存 etag(last-modified)是否存在；存在利用属性 If-None-match(If-Modified-since)携带值；请求服务器，服务器对比 etag(last-modified)，生效返回304。

F5刷新会忽略强缓存不会忽略协商缓存，ctrl+f5都失效。
## HTTP请求方法
* GET => 获取资源
* POST => 传输资源
* PUT => 更新资源
* DELETE => 删除资源
* HEAD => 获得报文首部

## POST和GET的区别
* GET在浏览器回退时是无害的，而POST会再次提交请求；
* GET请求会被浏览器主动缓存，而POST不会，除非手动设置；
* GET请求参数会被完整保留在浏览器的历史记录里，而POST中的参数不会被保留；
* GET请求在URL中传送的参数是有长度限制的，而POST没有限制；
* GET参数通过URL传递，POST放在Request body中；
* GET请求只能进行url编码，而POST支持多种编码方式；
* GET产生的URL地址可以被收藏，而POST不可以对参数的数据类型，GET只接受ASCII字符，而POST没有限制；
* GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。
## POST和PUT的区别
* POST常用于提交数据至服务端，新建资源时使用。
* PUT常用于更新已存在的资源时使用。

GET和POST的区别：GET请求多数采用查询数据时使用，不推荐对资源的更新及新建，容易造成服务器数据泄漏，或者XSS或者CSRF攻击。
## post请求中有几种content-type，表单提交的是哪个content-type
[第 7 题：表单提交有哪些content-type？](https://github.com/ravencrown/noteBook/issues/22)
##### nginx配置，有几种rewrite、gzip的选项有几种，upstream的方式
## gzip编码协议
这个看过一些，大概就是和缓存策略一样，需要在服务器进行配置，同时需要浏览器的支持。
```js
http {
    ...
    gzip on; // 开启gzip
    gzip_min_length 1k; // 最小1k的文件才使用gzip
    gzip_buffers 4 8k; // 代表以8k为单位，按照原始数据大小以8k为单位的4倍申请内存
    gzip_comp_level 5; // 1 压缩比最小处理速度最快，9 压缩比最大但处理最慢（传输快但比较消耗cpu）
    gzip_types application/javascript text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; // 支持的文件类型
    gzip_disable "MSIE [1-6]\."; // IE6一下 Gzip支持的不好，故不实用gzip
    ...
}
```
服务器配置之后，会在浏览器请求接口后的response header的Content-Encoding字段看到gzip。
客户端请求数据时，请求头中有个Accept-Encoding声明浏览器支持的压缩方式，当客户端请求到服务端的时候，服务器解析请求头，如果客户端支持gzip压缩，响应时对请求的资源进行压缩并返回给客户端，浏览器按照自己的方式解析。
然后拓展问了下，如果传输的数据希望后端压缩，但是算法没有声明如何启用后端算法。我就模拟了下这个流程，客户端利用header头部的自定义字段将可以容忍的压缩算法告诉服务端，服务端配置允许发送这个自定义header，逐个匹配服务器上当前的算法，匹配到则发送成功结果，无法匹配则告知客服端数据无法进行压缩，等待接下来的操作。
##### 浏览器请求分析
![7fa67ee52112f110513eb61606c97e72.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1480)

##### 介绍下Restful
当时被问到这个问题感觉太笼统了，就介绍了下Restful的集中请求格式，GET从服务器取出资源，POST在服务器新建一个资源，PUT在服务器更新资源，PATCH在服务器部分更新资源，DELETE从服务器删除资源。

##### 描述一个XSS攻击的场景
表单提交过程中，需要对提交的数据进行引号，尖括号，斜杠进行转义，防止标签或者是eval()的恶意代码注入。

##### 跨域是在哪个阶段

##### http和https监听端口
![c5f64bfedc03ef632355a214c115cbf2.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1748)

* https默认端口是443
* http默认端口是80


十一、TCP三次握手和四次挥手，分别发了什么数据
SYN和ACK
十三、图片CDN缓存，为什么cookie不用传，因为cookie的同源政策，path决定，只能在同一个域名下
十四、输入URL到页面渲染的整个流程，浏览器渲染原理的主要步骤，合成renderTree之后的两个关键步骤是什么？
重绘和回流
十五：前端安全有哪些? XSS/CSRF/点击劫持/SQL注入
3、cookie, session, token
4、前端持久化的方式、区别
5、DNS是怎么解析的
6、cdn
7、计算机网络的相关协议
8、http/https/http2.0
10、ajax、axios库
12、跨域
13、前端安全XSS、CSRF
14、websocket
16、网络分层
17、即时通信，除了Ajax和websocket
18、模块化，commonJS，es6，cmd，amd
