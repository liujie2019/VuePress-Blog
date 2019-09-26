---
title: Web实时推送技术总结
---
[TOC]
## 双向通信
HTTP协议有一个缺陷：通信只能由客户端发起。举例来说，我们想了解今天的天气，只能是客户端向服务器发出请求，服务器返回查询结果。**HTTP协议做不到服务器主动向客户端推送信息**。这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。在WebSocket协议之前，有三种实现双向通信的方式：轮询（polling）、长轮询（long-polling）和iframe流（streaming）。
### 轮询（polling）
![8b6127c0a39207bfb8f6ce630f5bba77.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1192)
轮询是客户端和服务器之间会一直进行连接，每隔一段时间就询问一次。其缺点也很明显：连接数会很多，一个接受，一个发送。而且每次发送请求都会有Http的Header，会很耗流量，也会消耗CPU的利用率。

* 优点：实现简单，无需做过多的更改；
* 缺点：轮询的间隔过长，会导致用户不能及时接收到更新的数据；轮询的间隔过短，会导致查询请求过多，增加服务器端的负担。
#### demo
```html
<body>
    <h1 id="time"></h1>
    <script>
        const timeText = document.querySelector('#time');
        setInterval(() => {
            const xhr = new XMLHttpRequest;
            xhr.open('GET', '/time', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    timeText.innerHTML = xhr.responseText;
                }
            }
            xhr.send();
        }, 1000);
    </script>
</body>
```
```js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/time', (req, res) => {
    const currentTime = new Date();
    res.end(currentTime.toLocaleString());
});
app.listen(8080, () => {
    console.log('server run on port 8080');
});
```
启动本地服务，打开http://localhost:8080/index.html。
![84688bb62708eafa272942f7d4701893.gif](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1196)
### 长轮询（long-polling）
![16be59e17321017125a72fd54f11b967.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1193)
长轮询是对轮询的改进版，客户端发送HTTP给服务器之后，看有没有新消息，如果没有新消息，就一直等待。当有新消息的时候，才会返回给客户端。在某种程度上减小了网络带宽和CPU利用率等问题。由于http数据包的头部数据量往往很大（通常有400多个字节），但是真正被服务器需要的数据却很少（有时只有10个字节左右），这样的数据包在网络上周期性的传输，难免对网络带宽是一种浪费。

* 优点：比 Polling 做了优化，有较好的时效性；
* 缺点：保持连接会消耗资源; 服务器没有返回有效数据，程序超时。
```html
<body>
    <h1 id="time"></h1>
    <script>
        const timeText = document.querySelector('#time');
        function send() {
            const xhr = new XMLHttpRequest;
            xhr.timeout = 2000; // 设置请求超时时间为2秒
            xhr.open('GET', '/time', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // 如果成功了，则显示结果
                        timeText.innerHTML = xhr.responseText;
                    }
                    send(); // 不管成功还是失败都会发送下一次请求
                }
            }
            xhr.ontimeout = function() {
                send();
            }
            xhr.send();
        }
        send();
    </script>
</body>
```
```js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/time', (req, res) => {
    const currentTime = new Date();
    res.end(currentTime.toLocaleString());
});

app.listen(8080, () => {
    console.log('server run on port 8080');
});
```
### iframe流（streaming）
![e3f621865151c636357c571b8256f38c.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1194)
iframe流方式是在页面中插入一个隐藏的iframe，利用其src属性在服务器和客户端之间创建一条长连接，服务器向iframe传输数据（通常是HTML，内有负责插入信息的javascript），来实时更新页面。

* 优点：消息能够实时到达；浏览器兼容好；
* 缺点：服务器维护一个长连接会增加开销；IE、chrome、Firefox会显示加载没有完成，图标会不停旋转。

