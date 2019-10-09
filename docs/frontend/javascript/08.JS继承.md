---
title: JS继承
---
js里常用的如下两种继承方式：
* 原型链继承（对象间依靠原型链来实现继承）；
* 类式继承（在子类型构造函数的内部调用超类型的构造函数）

由于js不像java那样是真正面向对象的语言，js是基于对象的，它没有类的概念。所以，要想实现继承，可以用js的原型
prototype机制或者用apply和call方法去实现。

## 借用构造函数（类式继承）
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>借用构造函数（类式继承）</title>
    </head>
    <body>
    <script type="text/javascript">
        /*
        在js中，被继承的函数称为超类型（父类，基类也行），继承的函数称为子类型（子类，派生类）。使用原型继承主要由两个问题：
        一是字面量重写原型会中断关系，使用引用类型的原型，并且子类型还无法给超类型传递参数。

        伪类解决引用共享和超类型无法传参的问题，我们可以采用“借用构造函数”技术
         */
        function Parent(age){
            this.colors=['red','blue','green'];
            this.age=age;
        }
        function Child(age){
            Parent.call(this,age);
        }
        var child=new Child("lisi");
        var child2=new Child("zhangsan");
        var obj=new Parent("wangwu");
        console.log(child.age);//lisi
        console.log(child.colors);//["red", "blue", "green"]
        child.colors.push("yellow");
        console.log(child.colors);// ["red", "blue", "green", "yellow"]
        console.log(obj.colors);// ["red", "blue", "green"]
        console.log(child2.colors);//["red", "blue", "green"]
        /*
        借用构造函数虽然解决了刚才两种问题，但没有原型，则复用无从谈起，所以我们需要原型链+借用构造函数的模式，这种模式称为组合继承
         */
    </script>
    </body>
</html>
```
#### 2. 原型链继承
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>原型继承</title>
    </head>
    <body>
    <script type="text/javascript">
        //原型式继承是借助已有的对象创建新的对象，将子类的原型指向父类，就相当于加入了父类这条原型链
        //为了让子类继承父类的属性（也包括方法），首先需要定义一个构造函数。然后，将父类的新实例赋值给子类构造函数的原型。代码如下：
        function Parent(){
            this.age=12;
        }
        function Child(){
            this.name="lisi";
        }
        Child.prototype=new Parent();//Child继承Parent，通过原型，形成链条
        var test=new Child();
        console.log(test.name);//lisi
        console.log(test.age);//12  得到被继承的属性
        //继续原型链继承
        function Brother(){
            this.job="worker";
        }
        Brother.prototype=new Child();//继续原型链继承
        var person=new Brother();
        person.name="wangwu";
        console.log(person.name);//wangwu  实例属性覆盖原型属性
        console.log(person.age);//12  继承了Parent和Child,弹出12和lisi
        console.log(person.job);//worker

        //以上原型链继承还缺少一环，那就是Object，所有的构造函数都继承自Object。而继承Object是自动完成的，并不需要我们自己手动继承

        //确定原型和实例的关系
        //可以通过两种方式来确定原型和实例之间的关系。操作符instanceof和isPrototypeof()方法：
        console.log(person instanceof Brother);//true
        console.log(person instanceof Child);//true
        console.log(person instanceof Parent);//true
        console.log(Brother.prototype.isPrototypeOf(person));//true
        console.log(Child.prototype.isPrototypeOf(Brother.prototype));//true
        console.log(Child.prototype.isPrototypeOf(test));//true
        console.log(Parent.prototype.isPrototypeOf(Child.prototype));//true
        //只要是原型链中出现过的原型，都可以说是该原型链派生的实例的原型，因此，isPrototypeof()方法也会返回true
    </script>
    </body>
</html>
```
Child.prototype=new Parent();这一行相当于完全删除了Child的prototype 对象原先的值，然后赋予一个新值。

这样赋值之后，需要重新指定：Child.prototype.constructor = Child;

因为任何一个prototype对象都有一个constructor属性，指向它的构造函数。如果没有"Child.prototype=new Parent();"这一行，Child.prototype.constructor是指向Child的；加了这一行以后，Child.prototype.constructor指向Parent。所以为了确保Child.prototype.constructor是指向Child，需要重新指定Child.prototype.constructor = Child;

