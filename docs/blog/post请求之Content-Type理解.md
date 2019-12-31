---
title: POST请求之Content-Type总结
---
Content-Type(内容类型)，一般是指网页中存在的Content-Type，用于定义网络文件的类型和网页的编码，决定浏览器将以什么形式、什么编码读取这个文件，这就是经常看到一些PHP网页点击的结果却是下载一个文件或一张图片的原因。

Content-Type标头告诉客户端实际返回的内容的内容类型。语法格式如下：
```js
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=something
```
## `application/x-www-form-urlencoded`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>application/x-www-form-urlencoded</title>
</head>
<body>
    <div id="app">
        <form action="http://www.test.com" method="post">
            <p>用户名：<input type="text" name="username" /></p>
            <p>密码：<input type="password" name="password" /></p>
            <input type="submit" value="提交" />
        </form>
    </div>
</body>
</html>
```
![](https://github.com/liujie2019/static_data/blob/master/img/20191230185119.png?raw=true)

## 参考文档
1. [POST提交数据之---Content-Type的理解](https://www.cnblogs.com/tugenhua0707/p/8975121.html)
2. [HTTP请求中 request payload 和 formData 区别？](https://www.cnblogs.com/tugenhua0707/p/8975615.html)