const CryptoJS = require('./crypto/hmac');
const Crypto = require('crypto-js');
let date = new Date();
    // 设置policy过期时间。
date.setHours(date.getHours() + 1);
let srcT = date.toISOString();

function strToUtf8Bytes(str) {
    const utf8 = [];
    for (let ii = 0; ii < str.length; ii++) {
      let charCode = str.charCodeAt(ii);
      if (charCode < 0x80) utf8.push(charCode);
      else if (charCode < 0x800) {
        utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
      } else if (charCode < 0xd800 || charCode >= 0xe000) {
        utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
      } else {
        ii ++;
        // Surrogate pair:
        // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and
        // splitting the 20 bits of 0x0-0xFFFFF into two halves
        charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff));
        utf8.push(
          0xf0 | (charCode >> 18),
          0x80 | ((charCode >> 12) & 0x3f),
          0x80 | ((charCode >> 6) & 0x3f),
          0x80 | (charCode & 0x3f),
        );
      }
    }
    //兼容汉字&#xff0c;ASCII码表最大的值为127&#xff0c;大于127的值为特殊字符
    for(let jj = 0;jj < utf8.length;jj ++){
        var code = utf8[jj];
        if(code > 127){
            utf8[jj] = code - 256;
        }
    }
    return utf8;
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

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
//将Ansi编码的字符串进行Base64编码
function encode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
        + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
}
//将Base64编码字符串转换成Ansi编码的字符串
function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    if (input.length % 4 != 0) {
        return "";
    }
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        return "";
    }
    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output += String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output += String.fromCharCode(chr3);
        }
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
}
function utf16to8(str) {
 var out, i, len, c;
 out = "";
 len = str.length;
 for(i = 0; i < len; i++) {
  c = str.charCodeAt(i);
  if ((c >= 0x0001) && (c <= 0x007F)) {
   out += str.charAt(i);
  } else if (c > 0x07FF) {
   out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
   out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
   out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
  } else {
   out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
   out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
  }
 }
 return out;
}
function utf8to16(str) {
 var out, i, len, c;
 var char2, char3;
 out = "";
 len = str.length;
 i = 0;
 while(i < len) {
  c = str.charCodeAt(i++);
  switch(c >> 4) {
   case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
    // 0xxxxxxx
    out += str.charAt(i-1);
    break;
   case 12: case 13:
    // 110x xxxx  10xx xxxx
    char2 = str.charCodeAt(i++);
    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
    break;
   case 14:
    // 1110 xxxx 10xx xxxx 10xx xxxx
    char2 = str.charCodeAt(i++);
    char3 = str.charCodeAt(i++);
    out += String.fromCharCode(((c & 0x0F) << 12) |
    ((char2 & 0x3F) << 6) |
    ((char3 & 0x3F) << 0));
    break;
  }
 }
 return out;
}

let res = JSON.stringify({
    expiration: srcT,
    conditions: [
      // 限制上传文件大小。
      ["content-length-range", 0, 10 * 1024 * 1024],
    ],
});


let buf1 = Buffer.from(res);
let buf2 = buf1.toString('base64');
let buf3 = utf16to8(res);
let buf4 = encode64(buf3);
// let buf5 = toBase64(toBinary(buf1));
console.log(buf1);
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

console.log(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(buf4, '7wYyyNsRmXFghgjDoQemzGXcaZdejF')));

console.log(Crypto.enc.Base64.stringify(Crypto.HmacSHA1(buf4, '7wYyyNsRmXFghgjDoQemzGXcaZdejF')));
