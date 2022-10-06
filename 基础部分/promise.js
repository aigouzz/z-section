/**
 * Promise.all某一个promise出问题，其他没出问题的请求结果无法获取，如何获取到呢
 * 1:单个catch中对失败的promise请求做处理
 * 2:reject操作换成resolve（new Error（‘出问题了’））
 * 3:引入Promise.allSettled  可以获取到所有fullfilled和rejected的promise结果
 * 4:引入promise-transaction
 * 
 * 
 * 
 */