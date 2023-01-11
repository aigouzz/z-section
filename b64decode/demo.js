var WXBizDataCrypt = require('./WXBizDataCrypt')

var appId = 'wx6f064265af79da15'
var sessionKey = 'qXOuDNKB+0xtJhefkVkgpA=='
var encryptedData = 'z6wVGRcLoq35fcKvGcNnnHYEpGUyWNPw2vdpEJR0yHuh54DNd7DixVaL4oJUiwUMJJ4UckidTrLXgmiLODNE5HUcXkIwogTin4RPgKWIaguZMZ2yglSy5/Q8KuPSbQXW5Sq9XhLByK6fC2VpAXv6zAnHAi10ZDzsrBO4qm8e/1yDG6Pxf7NXachSsrdBuJYJzFVaadYw/LlmAlVgBakIJyCGS96GWrw3WqWMZsUZNxLz0H9X0+NDvEXQTfbc71Ab2eCOF7iQD508FVAajfD6qxmxu6NhCnuElFiPgOS9wPJRoOLOvMNYfZoEIuCos7J0bu4bsZ0B10BhqmBRsPh92MFokoZq6Iosa5PE3S5Nw+FSzRzshQPDGEgF5SuXnJ7+gU/0jnd18A8GrKd26Hci6gKaWo3mR6/isY8dnHzCK3IhUyGEw/0SAv7mNUC+vG+V'
var iv = 'OmFTZnMfuKgWfeRKfuJmVQ=='

var pc = new WXBizDataCrypt(appId, sessionKey)

var data = pc.decryptData(encryptedData , iv)

console.log('解密后 data: ', data)
// 解密后的数据为
//
// data = {
//   "nickName": "Band",
//   "gender": 1,
//   "language": "zh_CN",
//   "city": "Guangzhou",
//   "province": "Guangdong",
//   "country": "CN",
//   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
//   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
//   "watermark": {
//     "timestamp": 1477314187,
//     "appid": "wx4f4bc4dec97d474b"
//   }
// }
