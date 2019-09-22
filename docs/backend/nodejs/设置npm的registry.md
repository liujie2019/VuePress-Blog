---
title: 设置npm的registry
---
## 原npm地址
```js
npm config set registry http://registry.npmjs.org
```
## 设置国内镜像
### 通过config命令
```js
npm config set registry https://registry.npm.taobao.org
// 产看underscore包信息
npm info underscore
```
::: tip
看到下图，说明成功。
:::
<img :src="$withBase('/nodejs/nrm.png')" alt="">

### 命令行指定
```js
npm --registry https://registry.npm.taobao.org info underscore
```
### 编辑`~/.npmrc`加入下面内容
```js
registry = https://registry.npm.taobao.org
```
## 使用nrm管理registry地址
### 下载nrm
```js
npm install -g nrm
// 或者
yarn global add nrm
```
### 添加registry地址
```js
nrm add npm http://registry.npmjs.org
nrm add taobao https://registry.npm.taobao.org
```
### 切换npm registry地址
```js
nrm use taobao
nrm use npm
```