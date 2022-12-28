let fs = require('fs');
let babylon = require('babylon');
let traverse = require('babel-traverse').default;
let {transformFromAst} = require('babel-core');
let path = require('path');
let ID = 1;

// let content = fs.readFileSync('../async.js', 'utf-8');
// let ast = babylon.parse(content, {
//     sourceType: 'module'
// });

// console.log(ast)
// console.log(content)

function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = babylon.parse(content, {
        sourceType: 'module'
    });
    const dependencies = [];
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    });
    const id = ID ++;
    const { code } = transformFromAst(ast, null, {
        presets: ['env']
    });
    const customCode = loader(filename, code);
    return {
        id,
        filename,
        dependencies,
        code
    };
}

function loader(filename, code) {
    if (/entry/.test(filename)) {
      console.log('this is loader ')
    }
    return code
  } 

function createGraph(entry) {
    const mainAsset = createAsset(entry);
    const queue = [mainAsset];
    for(const asset of queue) {
        asset.mapping = {};
        const dirname = path.dirname(asset.filename);
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.resolve(dirname, relativePath);
            const child = createAsset(absolutePath);
            asset.mapping[relativePath] = child.id;
            queue.push(child);
        });
    }
    return queue;
}

function build(graph) {
    let modules = '';
    graph.forEach(mod => {
        modules += `${mod.id}:[
            function(require, module, exports) {
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)}
        ]`;
    });
    const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;

    return result;
}

const graph = createGraph('../async.js');
const result = build(graph);
console.log(result)
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
【1】接受输入事件
【2】执行事件回调
【3】开始一帧
【4】执行 RAF (RequestAnimationFrame)
【5】页面布局，样式计算
【6】绘制渲染
【7】执行 RIC (RequestIdelCallback)

第七步的 RIC 事件不是每一帧结束都会执行，只有在一帧的 16.6ms 中做完了前面 6 件事儿且还有剩余时间，才会执行。如果一帧执行结束后还有时间执行 RIC 事件，那么下一帧需要在事件执行结束才能继续渲染，所以 RIC 执行不要超过 30ms，如果长时间不将控制权交还给浏览器，会影响下一帧的渲染，导致页面出现卡顿和事件响应不及时。

 */