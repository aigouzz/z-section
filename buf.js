let date = new Date();
    // 设置policy过期时间。
date.setHours(date.getHours() + 1);
let srcT = date.toISOString();

function toBinary (str){
    let tempResult = [];
    let result = [];
    // 分割字符
    str.split('').forEach(element => {
        //转二进制
        let binaryElement = element.charCodeAt().toString(2)
        //由于js原生方法转二进制如果前面是0可能会不满8位，所以前面补0，转为8位的对应ascii码二进制
        binaryElement = binaryElement.length === 8 ? binaryElement : ('0' + binaryElement)  //不足8位的二进制码在前面补0
        tempResult.push(binaryElement);
    });
    let index = 0;
    // 不满3个字符往后面补满3个字符（3个字符（24个二进制位）是6和8的最小公倍数）
    while(tempResult.length % 3 != 0){
        tempResult.push('00000000')
    }
    console.log(tempResult.length)
    return tempResult.join('');
}
from = (str) => {
    let res = '<Buffer';
    for(let i = 0;i < str.length;i ++) {
        let item = str[i].charCodeAt(0).toString(16);
        res += ' ' + item;
    }
    res += '>';
    return res;
} 
toBase64 = (binary) => {
    let KEYCODE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split('');
    let tempResult = [];
    let result = [];
    let index = 0;
    // 每6位切割二进制
    while(index+6 < binary.length){
        tempResult.push(binary.slice(index,index+6))
        index = index + 6 ;
    }
    //不满6位的前面补0
    tempResult.push(("000000" + binary.slice(index,index+6)).substr( -6 ));
    tempResult.forEach(element => {
        //将二进制转为数组下标
        let index = parseInt(element,2);
        //获取对应下标字符串
        result.push(index === 0 ? '=' : KEYCODE[index])
    });
    //字符串拼接
    return result.join('');
}
let res = JSON.stringify({
    expiration: srcT,
    conditions: [
      // 限制上传文件大小。
      ["content-length-range", 0, 10 * 1024 * 1024],
    ],
});
let buf1 = Buffer.from(`{"expiration":"2022-12-28T09:16:05.721Z","conditions":[["content-length-range",0,10485760]]}`);
let buf2 = buf1.toString('base64');
let buf3 = from(res);
let buf4 = toBase64(toBinary(res));
// let buf5 = toBase64(toBinary(buf1));
console.log(typeof buf1);
console.log(buf2);
console.log('/n')
console.log(buf3);
console.log(buf4);
console.log(res);


function byteLength (str) {
    let n = 0;
    for(let i = 0;i < str.length;i ++) {
        let hi = str.charCodeAt(i);
        if(hi < 0x0080) {
            n += 1;
        } else if(hi < 0x0800) {
            n += 2;
        } else if(hi < 0xD800) {
            n += 3;
        } else if(hi < 0xDC00) {
            let lo = str.charCodeAt(++i);
            if(i < str.length && lo >= 0xDC00 && lo <= 0xDFFF) {
                n += 4;
            } else {
                throw new Error('ucs2 string malformed');
            }
        } else if(hi < 0xE000) {
            throw new Error('ucs2 string malformed');
        } else {
            n += 3;
        }
    }
    return n;
}