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
 * 
 */
/**
 * vue挂载过程发生了啥？
 * vuefunction执行中有this._init()
 * 然后执行initmixin（vue）   定义了_init方法
 * stateMixin（Vue）  定义了$set,$get,$delete,$watch
 * eventsMixin（vue）  $on $off $once $emit definition
 * lifecycleMixin（vue）  _update $forceUpdate $destroy definition
 * renderMixin（vue）  定义_render 返回虚拟dom
 * 
 * initMixin(Vue);在vue圆形上定义了_init
 * initLifecycle(vm) // 初始化生命周期标识位
 * initEvents(vm)  // 初始化组件事件侦听
 * initRender(vm)  // 初始化渲染方法
 * callHook(vm, 'beforeCreate');   //调用beforecreate钩子函数
 * initInjection(vm);  //初始化依赖注入方法 在初始化data props之前
 * initState(vm)  //初始化props data methods watch
 * initProvide(vm)  // 初始化provide
 * callHook(vm, 'created')  //调用created钩子函数
 * 
 * 
 * 
 */