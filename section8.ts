/**
 * cjs:commonjs   webpack node环境皆可以 require exports
 * 动态加载，可以直接require一个变量
 * 
 * esm: es module  import/export
 * 静态导入，可在编译器进行tree shaking减少js体积
 * 
 * cjs输出的是一个值的拷贝，esm输出的是值的引用
 * cjs运行时加载，esm编译时加载
 * 
 * umd：兼容cjs和esm
 * 
 * amd：requirejs  define require
 */
/**
 * webpack
 * html-webpack-plugin:打包器生成entryPoint文件后，获得文件名和publicPath，
 *  将其注入到html
 * style构建
 *  css-loader:处理css中url和@import，并将其视为模块引入，此处通过postcss来解析
 * 处理，postcss在css处理中重要性很高
 * style-loader：将样式注入到dom中
 * cssloader原理就是postcss借用postcss-value-parser解析css位ast，并将css
 *  中url和import解析成模块
 * styleloader用来讲css注入到dom中，原理是使用domapi手动构建style标签并将
 * css内容注入到style中
 * 线上使用extract text plugin将css文件单独打包成css文件，并且publicpath
 * 可以改成线上地址
 * 
 * hmr： hot module replacement热模块替换
 * __webpack_modules__维护所有模块，hmr原理是通过chunk的方式加载最新的modules
 *  找到__webpack__modules__中对应的模块逐一替换，并删除其上下缓存
 * webpack-dev-server将打包输出bundle使用内存行文件系统控制，使用memfs模拟node
 *  的fs api
 * 当文件发生变更时，webpack会重新编译，webpack dev server将会监控到文件变更
 * 事件，找到对应module，使用chokidar监控文件变更
 * webpackdevserver将会把变更模块通知到浏览器断，使用的是websocket与浏览器交流
 * 浏览器根据websocket接收到的hash，通过hash以jsonp的方式请求更新模块的chunk
 * 浏览器加载chunk，使用新的模块对旧的模块进行热替换，并删除其缓存
 * 
 * 构建性能优化：
 *  更快的loader：swc
 *  webpack中耗时最久是负责ast转换的loader，CPU密集型任务，比如test: /\.m?js&/
 *      使用swc-loader来解析
 *  webpack5内置了关于缓存的插件，可以通过cache字段配置开启
 *      将module chunk modulechunk等信息序列化到磁盘里面，二次构建避免重复
 * 编译计算，编译速度得到很大提升
 *      {
 *          cache：{
 *              type: 'filesystem'
 *          }
 * }
 *  如对一个js文件配置了eslint typescript babel等loader，他将有可能执行
 * 五次编译
 * acorn：依赖分析，解析位acorn的ast
 * eslint-parser：lint 解析位espree的ast
 * typescript：ts解析为typescript的ast
 * babel：转化成低版本，解析位@babel/parser的ast
 * terser：持久压缩混淆，解析为acorm的ast
 * 持久化缓存，可以使webpack二次编译可以与unbundle的vite等相近的开发体验
 * 
 * 多进程：thread-loader  可对babel解析ast开启多线程处理，提升编译性能
 * test：/\.js/,
 * use: [
 *      {
 *      loader: "thread-loader",
 *      options: {
 *              worker: 8
 *          }
 *      },
 *      "babel-loader"
 * ]
 * 
 */
/**
 * 性能优化
 * 1:浏览器请求方向
 *  cdn：加速js css 图片等的请求速度
 *  http2  可以同时请求n个资源，请求头部压缩，优先级更高
 *  缓存：hash强缓存，html使用协商缓存
 *  减少http请求和负载，压缩优化
 *  更小的js，压缩tersorplugin，tree shaking es模块中只有用到的方法被打包，其他没有用到的方法被过滤
 * 去除无用的代码，包括注释和console等
 *  更小的图片：图片压缩，大小优化，100*100
 *  preload prefetch：preload对当前的资源进行优先加载
 *  不会影响onload事件 在浏览器渲染机制之前进行处理，支持多种类型，可以加载跨域资源
 *  加载和执行过程分离，预加载，需要时自行调用
 * prefetch：对于马上要进入的页面资源进行提前加载    兼容性不好
 *   dns-prefetch
 * async ：异步下载资源，下载完成之后立即执行，会阻塞html解析
 * defer：html解析完成后，domcontentloaded触发之前执行，整个页面在内存中正常渲染结束（
 * dom结构完全生成，其他脚本执行完成
 * ），在window。onload之前执行
 * defer脚本保证按照循序执行
 * async：不保证按照顺序，哪个下载完执行哪个，执行会阻塞html解析
 * 
 * 2:浏览器渲染方向
 *  防抖节流 debounce throttle  防抖连续点击只生效一次   节流一段时间只生肖一次
 *  react中useDebounce避免重新渲染
 *  虚拟列表优化
 *  懒加载图片
 *  动画可以开启硬件加速，animation  transform： translate3d等
 * 
 * 
 */
/**
 * 浏览器  js  闭包
 * 
 * 
 */