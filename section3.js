/*
js包括：
浏览器api
    dom api文档对象api
    地理api
    画布canvas webgl
    影音api media video audio
第三方api
    google map
    微博api

script标签的async和defer属性
    async不会阻塞页面加载，会直接下载后运行，运行顺序无法控制
    defer脚本会按需加载并运行，有依赖关系的可以添加
*/
/*
变量
名字：0-9 a-z A-Z _组合  不得以数字开头，也最好不要_开头，大小写敏感 字母下划线或者$开头
Number
String
Boolean
Function
Object
    Array
    Object
undefined 未定义  转换成数字是NaN，转成布尔是false
null 空值 转换成数字是0，转成布尔值是false
Symbol在es6中新增的数据类型 一种实例是唯一且不可改变的数据类型
BigInt任意精度的整数，可以存储操作大数
*/
/*
Number 10进制一般都是   二进制和8进制 16进制
typeof 1 === 'number'
** 幂次，在es2016中首次引入 相当于Math.pow(7, 3) === 7**3 7的3次方

运算符优先级  *\/比+-优先，()优先级更高 具体看书

*/

/** 
string字符串
string.length  长度
string[1] 第二个字符
string.indexOf('')第一次出现的位置，如果没有返回-1
string.slice(first, last) 从first位置开始剪切，到last，包括first，不包括last，如果last没有，就直接剪切到最后一位，不改变string
string.toLowerCase() string.toUpperCase()
string.replace(sonStr, source) 用source代替sonstr，不会改变string

*/
/**
 * Array数组
 * length长度
 * arr.join变成字符串  str.split('@')变成数组
 * arr.toString() 变成string
 * arr.push() 最后一位加入一/多个元素  .pop() 删除最后一个元素
 * unshift()开头新增一个/多个元素  shift()开头删除一个元素
 * arr.slice(first, last) fist位置开始，last结束，不包括last  不改变arr
 * arr.splice(index, howmany, ) 
 * 
 */

/**
 * if else
 * for  break退出循环 continue继续下一次循环，这次循环下面的代码不执行了
 * while 和 do while  一般都使用for，比较方便，可以看出初始值，结束条件和渐进项目
 * 
 * function代码块
 * 
 * 
 * 
 */
/**
 * var let cons区别
 * var声明一个变量，可选初始化一个值 
 *      变量提升：变量在声明之后会被提升或者移到了函数或者语句的最前面，但是提升之后的变量将返回undefined值
 * let声明一个块作用域的局部变量，可选初始化一个值
 * const声明一个块作用域的只读常量
 * let const同样会被声明提前，但是在变量声明之前引用这个变量会抛出referenceerror，因为这个时候这个变量还处于暂时性死区
 * 
 * 函数
 *  函数声明会被提升到顶部，函数表达式不会
 * 
 * 全局变量
 *  全局对象的属性，在网页中是window的属性
 * 
 * 常量
 *  const创建一个只读的常量，字母下划线或者$开头，之后可以包含字母数字或者下划线
 *  不可以重新赋值，不可以在代码运行时重新声明
 *  但是定义一个只读常量如果是对象，重新对对象的属性修改是不会报错的
 * 
 * 
 * 
 */
function foo() {} // 函数声明  会被提升
var baz = function() {} // 函数表达式  不会提升到顶部

/**数据类型转换
 * -：一般左右转换成数字类型在减，如果有一方不能转换成数字，结果是NaN
 * +：一边是字符串会都转换成字符串
 * parseInt(string, radix) 如果第一个参数不是字符串，会tostring转成字符串  radix表示进制数
 * parseFloat(string)  给定值被解析成浮点数，如果不能转换成数值，会返回NaN
 */
console.log(parseInt('1010', 2));
console.log(parseInt('1010', 10));
console.log(parseInt('1010', 16));
console.log(parseFloat('0.12a'));
console.log(parseFloat('a0.12a'));

/**字面量：语法表达式定义的常量 
 * 数组字面量：封闭在[]中一个或者多个的表达式的列表
 * 布尔字面量：true false
 * 整数字面量： 
 *      10进制：一串数字序列组成，不是0开头
 *      8进制：以0(或者0O,0o开头)开头，只能包含数字0-7
 *      16进制：以0X(或者0x)开头 包含0-9，a-f（A-F）
 *      2进制：以0B（或者0b）开头，包含0和1
 * 浮点数字面量：十进制整数，点，十进制小数部分，指数部分
 * 对象字面量：
 *      封闭在花括号（{}）对中的一个或者多个属性名-值的元素列表
 *      增强的对象字面量：es2015（es6）中新增了：创建时设置原型，foo：foo支持简写，方法定义，父方法super调用，表达式动态计算属性名字
 * RegExp字面值
 *      /abc/
 * 字符串字面量
 *      '1ds'  "dbd"
 *      es2015中新增了模板字面量：
 */
