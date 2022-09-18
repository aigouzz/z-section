//最好的方式使用weakMap 强弱引用的问题
let cachedmap = new Map();

function deepclone(obj) {
    if(typeof obj !== 'object' || !obj) {
        return obj;
    }
    if(cachedmap.has(obj)) {
        return cachedmap.get(obj);
    }
    if(obj instanceof RegExp) {
        let tmp = new RegExp(obj);
        cachedmap.set(obj, tmp);
        return tmp;
    } else if (obj instanceof Map) {
        let tmp = new Map();
        cachedmap.set(obj, tmp);
        obj.forEach((val, key) => {
            tmp.set(deepclone(key), deepclone(val));
        });
        return tmp;
    } else if (obj instanceof Set) {
        let tmp = new Set();
        cachedmap.set(obj, tmp);
        obj.forEach((val) => {
            tmp.add(deepclone(val));
        });
        return tmp;
    } else {
        let tmp = new obj.constructor();
        cachedmap.set(obj, tmp);
        //便利数组或者对象
        for(let key in obj) {
            tmp[key] = deepclone(obj[key]);
        }
        return tmp;
    }
}
let obj1 = {
    name: 1,
    age: {
        name:2
    },
    set: new Set([1, 2]),
    map: new Map([['name', 1], ['age', 2]]),
    arr: [1, '2'],
    obj2: {
        me: 'guo'
    }
};
let obj2 = deepclone(obj1);
console.log(obj2);
console.log(obj2 === obj1);
