/**
 * 怎么优化？怎么度量？首屏事件怎么计算？
 * first contentful paint
 * let timing = performance。timing
 * timing.domContentLoadedEventEnd - timing.fetchStart
 * 白屏时间：输入url到展示第一个dom是白屏时间
 * timing.domInteractive - timing.fetchStart
 * 
 */
/**
 * 减少dom方法
 * 可以使用伪元素，阴影实现的内容尽量不使用真实dom
 * 按需加载，减少不必要渲染
 * 结构合理，语义化标签
 * 
 * 大量dom优化
 * 缓存dom对象
 *  循环之前就将主节点，和不必循环的节点先获取，然后循环里面可以直接引用
 * 文档片段
 *  document.createDocumentFragment（）方法创建文档碎片节点，是一个虚拟节点对象
 * 可以使用文档碎片一次性的插入到dom节点，避免大量dom操作
 * 用innerHTML代替高频的appendChild
 * 最优的layout方案
 *  批量读，一次性写== 先对一个不在rendertree上的节点操作，再把这个节点添加回render tree
 *  使用requestAnimationFrame（），把任何导致重绘的操作放入requestAnimationFrame（）
 * 虚拟dom
 *  利用vdom，将真实dom抽象为vnode，在dom发生变化时候先对vnode操作，通过vnode diff算法将
 * vnode和原vnode对比，最终批量取修改真实dom，尽可能皮面频繁修改真实dom
 */
/**
 * 捕获异常？
 * 代码执行的错误捕获
 *  try 。。。catch
 *      能捕获到代码执行的错误
 *      捕获不到语法错误
 *      无法处理异步中错误
 *      使用try catch包裹，影响代码可读性
 *  window.onerror
 *      无论是异步还是同步错误，onerror都能捕获到运行时错误
 *      主要用来捕获预料之外的错误，try catch是在可预见的情况下监控特定的错误，结合使用更高效
 *      onerror函数只有在返回true的时候，异常才不会向上抛出，否则即使时知道异常的发生控制台还是会显示Uncaught
 *      Error：xxxx
 *      遇到img src=‘。/404.jpg’ 报404网络错误时候，onerror无法监控到
 *     缺点：监听不到资源加载的报错onerror，事件处理函数只能声明一次，不会重复执行多个回调
 *  window。addEventListener('error')
 *      可以监听到资源加载报错，也可以注册多个事件处理函数，
 *      window.addEventListener('error',(msg, url, row, col, error) => {}, true)
 *      虽然可以捕捉到网络请求异常，却无法判断http状态时404还是500等，需要服务端排查日志才能确定
 *  window.addEventListener('unhandledrejection')
 *      捕获promise错误，当Promise被reject且没有reject处理器的时候，会触发unhandledrejection事件
 *      这可能发生在window下，也可能在worker中，对于调试回退错误处理非常有用
 *  资源加载的错误捕获
 *      img。onerror = （）=> {}
 *      performance.getEntries() 获取到成功加载的资源，对比可以间接捕获错误
 *      window.addEventListener('error', fn, true) 会捕获但是不冒泡  所以window。error不会触发
 *      捕获阶段可以触发
 * vue中有errHandler，react中有componentDidCatch进行错误捕获
 * 
 */
