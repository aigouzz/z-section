/**
 * 作用域链：定义时确定，静态作用域
 * 执行上下文：一个栈，全局执行上下文先入栈，然后执行函数的时候，把函数上下文压入栈，执行完就pop，全局
 * 在最底部
 * 
 * 进入执行上下文：还没有执行代码
 * 变量对象包括： 函数所有形参，由名称和对应值组成的一个变量对象的属性被创建，没有实参，属性值设为undefined
 *   函数声明：由名称和对应值（函数对象function-object）组成一个变量对象的属性值被创建
 *      如果变量对象已经存在相同名称属性，则完全替换这个属性
 *   变量声明：由名称和对应值（undefined）组成一个变量对象的属性被创建
 *      如果变量名称和已经声明的形参或函数相同，则变量声明不会干扰这些已经存在的这类属性
 * 
 * 作用域链：函数作用域在函数定义时就决定了，[[scope]]
 * 函数创建时候保存所有父变量对象到其中，理解为父变量对象的层级链，但是并不代表完整作用域链
 *      创建函数保存的是根据词法生成的作用域链，执行时候会复制这个作用域链，作为自己作用域链的初始化
 *      然后根据环境生成变量对象，然后将这个变量对象添加到这个复制的作用域链，
 * 闭包：函数+函数能够反问的自由变量
 *  理论角度：所有函数都是闭包，可以反问全局变量，使用最外层作用域
 *  实践角度：即使创建他的上下文已经销毁，他任然存在比如内部函数从父函数中返回
 *          在代码中引用了自由变量
 * 作用域链使得父函数的上下文销毁了，js在内存中还是保存了父函数上下文呢的ao对象
 * 依然可以通过子函数作用域链找到他
 * 
 * 参数按照值来传递：基本类型是按值传递，引用类型是传递对象的引用的副本
 *  引用类型传递如果内部修改了形参的值，修改成基本类型，不会改变引用，修改成引用类型，会改变
 *      外层传入的实参
 */
/**
 * 类数组对象： {1: 'a', 2: 'b', 3: 'c', length: 3}
 * 转数组：Array.prototype.push.call(arrlike, 'def');
 * arguments document.getElementsByTagName('div') ...
 * 函数体中arguments指代函数的Arguments对象
 * 传入的参数，实参和arguments是共享的，没有传入的参数，实参和arguments不共享，改变其中之一
 * 另外一个不变
 * 在严格模式中，都不会共享
 * 
 * 创建对象多种方式和优缺点
 * 
 * 组合继承最适合
 * 
 */
{
    function Parent(name) {
        this.name = name;
    }
    Parent.prototype.getname = function() {
        return this.name;
    }
    function Child(name) {
        Parent.call(this, name);
    }
    Child.prototype = new Parent();
    Child.prototype.constructor = Child;
    // Child.protype = Object.create(Parent.prototype);
    // Child.prototype.constructor = Child;
}
/**
 * http1.0:简单的数据链接协议，一个请求对应一个回应，回应完就关闭连接,一个请求对应一个tcp连接
 * http:1.1 连接可以复用，connection kkepalive默认开启一个tcp连接可以传送多个http请求
 *  增加了管道化技术，复用同一个tcp连接时，即使通过管道发送多个请求，服务端按照顺序依次响应
 *  客户端未收到之前请求之前会阻塞后续请求，队头阻塞，同时最多支持6-8个请求
 * 支持响应分块：
 * 引入更多缓存控制机制，etag，ifnonematch，cache-control   
 *  host头：主要用来实现虚拟主机技术
 * http：2.0 二进制协议不是文本协议，
 *  客户端和服务器通过帧来通信，最小单位，请求和响应通过一个个帧组成，
 *  2.0将http1.1中消息分成帧并嵌入到流中，数据帧和报头帧分离，允许报头压缩，将多个流组合，可以多路复用
 *      ，更有效的底层tcp连接，这个是复用协议，并行请求能在同一个连接中处理，移除了http1.x
 *      中顺序和阻塞的约束，
 *      压缩了header
 *      服务端推送
 * https:也是通过http协议进行传输信息，但是使用了tlc层进行了加密
 *  tlc握手时使用非对称加密，
 * 服务端将公钥发布出去，客户端获取到公钥，客户端创建一个秘钥， 使用公钥加密，发送给服务端，服务端通过私钥解密
 *      得到这个密钥
 * 200:强缓存失效，返回新的资源
 * 200fromcache：强缓存都存在未过期，cache-control优先于expires，从本地获取成功
 * 304not modified：协商缓存没有过期时服务器返回状态304
 * 
 * 
 */
