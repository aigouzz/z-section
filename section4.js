/**
 * 正则表达式
 */
/**
 * \w: [a-zA-Z0-9_]
 * \s:匹配所有空格符，包括换行符，空格符，制表符等 [\f\r\t\v\n]  \S相反
 * \n:换行符
 * \r:回车符
 * \f:匹配换页符
 * \t:制表符
 * \v:垂直制表符
 * 
 * $:结尾
 * ():子表达式
 * *：匹配前面表达式零次或多次
 * +：一次或者多次
 * .:匹配除了换行符\n之外的任何字符
 * []:中括号表达式
 * ?:零次或者一次  或指明一个非贪婪限定符
 * ^:匹配输入字符串的开始位置 在中括号中代表非
 * {}：限定符表达式
 * |：或者
 * 
 * *和+限定符都是贪婪的，他们会尽可能多的匹配到符合的字符串，如果要使用非贪婪的匹配，可以加上?，实现非贪婪或者最小匹配
 * 
 * 
 */
let reg1 = /^(\w+):\/\/([^\/]+)\/(.*)$/g;
let str1 = 'https://www.baidu.com/ch-zn/index';
let result1 = reg1.exec(str1); // ['https://www.baidu.com/ch-zn/index', 'https', 'www.baidu.com', 'ch-zn/index'];
let result2 = str1.match(reg1);
console.log(result1);
console.log(result2);
/**
 * 标志符号：
 * i：不区分大小写
 * g：全局匹配
 * m：多行匹配  使^ $匹配每一行的开头和结尾，记住是多行，而不是每个字符串的开头和结尾
 * s：特殊字符圆点.包含匹配换行符\n，正常情况下是不包含的
 * 
 */
/**
 * \b:单词边界， /er\b/可以匹配thunder storm中的er ，不能匹配verb中的er
 * \B:非单词边界  /er\B/可以匹配verb中er，不能匹配thunder storm中er
 * \d:匹配数字  [0-9]
 * \D:匹配非数字  [^0-9]
 */
/**
 * 邮箱匹配
 * reg.test(str)
 */
let reg2 = /[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,6}/g;
let mail1 = 'no-163@qq.com';
let mail2 = 'ano.mail-112@163.com';
let result3 = mail1.match(reg2);
let result4 = mail2.match(reg2);
console.log(result3);
console.log(result4);
console.log(reg2.test(mail1), reg2.test(mail2));

/**
 * 运算符优先级：从上到下 从高到低
 * \
 * () (?:) (?=) []
 * * + ? {n} {n, m}
 * ^ $ \任何元字符 任何字符
 * |
 */
/**
 * 匹配规则
 * 基本模式匹配
 *  
 */
