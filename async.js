/**
 * 异步：js是单线程模式，一次只能干一件事
 * web worker允许你将一段代码发到另外一个线程，称为worker，以便于同时运行多个js块
 *  数据通过消息系统在主线程和工作线程之间发送，双方使用postMessage() 方法发送信息，并通过onmessage事件处理程序响应消息，消息包含在message事件的data属性中，
 *  数据被复制而不是共享
 *  
 * 异步回调：调用将在后台执行代码的函数时指定为参数的函数 后台代码完成运行时，他会调用回调函数让你知道工作已经完成
 * btn.addEventListener('click', function() {
 *  //这是一个回调函数
 * });
 * 
 * promise：新型异步代码 对象
 * Promise.prototype.then (handleresolve, handlereject) 第一个参数是处理promise对象成功之后的函数，后面是处理失败的函数，后一个可以忽略，可以在最后用catch处理也可以
 * 
 * 
 */

// const { times } = require("async");

/**
 * 事件队列：像promise这样的异步操作都放在一个事件队列中，该队列在主线程处理完成之后运行，这样他们就不会阻止后续js代码的执行
 *  排队的队列将尽快完成，然后将其结果返回给js环境
 * promise与回调：
 *  es6新增的api，专门为异步操作而设计的
 *  可以使用多个then方法将多个异步操作连接在一起，并将其中一个then操作结果作为输入传递给下个异步操作
 *  promise总是严格按照他们放在事件队列中的顺序操作
 *  错误处理都是使用catch来抓取
 * 
 * 每次调用then方法都会创建一个新的promise对象然后返回,then的参数包括fulfilled函数和reject函数，前者处理成功状态的函数，后者处理失状态的函数，参数是promise的onfulfilled()里面的参数和
 * onrejected()里面的参数
 * 
 * 同步try catch在异步代码中不起作用
 * 
 * 链式调用
 *  通过then方法可以实现，then会返回一个和原来不同的新的Promise
 *  一定加上返回值，否则callback无法获取上一个promise的结果
 *  catch能捕获到这个链上所有出错的callback，通常一遇到异常抛出，浏览器会循着promise链寻找onrejected函数或者由.catch()指定的回调函数
 *  当promise被拒绝时候，会有一下两个事件之一被派发到全局作用域(通常是window，若在webworker中使用的话就是worker或者其他worker-based接口)
 *      rejectionhandled：当promise被拒绝且reject函数处理该rejection之后会派发此事件
 *      unhandledrejection：当promise被拒绝，但没有提供reject函数来处理该rejection时，会触发此事件
 *  以上两种情况：PromiseRejectionEvent事件都有两个属性，一个是promise属性，指向被驳回的Promise，另外一个是reason属性，用来说明Promise被驳回的原因
 * 在每一个上下文中，该处理都是全局的，因此不管源码如何，所有的错误都会在同一个处理函数中被捕捉并处理
 * 
 */
// window.addEventListener('unhandledrejection', (event) => {
//     console.log(event.promise);
//     console.log(event.reason);
//     event.preventDefault(); //阻止一些默认事件，比如将未处理的驳回的promise打印在控制栏中等等
// }, false);
/**
 * Promise.resolve() Promise.reject() 手动创建一个已经resolve和reject的promise快捷方法
 * 
 * Promise.all()  Promise.race() 并行运行异步操作的两个组合式工具
 * 
 * Promise.resolve(value)返回一个Pormise对象，如果value是一个promise对象，则返回这个promise对象
 * Promise.reject(value)返回一个promsie对象，状态是rejected
 * 
 */
import './deepclone.js'
let p1 = Promise.resolve({
    then(resolve, reject) {
        resolve(1);
    }
});
p1.then((val) => {
    console.log(val); // 1
}, (e) => {
    console.log(e); // 不会打印
});
/**
 * setTimeout(fn, ms) 回调和ms数
 * setInterval(fn, ms) 回调和ms数
 * requestAnimationFrame(fn) 告诉浏览器，你希望执行一个函数，该函数在浏览器下次重绘之前调用，以更新动画；fn在下一次重绘之前执行
 *      fn会传入一个参数DOMHighResTimeStamp参数，表示当前被requestAnimationFrame()排序的回调函数被触发的时间, 返回一个long整数，请求id，是回调列表中唯一的标识，可以传给cancelAnimationFrame()
 * 
 */
// let start;
// let ele = document.querySelector('#dd');
// requestAnimationFrame(step);
// function step(timestamp) {
//     if(!start)start = timestamp;
//     const timechange = timestamp - start;
//     ele.style.width = Math.round(timechange / 10) + 10 + 'px';
//     if (timechange < 2000) {
//         requestAnimationFrame(step);
//     } 
// }
/**
 * 任何异步代码仅仅在主线程可用后才执行，换句话说就是当调用栈为空时才执行
 * 比如setTimeout(fn, 0)这个回调函数不会立即执行，需要等主线程中调用栈都执行完成之后再执行fn，一般会耽搁几毫秒
 * 
 */