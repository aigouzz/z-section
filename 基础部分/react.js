/**
 * react触发更新
 * setState()方法调用  传入null时候并不会触发更新
 *  prevstate === nextstate也不会更新
 * 
 * 父组件重新渲染
 *  只要父组件重新渲染了，即使传入子组件的props未发生改变，子组件也会重新渲染，触发更新
 * 
 * forceUpdate（）
 * 默认情况下，当组件state或者props改变是，组件将重新渲染，如果你的render（）方法依赖于一些其他数据
 * 你可以告诉react组件需要通过调用forceUpdate（）重新渲染
 * 调用forceUpdate（）会导致组件跳过shouldComponentUpdate（），直接调用render（），
 * 这将会触发组件正常生命周期方法，包括每个子组件的shouldComponentUpdate（）方法
 * forceUpdate就是重新render，有些变量不在state上，但是你又想达到这个变量更新的时候，触发render
 * 或者state里面某个变量层次太深，更新时候没有自动触发render，这些时候都可以手动调用forceUpdate方法触发更新
 * 
 * 重新渲染render会发生什么
 * 1:会对新旧的vnode进行对比，也就是ddom diff过程
 * 2:对新旧两颗树进行深度优先遍历，这样每个节点都有一个标记，到深度遍历时，每遍历到一个节点，就把该节点和
 * 新的节点树进行对比，如果有差异就放到一个对像里
 * 3:遍历差异对象，更具差异类型，对应规则更新vnode
 * 
 * vdom厉害的地方并不是比直接操作dom快，而是不管数据怎么变，都可以尽量以最小代价更新dom
 * 当dom树很大时，遍历两颗树进行各种比对还是很耗性能的，特别是顶层setstate一个微小修改，默认回去遍历整颗树
 * 尽管react使用高度优化的diff算法，但是整个过程仍然会损耗性能
 * 
 * 避免不必要渲染
 * 1:shouldComponentUpdate（）和PureComponent
 * 2:利用高阶组件  封装一个类似shouldComponentUpdate的方法，在函数组件中
 * 3:使用React。memo   react16.6的新的api，用来缓存组件渲染，避免不必要更新，只能用于函数组件
 * 4:合理拆分组件  以更轻更小粒度来纵向拆分整个应用，render粒度更加紧准，性能得到一定提神
 * 
 */
/**
 * react hooks开发中注意
 * 不要再循环 条件或者嵌套函数中调用hook，必须在react函数顶层使用hook
 * 使用usestate时候，使用push pop splice等直接更改数组对象的坑  函数组件中会有，class组件中没这问题
 * function Indicate（）{
 *      let [num, setNum] = useState([0,1,2])
 *      let test = () => {
 *          num.push(1)
 *          setNum(num) // 无法更新  使用num = [...num, 1]
 * }
 * }
 * usestate设置状态时候，只有第一次生效，后期需要更新状态，必须通过useEffect
 * 
 */