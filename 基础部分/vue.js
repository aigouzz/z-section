import { observe } from "../../vueOptimise/src/v-src/core/observer";
import { isObject } from "../../vueOptimise/src/v-src/core/observer/api";
import { arrKeys } from "../../vueOptimise/src/v-src/core/observer/array";
import { VNode } from "../../vueOptimise/src/v-src/core/observer/VNode";

const hasProto = __proto__ in {};

{
    class Observer{
        constructor(value) {
            this.value = value;
            def(this, '__ob__', value);
            this.dep = new Dep();
            if(Array.isArray(value)) {
                let augment = hasProto ? protoAugment : copyAugment;
                augment(value, arrayMethods, arrKeys);
                this.observeArray(value);
            } else {
                this.walk(value);
            }
        }
        walk(val) {
            Object.keys(val).forEach((item, index) => {
                defineReactive(val, item);
            });
        }
        observeArray(value) {
            for(let i = 0;i < value.length;i ++) {
                observe(arr[i]);
            }
        }
    }
    function observe(val) {
        if(!isObject(val) || val instanceof VNode) {
            return;
        }
        
    }
    function defineReactive(obj, key, val) {
        if(arguments.length == 2) {
            val = obj[key];
        }
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                dep.depend();
                return val;
            },
            set(newVal) {
                if(newVal === val) {
                    return ;
                }
                val = newVal;
                dep.notify();
            }
        }) 
    }
    class Dep{
        constructor() {
            this.subs = [];
        }
        addSub(sub) {
            this.subs.push(sub);
        }
        removeSub(sub) {
            let index = this.subs.indexOf(sub);
            if(index >=0 ) {
                this.subs.splice(index, 1);
                return true;
            }
            return false;
        }
        depend() {
            if(Dep.target) {
                Dep.target.addDep(this);
            }
        }
        notify() {
            const subs = this.subs.slice();
            subs.forEach((item, index) => {
                item.update();
            });
        }
    }
    Dep.target = null;
    let targetStack = [];
    function pushTarget(target) {
        Dep.target = target;
        targetStack.push(target);
    }
    function popTarget() {
        targetStack.pop();
        Dep.target = targetStack[targetStack.length - 1];
    }
    function def(obj, key, val) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: true,
            configurable: true
        })
    }
}

/**
 * vue父组件监听子组件的生命周期
 *  1:父：@mounted=‘domount’ 子：mounted(){this.$emit('mounted')}
 *  2:父：@hook：mounted=‘domount’  @hook可以监听到created updated都可
 * 
 * 首屏加载
 * performance.getEntriedByName('first-contentful-paint')[0].startTime
 * document.addEventListener('domContentLoaded', (e) => {console.log('first')})
 * let timing = performance.timing;
 * timing.domContentLoadedEventEnd - timing.requestEnd   //首屏加载
 * 
 * 解决方法：
 *  减少入口文件体积  路由懒加载，把不同路由组件分割成不同代码块
 *  静态资源本地缓存   http缓存，cache-contrl  etag等方式缓存
 *                  service-worker离线缓存 合理使用localStorage
 *  ui框架按需加载    antd elementui使用哪些模块就引入哪些模块
 *  图片资源压缩  大图压缩，小图雪碧，或3k一下用base64编码直接引入
 *  组件重复打包
 *  开启gzip压缩
 *  使用ssr
 * 
 * 数字点运算符优先级高于对象属性符
 */
/**
 * vue挂载过程发生了啥？
 * vuefunction执行中有this._init()
 * 然后执行
 * initmixin（vue）   定义了_init方法
 * stateMixin（Vue）  定义了$set,$get,$delete,$watch
 * eventsMixin（vue）  $on $off $once $emit definition
 * lifecycleMixin（vue）  _update $forceUpdate $destroy definition
 * renderMixin（vue）  定义_render 返回虚拟dom
 * 
 * 执行initMixin(Vue);在vue原型上定义了_init
 * _init()执行
 * initLifecycle(vm) // 初始化生命周期标识位
 * initEvents(vm)  // 初始化组件事件侦听
 * initRender(vm)  // 初始化渲染方法
 * callHook(vm, 'beforeCreate');   //调用beforecreate钩子函数
 * initInjection(vm);  //初始化依赖注入方法 在初始化data props之前
 * initState(vm)  //初始化props data methods watch
 * initProvide(vm)  // 初始化provide
 * callHook(vm, 'created')  //调用created钩子函数
 * 在调用beforeCreate之前，数据初始化没完成，data props这些属性无法访问到
 * 到了created时，数据已经初始化完成，能够访问到data props属性等，这时候没有完成dom挂载，无法访问到
 * dom元素
 * 挂载方法调用vm.$mount（vm.$options.el）方法
 * 
 * initState(vm) ==>完成数据初始化
 *  initProps（vm，opts.props）
 *  initMethods(vm, opts.methods)
 *  initData(vm)
 *  initComputed(vm, opts.computed)
 *  initWatch(vm, opts.watch)
 * 
 */