```html
<body>
    <h1 id="time"></h1>
    <iframe src="/time" frameborder="0" style="display: none"></iframe>
</body>
```
```js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/time', (req, res) => {
    setInterval(() => {
        const currentTime = new Date().toLocaleString();
        res.write(`
            <script type="text/javascript">
                parent.document.querySelector('#time').innerHTML = '${currentTime}'; // 改变父窗口dom元素
            </script>
        `);
    }, 1000);
});

app.listen(8080, () => {
    console.log('server run on port 8080');
});
```
![6521a8f4709ce6aaea5cbf5fdd44322f.gif](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1198)
上述代码中，客户端只请求一次，然而服务端却是源源不断向客户端发送数据，这样服务器维护一个长连接会增加开销。
## WebSocket
### 什么是websocket
WebSocket是一种全新的协议，随着HTML5草案的不断完善，越来越多的现代浏览器开始全面支持WebSocket技术了，它将TCP的Socket（套接字）应用在了webpage上，从而使通信双方建立起一个保持在活动状态连接通道。

一旦Web服务器与客户端之间建立起WebSocket协议的通信连接，之后所有的通信都依靠这个专用协议进行。通信过程中可互相发送JSON、XML、HTML或图片等任意格式的数据。**由于是建立在HTTP基础上的协议，因此连接的发起方仍是客户端，而一旦确立WebSocket通信连接，不论服务器还是客户端，任意一方都可直接向对方发送报文。**

初次接触 WebSocket 的人，都会问同样的问题：我们已经有了 HTTP 协议，为什么还需要另一个协议？

### HTTP的局限性

* HTTP是半双工协议，也就是说，在同一时刻数据只能单向流动，客户端向服务器发送请求(单向的)，然后服务器响应请求(单向的)。
* 服务器不能主动推送数据给浏览器。这就会导致一些高级功能难以实现，诸如聊天室场景就没法实现。
### WebSocket的特点

* 支持双向通信，实时性更强；
* 可以发送文本，也可以发送二进制数据；
* 减少通信量：只要建立起WebSocket连接，就希望一直保持连接状态。和HTTP相比，不但每次连接时的总开销减少，而且由于WebSocket的首部信息很小，通信量也相应减少了。

![293c95962634f5555443c1675ab4e9e3.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1199)
相对于传统的HTTP每次请求-应答都需要客户端与服务端建立连接的模式，WebSocket是类似Socket的TCP长连接的通讯模式，一旦WebSocket连接建立后，后续数据都以帧序列的形式传输。在客户端断开WebSocket连接或Server端断掉连接前，不需要客户端和服务端重新发起连接请求。**在海量并发和客户端与服务器交互负载流量大的情况下，极大的节省了网络带宽资源的消耗，有明显的性能优势，且客户端发送和接受消息是在同一个持久连接上发起，实时性优势明显。**
### demo
```html
<body>
    <script>
        // 高级api 不兼容 socket.io(一般使用它)
        let socket = new WebSocket('ws://localhost:3000');
        socket.onopen = function() {
            socket.send('我是客户端'); // 向服务器发送数据
        };
        socket.onmessage = function(e) {
            console.log(e.data); // 接收服务器返回的数据
        }
    </script>
</body>
```
```js
const express = require('express');
const app = express();
// 以当前目录作为静态资源目录
app.use(express.static(__dirname));

const WebSocket = require('ws');
// 用ws模块启动一个websocket服务器，监听了9999端口
const wss = new WebSocket.Server({port: 3000});
// 监听客户端的连接请求  当客户端连接服务器的时候，就会触发connection事件
// socket代表一个客户端，不是所有客户端共享的，而是每个客户端都有一个socket
wss.on('connection', function(socket) {
    // 监听对方发过来的消息
    socket.on('message', function(data) {
        console.log(data);
        socket.send('我是服务端');
    });
});

app.listen(5000, () => {
    console.log('server run at port 5000');
});
```
## Web实时推送技术的比较
![2e83c548aafb1b1dc4cf88717ac735e5.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1200)

综上所述：Websocket协议不仅解决了HTTP协议中服务端的被动性，即通信只能由客户端发起，也解决了数据同步有延迟的问题，同时还带来了明显的性能优势，所以websocket
是Web实时推送技术的比较理想的方案，但如果要**兼容低版本浏览器**，可以考虑用轮询来实现。
## Comet
Ajax是一种页面向服务器请求数据的技术，Comet是一种服务器向页面推送数据的技术。Comet能够让信息近乎实时的被推送到页面上，非常适合处理体育比赛和股票报价。
有两种实现Comet的方式：长轮询和流。长轮询是传统轮询（即短轮询）的一个翻版，即浏览器定时向服务器发送请求，看看有没有数据更新。

