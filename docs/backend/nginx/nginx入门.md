---
title: Nginx入门
---

[TOC]

## nginx 好处

- 支持海量高并发
- 内存消耗少
- 免费使用可以商业化
- 配置文件简单

## 初识 Nginx 和环境准备

```js
yum -y install gcc gcc-c++ autoconf pcre-devel make automake
yum -y install wget httpd-tools vim
```

### 基于 Yum 的方式安装 Nginx

我们可以先来查看一下 yum 是否已经存在，命令如下：

```js
yum list | grep nginx
```

如果出现类似下面的内容，说明 yum 源是存在的。
![b72907f6d5c8c860d21dddd6fca58fca.png](evernotecid://25C71799-9F90-488F-8836-E5CA81A8E273/appyinxiangcom/10797539/ENResource/p1439)
如果不存在，或者不是你需要的版本，那我们可以自行配置 yum 源，下面是官网提供的源，我们可以放心大胆的使用。

```bash
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/OS/OSRELEASE/$basearch/
gpgcheck=0
enabled=1
```

复制上面的代码，然后在终端里输入：

```bash
vim /etc/yum.repos.d/nginx.repo
```

复制代码然后把代码复制进去，这里你可能需要一些 Vim 的操作知识，如果不熟悉，可以自行学习一下，当然我视频中也是有讲解的。
赋值完成后，你需要修改一下对应的操作系统和版本号，因为我的是 centos 和 7 的版本，所以改为这样。

```js
baseurl=http://nginx.org/packages/centos/7/$basearch/
```

你可以根据你的系统或需要的版本进行修改。

如果都已经准备好了，那就可以开始安装了，安装的命令非常简单：

```bash
yum install nginx
```

复制代码
安装完成后可以使用命令，来检测 Nginx 的版本。

```bash
nginx -v
```

![ea9393b321e9cf44b41266cb5acfba98.png](evernotecid://25C71799-9F90-488F-8836-E5CA81A8E273/appyinxiangcom/10797539/ENResource/p1441)
出现上述内容说明安装成功。
![e0fd309936d0d08e75ba95782a7e8bf3.png](evernotecid://25C71799-9F90-488F-8836-E5CA81A8E273/appyinxiangcom/10797539/ENResource/p1440)

## Nginx 配置文件详解

### 查看 Nginx 的安装目录

在使用 yum 安装完 Nginx 后，需要知道系统中多了那些文件，它们都安装到了那里。可以使用下面的命令进行查看：

```bsah
rpm -ql nginx
```

rpm 是 linux 的 rpm 包管理工具，-q 代表询问模式，-l 代表返回列表，这样我们就可以找到 nginx 的所有安装位置了。
列表列出的内容还是比较多的，我们尽量给大家进行讲解，我们这节先来看看重要的文件。

### nginx.conf

nginx.conf 文件是 Nginx 总配置文件，在我们搭建服务器时经常调整的文件。
进入 etc/nginx 目录下，然后用 vim 进行打开

```bash
cd /etc/nginx
vim nginx.conf
```

下面是文件的详细注释，我几乎把每一句都进行了注释，你可以根据你的需要来进行配置。

```bash
#运行用户，默认即是nginx，可以不进行设置
user  nginx;
#Nginx进程，一般设置为和CPU核数一样
worker_processes  1;
#错误日志存放目录
error_log  /var/log/nginx/error.log warn;
#进程pid存放位置
pid        /var/run/nginx.pid;


events {
    worker_connections  1024; # 单个后台进程的最大并发数
}


http {
    include       /etc/nginx/mime.types;   #文件扩展名与类型映射表
    default_type  application/octet-stream;  #默认文件类型
    #设置日志模式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;   #nginx访问日志存放位置

    sendfile        on;   #开启高效传输模式
    #tcp_nopush     on;    #减少网络报文段的数量

    keepalive_timeout  65;  #保持连接的时间，也叫超时时间

    #gzip  on;  #开启gzip压缩

    include /etc/nginx/conf.d/*.conf; #包含的子配置项位置和文件
```

### default.conf

我们看到最后有一个子文件的配置项，那我们打开这个 include 子文件配置项看一下里边都有些什么内容。

进入 conf.d 目录，然后使用 vim default.conf 进行查看。

```bash
server {
    listen       80;   #配置监听端口
    server_name  localhost;  //配置域名

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;     #服务默认启动目录
        index  index.html index.htm;    #默认访问文件
    }

    #error_page  404              /404.html;   # 配置404页面

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;   #错误状态码的显示页面，配置后需要重启
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

明白了这些配置项，我们知道我们的服务目录放在了
**/usr/share/nginx/html**下，可以使用命令进入看一下目录下的文件。

```bash
cd /usr/share/nginx/html
ls
```

可以看到目录下面有两个文件，50x.html 和 index.html。我们可以使用 vim 进行编辑。
学到这里，其实可以预想到，我们的 nginx 服务器已经可以为 html 提供服务器了。我们可以打开浏览器，访问 ip 地址试一试。

## Nginx 服务启动、停止、重启

### 启动 Nginx 服务

默认的情况下，Nginx 是不会自动启动的，需要我们手动进行启动，当然启动 Nginx 的方法也不是单一的。

#### nginx 直接启动

在 CentOS7.4 版本里（低版本是不行的），是可以直接直接使用 nginx 启动服务的。

```bash
nginx
```

#### 使用 systemctl 命令启动

还可以使用个 Linux 的命令进行启动，我一般都是采用这种方法进行使用。因为这种方法无论启动什么服务，都是一样的，只是换一下服务的名字（不用增加额外的记忆点）。

```bash
systemctl start nginx.service
```

输入命令后，没有任何提示，那我们如何知道 Nginx 服务已经启动了哪？可以使用 Linux 的组合命令，进行查询服务的运行状况。

```bash
ps aux | grep nginx
```

如果启动成功会出现如下图片中类似的结果。
![7f58f96302e5274aea53b0c67b8849ff.png](evernotecid://25C71799-9F90-488F-8836-E5CA81A8E273/appyinxiangcom/10797539/ENResource/p1438)

### 停止 Nginx 服务的四种方法

停止 Nginx 方法有很多种，可以根据需求采用不一样的方法，我们一个一个说明。

#### 立即停止服务

```bash
nginx  -s stop
```

这种方法比较强硬，无论进程是否在工作，都直接停止进程。

#### 从容停止服务

```bash
nginx -s quit
```

这种方法较 stop 相比就比较温和一些了，需要进程完成当前工作后再停止。

#### killall 方法杀死进程

这种方法也是比较野蛮的，我们直接杀死进程，但是在上面使用没有效果时，我们用这种方法还是比较好的。

```bash
killall nginx
```

#### systemctl 停止

```bash
systemctl stop nginx.service
```

### 重启 Nginx 服务

有时候我们需要重启 Nginx 服务，这时候可以使用下面的命令。

```bash
systemctl restart nginx.service
```

### 重新载入配置文件

在重新编写或者修改 Nginx 的配置文件后，都需要作一下重新载入，这时候可以用 Nginx 给的命令。

```bash
nginx -s reload
```

### 查看端口号

在默认情况下，Nginx 启动后会监听 80 端口，从而提供 HTTP 访问，如果 80 端口已经被占用则会启动失败。我么可以使用`netstat -tlnp`命令查看端口号的占用情况。

## 自定义错误页和访问设置

### 简单实现访问控制

有时候我们的服务器只允许特定主机访问，比如内部 OA 系统，或者应用的管理后台系统，更或者是某些应用接口，这时候我们就需要控制一些 IP 访问，我们可以直接在 location 里进行配置。
可以直接在 default.conf 里进行配置。

```bash
location / {
    deny   123.9.51.42;
    allow  45.76.202.231;
}
```

配置完成后，重启一下服务器就可以实现限制和允许访问了。这在工作中非常常用，一定要好好记得。

## Nginx 访问权限详解

### 指令优先级

我们先来看一下代码：

```bash
location / {
    allow  45.76.202.231;
    deny   all;
}
```

上面的配置表示只允许 45.76.202.231 进行访问，其他的 IP 是禁止访问的。但是如果我们把 deny all 指令，移动到 allow 45.76.202.231 之前，会发生什么那？会发现所有的 IP 都不允许访问了。这说明了一个问题：就是在同一个块下的两个权限指令，先出现的设置会覆盖后出现的设置（也就是谁先触发，谁起作用）。

### 复杂访问控制权限匹配

在工作中，访问权限的控制需求更加复杂，例如，对于网站下的 img（图片目录）是运行所有用户访问，但对于网站下的 admin 目录则只允许公司内部固定 IP 访问。这时候仅靠 deny 和 allow 这两个指令，是无法实现的。我们需要 location 块来完成相关的需求匹配。
上面的需求，配置代码如下：

```bash
    location =/img{
        allow all;
    }
    location =/admin{
        deny all;
    }
```

=号代表精确匹配，使用了=后是根据其后的模式进行精确匹配。这个直接关系到我们网站的安全，一定要学会。

### 使用正则表达式设置访问权限

只有精确匹配有时是完不成我们的工作任务的，比如现在我们要禁止访问所有 php 的页面，php 的页面大多是后台的管理或者接口代码，所以为了安全我们经常要禁止所有用户访问，而只开放公司内部访问的。
代码如下：

```bash
 location ~\.php$ {
        deny all;
    }
```

这样我们再访问的时候就不能访问以 php 结尾的文件了

## Nginx 配置虚拟主机

虚拟主机是指在一台物理主机服务器上划分出多个磁盘空间，每个磁盘空间都是一个虚拟主机，每台虚拟主机都可以对外提供 Web 服务，并且互不干扰。在外界看来，虚拟主机就是一台独立的服务器主机，这意味着用户能够利用虚拟主机把多个不同域名的网站部署在同一台服务器上，而不必再为简历一个网站单独购买一台服务器，既解决了维护服务器技术的难题，同时又极大地节省了服务器硬件成本和相关的维护费用。

配置虚拟主机可以基于端口号、基于 IP 和基于域名，这节课我们先学习基于端口号来设置虚拟主机。

### 基于端口号来设置虚拟主机

基于端口号来配置虚拟主机，算是 Nginx 中最简单的一种方式了。

> 原理就是：Nginx 监听多个端口，根据不同的端口号，来区分不同的网站。

我们可以直接配置在主文件里`etc/nginx/nginx.conf`文件里，也可以配置在子配置文件里`etc/nginx/conf.d/default.conf`。我这里为了配置方便，就配置在子文件里了。当然你也可以再新建一个文件，只要在`conf.d`文件夹下就可以了。
修改配置文件中的 server 选项，这时候就会有两个 server。

### 基于 IP 的虚拟主机

基于 IP 和基于端口的配置几乎一样，只是把 server_name 选项，配置成 IP 就可以了。
比如上面的配置，我们可以修改为：

```js
server{
        listen 80;
        server_name 112.74.164.244;
        root /usr/share/nginx/html/html8001;
        index index.html;
}
```

这种演示需要多个 IP 的支持，由于我们的阿里 ECS 只提供了一个 IP，所以这里就不给大家演示了，如果工作中用到，只要安装这种方法配置就可以了。

### 配置以域名为划分的虚拟主机

在真实的上线环境中，一个网站是需要域名和公网 IP 才可以访问的。

- nginx.jspang.com: 这个域名映射到默认的 Nginx 首页位置。
- nginx2.jspang.com: 这个域名映射到原来的 8001 端口的位置。

我们修改 etc/nginx/conf.d 目录下的 default.conf 文件，把原来的 80 端口虚拟主机改为以域名划分的虚拟主机。代码如下：

```bash
server {
    listen       80;
    server_name  nginx.jspang.com;
```

我们再把同目录下的 8001.conf 文件进行修改，改成如下：

```bash
server{
        listen 80;
        server_name nginx2.jspang.com;
        location / {
                root /usr/share/nginx/html/html8001;
                index index.html index.htm;
        }
}
```

然后我们用平滑重启的方式，进行重启，这时候我们在浏览器中访问这两个网页。
其实域名设置虚拟主机也非常简单，主要操作的是配置文件的 server_name 项，还需要域名解析的配合。小伙伴们一定要进行练习一下。后面的课程可能就没有这么简单了。

## Nginx 反向代理的设置

作为一个前端必会的一个技能就是反向代理。大家都知道，我们现在的 web 模式基本上都是标准的 CS 结构，即 Client 端到 Server 端。那代理就是在 Client 端和 Server 端之间增加一个提供特定功能的服务器，这个服务器就是我们说的代理服务器。

### 正向代理(代理客户端)

在理解反向代理之前，我们先来了解一下正向代理。我们常用的翻墙工具就是一个典型的正向代理工具。它会把不让我们访问的服务器的网页请求，代理到一个可以访问该网站的代理服务器上来，一般叫做 proxy 服务器，再转发给客户。

![aecdae2623bb86788d6c22b2219b1421.png](evernotecid://25C71799-9F90-488F-8836-E5CA81A8E273/appyinxiangcom/10797539/ENResource/p1443)
简单来说就是：你想访问目标服务器的权限，但是没有权限。这时候代理服务器有权限访问服务器，并且你有访问代理服务器的权限，这时候你就可以通过访问代理服务器，代理服务器访问真实服务器，把内容给你呈现出来。

### 反向代理(代理服务器)

反向代理跟代理正好相反（需要说明的是，现在基本所有的大型网站的页面都是用了反向代理），客户端发送的请求，想要访问 server 服务器上的内容。发送的内容被发送到代理服务器上，这个代理服务器再把请求发送到自己设置好的内部服务器上，而用户真实想获得的内容就在这些设置好的服务器上。
![63fd48834262bfc2c8ef59c903901f72.png](evernotecid://25C71799-9F90-488F-8836-E5CA81A8E273/appyinxiangcom/10797539/ENResource/p1444)

通过图片的对比，应该看出一些区别，这里 proxy 服务器代理的并不是客户端，而是服务器。即向外部客户端提供了一个统一的代理入口，客户端的请求都要先经过这个 proxy 服务器。具体访问哪个服务器 server 是由 Nginx 来控制的。再简单点来讲，**一般代理指代理的客户端，反向代理是代理的服务器**。

### 反向代理的用途和好处

- 安全性：正向代理的客户端能够在隐藏自身信息的同时访问任意网站，这个给网络安全代理了极大的威胁。因此，我们必须把服务器保护起来，使用反向代理客户端用户只能通过外来网来访问代理服务器，并且用户并不知道自己访问的真实服务器是那一台，可以很好的提供安全保护。

- 功能性：反向代理的主要用途是为多个服务器提供负载均衡、缓存等功能。负载均衡就是一个网站的内容被部署在若干服务器上，可以把这些机子看成一个集群，那 Nginx 可以将接收到的客户端请求“均匀地”分配到这个集群中所有的服务器上，从而实现服务器压力的平均分配，也叫负载均衡。
  > 修改后的配置文件：

```js
server{
        listen 8093;
        server_name localhost;
        location / {
            proxy_pass http://39.107.236.234;
            #root /usr/share/nginx/html/html8093;
            #index index.html;
        }
}
```

这样一来，所有http://39.107.236.234:8093的请求，都会被代理到http://39.107.236.234。

## Nginx 的 Gzip 压缩配置

Gzip 是网页的一种网页压缩技术，经过 gzip 压缩后，页面大小可以变为原来的 30%甚至更小。更小的网页会让用户浏览的体验更好，速度更快。gzip 网页压缩的实现需要浏览器和服务器的支持。
![ba601157791305bdf04d20a62ba13db0.png](evernotecid://25C71799-9F90-488F-8836-E5CA81A8E273/appyinxiangcom/10797539/ENResource/p1442)

从上图可以清楚的看出，gzip 是需要服务器和浏览器同时支持的。当浏览器支持 gzip 压缩时，会在请求消息中包含`Accept-Encoding: gzip`，这样 Nginx 就会向浏览器发送经过 gzip 后的内容，同时在相应信息头中加入`Content-Encoding: gzip`，声明这是 gzip 后的内容，告知浏览器要先解压后才能解析输出。

## 参考文档

1. [前端必会的 Nginx 入门视频教程\(共 11 集\)](https://juejin.im/post/5bd7a6046fb9a05d2c43f8c7)
2. [一个前端必会的 Nginx 免费教程 (共 11 集)](https://jspang.com/detailed?id=39)
3. [Nginx 免费视频教程](https://www.bilibili.com/video/av35986548?from=search&seid=16777063348958326206)
