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
 * 善用useCallback
 * 父组件传递给子组件事件句柄时，如果我们没有任何参数变动可能选用useMemo，但是每一次父组件渲染子组件即使
 * 没有变化也会跟着渲染一次
 * 
 * 不要滥用useContext
 * 可以使用机遇useContext封装的状态管理工具
 */
// 一、实现useState
const { render } = require("react-dom");
let memoriedStates = [];
let lastIndex = 0;
function useState(initialState) {
    memoriedStates[lastIndex] = memoriedStates[lastIndex] || initialState;
    function setState(newState) {
        memoriedStates[lastIndex] = newState;
        // 状态更新完毕，调用render函数。重新更新视图
        render();
    }
    // 返回最新状态和更新函数，注意index要前进
    return [memoriedStates[lastIndex++], setState];
}

// 二、实现useEffect
let lastDendencies; // 存放依赖项的数组
function useEffect(callback, dependencies) {
    if (lastDendencies) {
        // 判断传入的依赖项是不是都没有变化，只要有以一项改变，就需要执行callback
        const isChange = dependencies && dependencies.some((dep, index) => dep !== lastDendencies[index]);
        if (isChange) {
            // 一开始没有值，需要更新一次(相当于componentDidMount)
            typeof callback === 'function' && callback();
            // 更新依赖项
            lastDendencies = dependencies;
        }
    } else {
        // 一开始没有值，需要更新一次(相当于componentDidMount)
        typeof callback === 'function' && callback();
        // 更新依赖项
        lastDendencies = dependencies;
    }
}

// 三、实现useCallback
let lastCallback; // 最新的回调函数
let lastCallbackDependencies = []; // 回调函数的依赖项
function useCallback(callback, dependencies = []) {
    if (lastCallback) {
        const isChange = dependencies && dependencies.some((dep, index) = dep !== lastCallbackDependencies[index]);
        if (isChange) {
            // 只要有一个依赖项改变了，就更新回调(重新创建)
            lastCallback = callback;
            lastCallbackDependencies = dependencies;
        }
    } else {
        lastCallback = callback;
        lastCallbackDependencies = dependencies;
    }
    // 最后需要返回最新的函数
    return lastCallback;
}

// 四、实现useRef
let lastRef;
function useRef(initialValue = null){
    
    lastRef = lastRef != undefined ? lastRef : initialValue;
    // 本质上就是返回一个对象，对象种有一个current属性，值为初始化传入的值，如果没有传入初始值，则默认为null
    return {
        current: lastRef
    }
}

// 五、实现useContext
function useContext(context){
    // 很简单，就是返回context的_currentValue值
    return context._currentValue;
}

// 六、实现useReducer
let lastState;
function useReducer(reducer, initialState){
    lastState = lastState !== undefined ? lastState : initialState;
    // dispatch一个action，内部就是自动调用reducer来计算新的值返回
    function dispatch(action){
        lastState = reducer(lastState, action);
        // 更新完毕后，需要重新渲染视图
        render();
    }
    // 最后返回一个的状态值和派发action的方法
    return [lastState, dispatch];
}