* 短轮询：浏览器定时向服务器发送请求，看看有没有数据更新。

短轮询是一种从服务器拉取数据的工作模式。设置一个定时器，定时询问服务器是否有信息，每次建立连接传输数据之后，链接会关闭
短轮询模式：建立连接——数据传输——关闭连接...建立连接——数据传输——关闭连接。
![3fa7edebcfbf3908bfe861fed53f2559.png](evernotecid://AC85336C-B325-443E-8ED7-E6554790A944/appyinxiangcom/10797539/ENResource/p1190)

长轮询把传统轮询颠倒了一下，页面发送一个到服务器的请求，然后服务器一直保持连接打开，直到有数据可发送。发送完数据后，浏览器关闭连接，随即又发起一个到服务器的新请求。这个过程在页面打开期间一直不断持续。

* 长轮询：页面发送一个到服务器的请求，然后服务器一直保持连接打开，直到有数据可发送。发送完数据后，浏览器关闭连接，随即又发起一个到服务器的新请求。

长轮询模式：建立连接——（保持连接直到有数据可发送）...数据传输——关闭连接(随即又向服务器建立一个连接)

>长轮询与短轮询的不同：主要在于client和server采取的关闭策略不同。短轮询在建立连接以后只进行一次数据传输就关闭连接，而长轮询在建立连接以后会进行多次数据数据传输直至关闭连接。
无论是短轮询还是长轮询，浏览器都要在接收数据之前，先发起对服务器的连接。两者最大的区别在于服务器如何发送数据。短轮询是服务器立即发送响应，无论数据是否有效，而长轮询是等待发送响应。轮询的优势是所有浏览器都支持，因为使用XHR对象和setTimeout()就能实现，你要做的就是决定什么时候发送请求。

### HTTP流
第二种流行的Comet方式是HTTP流。流不同于上述的两种轮询，它在页面的整个生命周期中只使用一个HTTP连接。具体来说就是浏览器向服务器发送一个请求，然后服务器保持连接打开，然后周期性的向浏览器发送数据。下面这段php脚本就是采用流实现的服务器中的常见方式：
>streaming.php:
```php
<?php
    $i=0;
    while(true){
        echo "Number is $i"; // 输出一些数据，然后立即刷新输出缓存
        flush();
        sleep(10);//等几秒
        $i++;
    }
?>
```
通过侦听readystatechange事件及检测readyState的值是否为3，就可以利用XHR对象实现HTTP流。随着不断从服务器接收数据，readyState的值就会周期性地变为3，当readyState值变为3时，responseText属性中就会保存接收到的所有数据。此时，就需要比较此前接收到的数据，决定从什么位置开始取得最新的数据。
只要readystatechange事件发生，而且readyState值为3，就对responseText进行分割以取得最新数据。这里的received变量用于记录已经处理了多少个字符，每次readyState值为3时都递增。然后，通过progress回调函数来处理传入的新数据。而当readyState值为4时，则执行finished回调函数，传入响应返回的全部内容。
```html
<!DOCTYPE html>
<html>
<head>
    <title>HTTP Streaming Example</title>
    <meta charset="utf-8">
</head>
<body>
    <script>
        function createStreamingClient(url, progress, finished){
            //三个参数分别是：要连接的URL、在接收到数据时调用的函数以及关闭连接时调用的函数
            var xhr = new XMLHttpRequest(),
                received = 0;

            xhr.open("get", url, true);
            xhr.onreadystatechange = function(){
                var result;
                if (xhr.readyState == 3){
                    //只取得最新数据并调整计数器
                    result = xhr.responseText.substring(received);
                    received += result.length;

                    //调用progress回调函数
                    progress(result);

                } else if (xhr.readyState == 4){
                    //finished函数是用来关闭连接的
                    finished(xhr.responseText);
                }
            };
            xhr.send(null);
            return xhr;
        }

        var client = createStreamingClient("streaming.php", function(data){
                        alert("Received: " + data);
                     }, function(data){
                        alert("Done!");
                     });

    </script>
</body>
</html>
```
## 服务器发送事件
SSE（Server-Sent Events，服务器发送事件）是围绕只读Comet交互推出的API或者模式。SSE API用于创建到服务器的单向连接，服务器通过这个连接可以发送任意数量的数据。服务器响应的MIME类型必须是text/event-stream，而且是浏览器中的Javascript API能解析的格式输出。SSE支持短轮询、长轮询和HTTP流，而且能在断开连接时自动确定何时重新连接。
### SSE API
SSE是为javascript api与其他传递消息的javascript api很相似。要预定新的事件流，要创建新的EventSource对象，并传入一个入口点：
```js
var source=new EventSource("myevents.php");
```
注意：要传入的URL必须与创建对象的页面同源。EventSource的实例有一个readyState属性，值为0表示正连接到服务器，值为1表示打开了连接，值为2表示关闭连接。另外还有以下三个事件：

* open：在建立连接时触发
* message：在从服务器接收到新事件时触发
* error：在无法建立连接时触发

服务器返回的数据以字符串的格式保存在event.data中。默认情况下，EventSource对象会保存于服务器的活动连接。如果连接断开，还会重新连接。这就意味着SSE适合长轮询和HTTP流。如果想强制立即断开连接并且不再重新连接，可以调用close()方法。
### 事件流
所谓的服务器事件会通过一个持久的HTTP响应发送，这个响应的MIME类型为text/event-stream。响应的格式是纯文本。
### Demo
index.html
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>SSE</title>
</head>
<body>
<!-- 实现服务器数据推送，例如股票时时刷新等 -->
	<script type="text/javascript" src="index.js"></script>
</body>
</html>
```
index.js
```js
var source;
function init(argument) {
	source = new EventSource('http://localhost/sse/data.php');
	source.onopen = function(){
		console.log('连接已建立', this.readyState);
	}
	source.onmessage = function(event){
		console.log('从服务器时时获取的数据', event.data);
	}
	source.οnerrοr=function(){

	}
}
init();
```
data.php
```php
<?php
    header("Content-Type:text/event-stream;charset=utf-8");
    header("Access-Control-Allow-Origin:http://127.0.0.1/");
    echo "data:现在北京时间是".date('H:i:s')."\r\n\r\n";
 ?>
```
## WebSocket
WebSocket使用了自定义的协议。未加密的协议是ws://，加密的协议是wss://。
要创建WebSocket，先实例一个WebSocket对象并传入要连接的URL：
```js
var sockets=new WebSockets("ws://www.example.com/server.php");
```
注意，必须给WebSockets构造函数传入绝对的URL。同源策略对它不适用，因此可以通过它打开到任何站点的连接。关闭WebSocket连接：
```js
sockets.close(); //关闭发送和接收数据：
```
```js
sockets.send("Hello word"); //可以发送字符串，json格式的字符串
```
sockets的事件有onmessage：当服务器向客户端发来消息时，WebSocket对象就会触发message事件，这个message事件与其他传递消息的协议类似，也是把返回的数据保存在event.data属性中。
```js
Socket.onmessage = function(event){
var data = event.data;
//处理数据
 }
```
 其他事件：

* open：在成功建立连接时触发；
* error：在发生错误时触发，连接不能持续；
* close：在连接关闭时触发。

close事件的event对象有三个额外的属性：wasClean，code，reason。其中，

* wasClean是一个布尔值，表示连接是否已经明确地关闭；
* code是服务器返回的数值状态码；
* reason是一个字符串，包含服务器发回的消息。

WebSocket协议不同于HTTP，所以现有的服务器不能用Web Socket通信。SSE倒是通过常规HTTP通信，因此现有服务器就可以满足需求。要是双向的通信，WebSocket更好一些。在不能使用Web Sockets的情况下，组合XHR+SSE也能实现双向通信。
WebSocket协议是html5引入的一种新的协议，其目的在于实现了浏览器与服务器全双工通信。看了上面链接的同学肯定对过去怎么低效率高消耗（轮询或comet）的做此事已经有所了解了，而在websocket API，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。同时这么做有两个好处：

1. 通信传输字节减少：比起以前使用http传输数据，websocket传输的额外信息很少。
2. 服务器可以主动向客户端推送消息，而不用客户端去查询。

## 参考文档

1. [Web 实时推送技术的总结](https://segmentfault.com/a/1190000018496938)