/**
 * 小程序
 * 应用生命周期：
 *  onLaunch onShow onHide onPageNotFound onThemeChange
 * 页面生命周期 
 *  onLoad onShow onHide onUnload
 * 组件生命周期
 *  created attached ready detached moved
 * 打开小程序：(App)onLaunch --> (App)onShow --> (Pages)onLoad --> (Pages)onShow --> (pages)onRead

进入下一个页面：(Pages)onHide --> (Next)onLoad --> (Next)onShow --> (Next)onReady

返回上一个页面：(curr)onUnload --> (pre)onShow

离开小程序：(App)onHide

再次进入：小程序未销毁 --> (App)onShow(执行上面的顺序），小程序被销毁，（App)onLaunch重新开始执行.
双线程：逻辑层，渲染层  nwjs  Chromewebview

提高小程序应用速度：
    加载：小程序包体积压缩，清理无用代码，图片可以直接使用cdn，分包
    渲染：onload请求数据，减少不必要的请求，可以把结果缓存本地localstorage，骨架屏，
    多次setdata合并成一次，如果页面有一些用不到的数据，不需要放在data中，

    登陆：code ==》后段 code appid appsecret ==》微信
            ssessionid openid ==》后段 自定义登陆态  =》前段存储在localstorage

 */
/**
 * webpack：静态模块打包工具
 * 静态模块开发阶段可以被webpack直接引用的资源，已经打包成bundle。js
 *  编译代码的能力，提高效率，解决浏览器兼容性
 *  模块整合能力，提高性能，可维护性，解决浏览器频繁请求的问题
 *  统一的模块化方案
 * 
 * 流程：读取合并参数，初始化配置的插件和执行环境需要的参数
 *         从entry触发，针对每个module穿行调用每个loader，再找到该module依赖的module，
 *      递归调用编译处理
 *      编译后的module组合成chunk，然后把chunk生成文件，插入到页面汇总
 * compile：开始编译
 * make：从入口开始分析模块及其依赖的模块，创建模块文件
 * buildmodule：构建模块
 * seal：封装构建结果
 * emit：把各个chunk输出到结果文件
 * loader：对sass，css，png等不认识的文件调用loader进行匹配识别解析
 * plugin：打包优化，资源管理，环境变量注入，运行在webpack不同生命周期阶段
 * loader运行在打包文件之前，plugin全生命周期
 * plugin：监听webpack抛出的事件，在合适的时机执行函数
 * 
 * hmr：
 *  webpack compiler：源代码编译成bundlejs
 *  hmr server：将热更新文件输出给hmr runtime
 *  bundle server：提供编译之后的文件访问
 *  hmr runtime：websocket服务器，注入到浏览器，更新文件的变化
 *  启动，compiler会将源代码和runtime hmr一起编译成bundlejs，发送到浏览器解析
 *  变化时候，webpack监听到变化，重新对文件打包编译，编译生成唯一hash值
 *  socketserver监听到变化时候，生成两个文件manifest。json和update chunk。js
 *  通过websocket连接，socketserver将这两个文件发送个客户端
 *  浏览器拿到两个文件，通过hmr runtime解析加载这两个文件，针对修改的模块进行更新
 * 
 */
/**
 * es6:
 *  扩展运算符：实现浅拷贝
 *      定义了iterator遍历接口的对象，都可以使用扩展运算符转成真正的数组  =array map set
 * Array.from()
 * Array.of()  无参数，返回看空数组，一个参数，返回这个参数个数的数组，多个才返回由这些参数组成数组
 * copyWithin（）
 * find()  findIndex() fill()  entries()  keys() values() includes() flat() flatMap()
 * find findindex找出第一个符合的，find返回item findindex返回index
 * fill(item, from, to) //用item填充数组，from替换，to不替换，浅拷贝
 * flat参数默认1
 * flatMap()  arr.flatMap((x) => [x, x*2])  [1,2,3] => [[1, 2,], [2, 4], [3, 6]] =>
 *  [1,2,2,4,3,6]
 * sort((a, b) => a-b)升序排列
 * 
 * css优化：
 *  内联首屏关键css
 *  异步加载css
 *  css压缩
 *  合理使用选择器
 *  不要使用昂贵的属性  box-shadow border-radius nth-childs
 *  不要使用@import  影响浏览器并行下载，加载时候有多余的负担，增加了页面渲染时间
 *  小图片使用base64编码，减少重拍重绘，
 *  css3动画尽量使用transform transition animation，少用left top
 * 
 * 
 */
// console.log([1, 2, {name:1}].find((item, index, arr) => {
//     return item == 5;
// }));  // undefined   findIndex => -1  引用地址肯定不等
async function names() {
    // return 1;
    let a = await (new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
    }))
    console.log('nexr')
}
console.log(names().then(data => {
    console.log(data);
}))

