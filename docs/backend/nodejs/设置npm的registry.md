---
title: 设置npm的registry
---
## 设置国内镜像
### 查看当前使用的registry
```js
➜  ~ npm config get registry
https://registry.npm.taobao.org/
```
### 设置registry
```js
npm config set registry https://registry.npm.taobao.org/
// 产看underscore包信息
npm info underscore
```
::: tip
看到下图，说明成功。
:::
<img :src="$withBase('/nodejs/nrm.png')" alt="">

### 命令行指定使用特定源
```js
npm --registry https://registry.npm.taobao.org info underscore
// 全部使用特定源安装
npm install --registry=https://registry.npm.taobao.org
// 安装指定包使用特定源
npm i koa --registry=https://registry.npm.taobao.org
```
## 使用`~/.npmrc`
在项目根目录中新建`~/.npmrc`文件，并加入下面内容，安装项目依赖时将使用指定的registry。
```js
registry = https://registry.npm.taobao.org
```
## 使用nrm管理registry地址
### 安装nrm
```js
npm install -g nrm
// 或者
yarn global add nrm
```
### 查看是否安装成功
```js
➜  ~ nrm --version
1.2.1
```
### 列出所有可选择的源
```bash
➜  ~ nrm ls

  npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
* taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/
  baidu ------ http://registry.npm.baidu-int.com/
```
>说明：带`*`号的表示当前所使用的源。

### 切换registry地址
```js
nrm use taobao
nrm use npm
```
### 添加registry地址
```js
nrm add <registry> <url>
```
```js
nrm add npm https://registry.npmjs.org
nrm add taobao https://registry.npm.taobao.org
```
### 删除registry地址
```js
nrm del <registry> // reigstry为源名
```
```bash
nrm del testRegistry
```
>注意：`nrm del`命令不能删除nrm内置的源。

## 测试源速度`nrm test <registry>`
```bash
➜  ~ nrm test npm

  npm ---- 1021ms
```
### 测试所有源的速度：`nrm test`
```bash
➜  ~ nrm test

  npm ---- 1273ms
  yarn --- 1673ms
  cnpm --- 232ms
* taobao - 233ms
  nj ----- Fetch Error
  npmMirror  1877ms
  edunpm - Fetch Error
  baidu -- 1647ms
```
## 访问源的主页
```bash
nrm home taobao
```
>上述命令会在浏览器中打开淘宝源的主页：https://npm.taobao.org/。

注意：如果要查看自己添加的源的主页，那么在添加源的时候就要把主页带上：
```bash
nrm add company http://npm.company.com/
```