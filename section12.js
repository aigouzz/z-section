/**
 * map & for
    map 会先把执行同步操作执行完，就返回，之后再一次一次的执行异步任务
    for 是等待异步返回结果后再进入下一次循环
 * 
 */
/**
 * 了解axios吗？
 * 轻量的http客户端，基于xmlhttprequest服务；爱执行http请求，支持丰富的配置，支持promise
 * 支持浏览器端和nodejs端
 * 特性：
 *    从浏览器中创建XMLhttpRequest
 *    从nodejs创建http请求
 *    支持promiseapi
 *    拦截请求和响应
 *    转换请求数据和响应数据
 *    取消请求
 *    自动转换JSON数据
 *    客户端支持防御xsrf
 * 封装的同时，你需要和 后端协商好一些约定，请求头，状态码，请求超时时间.......

   设置接口请求前缀：根据开发、测试、生产环境的不同，前缀需要加以区分

   请求头 : 来实现一些具体的业务，必须携带一些参数才可以请求(例如：会员业务)

   状态码: 根据接口返回的不同status ， 来执行不同的业务，这块需要和后端约定好

   请求方法：根据get、post等方法进行一个再次封装，使用起来更为方便

   请求拦截器: 根据请求的请求头设定，来决定哪些请求可以访问

   响应拦截器： 这块就是根据 后端`返回来的状态码判定执行不同业务
 */
/**
 * 了解业务：全面调研当前业务和竞品的现状，充分理解当前渲染链路和节点，确认当前存在的问题
寻找方案：预估未来发展的方向，尽可能多的了解相关解决方案或创新自己的方案，比如：SSR，ER，预渲染，预加载，静态化等
评估方案：和相关同学讨论或开会，评估所有可行的方案及其合适度、复杂度、前瞻性和 ROI。选出至少一个候选方案，比如：SSR
Demo 开发：基于现有开发能力为所有候选方案开发对应 Demo，提前探路并验证风险和可行性，帮助产出更合适的方案设计
方案设计：梳理清楚 SSR 完整链路上相关节点和合作方，多写、多画、多思考、多讨论相关架构和设计，深入细节产出 RFC 文档
RFC 评审：充分评审设计、实现和产物细节，可多次评审直至所有成员达成共识。确定相关开发和团队分工，保证方案完善可执行
落到实处：推进项目开发，多与开发团队沟通，并至少参与一部分编码工作，打通所有相关开发和运维链路，保障产物简单好用
沉淀传承：沉淀文档，通过会议、分享或文章帮助其他人理解 SSR 方案和架构，用好 SSR。做好答疑，并推动方案实施
不断演进：关注 SSR 的发展，演进已有链路，比如，个性化的 SSR，结合 ER 的 SSR 等
 */
