{
    // function flatDeep(arr) {
    //     return arr.flat(Infinity);
    // }
    function flatDeep(arr) {
        let result = [];
        while(arr.length) {
            let lastItem = arr.pop();
            if(Array.isArray(lastItem)) {
                arr.push(...lastItem);
            } else {
                result.push(lastItem);
            }
        }
        return result.reverse();
    }
    console.log(flatDeep([1, 2, [3, 4, [5, 6, [7, 8, 9, ['a', 'b', ['c', ['d', 'e']]]]]]]))
}
{
    /**
     * map set weakMap weakSet
     * set:成员唯一无序不重复，add delete has clear
     * weakSet：成员都是对象，唯一无序不重复 成员弱引用，可以被垃圾回收机制回收
     * Map：健值对集合，key可以是任意值
     * weakMap：只接受对象作为键，（null除外），键名都是弱应用，
     * get set delete has
     */
}