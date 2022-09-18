//基于类的语言：java c++
//基于原型的语言：javascript  他只有对象  原型对象可以作为模板 新对象可以从中获得原始的属性 任何对象都可以增加自身的属性，既可以是创建时也可以是运行时候；任何对象都可以作为另外一个对象的原型，从而允许
//后者共享前者的属性

// new 的过程
//当 JavaScript 执行 new 操作符时，它会先创建一个普通对象，并将这个普通对象中的 [[prototype]] 指向 WorkerBee.prototype ，
//然后再把这个普通对象设置为执行 WorkerBee 构造函数时 this  的值。该普通对象的 [[Prototype]] 决定其用于检索属性的原型链。
//当构造函数执行完成后，所有的属性都被设置完毕，JavaScript 返回之前创建的对象，通过赋值语句将它的引用赋值给变量 mark

/* 继承的过程
这个过程不会显式的将 mark所继承的原型链中的属性作为本地属性存放在 mark 对象中。当访问属性时，JavaScript 将首先检查
对象自身中是否存在该属性，如果有，则返回该属性的值。如果不存在，JavaScript会检查原型链（使用内置的 [[Prototype]] ）。
如果原型链中的某个对象包含该属性，则返回这个属性的值。如果遍历整条原型链都没有找到该属性，JavaScript 则认为对象中不存在该属性，返回一个 undefined
*/

function Father() {
    this.name = 'name';
}
let father1 = new Father;
father1.__proto__ == Father.prototype;//指向原型  father是构造函数  father1是实例对象
Father.prototype.constructor == Father;//原型构造函数是Father

/*
js类型
string字符串
boolean布尔值
number数字型
Symbol es2015新增
Object对象
    Function函数
    Array数组
    Date时间
    Regexp正则
    Math对象
null空
undefined未定义
*/
/*
parseInt(number, 位数) 支持二进制 8进制 10进制 16进制等
parseFloat(number)只支持10进制

isFinite(); 是否有穷，finite -finite NaN都返回false
*/
/* 
class需要提前声明，不然报错
static定义类下面的一些方法和属性，实例调用返回undefined，类调用是ok的
class体内部代码总是严格模式下运行的
super关键字用于调用对象的父对象上的函数
子类有constructor函数时要调用super来继承父类的属性和方法，子类有extends时可以不加constructor


*/

class A {
    constructor (name, age) {
        this.name = name || '';
        this.age = age || '';
    }
    get theAge() {
        return this.getAge();
    }
    getAge() {
        return this.age + 1;
    }
}
class B extends A {
    // constructor() {
    //     // super(name, age);
    // }
    getAge() {
        // super.getAge();
        // console.log(super.getAge());
        console.log(`${this.name} is his name`);
        return this.age + 2;
    }
}
let a1 = new A('a1', 12);
let b1 = new B('b1', 14);
// console.log(a1.theAge);
console.log(b1.getAge());
let c1 = {
    say() {
        console.log(`${this.name} is saying`);
    }
};
class C {
    constructor(name) {
        this.name = name || 'original name';
    }
}
Object.setPrototypeOf(C.prototype, c1);
let c2 = new C('c2');
c2.say();
console.log(C.prototype.__proto__ === c1);

let obj = Object.create(C, {name: {
    value: 'gg',
    configurable: true,
}});// create一个新的对象，原型指向C，可枚举属性增加一个name：1
for(let i in obj) {
    console.log(i, obj[i])
}
obj.name = 'gxc';
delete obj.name;
console.log(obj['name']);

/**
 * 防抖节流
 * 防抖：防止重复点击
 * 节流：一段时间内只能执行一次代码
 */

const debounce = (function() {
    let timer = null;
    return function(fn, wait = 800) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn().apply(this);
        }, wait); 
    }
})();

const throttle = (function() {
    let last = 0;
    return function(fn, wait) {
        let now = new Date().getTime();
        if(now - last > wait) {
            fn().apply(this);
            last = now;
        }
    };
})();

setInterval(() => {
    debounce(() => {
        console.log('debounce work')
    });
    throttle(() => {
        console.log('throttle work')
    });
}, 300);


/**
 * url输入之后发生了什么
 */
/**
 * 浏览器拼接协议，域名和端口，生成url，然后发送到dns域名系统匹配相对应的ip地址，
 * 然后三次握手建立链接，之后服务端收到浏览器发送的数据然后回复相对应的数据，
 * 之后通过四次挥手断开链接
 * 
 * 先查看浏览器缓存-系统缓存-路由缓存中是否有该地址页面，有则显示页面内容，没有进行下一步
 * dns域名解析：向dns服务器发送请求，解析改地址的ip地址（dns服务器基于udp，用到udp协议）
 * 建立tcp链接：解析出ip，根据ip和80端口，和服务器建立链接
 * 发起http请求：发起读取文件的http请求，请求报文作为tcp三次握手第三次数据发给服务
 * 服务器响应请求并返回结果：把对应html发送给客户端
 * 关闭tcp链接：四次挥手释放tcp链接
 * 浏览器渲染
 */