//实现简易版本axios
class Axios{
   constructor() {

   }
   request(config) {
      return new Promise((resolve, reject) => {
         const {url, method='get', data = {}} = config;
         const xhr = new XMLHttpRequest();
         xhr.open(method, url, true);
         xhr.onload = () => {
            console.log(xhr.responseText);
            resolve(xhr.responseText);
         }
         xhr.send(data);
      });
   }
}
function findmax(str) {
   let set = new Set();
   let str1 = '';
   let rk = -1;
   let res = 0;
   for(let i = 0;i < str.length;i ++) {
      if(i != 0) {
         set.delete(str.charAt(i - 1));
      }
      while(rk + 1 < str.length && !set.has(str.charAt(rk + 1))) {
         set.add(str.charAt(rk + 1));
         rk ++;
      }
      if(res < rk + 1 - i) {
         str1 = str.substring(i, rk + 1);
      }
      res = Math.max(res, rk + 1 - i);
      
   }
   return {res, str1};
}
// console.log(findmax('aabccdddddde'));
{
   class Scheduler {
      constructor(maxCount=2) {
        this.queue = [];
        this.maxCount = maxCount;
        this.runCounts = 0;
      }
      add(promiseCreator) {
        this.queue.push(promiseCreator);
      }
      taskStart() {
        for (let i = 0; i < this.maxCount; i++) {
          this.request();
        }
      }
      request() {
        if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
          return;
        }
        this.runCounts++;
        // promise 直接执行
        this.queue.shift()().then(() => {
          this.runCounts--;
          this.request();
        });
      }
    }
       
    const timeout = time => new Promise(resolve => {
      setTimeout(resolve, time);
    })
      
    const scheduler = new Scheduler();
    
    const addTask = (time,order) => {
      scheduler.add(() => timeout(time).then(()=>console.log(order)))
    }
      
      
    addTask(1000, '1');
    addTask(500, '2');
    addTask(300, '3');
    addTask(400, '4');
    scheduler.taskStart()
    // 每次两个任务：500ms 先结束，第3个任务进来，300ms 先结束，第4个任务进来，1000ms 先结束
    // 2
    // 3
    // 1
    // 4
    
    
    // 实现2
    class Scheduler1{  
      constructor (limit = 2) {    
        this.limit = limit    
        this.concurrent = 0    
        this.stack = []  
      }
      add (promiseCreator) {
        if (this.concurrent < this.limit) {      
          this.concurrent++      
          return promiseCreator().then(() => {        
            this.concurrent--        
            this.next()      
          })    
        } else {      
          let resolve      
          let p = new Promise(r => {        
            resolve = r      
          })      
          this.stack.push(() => {        
            promiseCreator().then(() => {          
              resolve()        
              this.concurrent--          
              this.next()        
            })
          })      
          return p
        }  
      }  
      next () {    
        if (this.stack.length > 0 && this.concurrent < this.limit) {      
          let p = this.stack.shift()      
          this.concurrent++      
          p()    
        }  
      }
    }
    
}
{
  // function isDate(value) {
  //   return Object.prototype.toString.call(value).substring(8, -1) === 'Object'
  // }
  // function isObject(value) {
  //   return Object.prototype.toString.call(value).substring(8, -1) === 'Object'
  // }
  // function deepclone(value, map = new WeakMap()) {
  //   if(value == null || typeof value !== 'object') {
  //     return value;
  //   }
  //   if(map.get(value)) {
  //     return map.get(value);
  //   }
  //   let res = null;
  //   if(Array.isArray(value)) {
  //     res = [];
  //     for(let i = 0;i < value.length;i ++) {
  //       res[i] = deepclone(value[i]);
  //     }
  //   } else if(isObject(value)) {
  //     for(let i in value) {
  //       res[i] = deepclone(value[i]);
  //     }
  //   } else if(isDate(value)) {

  //   }
  // }
}
{
  function fn1(v) {
    console.log('fn1')
    return v+1
  }
  
  function fn2(v) {
    console.log('fn2')
    return v+2
  }
  
  function fn3(v) {
    console.log('fn3')
    return v+3
  }
  
  
  //compose(fn3, fn2, fn1)(1) === 7
  
  function compose(...args) {
    let arr = args.reverse();
    function rent(v) {
      let res = arr.reduce((prev, item) => {
        let res = item(prev);
        return res;
      }, v);
      return res;
    }
    return rent;
  }
  console.log(compose(fn3, fn2, fn1)(1))
}
{
  //找出数组numbers的两个数相加等于target的index。
const numbers = [2, 5, 7, 9, 11, 6, 3]
const target = 12;
function diffNumbers(num, trg){
    //这里写逻辑
    let arr = new Array();
    for(let i = 0;i < numbers.length;i ++) {
      let num = numbers.indexOf(trg - numbers[i]);
      if(num !== -1 && !arr.flat(1).includes(i) && num !== i) {
        arr.push([i, numbers.indexOf(trg - numbers[i])]);
      }
    }

    return arr;
}

console.log(diffNumbers(numbers, target))
//[[1, 2], [3, 6]]]

}
{
  function findIP(onNewIP) {
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]}),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;
    
    function ipIterate(ip) {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    }
      
    pc.createDataChannel("");
     
    pc.createOffer(function(sdp) {
      sdp.sdp.split('\n').forEach(function(line) {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(ipIterate);
      });
      pc.setLocalDescription(sdp, noop, noop);
    }, noop);
      
    pc.onicecandidate = function(ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
    };
    }
    
    function addIP(ip) {
    console.log('got ip: ', ip);
    }
    // findIP(addIP);
}
{
  function findMax(str) {
    let set = new Set();
    let rk = -1;
    let str1 = '';
    let res = 0;
    let length = str.length;
    for(let i = 0;i < length;i ++) {
      if(i !== 0) {
        set.delete(str.charAt(i - 1));
      }
      while(rk + 1 < i && !set.has(str.charAt(rk + 1))) {
        set.add(str.charAt(rk + 1));
        rk ++;
      }
      if(res < rk + 1 - i) {
        str1 = str.substring(res, rk + 1 - i);
        res = rk + 1 - i;
      }
    }
    return {str1, res};
  }
  function findMax1(arr) {
    let sum = 0;
    let res = arr[0];
    for(let i = 0;i < arr.length;i ++) {
      if(sum > 0) {
        sum += arr[i];
      } else {
        sum = arr[i];
      }
      res = Math.max(res, sum);
    }
    return res;
  }
}