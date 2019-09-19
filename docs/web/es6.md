# JavaScript ES6 规范
## ES6 简介
ECMAScript 6 简称 ES6，是 JavaScript 语言的下一代标准，已经在2015年6月正式发布了。它的目标是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言。

ECMAScript 和 JavaScript 的关系：前者是后者的语法规格，后者是前者的一种实现

[Babel](http://babeljs.io/)：将ES6代码转为ES5代码 
## 新特性
### let、const
let 定义的变量不会被变量提升，const 定义的常量不能被修改，let 和 const 都是块级作用域

ES6前，js 是没有块级作用域 {} 的概念的。（有函数作用域、全局作用域、eval作用域）

ES6后，let 和 const 的出现，js 也有了块级作用域的概念，前端的知识是日新月异的~

变量提升：在ES6以前，var关键字声明变量。无论声明在何处，都会被视为声明在函数的最顶部；不在函数内即在全局作用域的最顶部。这样就会引起一些误解。例如：
```js
console.log(a); // undefined
var a = 'hello';
 
# 上面的代码相当于
var a;
console.log(a);
a = 'hello';
 
# 而 let 就不会被变量提升
console.log(a); // a is not defined
let a = 'hello';
```
const 定义的常量不能被修改
```js
var name = "bai";
name = "ming";
console.log(name); // ming
const name = "bai";
name = "ming"; // Assignment to constant variable.
console.log(name);
```
### import、export
import导入模块、export导出模块
```js
// 全部导入
import people from './example'
 
// 将整个模块当作单一对象进行导入，该模块的所有导出都会作为对象的属性存在
import * as example from "./example.js"
console.log(example.name)
console.log(example.getName())
 
// 导入部分，引入非 default 时，使用花括号
import {name, age} from './example'
 
 
// 导出默认, 有且只有一个默认
export default App
 
// 部分导出
export class App extend Component {};
```
### class、extends、super
ES5中最令人头疼的的几个部分：原型、构造函数，继承，有了ES6我们不再烦恼！

ES6引入了Class（类）这个概念。
```js
class Animal {
constructor() {
this.type = 'animal';
}
says(say) {
console.log(this.type + ' says ' + say);
}
}
 
let animal = new Animal();
animal.says('hello'); //animal says hello
 
class Cat extends Animal {
constructor() {
super();
this.type = 'cat';
}
}
 
let cat = new Cat();
cat.says('hello'); //cat says hello
```
上面代码首先用class定义了一个“类”，可以看到里面有一个constructor方法，这就是构造方法，而this关键字则代表实例对象。简单地说，constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实力对象可以共享的。

Class之间可以通过extends关键字实现继承，这比ES5的通过修改原型链实现继承，要清晰和方便很多。上面定义了一个Cat类，该类通过extends关键字，继承了Animal类的所有属性和方法。

super关键字，它指代父类的实例（即父类的this对象）。子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。

ES6的继承机制，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。
```js
// ES5
var Shape = function(id, x, y) {
this.id = id,
this.move(x, y);
};
Shape.prototype.move = function(x, y) {
this.x = x;
this.y = y;
};
 
var Rectangle = function id(ix, x, y, width, height) {
Shape.call(this, id, x, y);
this.width = width;
this.height = height;
};
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
 
var Circle = function(id, x, y, radius) {
Shape.call(this, id, x, y);
this.radius = radius;
};
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
 
// ES6
class Shape {
constructor(id, x, y) {
this.id = id this.move(x, y);
}
move(x, y) {
this.x = x this.y = y;
}
}
 
class Rectangle extends Shape {
constructor(id, x, y, width, height) {
super(id, x, y) this.width = width this.height = height;
}
}
 
class Circle extends Shape {
constructor(id, x, y, radius) {
super(id, x, y) this.radius = radius;
}
}
```
### arrow functions （箭头函数）
函数的快捷写法。不需要 function 关键字来创建函数，省略 return 关键字，继承当前上下文的 this 关键字
```js
// ES5
var arr1 = [1, 2, 3];
var newArr1 = arr1.map(function(x) {
return x + 1;
});
 
// ES6
let arr2 = [1, 2, 3];
let newArr2 = arr2.map((x) => {
x + 1
});
```
箭头函数小细节：当你的函数有且仅有一个参数的时候，是可以省略掉括号的；当你函数中有且仅有一个表达式的时候可以省略{}
```js
let arr2 = [1, 2, 3];
let newArr2 = arr2.map(x => x + 1);
```
JavaScript语言的this对象一直是一个令人头痛的问题，运行上面的代码会报错，这是因为setTimeout中的this指向的是全局对象。

```js
class Animal {
constructor() {
this.type = 'animal';
}
says(say) {
setTimeout(function() {
console.log(this.type + ' says ' + say);
}, 1000);
}
}
var animal = new Animal();
animal.says('hi'); //undefined says hi
```
解决办法：
```js
// 传统方法1: 将this传给self,再用self来指代this
says(say) {
var self = this;
setTimeout(function() {
console.log(self.type + ' says ' + say);
}, 1000);
}
 
// 传统方法2: 用bind(this),即
says(say) {
setTimeout(function() {
console.log(this.type + ' says ' + say);
}.bind(this), 1000);
}
 
// ES6: 箭头函数
// 当我们使用箭头函数时，函数体内的this对象，就是定义时所在的对象
says(say) {
setTimeout(() => {
console.log(this.type + ' says ' + say);
}, 1000);
}
```
### template string （模板字符串）
解决了 ES5 在字符串功能上的痛点。

第一个用途：字符串拼接。将表达式嵌入字符串中进行拼接，用 ` 和${}`来界定。
```js
// es5
var name1 = "bai";
console.log('hello' + name1);
 
// es6
const name2 = "ming";
console.log(`hello${name2}`);
```
第二个用途：在ES5时我们通过反斜杠来做多行字符串拼接。ES6反引号 `` 直接搞定。
```js
// es5
var msg = "Hi \
man!";
 
// es6
const template = `<div>
<span>hello world</span>
</div>`;
```
另外：includes repeat
```js
// includes：判断是否包含然后直接返回布尔值
let str = 'hahah';
console.log(str.includes('y')); // false
 
// repeat: 获取字符串重复n次
let s = 'he';
console.log(s.repeat(3)); // 'hehehe'
```
### destructuring （解构）
简化数组和对象中信息的提取。

ES6前，我们一个一个获取对象信息；

ES6后，解构能让我们从对象或者数组里取出数据存为变量
```js
// ES5
var people1 = {
name: 'bai',
age: 20,
color: ['red', 'blue']
};
 
var myName = people1.name;
var myAge = people1.age;
var myColor = people1.color[0];
console.log(myName + '----' + myAge + '----' + myColor);
 
// ES6
let people2 = {
name: 'ming',
age: 20,
color: ['red', 'blue']
}
 
let { name, age } = people2;
let [first, second] = people2.color;
console.log(`${name}----${age}----${first}`);
```
### default 函数默认参数
```js
// ES5 给函数定义参数默认值
function foo(num) {
num = num || 200;
return num;
}
 
// ES6
function foo(num = 200) {
return num;
}
```
### rest arguments （rest参数）
解决了 es5 复杂的 arguments 问题
```js
function foo(x, y, ...rest) {
return ((x + y) * rest.length);
}
foo(1, 2, 'hello', true, 7); // 9
```
### Spread Operator （展开运算符）
第一个用途：组装数组
```js
let color = ['red', 'yellow'];
let colorful = [...color, 'green', 'blue'];
console.log(colorful); // ["red", "yellow", "green", "blue"]
```
第二个用途：获取数组除了某几项的其他项
```js
let num = [1, 3, 5, 7, 9];
let [first, second, ...rest] = num;
console.log(rest); // [5, 7, 9]
```
### 对象
对象初始化简写
```js
// ES5
function people(name, age) {
return {
name: name,
age: age
};
}
 
// ES6
function people(name, age) {
return {
name,
age
};
}
```
对象字面量简写（省略冒号与 function 关键字）
```js
// ES5
var people1 = {
name: 'bai',
getName: function () {
console.log(this.name);
}
};
 
// ES6
let people2 = {
name: 'bai',
getName () {
console.log(this.name);
}
};
```
另外：Object.assign()

ES6 对象提供了Object.assign()这个方法来实现浅复制。Object.assign()可以把任意多个源对象自身可枚举的属性拷贝给目标对象，然后返回目标对象。第一参数即为目标对象。在实际项目中，我们为了不改变源对象。一般会把目标对象传为{}
```js
const obj = Object.assign({}, objA, objB)
 
// 给对象添加属性
this.seller = Object.assign({}, this.seller, response.data)
```
### Promise
用同步的方式去写异步代码
```js
// 发起异步请求
fetch('/api/todos')
.then(res => res.json())
.then(data => ({
data
}))
.catch(err => ({
err
}));
```
### Generators
生成器（ generator）是能返回一个迭代器的函数。

生成器函数也是一种函数，最直观的表现就是比普通的function多了个星号*，在其函数体内可以使用yield关键字,有意思的是函数会在每个yield后暂停。

这里生活中有一个比较形象的例子。咱们到银行办理业务时候都得向大厅的机器取一张排队号。你拿到你的排队号，机器并不会自动为你再出下一张票。也就是说取票机“暂停”住了，直到下一个人再次唤起才会继续吐票。

迭代器：当你调用一个generator时，它将返回一个迭代器对象。这个迭代器对象拥有一个叫做next的方法来帮助你重启generator函数并得到下一个值。next方法不仅返回值，它返回的对象具有两个属性：done和value。value是你获得的值，done用来表明你的generator是否已经停止提供值。继续用刚刚取票的例子，每张排队号就是这里的value，打印票的纸是否用完就这是这里的done。
```js
// 生成器
function *createIterator() {
yield 1;
yield 2;
yield 3;
}
 
// 生成器能像正规函数那样被调用，但会返回一个迭代器
let iterator = createIterator();
 
console.log(iterator.next().value); // 1
console.log(iterator.next().value); // 2
console.log(iterator.next().value); // 3
```
迭代器对异步编程作用很大，异步调用对于我们来说是很困难的事，我们的函数并不会等待异步调用完再执行，你可能会想到用回调函数，（当然还有其他方案比如Promise比如Async/await）。

生成器可以让我们的代码进行等待。就不用嵌套的回调函数。使用generator可以确保当异步调用在我们的generator函数运行一下行代码之前完成时暂停函数的执行。

那么问题来了，咱们也不能手动一直调用next()方法，你需要一个能够调用生成器并启动迭代器的方法。就像这样子的：
```js
function run(taskDef) {
// taskDef 即一个生成器函数
// 创建迭代器，让它在别处可用
let task = taskDef();
 
// 启动任务
let result = task.next();
 
// 递归使用函数来保持对 next() 的调用
function step() {
// 如果还有更多要做的
if (!result.done) {
result = task.next();
step();
}
}
 
// 开始处理过程
step();
}
```
## 总结
以上就是 ES6 最常用的一些语法，可以说这20%的语法，在ES6的日常使用中占了80%

[更多ES6语法点击这里](http://es6.ruanyifeng.com/)
[《JavaScript 语言入门教程》](https://wangdoc.com/)
