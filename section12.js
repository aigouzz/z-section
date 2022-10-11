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