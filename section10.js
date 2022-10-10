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
 * 100:请求继续
 * 200:请求已经完成
 * 300:资源方面的问题
 * 400:客户端有问题
 * 500:服务端的问题
 * 
 * https：http的安全版本
 * 采用对称加密和非对称加密结合的方式来保护浏览器和服务端之间通信的安全
 *  对称加密算法加密数据+非对称算法加密交换密钥+数字证书验证身份 = 安全
 * https是http报文将报文信息传输给ssl套接字进行加密，加密后将加密的套接字信息传送给tcp套接字
 *  tcp套接字再将加密后的报文发送给目的主机，目的主机获取加密报文之后通过ssl套接字解密，然后噢交给
 * 对应进程
 * client1：TLS版本号+所支持加密套件列表+希望使用的TLS选项
    Server1:选择一个客户端的加密套件+自己的公钥+自己的证书+希望使用的TLS选项+（要求客户端证书）；
    Client2:(自己的证书)+使用服务器公钥和协商的加密套件加密一个对称秘钥（自己生成的一个随机值）；
    Server2:使用私钥解密出对称秘钥（随机值）后，发送加密的Finish消息，表明完成握手

    加密请求一次握手过程：
        首先，客户端发起握手请求，以明文传输请求信息，包含版本信息，加密套件候选列表，压缩算法候选列表
        随机数，扩展字段等信息
        服务端配置，采用https协议的服务器必须要有一套数字证书，可以自己制作也可以向组织申请，区别是自己申请证书
        需要客户端验证通过，才可以继续访问，而使用受信任的的公司证书则不会提示页面，证书其实就是一对公钥和私钥
        服务端返回协商的信息结果，包括选择使用的协议版本version，选择的加密套件cipher suite，选择的压缩suanfa
        ，随机数random_s以及证书
        客户端验证证书合法性，包括可信性，是否吊销，过期时间和域名等，这部分工作由客户端的ssl/tls层完成
        客户端使用公钥对兑成密钥加密，发送给服务端，这部分传输的是用证书加密后的随机值，目的是让服务端得到随机值
        ，以后客户端和服务端通信都可以通过这个随机值来进行加密解密
        服务端用私钥解密，拿到对称加密的密钥
        传输加密后的信息，这部分信息就是服务端用私钥加密后的信息
        客户端解密信息，客户端用之前生产的私钥解密服务端传送过来的信息，于是获取了解密后的内容

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
/**
 * cors:cross origin resource shanring跨来源资源共享
 * 分成两种：
 * 简单请求：
 *  请求方法：head get post
 *  head头信息不超出一下字段：
 *      accept  accept-language  content-language last-event-id 
 *      content-type：application/x-www-form-urlencoded
 *                    multipart/form-data text/plain
 * 复杂请求：包含通信内容请求还包括预先请求
 *  access-control-allow-origin：请求允许的域名
 *  access-control-allow-methods：请求允许的请求方法
 *  access-control-allow-headers：对预请求中accss-control-request-headers的回应
 *  access-control-allow-credentials（可选）：是否携带cookie
 *  access-control-max-age（可选）：一秒为单位的缓存时间，预请求允许时应该尽量缓存
 *  
 * import和require的区别
 * import
 *  简单来说是闭包的运用
 *  为了创建module的内部作用域，会调用一个包装函数
 *  包装函数的返回值也就是module对外公开的api，也就是export出去的对象
 *  import可以拿到module导出的变量的引用
 * 
 * require的区别
 *  cjs输出一个值拷贝，es6模块输出的是值的引用
 *  cjs模块是运行时加载，es6模块是编译时输出接口
 * cjs是运行时加载对应模块，一旦输出一个值，即使模块内部对其发生改变，也不会影响输出值
 * es6模块则不同，import导入是在js引擎对脚本静态分析时候确定，获取到的只是一个只读引用，
 * 等脚本增长运行时候，会根据这个引用去对应模块中取值，所以引用对应值改变时候，其倒入的值也会变化
 * 
 * es6模块调用cjs模块
 *  可以直接使用cjs模块，cjs模块将不会被webpack的模块系统编译而是会原样输出，
 *  并且cjs模块没有default属性
 * es6模块调用es6模块
 *  被调用的es6模块不会添加{_esmodule: true},只有调用者才会添加{__esmodule: true},并且可以进行tree-shaking
 * 操作，如果被调用的es6模块只是import进来，但是并没有被用到，那么被调用的es6模块将会被标记为/**unused harmony default
 * export * /,在压缩时此模块将会被删除
 * cjs模块调用es6模块
 *  es6模块编译后会添加{__esmodule:true},如果被调用的es6模块中恰好有export default属性，那么被编译后的
 * es6模块将会添加default属性
 * cjs模块调用cjs模块
 *  cjs模块将会原样输出
 * 
 * 
 */
