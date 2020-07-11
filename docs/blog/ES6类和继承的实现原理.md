---
title: ES6类和继承的实现原理
---
[TOC]
## 类的实现
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```
上述代码经过babel转义后如下：
```js
"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Point = /*#__PURE__*/function () {
  function Point(x, y) {
    // 类不能当做普通函数调用，必须用new调用
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "toString",
    value: function toString() {
      return '(' + this.x + ', ' + this.y + ')';
    }
  }]);

  return Point;
}();
```

## 参考文档
1. [es6类和继承的实现原理](https://mp.weixin.qq.com/s/4BUCifMOkWvEd92jCuMhPA)