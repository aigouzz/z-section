// class myPromise {
//     constructor(executor) {
//         this.status = 'pending';
//         this.value = null;
//         this.resolveCallbacks = [];
//         this.rejectCallbacks = [];
//         try{
//             executor(this._resolve, this._reject);
//         } catch(err) {
//             this._reject(err);
//         }
//     }
//     _resolve=(value) => {
//         if(this.status === 'pending') {
//             this.status = 'resolved';
//             this.value = value;
//             this.resolveCallbacks.forEach(item => item(value));
//         }
//     }
//     _reject=(reason)=> {
//         if(this.status === 'pending') {
//             this.status = 'rejected';
//             this.value = reason;
//             this.rejectCallbacks.forEach(item => item(reason));
//         }
//     }
//     then(onFullfilled, onRejected) {
//         return new myPromise((resolve, reject) => {
//             this.resolveCallbacks.push((value) => {
//                 try{
//                     const res = onFullfilled(value);
//                     if(res instanceof myPromise) {
//                         res.then(resolve, reject);
//                     } else {
//                         resolve(res);
//                     }
//                 } catch(err) {
//                     reject(err);
//                 }
//             });
//             this.rejectCallbacks.push((value) => {
//                 try{
//                     const res = onRejected(value);
//                     if(res instanceof myPromise) {
//                         res.then(resolve, reject);
//                     } else {
//                         reject(res);
//                     }
//                 } catch (err) {
//                     reject(err);
//                 }
//             });
//         });
//     }
//     catch(onRejected) {
//         return this.then(null, onRejected);
//     }
// }

class myPromise{
    constructor(executor) {
        this.status = 'pending';
        this.value = null;
        this.resolveCallbacks = [];
        this.rejectCallbacks = [];
        try{
            executor(this._resolve, this._reject);
        } catch(err) {
            this._reject(err)
        }
    }
    _resolve=(value)=> {
        if(this.status === 'pending') {
            this.status = 'resolved';
            this.value = value;
            this.resolveCallbacks.forEach(item => item(value));
        }
    }
    _reject=(reason)=> {
        if(this.status === 'pending') {
            this.status = 'rejected';
            this.value = reason;
            this.rejectCallbacks.forEach(item => item(reason));
        }
    }
    then(onResolved, onRejected) {
        let _this = this;
        return new myPromise((resolve, reject) => {
            if(_this.status === 'pending') {
                _this.resolveCallbacks.push((value) => {
                    const res = onResolved(value);
                    res instanceof myPromise ? res.then(resolve, reject) : resolve(res);
                });
                _this.rejectCallbacks.push((reason) => {
                    const res = onRejected(reason);
                    res instanceof myPromise ? res.then(resolve, reject) : reject(res);
                })
            } else if(_this.status === 'resolved') {
                const res = onResolved(_this.value);
                res instanceof myPromise ? res.then(resolve, reject) : resolve(res);
            } else if(_this.status === 'rejected') {
                const res = onRejected(_this.value);
                res instanceof myPromise ? res.then(resolve, reject) : reject(res);
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
            })
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
    setTimeout(() => {
        resolve('data');
    }, 1000);
});
p1.then((data) => {
    console.log(data);
});
let p2 = myPromise.resolve({name: 'gg'});
p2.then((data) => {
    console.log(data);
})