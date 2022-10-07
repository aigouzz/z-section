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
 * 
 * runtime:在模块交互时候，连接模块所需的加载和解析逻辑，包括浏览器中一加载完毕模块的
 * 连接以及懒加载模块的执行逻辑
 * manifest：当编译器开始执行，解析和映射应用程序时候，他会保留所有模块的详细要点，这个数据集合
 *  保存的是模块之间的关系映射
 * 完成打包发送到浏览器，runtime的时候通过manifest来解析和加载模块
 * 
 * webpack compiler：将js编译成bundle
 * bundle server:提供文件在浏览器的访问，实际上就是一个服务器
 * hmr server：将热更新的文件输出给hmr runtime
 * hmr runtime：注入到bundle。js中，与hmr server通过websocket连接，接受文件变化，更新对应的文件
 * bundle。js：构建输出的文件
 * 原理：
 * 启动阶段：webpack compiler将对应的文件打包成bundlejs（包含注入的hmr server），
 *          发送给bundle server，浏览器就可以访问服务器的方式获取bundlejs
 * 更新阶段：webpack compiler重新编译，发送给hmr server
 *          hmr server可以知道有哪些资源，那些模块发生了变化，通知hmr runtime
 *          hmr runtime更新代码
 * 详解：webpack dev server启动本地服务，实现上使用了webpack express websocket
 *      使用express启动本地服务，当浏览器反问资源时对此做响应
 *      服务端和客户端使用websocket实现长连接
 *      webpack监听源文件变化，就是当开发者保存文件时候触发webpack重新编译
 *          每次编译生成hash值，以改动模块的json文件，已改动模块代码的js文件
 *          编译完成通过socket向客户端推送当前编译的hash戳
 *      客户端的websocket监听到有文件改动推送过来的hash戳，会和上一次对比
 *          一致就走缓存
 *          不一致就通过ajax和jsonp向服务端获取最新资源
 *      使用内存文件系统去替换有修改的内容实现局部更新
 * server端：
 *      启动webpackdev server服务器
 *      创建webpack 实例 ==》 创建server服务器==》添加webpack的done事件回调==》
 *      编译完成向客户端发送消息==》创建express应用app==》设置文件系统为内存文件系统
 *      ==》添加webpack dev middleware中间件==》中间件负责返回生成的文件==》启动webpack编译
 *      ==》创建http服务器并启动服务==》使用sockjs在浏览器端和服务端之间建立一个websocket长连接
 *      =》创建socket服务器
 * client端
 *      webpackdevserver/client端会监听到此hash消息
 *      客户端收到ok的消息后哦会判断执行reloadApp方法进行更新
 *      在reloadApp中进行判断，是否支持热更新，如果支持发射webpackhotupdate事件
 *  如果不支持直接刷新流浪起 ==》在check方法中调用module。hot。check方法==》
 *      hotModuleReplacement。runtime请求manifest==》它通过调用JsonpMainTemplate。runtime
 * 的hotDownloadManifest方法==》调用JsonpMainTemplate。runtime的hotDownloadUpdateChunk方法
 * 通过jsonp获取到最新的模块代码==》补丁js取回来之后会调用JsonpMainTemplate。runtime。js的webpackHotUpdate
 * 方法==》然后会调用JsonpMainTemplate。runtime。js的hotAddUpdateChunk方法动态更新模块代码
 * ==》然后调用hotApply方法进行热更新
 * 
 * webpack:本质上是一个事件流机制，核心模块：tapable（sync async）hooks构造出compiler（编译）
 *      +compilation（创建bundles）
 *      compiler对象代表了完整的webpack环境配置，在启动webpack时候被一次性建立，并配置好所有可操作的
 *  设置，包括options loaders plugins ，当在webpack中应用一个插件时候，插件将收到此compiler对象的
 *  引用，可以用compiler访问webpack的主环境
 *      compilation对象代表了一次资源版本构建，在运行webpack开发环境中间件时，每当检测到一个文件变化，
 *  就会创建一个新的compilation，从而生成一组新的编译资源，一个compilation对象表现来当前的模块资源，
 *  编译生成资源，变化文件，以及被跟踪依赖的变化信息，它也提供了很多关键时机回调，以供插件做自定义处理时候选择使用
 *      创建一个插件函数，在他prototype上定义一个apply方法，指定一个绑定到webpack的自身事件钩子上
 *      函数内，处理webpack内部实例的特定数据
 *      处理完成后调用webpack提供的回调
 * 
 * webpack为什么慢呢？
 * 他是所谓的模块捆绑器，内部有循环引用来分析模块之间的依赖，把文件解析成ast，通过一系列不同loader加工，
 *  最后全部打包到一个js文件
 *  webpack4之前在打包速度上没有过多优化，编译慢的过程都是花费在不同loader过程，webpack4以后，吸收借鉴了
 * 很多优秀工具的思路
 *      比如支持0配置，多线程等，速度大幅提神，依然有优化手段，合理代码拆分，公共代码提取，css资源的抽离
 *      优化webpack构建速度
 *          使用高版本webpack
 *          多线程：thread-loader
 *          缩小打包作用域：
 *              exclude/include 确定loader规则范围
 *              resolve。modules指明第三方模块的绝对路径，减少不必要的查找
 *              resolve。extensions尽可能减少后戳尝试的可能性，
 *              noparse对完全不需要解析的库进行忽略（不会解析但是仍会打包到bundle中，注意被忽略的文件里不应该包含import require define等模块语句）
 *              ignorePlugin：完全排除模块
 *              合理使用alias
 *          充分利用缓存提升二次构建
 *              babel-loader开启缓存
 *              terser-webpack-plugin：开启缓存
 *              使用cache-loader或hard-source-webpack-plugin
 *                  注意：cache-loader和thread-loader一起使用的话，先cache-loader then thread-loader最后heavy-loader
 *          dll
 *              使用dllPlugin进行分包，使用dllReferencePlugin（索引连接）对manifest。json的
 *              引用，让一些基本不会改动的代码先编译成静态资源，避免反复编译浪费时间
 *      webpack4带来的优化
 *          v8带来的优化 for of代替foreach，map和set代替object，includes代替indexof
 *          默认使用更快的md4 hash算法
 *          webpack ast可以直接从loader传递给ast，减少解析时间
 *          使用字符串代替里正则表达式
 * 具体使用
 *  1:noParse
 *      不去解析某个库内部依赖关系
 *      比如jquery这个库时独立的，则不去解析这个库内部依赖的其他东西
 *      在独立库的时候可以使用
 *      module.exports = {
 *          module: {
 *              noParse: /jquery/,
 *              rules: []
 *          }
 * }
 *  2:ignorePlugin
 *      忽略掉某些内容，不去解析依赖库内部引用的某些内容
 *      从moment中引用。/local则忽略掉
 *      如果要用local的话，则必须在项目中手动引入 import 'moment/locale/zh-cn'
 *      module.exports = {
 *          plugins: [
 *              new Webpack.IgnorePlugin(/\.\/local/, /moment/)
 * ]
 * }
 * 3:dllPlugin
 *      不会多次打包，优化打包时间
 *      先把依赖的不变的库打包
 *      生成manifest.json文件
 *      然后在webpack。config中引入
 *      webpack.DllPlugin,webpack.DllReferencePlugin
 * 4:thread-loader
 *  他会将您的loader放在一个worker池子里面运行，以达到多线程构建
 *  把这个loader放在其他loader之前，放在这个loader之后的loader就会在一个单独的worker池子中运行
 *  module.exports= {
 *      module: {
 *          rules: [
 *              {
 *                  test: /\.js$/,
 *                  include: path.resolve('src'),
 *                  use: [
 *                      'thread-loader',
 *                      //你的高开销的loader放置在此 eg babel-loaders
 *                  ]
 *              }
 *          ]
 *      }
 * }
 * 每个worker都是一个单独的有600ms限制的nodejs进程，同时夸进程的数据交换也会被限制，
 *  请在搞开销loader中使用，否则效果不佳
 * 5:压缩加速-开启多线程压缩
 * tersor-webpack-plugin({
 *  parallel: true
 * })
 * 
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