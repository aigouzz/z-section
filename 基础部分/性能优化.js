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