/**
 * 浏览器如何渲染一个页面？
 * 解析html
 *  构建dom树
 *  构建css规则树 css rule tree
 *  构建render树，将dom和css结合
 *  布局：layout，计算出每个节点在屏幕中位置
 *  绘制painting：遍历render树，使用ui后端层绘制每个节点
 * 
 */
/**
 * 重排（reflow）和重绘（repaint）的区别
 * reflow： dom变化影响了元素几何信息，重新计算元素的几何属性，将其安放在界面中正确位置
 *  表现为重新生成布局，重新排列元素
 * repaint：一个元素外观发生变化，没有改变布局，重新把元素外观绘制出的过程
 *  表现为某些元素外观被改变
 * 重拍性能影响更大  重绘不一定重拍，重排一定重绘
 * 
 */
/**
 * 如何避免重绘或者重排
 * 1：集中改变样式，不要一条一条改dom样式
 * 2：不要把dom节点属性值放在循环里作为循环变量
 * 3：为动画的html元素使用fixed absolute定位，修改他们css不会reflow
 * 4：不使用table布局
 * 5：尽量只修改absolute fixed，对其他元素影响不打
 * 6：动画使用gpu加速，translate使用3d变化
 * 7：提升为合成层
 *  合成层的位图，交给gpu合成，比cpu块
 *  需要repaint时，只需要repaint本身，不影响其他层
 *  对于transform和opacity，不会触发layout和paint
 *  提升合成层最好方式使用css的will-change属性
 */
/**
 * js引擎执行过程
 * 创建window对象：
 *  全局执行环境，所有的全局变量和函数都属于window的属性和方法，dom tree也会
 * 映射在window的document对象上
 * 加载文件
 *  完成js引擎分析他的词法和语法是否合法，合法则进入预编译
 * 预编译
 *  在预编译中，浏览器寻找全局变量声明，作为window属性加入到window对象中
 * 并给变量赋值undefined，寻找全局函数声明，作为window方法加入到window对象
 * ，并将函数体赋值给他（匿名函数不参与预编译，因为是变量），变量提升在es6已解决，
 * 函数提升还存在
 * 解释执行
 *  执行到变量就赋值，若变量没有被定义，也就没有被预编译直接赋值，在es5中非严格模式下
 * 该变量会成为window一个属性，基本类型直接放在栈中，引用类型把指针指向变量存储空间
 * 函数执行，就是将函数环境推入一个环境的栈中，执行完成后在弹出，控制权交给之前的环境
 * 
 */
/**
 * 性能优化
 * 1：加载
 *  a：减少http请求（精灵图，文件合并）
 *  b：减少文件大小，资源压缩，图压缩，代码压缩
 *  c：cdn（第三方库，大文件，大图等）
 *  d：ssr服务端渲染 预渲染
 *  e：懒加载
 *  f：分包
 * 2：性能
 *  a:减少dom操作
 *  b：避免回流
 *  c：文档碎片
 */
/**
 * 1:页面加载性能  加载时间，用户体验
 * 2：动画和操作性能   是否流畅
 * 3：内存占用   占用过大，浏览器崩掉
 * 4：电量消耗   游戏方面
 */
/**
 * 代码执行效率
 * while和for    
 */
