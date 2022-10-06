/*
Object相关方法
比如create assign defineProperty 
*/
class A {
    constructor() {
        this.name = 'A';
        this.age = '1';
    }
    getName() {
        return this.name;
    }
}
let a1 = new A();
let a2 = Object.create(A, {age:{
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true,
}}); // create可以传入两个参数 第一个可以是实例对象也可以是原型，也可以是构造函数，第二个参数必须要是定义value和configurable属性的对象

class B extends A{
    // constructor() {
    //     super();
    //     console.log(super.getName());
    // }  //派生类默认构造函数是constructor(...args) {super(...args);}
    getName() {
        console.log(this.age);
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
}
let b1 = new B();
b1.setName('b1');
console.log(b1.getName());

//create继承
class C{
    constructor() {
        this.name = 'c';
        this.age = 3;
    }
}
class D extends C{
    constructor() {
        super();
    }
}
let d1 = new D;
console.log(d1.name, d1.age);

function E() {
    this.name = 'e';
    this.age = 5;
}
function F() {
    E.call(this);
}
F.prototype = Object.create(E.prototype);
F.prototype.constructor = F;
let f1 = new F();
console.log(f1.__proto__, f1.__proto__.__proto__);

/*
Object.assign(target, source); 返回修改所有可枚举属性之后的target，同时target也已经被改变  
将源对象上的可枚举属性赋值到目标对象上，返回目标对象  string和Symbol类型都会被拷贝
这个拷贝并不是深拷贝，加入属性值是个对象，他会仅仅复制对象的引用值
深拷贝可以使用JSON.parse(JSON.stringify(obj))

继承属性和不可枚举属性不可拷贝
原始类型会被包装，null和undefined会被忽略
异常会打断后续拷贝任务，之前的拷贝是成功地

*/
let a3 = {name: 'a3', age: 3};
let a4 = {name: 'a4', age: 4, height: 176};
let a5 = {[Symbol('a')]: 'a'};
let target1 = Object.assign({}, a3, a4, a5);
console.log(a3, target1);
console.log(a3 === target1);

/**
 * Object.is(value1, value2)  判断两边是否相等，不会强制转换类型，满足下列条件返回true
 *  都是undefined或者null
 *  都是true或者false
 *  都是相同长度字符串且字符顺序一致
 *  都是相同对象，同一对象同一个引用
 *  都是数字且都是 +0 -0 都是NaN 或都是非0且非NaN且是同一个数值
 * ==会强制转换两边的类型
 * 与===不同，===会将+0和-0返回true，而将Number.NaN和NaN视为不等
 */
Object.is(-0, +0); // false
Object.is(-0, 0); // false
Object.is(0, +0); // true
Object.is(0/0, NaN); // true
//NaN === NaN; // false
//+0 === -0; // true