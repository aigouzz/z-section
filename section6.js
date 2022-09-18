/**
 * 数字和日期
 * 数字：双精度浮点数类型
 * 即一个介于±2−1023和±2+1024之间的数字，数字精度为53位
 * +Infinity -Infinity NaN
 * BigInt：用于表示一个大于2**53 - 1的整数  可以表示任意大的数
 * 
 * 数字后面加上n，或者直接用BigInt(90010110101010101)表示
 * typeof返回 bigint
 * 使用BigInt时候，带小数的运算会被取整
 * 
 */
// let bigint1 = BigInt(9007199254740991);
// let bigint2 = 9007199254740991n;
// console.log(bigint1 + 20n);
// console.log(typeof bigint1);

/**
 * 可以使用四种进位制，十进制，2进制，8进制，16进制
 * 0777会被当做8进制处理，0899当做十进制处理
 * 
 * 二进制：以0b或者0B开头，后面接一连串的1，0，如果不是会报syntaxerror
 * 8进制：以0开头
 * 16进制：开头添加0x或者0X，后面是0123456789ABCDEF，超出这个范围，报syntax error
 * 指数形式：1e3, ===》 1000   2e4  20000
 * 
 */
/**
 * Number.prototype.toFixed(digits) :参数是保留几位小数，默认0，返回四舍五入后形成的字符串
 * Math.abs() 绝对值
 * Math.floor()  ceil()  向下取整，向上取整
 * round() 四舍五入
 * min(...arr) 取最小 max(...arr) 取最大
 * 
 * Date对象
 * new Date()现在的时间
 * new Date(1999, 11, 25, 13, 30, 0) 1999.11.25 13:30:00
 */
let nowtime = new Date();
let year = nowtime.getFullYear();
let month = nowtime.getMonth() + 1;
let date = nowtime.getDate();
let hour = nowtime.getHours();
let minute = nowtime.getMinutes();
let seconds = nowtime.getSeconds();
let week = nowtime.getDay();
let weeks = ['天', '一', '二', '三', '四', '五', '六'];
let day  = weeks[week];
console.log('今天是' + year + '年' + month + '月' + date + '日 ' + hour + ':' + minute +':' + seconds + ' 星期' + day);


/**
 * text formating:字符串和文本
 * str.substring(start[, end]) 截取从start到end的字符串，包括start，不包括end，end可以省略，一直到最后
 *      substring如果任一参数小于0或者是NaN，则转成0，如果大于str.length,则被当成是str.length
 *      start > end那么效果等同于两个参数对调
 * str.slice(start[, end]) 截取start到end的字符串，返回该字符串，不会改变原字符串
 *      start和end的值为负数的话则加上str.length之后再计算
 */

/**
 * 强缓存：
 * expires: new Date('2022-07-30 23:59:59')过于依赖本地时间，已废弃
 * Cache-Control: http1.1中添加，res.writeHead(200, {cache-control: max-age=10})
 * 请求资源第一次返回开始10秒内在此请求该资源，从缓存中直接读取
 * max-age：缓存多久，s-maxge：代理服务器缓存的时长，no-cache：强制协商缓存
 * no-store：禁止任何缓存策略，public：资源可以被浏览器缓存，也可以被代理服务器缓存
 * private：只能被浏览器缓存  Cache-control: max-age=10,s-maxage=100,public
 * 
 * 协商缓存
 * last-modified：服务器端读出文件修改时间，将此时间赋值给响应头的last-modified字段，
 * Cache-Control设置位no-cache，
 * 客户端读取到last-modified会在下次请求标头上携带字段：If-Modified-Since，之后每次请求
 * 都会带上If-Modified-Since字段，服务端拿到之后会和资源修改时间进行对比，决定读取缓存
 * 还是返回新的资源（文件内容没有修改，修改时间很小  两个bug）
 * 
 * 基于ETag的协商缓存：
 * ETag：根据文件内容计算出的唯一hash值，代表着文件指纹，放在ETag字段中
 * 客户端第二次请求资源，将ETag放在If-None-Match字段中，服务端将其和生成的文件指纹对比，
 * 相等则返回304和空的响应体
 * （更多计算开销，文件尺寸大，计算多，不合适）
 * 
 * 有hash的css js可以直接强缓存，没有hash的比如index。html可以使用协商缓存
 * 
 */
function throttle(fn, wait=800) {
    let timer;
    return function() {
        if(!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.apply(this);
            }, wait);
        }
    }
}
function throttle1(fn, wait=800) {
    let last = 0;
    return function() {
        let now = new Date().getTime();
        if(now - last > wait) {
            fn.call(this);
            last = now;
        }
    }
}

function myNew(fn, ...args) {
    let obj = {};
    obj.__proto__ = fn.prototype;
    let res = fn.apply(obj, args);
    return typeof res === 'object' ? res : obj;
}

function create(obj) {
    function F(){}
    F.prototype = obj;
    return new F();
}

function myInstanceof(left, right) {
    let leftp = Object.getPrototypeOf(left);
    let rightp = right.prototype;
    while(true) {
        if(!leftp) return false;
        if(leftp === rightp) return true;
        leftp = Object.getPrototypeOf(leftp);
    }
}
