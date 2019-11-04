---
title: 迭代器(Iterator)
---
Iterator 的作用有三个：

1. 为各种数据结构，提供一个统一的、简便的访问接口；
2. 使得数据结构的成员能够按某种次序排列；
3. ES6创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

>Iterator 的遍历过程是这样的。

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。

```js
function makeIterator(array) {
    let nextIndex = 0;
    return {
        next() {
            const done = nextIndex === array.length;
            const value = done ? undefined : array[nextIndex++];
            return {
                value,
                done
            }
        }
    }
}

const it = makeIterator(['a', 'b']);
let result;
do {
    result= it.next();
    console.log(result);
} while (!result.done);
/*
{ value: 'a', done: false }
{ value: 'b', done: false }
{ value: undefined, done: true }
*/
```