更重要的是：每一个实例也有一个constructor属性，默认调用prototype对象的constructor属性。
```js
console.log(child.constructor == Child.prototype.constructor);//true
```
```js
<script type="text/javascript">
	function Parent(name){
		this.name = name;
	}
	function Child(age){
		this.age = age;
	}
	Child.prototype = new Parent();
	var child = new Child("lisi",23);
	console.log(child.constructor == Child.prototype.constructor);//false
	console.log(child.constructor == Parent);//true
	</script>
```
>但是，在运行"Child.prototype = new Parent();"这一行之后，Child.constructor也指向Parent！

这显然会导致继承链的紊乱（child明明是用构造函数Child生成的），因此我们必须手动纠正，将Child.prototype对象的constructor值改为Child。这就是需要重新指定：Child.prototype.constructor = Child;的意义所在。

这是很重要的一点，编程时务必要遵守。下文都遵循这一点，即如果替换了prototype对象。

```js
o.prototype = {};
```
那么，下一步必然是为新的prototype对象加上constructor属性，并将这个属性指回原来的构造函数。
```js
o.prototype.constructor = o;
```
#### 3. 直接继承prototype
```html
<script type="text/javascript">
//由于Parent对象中，不变的属性都可以直接写入Parent.prototype。所以，我们也可以让Child()跳过 Parent()，直接继承Parent.prototype。
	function Parent(name){
		this.name = name;
	}
	function Child(age){
		this.age = age;
	}
	//将Child的prototype对象，然后指向Parent的prototype对象，这样就完成了继承
	Child.prototype = Parent.prototype;
	Child.prototype.constructor = Child;//这里同样会修改Parent的构造函数
	var child = new Child("lisi",23);
	console.log(Child.prototype.constructor);//Child
	console.log(Parent.prototype.constructor);//Child
	/*
	与前一种方法相比，这样做的优点是效率比较高（不用执行和建立Parent的实例了），比较省内存。缺点是 Child.prototype和Parent.prototype现在指向了同一个对象，那么任何对Child.prototype的修改，都会反映到Parent.prototype。
	 */
</script>
```
#### 4. 原型式继承
原型式继承，要求必须有一个对象可以作为另一个对象的基础。如果有这么一个对象的话，可以把它传递给obj函数，然后再根据具体要求对得到的对象加以修改即可。在这个例子中，可以作为另一个对象基础的是box对象，我们将其传入obj()函数，然后该函数就会返回一个新对象。这个新对象将box作为原型，所以它的原型中就包含一个基本类型值属性和一个引用类型值属性。也就说box.family不仅属于box所有，而且也会被a1和a2共享。这就相当于又创建了box对象的两个副本(即对box对象进行了浅复制)。

这种继承方式的缺点是：包含引用类型值的属性始终都会共享相应的值。
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>原型式继承</title>
    </head>
    <body>
    <script type="text/javascript">
        //这种继承借助原型并基于已有的对象创建新对象，同时还不用创建自定义类型的方式称为原型式继承
        //原型式继承首先在obj()函数内部创建一个临时性的构造函数 ，然后将传入的对象作为这个构造函数的原型，最后返回这个临时类型的一个新实例。
        function obj(o){
            function F(){}
            F.prototype=o;
            return new F();
        }
        var box={
            name:"lisi",
            family:['brother','sister','me']//包含引用类型值的属性始终都会共享相应的值
        };
        var a1=obj(box);
        console.log(a1.name);//lisi
        a1.name="wangwu";
        console.log(a1.name);//wangwu
        console.log(a1.family);// ["brother", "sister", "me"]
        a1.family.push("mother");
        console.log(a1.family);// ["brother", "sister", "me", "mother"]

        var a2=obj(box);
        console.log(a2.name);//lisi
        console.log(a2.family);// ["brother", "sister", "me", "mother"]
        console.log(box.family);//["brother", "sister", "me", "mother"]
    </script>
    </body>
</html>
```
##### 4.1 Object.create()原型式继承
```js
<script type="text/javascript">
    //ECMAScript5新增了Object.create()方法规范化了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和可选参数--一个为新对象定义额外属性的对象。
        var box = {
            name:"lisi",
            family:['brother','sister','me']//包含引用类型值的属性始终都会共享相应的值
        };
        var a1 = Object.create(box);
        console.log(a1.name);//lisi
        a1.name = "wangwu";
        console.log(a1.name);//wangwu
        console.log(a1.family);// ["brother", "sister", "me"]
        a1.family.push("mother");
        console.log(a1.family);// ["brother", "sister", "me", "mother"]

        /*
        Object.create()方法的第二个参数与Object.defineProperties()方法的第二个参数格式相同：每个属性都是通过自己的描述符定义的。以这种方式指定的任何属性都会覆盖原型对象上的同名属性。
         */
        var a2 = Object.create(box,{
        	name:{
        		//描述符对象
        		value:"赵六"
        	}
        });
        console.log(a2.name);//赵六  覆盖了原型上的name属性
        a2.family.push("child");
        console.log(a2.family);// ["brother", "sister", "me", "mother", "child"]
        console.log(box.family);//["brother", "sister", "me", "mother", "child"]
    </script>
