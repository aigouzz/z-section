

/**
 * 手写
 */
{
    let maptype = '[object Map]';
    let settype = '[object Set]';
    let arraytype = '[object Array]';
    let objecttype = '[object Object]';
    let functiontype = '[object function]';
    let typeArray = [maptype, settype, arraytype, objecttype];
function isObject(val) {
    return (typeof val === 'object' && val !== null) || typeof val === 'function'
}

function getType(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
}

function cloneSymbol(val) {
    return Object(Symbol.prototype.valueOf.call(val))
}

function cloneFunction(val) {
    const bodyreg = /(?<={)(.|\n)+(?=})/m;
    const paramreg = /(?<=\().+(?=\)\s+{)/;
    const funcString = val.toString();
    if(val.prototype) {
        const param = funcString.match(paramreg);
        const body = funcString.match(bodyreg);
        if(body) {
            if(param) {
                const paramarr = param[0].split(',');
                return new Function(...paramarr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

function cloneOtherType(val, type) {
    let ctor = val.constructor;
    switch(type) {
        case functiontype:
            return cloneFunction(val);
        default:
            return new ctor(val);
    }
}

function clonedeep(val, map = new WeakMap()) {
    if(typeof val === 'symbol') return cloneSymbol(val);
    if(!isObject(val)) return val;
    const type = getType(val);
    let cloneVal;
    if(arraytype.includes(type)) {
        cloneVal = new val.constructor();
    } else {
        return cloneOtherType(val, type);
    }
    if(map.get(val)) {
        return map.get(val);
    }
    map.set(val, cloneVal);

    if(type === settype) {
        val.forEach(element => {
            cloneVal.add(clonedeep(element, map));
        });
        return cloneVal;
    }

    if(type === maptype) {
        val.forEach((element, key) => {
            cloneVal.set(key, clonedeep(element, map));
        });
        return cloneVal;
    }

    if(type === arraytype) {
        value.forEach((element, index) => {
            cloneVal[index] = clonedeep(element, map);
        });
        return cloneVal;
    }

    if(type === objecttype) {
        Object.keys(val).forEach((element, index) => {
            cloneVal[element] = clonedeep(val[key], map);
        });
        return cloneVal;
    }
}
let obj = {
    bool: true,
    name: 1,
    age: 'aa',
    name1: Symbol(1),
    getName() {},
    show: [
        function set() {},
    ],
    hide: {
        cancel: new Map([['a', 1]]),
        s1: new Set([1, 3, 5])
    }
}
// console.log(clonedeep(obj));
}
{
    class myPromise{
        constructor(executor) {
            let _this = this;
            this.status = 'pending';
            this.value = null;
            this.reason = null;
            this.resolveCallbacks = [];
            this.rejectCallbacks = [];
            try{
                executor(this._resolve, this._reject);
            } catch(err) {
                _this._reject(err);
            }
        }
        _resolve=(value) => {
            setTimeout(() => {
                if(this.status === 'pending') {
                    this.status = 'fulfilled';
                    this.value = value;
                    this.resolveCallbacks.forEach((item) => {
                        item(this.value);
                    });
                }
            }, 0);
        }
        _reject = (reason) => {
            setTimeout(() => {
                if(this.status === 'pending') {
                    this.status = 'rejected';
                    this.reason = reason;
                    this.rejectCallbacks.forEach((item) => {
                        item(this.reason);
                    });
                }}, 0);
        }
        then(onResolved, onRejected) {
            let _this = this;
            return new myPromise((resolve, reject) => {
                if(this.status === 'pending') {
                    this.resolveCallbacks.push((value) => {
                        const res = onResolved(value);
                        res instanceof myPromise ? res.then(resolve, reject) : resolve(res);
                    });
                    this.rejectCallbacks.push((reason) => {
                        const res = onRejected(reason);
                        res instanceof myPromise ? res.then(resolve, reject) : reject(res);
                    });
                } else if (this.status === 'fulfilled') {
                    const res = onResolved(this.value);
                    res instanceof myPromise ? res.then(resolve, reject) : resolve(res);
                } else if(this.status === 'rejected') {
                    const res = onRejected(this.reason);
                    res instanceof myPromise ? res.then(resolve, reject) : reject(reason)
                }
            });
        }
        catch(onRejected) {
            return this.then(null, onRejected);
        }
        static resolve(value) {
            if(value instanceof myPromise) {
                return value;
            } else {
                return new myPromise((resolve, reject) => {
                    resolve(value);
                });
            }
        }
        static reject(reason) {
            if(reason instanceof myPromise) {
                return reason;
            } else {
                return new myPromise((resolve, reject) => {
                    reject(reason);
                });
            }
        }
        static all(promiseArray) {
            if(!Array.isArray(promiseArray)) {
                throw new Error('all的参数必须是数组')
            }
            return new Promise((resolve, reject) => {
                let result = [];
                let resolveNum = 0;
                for(let i = 0; i < promiseArray.length; i++) {
                    promiseArray[i].then((data) => {
                        resolveNum ++;
                        result[i] = data;
                        if(resolveNum === promiseArray.length) {
                            resolve(result);
                        }
                    }, (err) => {
                        reject(err);
                    })
                }
            });
        }
        static race() {}
    }

    let p1 = new myPromise((resolve, reject) => {
        resolve('data');
    });
    p1.then((data) => {
        console.log(data);
    });
    myPromise.reject('error happen').then((data) => {
        console.log('fulfilled')
    }, (reason) => {
        console.log('rejected', reason)
    }).then((data) => {
        console.log('second then data',data);
    }, (err) => {
        console.log('second then er', err);
    }).then((data) => {
        console.log('third then data',data);
    }, (err) => {
        console.log('third then er', err);
    });
    myPromise.all([
        Promise.reject(1), Promise.resolve(2), Promise.resolve(new Promise((resolve, reject) => {
            resolve('resolved')
        }))
    ]).then((data) => {
        console.log(data);
    }, err => {
        console.log(err);
    });

}
{
    function myApply(...args) {
        let obj = args[0];
        let arr = args.slice(1);
        obj.fn = this;
        let result = obj.fn(...arr);
        delete obj.fn;
        return result;
    }
    function flatdeep(arr, depth = 1) {
        let result = [];
        let nowDep = 0;
        while(arr.length) {
            let lastItem = arr.pop();
            nowDep ++;
            if(Array.isArray(lastItem) && nowDep !== depth + 1) {
                arr.push(...lastItem);
            } else {
                nowDep = 0;
                result.push(lastItem);
            }
        }
        return result.reverse();
    }
    function myNew(fn, ...args) {
        if(typeof fn !== 'function') {
            throw Error('第一个参数必须是一个function');
        }
        let obj = Object.create(fn.prototype);
        // let obj = {};
        // obj.__proto__ = fn.prototype;
        let result = fn.apply(obj, args);
        return typeof result === 'object' ? result : obj;
    }

}
{
    function change(name, age, sex) {
        name = 'dd';
        console.log(name, arguments[0]);
        arguments[0] = 'kd';
        console.log(name, arguments[0]);
        sex = '11';
        console.log(sex, arguments[2]);
        arguments[2] = '22';
        console.log(sex, arguments[2]);
    }
}
{
    function nexttick(cb) {
        let callbacks = [];
        let timerFunc;
        callbacks.push(() => {
            cb();
        });
        if(typeof Promise != undefined) {
            timerFunc = () => {
                Promise.resolve().then(() => {
                    flushCallbacks();
                });
            }
        } else if(typeof MutationObserver !== undefined) {
            let counter = 1;
            let observer = new MutationObserver();
            const textnode = document.createTextNode(String(counter));
            observer.observe(textnode, {
                characterData: true
            });
            timerFunc = () => {
                counter = (counter + 1)%2;
                textnode.data = String(counter);
            }
        } else if(typeof setImmediate != undefined) {
            timerFunc = () => {
                setImmediate(flushCallbacks)
            }
        } else {
            timerFunc = () => {
                setTimeout(flushCallbacks, 0);
            }
        }
        function flushCallbacks() {
            let copies = [...callbacks];
            callbacks.length = 0;
            copies.forEach(item => item());
        }
        timerFunc();
    }
    console.log('prev nexttick')
    nexttick(() => {
        console.log('nexttick called');
    })
    console.log('next nexttick')
}
{
    class VueRouter {
        constructor(Vue, options) {
            this.$options = options;
            this.routeMap = {};
            this.app = new Vue({
                data() {
                    current: '#/'
                }
            });

            this.init();
            this.createRouteMap(this.$options);
            this.initComponent(Vue);
        }
        init() {
            window.addEventListener('load', this.onHashChange.bind(this), false);
            window.addEventListener('hashchange', this.onHashChange.bind(this), false);
        }
        createRouteMap(options) {
            options.routes.forEach(item => {
                this.routeMap[item.path] = item.component;
            })
        }
        initComponent(Vue) {
            Vue.component('router-link', {
                props: {
                    to: String,
                },
                template: '<a :href="to"><slot></slot></a>'
            });
            let _this = this;
            Vue.component('router-view', {
                render(h) {
                    let component = _this.routeMap[_this.app.current]
                    return h(component)
                }
            })
        }
        getHash() {
            return window.location.hash.slice(1) || '/'
        }
        onHashChange() {
            this.app.current = this.getHash();
        }
    }
}
{
    function selectSort(arr) {
        let minIndex, temp;
        for(let i = 0;i < arr.length;i ++) {
            minIndex = i;
            for(let j = i + 1;j < arr.length; j++) {
                if(arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        return arr;
    }
    function bubble(arr) {
        for(let i = 0;i < arr.length;i ++) {
            for(let j = 0;j < arr.length - 1 -i;j ++) {
                if(arr[j+1] < arr[j]) {
                    let temp = arr[j+1];
                    arr[j+1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }
    function insertSort(arr) {
        let result = [];
        for(let i = 0;i < arr.length;i ++) {
            for(let j = 0;j < result.length;j ++) {
                result[j]
            }
        }
    }
    console.log(bubble([3,2,1,4,22, 12, 11, 45, 21, 19]))
}
{
    function longestSon(arr) {
        let res = [];
        for(let i = 0;i < arr.length;i ++) {
            if(i == 0) {
                res[0] = arr[0];
            } else {
                if(arr[i] > res[res.length - 1]) {
                    res.push(arr[i]);
                }
            }
        }
        return res;
    }
    console.log(longestSon([3,2,1,4,22, 12, 11, 45, 21, 19]))
}
