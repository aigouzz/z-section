/**
 * 函数重载
 * 函数的一种特殊情况，为方便使用，允许在同一范围中声明几个功能类似的同名函数，但是这些同名函数
 * 的形式参数（指参数的个数，类型或者顺序）必须不同，也就是用同一个函数完成不同的功能
 * 这就是重载函数
 */
{
 function addMethod(object, name, fnt) {
   var old = object[name];  // 保存前一个值，以便后续调用
   object[name] = function(){  // 向object[name]赋值一个代理函数
     // 判断fnt期望接收的参数与传入参数个数是否一致
     if (fnt.length === arguments.length)
       // 若是，则调用fnt
       return fnt.apply(this, arguments)
     else if (typeof old === 'function')  // 若否，则判断old的值是否为函数
       // 若是，则调用old
       return old.apply(this, arguments);
   };
 }
 //模拟重载add
 var methods = {};
 //添加方法，顺序无关
 addMethod(methods, 'add', function(){return 0});
 addMethod(methods, 'add', function(a,b){return a + b});
 addMethod(methods, 'add', function(a,b,c){return a + b + c});
 //执行
 console.log(methods.add()); //0
 console.log(methods.add(10,20)); //30
 console.log(methods.add(10,20,30)); //60
}