```
#### 5. 组合继承
组合式继承是比较常用的一种继承方法，其背后的思路是：使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又保证每个实例都有它自己的属性。
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>组合继承</title>
    </head>
    <body>
    <script type="text/javascript">
        function Parent(age){
            this.colors=['red','blue','green'];
            this.age=age;
        }
        Parent.prototype.run=function(){
            console.log(this.colors+'---'+this.age);
        }
        function Child(age){
            Parent.call(this,age)//继承属性  对象冒充，给超类型传参
        }
        Child.prototype=new Parent();//原型链继承,继承原型方法
        var child=new Child("lisi");
        child.run();//red,blue,green---lisi
        /*
        call()的用法：改变this指向。
         */
    </script>
    </body>
</html>
```
#### 6. 寄生式继承
这种继承方式是把原型式+工厂模式结合起来，目的是为了封装创建的过程。

根据已有对象person，利用原型式继承返回一个新的对象，并根据要求对该对象进行增强。
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>寄生式继承</title>
    </head>
    <body>
    <script type="text/javascript">
        //这种继承方式是把原型式+工厂模式结合起来，目的是为了封装创建的过程。
         function obj(o){
            function F(){}
            F.prototype=o;
            return new F();
        }
        function createAnother(original){//工厂模式
            var clone=obj(original);//通过调用obj函数创建一个新对象
            clone.sayHi=function(){//根据要求增强新对象
                console.log("Hi");
            };
            return clone;
        }
        var person={
            name:'liujie',
            family:["father","mother","sister"]
        };
        var anotherPerson=createAnother(person);
        //anotherPerson是返回的新对象，不仅具有person的属性和方法，还有自己的sayHi方法
        anotherPerson.sayHi();//Hi
        console.log(anotherPerson.name);//liujie
        console.log(anotherPerson.family);// ["father", "mother", "sister"]
    </script>
    </body>
</html>
```
##### 6.1 组合式继承的小问题
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>组合式继承的小问题</title>
    </head>
    <body>
    <script type="text/javascript">
        //组合式继承是js最常用的继承模式，但组合继承的超类型在使用过程中会被调用两次；一次是创建子类型原型的时候，另一次是在子类型构造函数的内部
        //子类型最终会包含超类型对象的全部实例属性
        function SuperType(name){
            this.name=name;
            this.color=['red','blue','yellow'];
        }
        SuperType.prototype.sayName=function(){
            console.log(this.name);
        };
        function SubType(name,age){
            SuperType.call(this,name);//第二次调用SuperType()
            this.age=age;
        }
        SubType.prototype=new SuperType();//第一次调用SuperType()
        console.log(SubType.prototype.constructor);//SuperType(name)
        SubType.prototype.constructor=SubType;//这里如果不设置SubType.prototype.constructor将指向SuperType()  因为上面实现继承的同时也重写了SubType.prototype
        SubType.prototype.sayAge=function(){
            console.log(this.age);
        };
    </script>
    </body>
</html>
```
#### 7. 寄生组合式继承
这种方式的目的就在于：解决组合继承中父类构造函数调用两次造成的子类原型上创建多余的、不必要的属性的问题。

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。

 基本思路是：不必为指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。我们可以使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。这样就可以避免两次调用父类的构造函数，不会在子类原型上创建多余的、不必要的属性。
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>寄生组合式继承</title>
    </head>
    <body>
    <script type="text/javascript">
        function object(o){//o=SuperType.prototype
            function F(){}
            F.prototype = o;//F.prototype=SuperType.prototype
            return new F();//这里返回父类原型的副本
        }
        function inheritPrototype(subType, superType){
            var prototype = object(superType.prototype);   //创建对象   其实就是超类型原型的一个副本
            //console.log(prototype);// SuperType { sayName=function()}
            //console.log(prototype.constructor);//SuperType(name)
            prototype.constructor = subType;  //增强对象   为创建的副本添加constructor 属性，从而弥补下一步重写子类原型而让子类失去默认的constructor 属性
            subType.prototype = prototype;   //指定对象  将超类型原型的副本赋值给子类原型  这样就实现了继承
            //console.log(subType.prototype.constructor);//SubType(name, age)
        }

        function SuperType(name){
            this.name = name;
            this.colors = ["red", "blue", "green"];
        }

        SuperType.prototype.sayName = function(){
            alert(this.name);
        };

        function SubType(name, age){
            SuperType.call(this, name);//继承属性
            this.age = age;
        }

        inheritPrototype(SubType, SuperType);//通过这里实现继承

        SubType.prototype.sayAge = function(){//子类的原型方法
            alert(this.age);
        };

        var instance1 = new SubType("Nicholas", 29);
        instance1.colors.push("black");
        alert(instance1.colors);  //"red,blue,green,black"
        instance1.sayName();      //"Nicholas";
        instance1.sayAge();       //29


        var instance2 = new SubType("Greg", 27);
        alert(instance2.colors);  //"red,blue,green"   引用问题解决
        instance2.sayName();      //"Greg";
        instance2.sayAge();       //27

    </script>
    </body>
