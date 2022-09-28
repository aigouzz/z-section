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
                result = Math.min(result, i - left + 1);
                if(result > i - left + 1) {
                    choseArr = arr.slice(left, i + 1);
                }
                sum -= arr[left];
                left ++;
            }
        }
        return result == arr.length + 1 ? 0 : {result,choseArr};
    }
    console.log(shortSon([1, 2,2, 4, 3, 1, 2, 1], 7));
}