let str1 = 'gxc';
let string1 = `this is ok, my name is ${str1}`;
let string2 = `this is
ok`;

/**
 * 判断语句：
 *  false undefined null 0 NaN ''都会被判断为false
 * 异常处理
 *  throw：抛出一个异常
 *  try。。。catch。。。finally
 */
try{
    let a = new Error('something wrong');
    throw a;
}catch(e) {
    console.log('catch error');
    console.log(e);
}finally{
    console.log('finally');
}

/**
 * es6(es2015)开始支持promise对象，允许对延时和异步操作流进行控制
 * promise的状态
 *  pending请求中
 *  fulfilled请求完成
 *  rejected请求被拒绝
 *  settled：完成或者拒绝状态中一种
 * 
 * 
 */
let url = 'http://www.baidu.com';
let p1 = new Promise((resolved, rejected) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.requestType = 'blob';
    xhr.onload = () => {
        if(xhr.status == 200) {
            resolved(xhr.response);
        } else {
            rejected('img did not load successfully, error code:' + xhr.statusText);
        }
    }
    xhr.onerror = () => {
        rejected('error: network error');
    }
    xhr.send();
});

/**
 * loops and iteration循环和迭代
 * for([initialState]; [condition]; [incrementExpression]) {
 *      statement
 * }
 * do
 *  statement
 * while(condition)
 * 
 * while(condition) {
 *  statement
 * }
 * 
 * label:标记循环  在break和continue的时候选择跳出哪个循环
 * 
 * break：终止循环，switch或者链接到label语句
 * 
 * continue：继续执行while，do while，for，或者label语句，终止本次循环，进入下一循环
 * 
 * for(let variable in obj):循环一个指定的变量来循环一个对象所有的可枚举的属性
 *      可以把obj的所有可枚举属性都循环出来，包括从原型链上继承的属性
 * for(let value of obj):在可迭代对象上创建了一个循环，对值的每一个迭代属性调用一次循环
 *      一般都是用于array map set arguments等
 * 
 */

/**函数：函数声明或者函数语句 由一系列的function关键字组成，函数名 函数参数 函数javascript语句
 * 原始参数作为值传递给函数，函数内部改变了该值，是不会传递到函数外部作用域的
 * 如果你传递一个对象作为参数，函数内部修改了该参数的属性，外部对象也会相应的做出改变
 * 
 * 当一个函数是一个对象的属性时候，称之为方法
 * 
 * 函数声明会提升函数，函数表达式不会
 * 函数作用域和函数堆栈
 *  递归
 *      函数指向并且调用自身
 *          函数名
 *          arguments.callee es5禁止在严格模式下使用此属性
 *          作用域下一个指向该函数的变量名
 * 
 * 嵌套函数和闭包
 *  闭包：一个可以拥有自己独立的独立的环境和变量的表达式，通常是函数
 *      允许函数嵌套，内部函数可以访问外部函数的所有变量和函数，以及外部函数所能访问到的所有变量和函数
 *      但是外部函数却不能访问内部函数中的变量和函数
 * 
 * 
 *      
 */
function fibonacci(n) {
    if(n == 1 || n ==0) {
        return 1;
    }
    return fibonacci(n-1) + fibonacci(n - 2);
}
function defineName(name) {
    return {
        getName() {
            return name;
        },
        setName(newName) {
            name = newName;
        }
    };
}
/**
 * 使用arguments对象
 * 函数实际参数保存在arguments对象中，类似于数组
 * 
 * 函数参数
 *  es6开始有两个新的参数类型：默认参数和剩余参数
 *  默认参数：undefined
 *  剩余参数：允许将不确定数量的参数表示成数组 ...
 * 
 * 箭头函数 es6新增
 *  更简洁和this
 *  箭头函数没有自己的this值
 *  箭头函数也没有自己的arguments对象
 *  但是在es6中可以使用rest参数或者默认值
 *  
 */
function ext(a, b = 1) {} // 默认参数b是1
function ext1(arg1, ...arg2) { // 2, 2, 3, 4   =>返回  [4, 6, 8]
    return arg2.map((x) => { return x*arg1})
}

/**
 * 解构赋值: es2015(es6新增)
 * 
 */
let arr1 = [{name: 1}, 2, [1, 2]];
let [a1, b1, c1] = arr1;
[a1, b1] = [b1, a1]; // 互换值
let [a2, ...b2] = arr1; // b2 = [2, [1, 2]]
let [a3, , c3] = arr1; // a3 = {name: 1}, c3 = [1, 2]
function func1({number = 1, classes = {age: 0, name: 'classic'}} = {}) {}


