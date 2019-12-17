---
title: Class继承
---
## 基础
```js
/**
 * ES6继承：原理是基于寄生组合继承
*/
// ES6中基于class创建出来的类不能当做普通函数执行(也就是说call继承在ES6的class继承中行不通，call继承需要在子类的构造函数中把父类的构造函数当做普通函数执行)。
class Parent {
    constructor(name) {
        this.name = name;
    }
    getName() {
        console.log(this.name);
    }
}

class Child extends Parent {
    constructor(age) {
        // 需要注意：子类只要继承父类，可以不写constructor。但是一旦写了constructor，则在constructor中的第一行必须是super()。
        // 如果不调用super方法，子类就得不到this对象。
        super('lisi'); // super相当于Parent.call(this, 'lisi')，把父类当做普通函数执行，给父类构造函数传递参数，让父类构造函数中的this指向子类的实例。
        this.age = age;
    }
    getAge() {
        console.log(this.age);
    }
}

// Child.prototype = Object.create(Parent.prototype); 不允许重定向原型指向
const child = new Child(12);
console.log(child);
```
::: warning
需要注意的是：在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。
:::
## Object.getPrototypeOf()
Object.getPrototypeOf方法可以用来从子类上获取父类。
```js
console.log(Object.getPrototypeOf(Child) === Parent); // true
```
因此，可以使用这个方法判断，一个类是否继承了另一个类。
## super关键字
### super作为函数
```js
class Parent {
    constructor() {
        // new.target指向当前正在执行的函数
        // 这里输出Child，说明在super执行时，它指向的是子类Child的构造函数，而不是父类Parent的构造函数。也就是说，super内部的this指向的是Child。
        console.log(new.target.name); // Child
    }
}
class Child extends Parent {
    constructor() {
        // super作为函数调用时，只能用在子类的构造函数之中，用在其他地方就会报错。
        super();
    }
}

const child = new Child();
```
::: warning
需要注意：super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
:::
### super作为对象
```js
class Parent {
    constructor() {
        this.name = 'lisi';
    }
    sayName() {
        return '父类';
    }
}
Parent.prototype.age = 12;
class Child extends Parent {
    constructor() {
        super();
        // 这里将super当作对象使用，并且在普通方法中，此时super指向Parent.prototype
        // super.sayName()相当于Parent.prototype.sayName()
        console.log(super.sayName());
        // 由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
        console.log(super.name); // undefined
        // 父类原型上的属性是可以访问到的
        console.log(super.age); // 12
    }
}

const child = new Child();
```
::: tip
ES6规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
:::
```js
class Parent {
    constructor() {
        this.name = '父类';
    }
    sayName() {
        console.log(this.name);
    }
}

class Child extends Parent {
    constructor() {
        super();
        this.name = '子类';
    }
    print() {
        super.sayName(); // 调用父类的原型方法sayName
    }
}

const child = new Child();
child.print(); // 子类
```
上面代码中，super.sayName()虽然调用的是Parent.prototype.sayName()，但是Parent.prototype.sayName()内部的this指向子类Child的实例，导致输出的是`子类`，而不是`父类`。也就是说，实际上执行的是super.print.call(this)。
## 类的prototype属性和`__proto__`属性

## 参考文档
1. [Class 的继承](http://es6.ruanyifeng.com/#docs/class-extends)