/**
 * for(let task of macrotasks) {
 *      handleMacrotask(task);
 *      for(let micro of microtasks) {
 *          handleMicrotask(micro);
 *      }
 * }
 * 宏任务：settimeout setinterval MessageChannel  PostMessage  setImmediate
 * 微任务：Promise MutationObserver
 * 
 * 
 * 
 * 
 */
/**
 * 懒加载
 * document.documentElement.clientHeight+ document.documentElement.scrollTop > ele.offsetTop
 * getBoundingClientRect()获取元素大小位置
 * IntersectionObserver自动观察元素是否在市口内
 */
let img = import('./基础部分/flat.js');
img.then((data) => {
    console.log('flat:', data);
}).catch(err => {
    console.log('flat error:', err);
})

function MyExWebpackPlugin() {}
MyExWebpackPlugin.prototype.apply = function(compiler) {
    compiler.plugin('webpacksEventHook', function(compilation, callback) {
        console.log('example plugin');
        callback();
    });
}
/**
 * 单点登录
 * sso：多系统共存情况下，用户在一处登陆，不用在其他系统中登陆，一次登陆得到所有系统信任
 * 1:同域
 *  都是企业自己的系统，所有系统都使用同一个一级域名通过不同二级域名来区分
 * 核心原理：
        门户系统设置的cookie的domain为一级域名也是zlt.com，这样就可以共享门户的cookie给所有的使用该域名xxx.alt.com的系统
        使用Spring Session等技术让所有系统共享Session
        这样只要门户系统登录之后无论跳转应用1或者应用2，都能通过门户Cookie中的sessionId读取到Session中的登录信息实现单点登录
 * 2:跨域
        域名不一致的情况下不同共享门户cookie，
        用户第一次访问应用系统的时候，因为没有登录，会被引导到认证系统中进行登录；
        根据用户提供的登录信息，认证系统进行身份校验，如果通过，返回给用户一个认证凭据-令牌；
        用户再次访问别的应用的时候，带上令牌作为认证凭证；
        应用系统接收到请求后会把令牌送到认证服务器进行校验，如果通过，用户就可以在不用登录的情况下访问其他信任的业务服务器。
    登陆流程
        用户访问系统1的受保护资源，系统1发现用户没有登录，跳转到sso认证中心，并将自己的地址作为参数
        sso认证中心发现用户未登录，将用户引导到登录页面
        用户提交用户名、密码进行登录
        sso认证中心校验用户信息，创建用户与sso认证中心之间的会话，称之为全局会话，同时创建授权令牌
        sso 带着令牌跳转回最初的请求的地址(系统1)
        系统1拿着令牌，去sso认证中心校验令牌是否有效
        sso认证中心校验令牌，返回有效，注册系统1(也就是返回一个cookie)
        系统一使用该令牌创建与用户的会话，成为局部会话，返回受保护的资源
        用户访问系统2受保护的资源
        系统2发现用户未登录，跳转至sso认证中心，并将自己的地址作为参数
        sso认证中心发现用户已登录，跳转回系统2的地址，并且附上令牌
        系统2拿到令牌，去sso中心验证令牌是否有效，返回有效，注册系统2
        系统2使用该令牌创建与用户的局部会话，返回受保护资源
        用户登录成功之后，会与sso认证中心以及各个子系统建立会话，用户与sso认证中心建立的会话称之为全局会话，用户与各个子系统建立的会话称之为局部会话，局部会话建立之后，用户访问子系统受保护资源将不再通过sso认证中心
 * 
 */