/**
 * 缓存客户端
 * 强缓存
 *      服务器通知浏览器一个缓存时间，在缓存时间内，下次请求，直接用缓存，不在时间内，执行比较缓存策略
 *      强缓存命中则直接读取浏览器本地资源，在network中显示from memory fromdisk
 *  cache-control和expires http1.1和http1.0
 *      cache-control优先级高
 *      max-age：最大有效时间
 *      must-validate：如果超出max-age时间，浏览器必须向服务器发送请求
 *  验证资源是否还有效
 *      no-cache：不使用强缓存，需要与服务端验证缓存是否新鲜
 *      no-store：真正意义上的不要缓存，所有内容都不走缓存，包括强制和对比
 *      public：所有内容都可以被缓存（包括客户端和代理服务器，如cdn）
 *      private：所有内容只有客户端可以缓存，代理服务器不能缓存，默认值
 *  cache-control：
 *      优势
 *      HTTP 1.1 产物，以时间间隔标识失效时间，解决了Expires服务器和客户端相对时间的问题。
        比Expires多了很多选项设置
        劣势
        存在版本问题，到期之前的修改客户端是不可知的
    协商缓存
        让客户端与服务端之间能实现缓存文件是否更新的验证，提升缓存复用率，将缓存
        信息中的etag和last-modified通过请求发送给服务器，有服务器校验，返回304状态码时，
        浏览器直接使用缓存
        协商缓存状态码由服务器决策返回200或者304
        当浏览器强缓存失效时或者请求头中设置了不走强缓存，并且在请求头中设置了If-modified-since
        或者if-nonne-match时，会将这两个属性值到服务端去验证是否命中协商缓存，如果命中了协商缓存，会返回
        304状态，加载浏览器缓存，并且响应头会设置last-modified或etag属性
        对比缓存在请求数上和没有缓存时一致的，但如果是304的话，返回的仅仅是一个状态码而已，并没有实际文件内容
        因此在响应体体积上的节省是他的优化点
        协商缓存由2组字段，不是两个，控制协商缓存的字段有last-modified/if-modified-since（http1.0）
        和etag/if-none-match（http1.1）
        last-modified/if-modified-since表示的是服务器的资源最后一次修改时间，etag/if-none-match表示的是
        服务器资源的唯一标识，只要资源变化，etag就会重新生成
        etag/if-none-match优先级比last-modified/if-modified-since高
        协商缓存-协商缓存-Last-Modified/If-Modified-since
last-modified
    服务器通过 Last-Modified 字段告知客户端，资源最后一次被修改的时间，例如 Last-Modified: Mon, 10 Nov 2018 09:10:11 GMT
    浏览器将这个值和内容一起记录在缓存数据库中。
    下一次请求相同资源时时，浏览器从自己的缓存中找出“不确定是否过期的”缓存。因此在请求头中将上次的 Last-Modified 的值写入到请求头的 If-Modified-Since 字段
    服务器会将 If-Modified-Since 的值与 Last-Modified 字段进行对比。如果相等，则表示未修改，响应 304；反之，则表示修改了，响应 200 状态码，并返回数据。
优势特点:
    不存在版本问题，每次请求都会去服务器进行校验。服务器对比最后修改时间如果相同则返回304，不同返回200以及资源内容。
劣势问题:
    只要资源修改，无论内容是否发生实质性的变化，都会将该资源返回客户端。例如周期性重写，这种情况下该资源包含的数据实际上一样的。
以时刻作为标识，无法识别一秒内进行多次修改的情况。 如果资源更新的速度是秒以下单位，那么该缓存是不能被使用的，因为它的时间单位最低是秒。
某些服务器不能精确的得到文件的最后修改时间。
    如果文件是通过服务器动态生成的，那么该方法的更新时间永远是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。
2）协商缓存-Etag/If-None-match

    为了解决上述问题，出现了一组新的字段 Etag 和 If-None-Match
    Etag 存储的是文件的特殊标识(一般都是 hash 生成的)，服务器存储着文件的 Etag 字段。之后的流程和 Last-Modified 一致，只是 Last-Modified 字段和它所表示的更新时间改变成了 Etag 字段和它所表示的文件 hash，把 If-Modified-Since 变成了 If-None-Match。服务器同样进行比较，命中返回 304, 不命中返回新资源和 200。
浏览器在发起请求时，服务器返回在Response header中返回请求资源的唯一标识。在下一次请求时，会将上一次返回的Etag值赋值给If-No-Matched并添加在Request Header中。服务器将浏览器传来的if-no-matched跟自己的本地的资源的ETag做对比，如果匹配，则返回304通知浏览器读取本地缓存，否则返回200和更新后的资源。
Etag 的优先级高于 Last-Modified。
优势特点:
    可以更加精确的判断资源是否被修改，可以识别一秒内多次修改的情况。
    不存在版本问题，每次请求都回去服务器进行校验。
劣势问题:
    计算ETag值需要性能损耗。
    分布式服务器存储的情况下，计算ETag的算法如果不一样，会导致浏览器从一台服务器上获得页面内容后到另外一台服务器上进行验证时现ETag不匹配的情况。
二、浏览器出现 from disk、from memory 的策略
    强缓存：服务器通知浏览器一个缓存时间，在缓存时间内，下次请求，直接用缓存，不在时间内，执行其他缓存策略

    浏览器发现缓存无数据，于是发送请求，向服务器获取资源
    服务器响应请求，返回资源，同时标记资源的有效期Cache-Contrl: max-age=3000
    浏览器缓存资源，等待下次重用
 */
/**
 * 详情页数据缓慢，如何提升体验
 * 1  懒加载 获取首屏数据，后边数据进行滑动加载请求
 * 2  利用骨架屏提升体验
 * 3  preload js预加载
 * 4  除了添加loading和404之外，接口部分可以添加接口缓存和接口预加载
 *      workbox对数据缓存，缓存优先
 *      orm对本地离线数据缓存，优先请求本地
 *      采用预加载，再进入到详情页阶段使用quicklink预加载详情页
 *      使用nodejs作为中间层将详情页数据缓存到redis
 * 优化详情版本
 *  1 ttfb之前优化和浏览器上渲染优化
 *      页面出现可见元素从fcp首次内容绘制或者fc首次绘制，此时用户视觉体验开始
 *      到tti可交互时间，可交互元素出现，意味着用户体验开始
 *      痛点在于缩短到达tti和dcp时间
 *  2 页面数据缓存处理
 *      第一次进入页面，可以使用骨架屏模拟fc展示，可使用背景图模拟fc展示，对于
 *      请求过慢的接口使用worker进程，对详情的接口请求丢到另外一个工作线程进行请求处理
 *      页面渲染其他已经返回元素
 *      非第一次进入页面，可以通过特定接口请求回来的对应商品id签名的cookie，读取localstorage的商品图片
 *      缓存数据，对于第一次骨架屏的展示时间可以缩短，快速的到达tti与用户交互时间，在通过worker数据，进行
 *      高清图片切换
 * 页面重排重绘处理
 *  重排操作：
 *      页面首次渲染
 *      浏览器resize
 *      元素位置尺寸发生改变
 *      可见元素增删
 *      内容发生改变
 *      字体font改变
 *      css伪类激活
 * 尽量减少这类操作
 * 
 * css代码处理
 *  注意被阻塞的css资源
 *  减少不同页面的css代码加载
 *      当前网页需要多屏展示，可以使用link标签媒体查询
 *      《link href=‘base。css’ rel=‘stylesheet’ /》
 *      《link href=‘other。css’ rel=‘stylesheet’ media=‘（min-width：750px）’
 * 
 */