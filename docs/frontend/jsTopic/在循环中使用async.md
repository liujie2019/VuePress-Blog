---
title: 18. 在循环中使用async
---
## 先看一个例子
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

const getNumFruit = fruit => {
    return fruitBasket[fruit];
}

console.log(getNumFruit('pear')); // 14
```
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const fn = async () => {
    console.log('start');
    const numApples = await getNumFruit('apple'); // 每间隔一秒输出
    console.log(numApples);
    const numBananas = await getNumFruit('banana'); // 每间隔一秒输出
    console.log(numBananas);
    const numPears = await getNumFruit('pear'); // 每间隔一秒输出对应水果的数量
    console.log(numPears);
    console.log('end');
}
fn();
```
## 在for循环中使用await
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const forLoop = async () => {
    console.log('start');
    const fruits = Object.keys(fruitBasket);
    // 循环依次获取对应水果的数量
    for (let i = 0; i < fruits.length; i++) {
        const fruit = fruits[i];
        // getNumFruit返回一个promise，使用await来等待结果的返回并打印
        const fruitNum = await getNumFruit(fruit);
        console.log(`${fruit}: ${fruitNum}`);
    }
    console.log('end');
}

forLoop();
```
当使用await时，希望JavaScript暂停执行，直到promise返回处理结果，这意味着for循环中的await应该是按顺序执行的。
结果如下：
```js
start
apple: 27
banana: 12
pear: 14
end
```
## 在forEach循环中使用await
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const forEachLoop = async () => {
    console.log('start');
    const fruits = Object.keys(fruitBasket);
    fruits.forEach(async fruit => {
        const fruitNum = await getNumFruit(fruit);
        console.log(`${fruit}: ${fruitNum}`);
    });
    console.log('end');
}

forEachLoop();
```
结果如下：
```js
start
end
apple: 27
banana: 12
pear: 14
```
由上述结果可知，在JavaScript中的forEach不支持promise感知，也不支持async和await，所以不能在forEach使用await。
## 在map中使用await
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const mapLoop = async () => {
    console.log('start');
    const fruits = Object.keys(fruitBasket);
    const numFruits = await fruits.map(async fruit => {
        const fruitNum = await getNumFruit(fruit);
        return fruitNum; // 这里返回的是一个promise
    });
    // numFruits是一个Promise数组
    console.log(numFruits);
    console.log('end');
}

mapLoop();
```
```js
start
[ Promise { <pending> },
  Promise { <pending> },
  Promise { <pending> } ]
end
```
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const mapLoop = async () => {
    console.log('start');
    const fruits = Object.keys(fruitBasket);
    const numFruitsPromises = fruits.map(async fruit => {
        const fruitNum = await getNumFruit(fruit);
        return fruitNum; // 这里返回的是一个promise
    });
    // numFruits是一个Promise数组
    // 使用Promise.all来处理Promise数组
    const numFruits = await Promise.all(numFruitsPromises);
    console.log(numFruits);
    console.log('end');
}

mapLoop();
```
```js
start
[ 27, 12, 14 ]
end
```
## 在filter循环中使用await
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const filterLoop = async () => {
    console.log('start');
    const fruits = Object.keys(fruitBasket);
    const moreThan20 = await fruits.filter(async fruit => {
        const fruitNum = getNumFruit(fruit);
        return fruitNum > 12; // 这里return的是promise，所有数组中的所有项都通过filter。
    });
    console.log(moreThan20);
    console.log('end');
}

filterLoop();
```
```js
start
[ 'apple', 'banana', 'pear' ]
end
```
在filter正确使用await的三个步骤：

1. 使用map返回一个promise数组;
2. 使用 await 等待处理结果
3. 使用 filter 对返回的结果进行处理
## 在reduce循环中使用await
```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const reduceLoop = async () => {
    console.log('start');
    const fruits = Object.keys(fruitBasket);
    const sum = await fruits.reduce(async (sum, fruit) => {
        const fruitNum = await getNumFruit(fruit);
        return sum + fruitNum; // 这里return的是promise，所以最后返回的一个拼接字符串
    }, 0);
    console.log(sum);
    console.log('end');
}

reduceLoop();
```
```js
start
[object Promise]14
end
```
1. 在第一次遍历中，sum为0。fruitNum是27(通过getNumFruit(apple)的得到的值)，0 + 27 = 27。
2. 在第二次遍历中，sum是一个promise。为什么？因为异步函数总是返回promises）fruitNum是12。promise无法正常添加到对象，因此JavaScript将其转换为[object Promise]字符串。 [object Promise] + 12 是object Promise] 12。
3. 在第三次遍历中，sum还是一个promise。fruitNum是14. [object Promise] + 14是[object Promise] 14。

```js
const fruitBasket = {
    apple: 27,
    banana: 12,
    pear: 14
};

// 使用setTimeout模拟从服务器获取数据
const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const getNumFruit = fruit => {
    return sleep(1000).then(() => fruitBasket[fruit]);
}

const reduceLoop = async () => {
    console.log('start');
    const fruits = Object.keys(fruitBasket);
    const sum = await fruits.reduce(async (promisedSum, fruit) => {
        const sum = await promisedSum;
        const fruitNum = await getNumFruit(fruit);
        return sum + fruitNum;
    }, 0);
    console.log(sum);
    console.log('end');
}
reduceLoop();
```

在reduce中使用wait最简单(也是最有效)的方法是:

1. 使用map返回一个promise 数组
2. 使用 await 等待处理结果
3. 使用 reduce 对返回的结果进行处理
## 总结

* 如果需要循环执行await，使用for循环(或任何没有回调的循环)。
* 永远不要和forEach一起使用await，而是使用for循环(或任何没有回调的循环)。
* 不要在filter和reduce中使用await，如果需要，先用map进行处理，然后再使用filter和reduce进行处理。


## 参考文档
1. [JavaScript async and await in loops](https://medium.com/free-code-camp/javascript-async-and-await-in-loops-30ecc5fb3939)
2. [如何在 JS 循环中正确使用 async 与 await](https://juejin.im/post/5cf7042df265da1ba647d9d1)