</html>
```
#### js继承方式及其优缺点
原型链继承的缺点

一是字面量重写原型会中断关系，使用引用类型的原型，并且子类型还无法给超类型传递参数。

借用构造函数（类式继承）

借用构造函数虽然解决了刚才两种问题，但没有原型，则复用无从谈起。所以我们需要原型链+借用构造函数的模式，这种模式称为组合继承

组合式继承

组合式继承是比较常用的一种继承方法，其背后的思路是：使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又保证每个实例都有它自己的属性。

组合继承缺点：组合继承最大的问题：就是无论什么情况下，都会调用两次超类型构造函数。一次是在创建子类原型的时候，另一次是在子类型构造函数内部。子类型最终会包含超类型对象的全部实例属性，但我们不得不在调用子类型构造函数时重写这些属性。这样就会导致在子类原型上创建不必要的、多余的属性。
#### 非构造函数的继承
##### 浅拷贝继承
```js
<script type="text/javascript">
//把父对象的属性，全部拷贝给子对象，也能实现继承
var Parent = {
	name:"lisi",
	friends:['wangwu','zhaoliu']
};
function extendCopy(p){
	var c = {};
	for(var i in p){
		c[i] = p[i];
	}
	return c;
}
var Child = extendCopy(Parent);
Child.age = 23;
Child.friends.push("zhangsan");
console.log(Child.name);//lisi
console.log(Child.friends);//["wangwu", "zhaoliu", "zhangsan"]
console.log(Parent.friends);//["wangwu", "zhaoliu", "zhangsan"]
</script>
```
>缺点：这样的拷贝有一个问题。那就是，如果父对象的属性等于数组或另一个对象，那么实际上，子对象获得的只是一个内存地址，而不是真正拷贝，因此存在父对象被篡改的可能。上例中父对象的friends属性就被修改了。所以，extendCopy()只是拷贝基本类型的数据，我们把这种拷贝叫做"浅拷贝"。这是早期jQuery实现继承的方式。
##### 深拷贝继承
```js
<script type="text/javascript">
//所谓"深拷贝"，就是能够实现真正意义上的数组和对象的拷贝。它的实现并不难，只要递归调用"浅拷贝"就行了。
var Parent = {
	name:"lisi",
	friends:['wangwu','zhaoliu']
};
function deepCopy(p,c){
	var c = c || {};
	for(var i in p){
		//如果父元素的属性是对象类型并且是数组，则递归拷贝
		if(typeof p[i] === 'object'){
			c[i] = (p[i].constructor === Array) ? [] : {};
			deepCopy(p[i],c[i]);
		}else{//如果是基本类型，则直接拷贝
			c[i] = p[i];
		}
	}
	return c;
}
var Child = deepCopy(Parent);
Child.friends.push("zhangsan");
console.log(Child.friends);//["wangwu", "zhaoliu", "zhangsan"]
console.log(Parent.friends);//["wangwu", "zhaoliu"]
//jQuery库使用的就是这种继承方法
</script>
```
## 参考文档

1. [Javascript 面向对象编程（一）：封装](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)
2. [Javascript面向对象编程（二）：构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)
3. [Javascript面向对象编程（三）：非构造函数的继承](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance_continued.html)
4. [第六章 面向对象的程序设计](https://blog.csdn.net/hc1025808587/article/details/51539707)