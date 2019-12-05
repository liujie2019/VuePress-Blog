---
title: FormData
---
举个🌰：
```js
const formData = new FormData(); // 创建一个空的FormData对象

// 通过FormData.append往对象里加入键值对
formData.append('username', 'lisi');
formData.append('file', myFileInput.files[0], 'test.jpg');
```
FormData.set和append的区别在于：如果指定的键已经存在，FormData.set会使用新值覆盖已有的值，而append会把新值添加到已有值集合的后面(即不会覆盖原有的值，会进行重复添加)。

## XMLHttpRequest.upload
XMLHttpRequest.upload属性返回一个XMLHttpRequestUpload对象，用来表示上传的进度。这个对象是不透明的，但是作为一个XMLHttpRequestEventTarget，可以通过对其绑定事件来追踪它的进度。

可以被绑定在upload对象上的事件监听器如下：
| 事件       | 相应属性的信息类型           |
| ------------- |:-------------:|
| onloadstart     | 开始上传(一般可以用来设置上传进度条的显示) |
| onprogress      | 上传进行中(一般可以用来动态设置上传的进度)      |
| onabort | 上传操作终止      |
| onload     | 上传成功 |
| onerror      | 上传失败     |
| ontimeout | 上传操作在用户规定的时间内未完成      |
| onloadend | 上传操作完成（不论成功与否）      |

## BLOB (binary large object)




## 参考文档
1. [Blob进行文件上传](https://libin1991.github.io/2018/12/15/Blob%E8%BF%9B%E8%A1%8C%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0/)