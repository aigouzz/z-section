import { copyAugment } from "../../vueOptimise/src/v-src/core/observer/api";
import { hasProto } from "../../vueOptimise/src/v-src/core/util";

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