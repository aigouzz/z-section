/**
 * 运算符
 * 位运算符:将操作数视为32位的二进制串，而非10进制8进制或者16进制，
 * &:按位与，每一位都是1才返回1，否则返回0
 * |：按位或，每一个对应的位，只要有一个是1就返回1，都是0才返回0
 * ^:按位异或，每一个对应的位，不同才返回1，否则返回0
 * ~:按位非， ~a，反转被操作数的位
 * a>>b:a按位右移b个位，丢弃被移出的所有位，且左边都填入0
 * a<<b:a按位左移b个位，右边移入0
 */
/** !取反运算符
 * 能够转换成false的值有null，0，undefined，''以及NaN
 * 
 */
/**
 * 一元操作符
 * delete：删除某个对象的属性，数组的某个键值 成功返回true，失败返回false
 *  delete含蓄声明的变量
 *  delete不能delete已经var的声明变量
 * 不能delete预声明的属性
 * 删除数组中元素，数组长度不变，值为undefined
 * 
 * typeof可以返回 string number object function boolean
 * 
 * void：  void espression
 * 标明一个运算没有返回值 javascript:void(0)
 * 
 * in:指定属性存在于某一个对象中，返回true，否则返回false
 * 'length' in array ====>  true,数组中有length这个属性
 * 
 * instanceof：所判别的对象确实是所指定的类型，返回true，否则返回false
 * theDay instanceof Date  ===》true，的确是Date类型
 */
let a1 = {name: 1};
let a2 = [1, 2, 3];
delete a1.name;
delete a2[1];
console.log(a1);
console.log(a2);

/**
 * 运算符优先级:从高到低
 * member： . []
 * call/create instance: () new
 * ! ~ - + ++ -- typeof void delete
 * * / %
 * + -
 * << >> >>>
 * < <= > >= in instanceof
 * == != === !==
 * &
 * ^
 * |
 * &&
 * ||
 * ?:三元运算符
 * = += -= *= /= %= <<= >>= >>>= &= ^= |=
 * ,
 */

/**
 * 表达式：一组代码的集合，它返回一个值
 * this用于指代当前的对象，通常指代方法中被调用的对象
 * 
 */