/**
 * vue既然可以通过数据劫持来精准知道数据在dom上变化，为何还需要vdom操作呢？
 * 应用上变化不可能只是某一个点变化
 * vdom操作可以提供一个性能操作的下限
 * 带来更好的代码维护性
 * 
 * keep-alive
 * 组件name用处：keepalive搭配component is=name使用
 *              dom做递归组件需要调用自身name   vue devtool调试工具显示组件名称
 * include exclude 支持字符串和正则，exclude优先级更高
 * max能缓存多少组件
 * 对应两个钩子函数activated deactivated
 * created 初始化两个对象分别缓存vnode和vnode的key
 * destroyed 删除缓存vnode还要对应执行组件实例的destroyed
 * 
 * render
 * 第一步：获取keepalive包着的第一个子组件对象及其组件名
 * 第二步：根据设定黑白名单进行匹配，决定是否缓存，不匹配直接返回组件实例（vnode），
 * 否则执行第三步
 * 第三步：根据组件id和tag生成缓存key，并在缓存对象中查找是否已缓存过该组件实例，如果存在，直接
 * 取出缓存值，并更新该key在this。keys中位置（更新key的位置是实现lru置换策略的关键）
 * 第四步：在this。cache对象中存储该组件实例并保存key值，之后检查缓存实例对象是否超过max的缓存值，
 * 超过则根据lru置换策略删除最久没有使用的实例（即下表为0的那个key）
 * 第五部：将该组件的keepalive属性值设置成true
 * 最后就是再次渲染执行缓存和对应钩子函数
 * 
 */
/**
 * vue-router
 * hash模式
 *  window.addEventListener('hashchange', callback, false)
 *      对浏览器地址进行监听，当调用push时候，把新路由添加到浏览器访问历史的栈顶，
 * 使用replace时，把浏览器访问历史的栈顶路由替换成新路由
 *  hash值是url中#及其以后的内容，浏览器根据hash值变化，将页面加载到对应的dom位置，锚点变化只是
 * 浏览器行为，每次锚点变化都会在浏览器中留下记录，可以通过回退按钮回到上一次记录
 * history模式
 *  使用window。popstate来监控浏览器地址变化，对pushState（），replaceState（）进行封装，
 * 当方法调用，会对浏览器历史栈进行修改，从而实现浏览器跳转，无需重新加载页面
 *  但是在刷新页面时候会走后段路由，所以需要服务端辅助来兜底，避免url无法匹配到资源时候能够返回页面
 * abstract模式
 *  不涉及和浏览器地址的相关记录，流程和hash模式一样，通过数组模拟浏览器的历史记录栈
 * 服务端：使用一个不依赖于浏览器的浏览历史虚拟管理后台
 * 
 */
/**
 * 对key的理解
 * key是对每一个vnode的唯一id，也是diff的一种优化策略，根据他可以更快更准确找到对应的vnode
 * v-for使用key
 *  如果不用key，vue会采用就地服用原则，最小化element移动，尝试最大程度在同适当的
 *  地方对相同类型element做patch或者reuse
 *      如果使用了key，根据keys的顺序记录element，曾经拥有key的element如果不在出现，
 *      会被直接remove或者destroyed
 * 用+new Date()生成的时间戳作为key，手动强制触发重新渲染
        当拥有新值的rerender作为key时，拥有了新key的Comp出现了，那么旧key Comp会被移除，新key Comp触发渲染
 * 不设置key：相同类型节点，patch，数据相同，不发生dom操作
            相同类型节点，patch，数据不同，dom操作
            不同类型节点，去除旧节点，新增新节点
            新节点多则插入，旧节点多则删除
    设置key：双端对比 减少了dom操作，提高了diff效率
    
 * 
 * 
 */
/**
 * vnode的理解
 * 是一个js对象，通过对象方式表示dom结构，将页面状态抽象出对象形式，配合不同渲染工具
 * 使得跨平台渲染成为可能  通过事务处理机制，将多次dom修改结果一次性添加到页面上，有效减少页面渲染次数
 * 减少修改dom的重排重绘次数，提高渲染性能
 * 为什么用？
 * 保证性能下限，在不进行手动优化情况下，提供过得去的性能
 * 跨平台   ssr渲染 uniapp转换成小程序
 * 
 * 真的比真实dom好？
 * 首次渲染大量dom，多了一层vnode的计算过程，会比innerHTML插入慢
 * 保证了下限，在真实dom操作时候进行针对性的优化，还是更快的
 */
/**
 * 生命周期
 * beforeCreate 
 * created
 * beforeMount
 * mounted
 * beforeUpdate
 * updated
 * beforeDestroy
 * destroyed
 * activated
 * deactivated
 * errorCaptured
 * 
 * 
 */