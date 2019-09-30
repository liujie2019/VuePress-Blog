---
title: 原生JS函数
---
## 函数
### 匿名函数
在javascript里**任何匿名函数都是属于window对象**。在定义匿名函数时候它会返回自己的内存地址，如果此时有个变量接收了这个内存地址，那么匿名函数就能在程序里被使用了(可以通过在这个变量后面加一对圆括号来调用这个匿名函数)，因为匿名函数也是在全局执行环境构造时候定义和赋值，所以匿名函数的this指向也是window对象。
```html
<script type="text/javascript">
(function(){
	console.log(this == window);//true
})();
</script>
```
### 参数传递
```html
<script type="text/javascript">
     function test(num){//按值传递
         num+=5;
         console.log(num);
         return num;
     }
     var num = 5;
     var result = test(num);
     console.log(result);// 10 如果是按引用传递，那么函数里的num会成为类似全局变量，把外面的num覆盖掉
     console.log(num);// 5 也就是说，最后应该输出20（这里输出10）
</script>
```
js中不存在引用传递，如果存在引用传递的话，那么函数内的变量将是全局变量，在外部也可以访问，但这明显是不可能的。
**再看一个例子：**
```html
<script type="text/javascript">
function setName(obj){//obj = person
	obj.name = "lisi";
	obj = new Object();
	obj.name = "wangwu";
}
var person = new Object();
setName(person);
alert(person.name);
console.log(obj.name);//Uncaught ReferenceError: obj is not defined
</script>
```
在将person传递给obj后，其name属性就被设置成了"lisi"。又将obj重新定义了一个对象，另一行代码为该对象定义了一个带有不同值的name属性。
如果person是按引用传递的，那么person就会自动被修改为指向其name属性值为"wangwu"的新对象，但事实上并没有，其name属性依然是"lisi"。
**这就说明：**即使在函数内部修改了参数的值，但原始的引用仍然保持不变。实际上，当在函数内重写obj时，这个变量引用的就是一个局部对象了。而这个局部对象会在函数执行完毕后立即被销毁。
