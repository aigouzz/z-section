/**
 * 代码规范
 * eslint 规范如何指定
 * http  cors 6个参数
 *  http 1.0 1.1 s 2.0 3.0
 *  
 * 模块化
 *   
 */
/**
 * ts:typescript 
 * 优点：类型检查  语法提示  重构
 * 缺点：接口interface 泛型generics 类classes 枚举类型enums
 * 接口interface：对对象的形状shape进行描述
 * 泛型generics：定义函数接口或者类的时候，不预先指定具体类型，使用时候再指定类型
 * 类class：定义了一个事物的抽象特点，包含他的属性和方法  
 */
let str : string | number = 'name';
let num1: undefined;
let flag: boolean = true;
let str1: any = 1;
// let arr: number[] = [1, 's', function() {}];
let arr1:Array<number|string> = [1, 2, 'a'];//泛型
//对象类型定义
interface Person{
    name: string,
    age?: number,
    [propName: string]: any, //任意属性
}

let tom: Person = {
    name: 'tom',
    // age: 19,
    // height: 190,
    msg() {
        return 'done';
    }, //任意属性也是可以的
};

//函数类型 输入和输出 类型定义
function fn(x: number=1, y: string='name'): void { // void没有返回值
    let num = x + y;
}