/**
 * http1.1:
 * 缺陷：
 *  高延迟，队头阻塞：
 *      资源分散到不同域名，提升链接上线：chrome对于同一域名，允许同时建立6个tcp持久链接，但在同一个管道中
 * 同时只能处理一个请求，其他请求处于阻塞状态，超过6个进入排队等待
 *      合并小文件，减少资源
 *      内联资源：base64
 *      减少请求：合并文件
 *  无状态：对于链接状态没有记忆
 *      header携带东西很多，body携带东西少
 *  明文传输：不安全
 *  不支持服务端推送消息
 * http2：基于spdy协议，在http和ssl协议中间
 *  传输数据量大幅减少：
 *      以二进制方式传输
 *      将请求和相应数据分割成更小的帧，并用二进制编码，header和body消息打散成小片
 *      二进制帧，headers帧存放头数据，body帧存放实体数据，协议看到的是一个个frame碎片
 *      同域名下所有通信在单个链接上完成，可以承载任意数量双向数据流，根据帧首部的流标识
 *      进行重新组装
 *      header压缩
 *      客户端和服务端使用首部表来耕种和存储之前发送的键值对，对于相同的键值对，不在
 *      通过每次请求和响应发送
 *      首部表在链接存续期内始终存在，有客户端和服务端共同渐进更新
 *      每个新的首部键值对要么追加到表末尾，幺妹替换表中之前的值
 *      多路复用
 *      同一个域名只需要占用一个tcp链接，并行发送多个请求和响应，整个页面
 *      资源下载过程只需要一个慢启动，避免多个tcp链接竞争带宽
 *      并行交错发送请求响应，之间互不影响
 *      根据请求优先值来以最优的方式发送流4和消息
 *      server push
 *      服务端不只是被动响应，还可以主动发送消息，
 *      提高安全性
 *      缺点
 *      tcp和tcp+tls建立链接的延时
 *      tcp的队头阻塞没有彻底解决
 *      多路复用导致服务器压力
 *      多路复用容易timeout
 * 
 * http3
 *  基于udp的quic协议
 *  udp无连接，无需握手和回收
 *  实现了类似tcp的流量控制，传输可靠性的功能
 *  实现了快速握手功能 0rtt建联
 *  集成来tls加密功能：tls1.3
 *  多路复用：彻底解决tcp链接中队头阻塞问题
 *      实现了同一物理链接中可以有多个独立的逻辑数据流，实现了数据流单独传输
 *  链接迁移
 *      quic是按照客户端生成的connectionid来区分不同链接，只要cid不变，链接就
 *      不需要重新建立
 *  xss：corss site scripting跨站脚本攻击，被攻击者登陆网站会执行恶意代码，读取cookie
 * session tokens等，对用户钓鱼欺诈
 *      url参数使用encodeURIComponent转义
 *      尽量不使用innerHTML插入html内容
 *      使用特殊符号，标签转义符
 * csrf：cross-site request forgery跨站请求伪造，诱导进入第三方网站，向被攻击网站发送
 * 跨站请求，利用受害者在被攻击网站已经获得的注册凭证，绕过后台数据验证，达到冒充用户对被攻击
 * 网站执行某操作的目的
 *  添加验证码
 *  使用token：服务端生产一个token，加密传给用户，用户提交请求时带上这个token，服务端可以
 * 验证是否该用户
 */
/**
 * 介绍一下304
 * 1：浏览器请求资源时候首先命中资源的expires和cache-control
 * expires受限于本地时间，修改了之后可能会造成缓存失效，cache-control：max-age=1000
 * 指定最大生命周期，仍然返回200，但是可以看到fromcache
 * cache-control：private默认，只有客户端可缓存
 *  no-cache 客户端缓存，但是需要经过协商缓存验证
 *  no-store：都不会被缓存，包括协商缓存
 *  public：客户端和代理服务器都可缓存
 * from memory：内存，包括js 图片等
 * from disk：硬盘  css等
 * 
 * eta比last-modified级别高，cache-control比eapires高
 * 
 * 
 */
/**
 * 进程， 线程，协程
 * 一个进程至少有一个线程，资源分配给进程，同一进程上的所有线程共享该进程的所有资源
 * 处理机分给线程，真正在处理机上运行的是线程
 * 线程在执行过程中，需要协作同步，不同进程的线程之间要利用消息通信的方法实现同步
 * 
 */
/**
 * bfc:block formatting context 块级格式化上下文
 * 布局规划：
 *  内部box垂直方向，一个个放置
 *  垂直方向距离由margin决定，相邻box的margin会相互重叠
 *  bfc区域不会和float box重叠
 *  子元素不会影响到外面的元素
 *  浮动元素也参与计算高度
 *  元素类型和display属性，决定了这个box类型
 * html是bfc
 * float不为none
 * absolute或者fixed
 * display inline-block table-cell table-caption
 * overflow不为visible
 * 使用场景：去除边距重叠，清楚浮动，避免某元素被浮动元素覆盖
 * 避免多列布局由于宽度四舍五入而自动换行
 * 
 * display：flex
 * flex-direction 
 * justify-content水平主轴对齐方式
 */
/**
 * cors:
 * access-control-allow-origin
 * access-control-allow-methods: post get put head 等
 * access-control-allow-headers
 * access-control-allow-max-age  预检请求多久之内不可不发送
 * access-control-allow-credentials  是否可以读取设置cookie
 */
/**
 * new Vue() 新建vue实例
 * 初始化事件和生命周期
 * beforecreate
 * 初始化注入and校验
 * created
 * 是否指定el选项 ==》否   当调用vm.$mount(el)时候  |
 * 是 =》是否指定template选项    
 * 是 =》将template编译到render函数中     否=》将el外部的html作为template编译
 * beforeMount
 * 创建vm.$el并用其替换el
 * mounted
 * 挂载完毕  =》当data修改时候 =》beforeupdate =》xunidom重新渲染并更新应用=》 updated
 * 当调用vm.$destroy()函数
 * beforeDestroy
 * 解除绑定 销毁子组件以及事件监听器
 * 销毁完毕  destroyed
 * 
 */
/**
 * http响应码
 * 信息型响应  10*
 * 成功响应 20*
 * 重定向  30*
 * 客户端错误  40*
 * 服务端错误   50*
 * 
 */