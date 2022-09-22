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

}