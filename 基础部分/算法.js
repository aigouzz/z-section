{
    /**
     * 最短和>=target的连续子序列
     * [1, 2, 2, 4, 3, 1, 2, 1]  target=7    result is 4, 3
     */
    function shortSon(arr, target) {
        let result = arr.length + 1;
        let choseArr = [];
        let left = 0;
        let sum = 0;
        for(let i = 0;i< arr.length;i ++) {
            sum += arr[i];
            while(sum >= target) {
                if(result > i - left + 1) {
                    choseArr = arr.slice(left, i + 1);
                }
                result = Math.min(result, i - left + 1);
                sum -= arr[left];
                left ++;
            }
        }
        return result == arr.length + 1 ? 0 : {result,choseArr};
    }
    console.log(shortSon([1, 2,2, 4, 3, 1, 2, 1], 8));
}
{
    /**
     * 最长递增子序列 子序列中元素单调递增，非子串，不用连续
     * [3, 4, 2, 1, 7, 1, 3, 1, 9, 1, 2, 3]   == 3, 4, 7, 9
     */
    function maxOfLIS(arr) {
        let result = new Map();
        let maxLength = 0;
        let res = [];
        for(let i = 0;i < arr.length;i ++) {
            if(i === 0) {
                result.set(i, [arr[i]]);
            } else {
                let keys = result.keys();
                let find = false;
                for(let j of keys) {
                    let array = result.get(j);
                    if(array && array[array.length - 1] < arr[i]) {
                        array.push(arr[i]);
                        result.set(j, array);
                        find = true;
                    }
                };
                if(!find) {
                    result.set(i, [arr[i]]);
                }
            }
        }
        for(let i of result.values()) {
            if(i.length > maxLength) {
                maxLength = i.length;
                res = i;
            }
        }
        return {maxLength, res};
    }
    console.log(maxOfLIS([1, 4, 6, 2, 3, 9, 1, 2]));
}