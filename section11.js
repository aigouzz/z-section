/**
 * react diff和vue2 vue3 diff
 * reactdiff
 * 先循环新vnode，设定lastindex=0；然后循环oldvnode，   
 * 如果newvnode[i].key == oldvnode[j].key
 *  if（j《lastindex） parent.insertBefore(newvnode[i].el, newvnode[i-1].el),把新节点对应的dom节点
 *  插入到新节点前一个节点对应dom节点的后面
 *  如果j>=lastindex   lastindex = j;相当于新旧节点对应的dom节点顺序一致，可以先不用处理
 * 如果没有找到，那么newvnode[i]对应dom节点直接插入到前一个newvnode对应dom节点后面，如果时第一个，那就插入到
 *  旧节点第一个对应dom元素前面
 * 最后循环旧节点，如果在新节点中没有找到该纠结点的key，那么这个旧节点对应的dom节点应该删除
 * 
 * vue2
 * 头和头对比，一致的话就startindex++，不一致走下面
 * 尾和尾对比，一致的话就endindex--，不一致走下面
 * 旧节点的头和新节点的尾对比，一致的话就把旧节点头对应的dom节点移到旧节点尾对应dom后面，不一致走下面
 * 旧节点尾和新节点头对比，一致的话就把旧节点尾对应的dom节点移动到旧节点头对应的dom前面，不一致的话走下面
 * 新节点第一个节点和旧节点循环对比，如果找到了相对应的虚拟节点，移动这个对应的vnode的dom节点移动到旧节点开头
 *  旧节点改成undefined，newstartindex++
 *  如果没有找到对应虚拟节点，直接建立一个新的节点放在旧列表第一个vnode对应的dom节点前面
 * oldendindex < oldstartindex但是新节点中还有节点，此时创建新的节点全部插入到oldstarindex对应的dom
 *  节点前面
 * newendindex < newstartindex,而旧虚拟节点还有节点，那么就把oldvnode中对应的dom节点删除即可
 * 
 * vue3 diff--最长递增子序列
 * 
 * 
 */
/**
 * react vdom diff
 * @param {@param} prevChildren 
 * @param {@param} nextChildren 
 * @param {@param} parent 
 */
 function reactdiff(prevChildren, nextChildren, parent) {
    let prevIndexMap = {},
      nextIndexMap = {};
    for (let i = 0; i < prevChildren.length; i++) {
      let { key } = prevChildren[i]
      //保存旧列表key和指引i的关系
      prevIndexMap[key] = i
    }
    let lastIndex = 0;
    for (let i = 0; i < nextChildren.length; i++) {
      let nextChild = nextChildren[i],
        nextKey = nextChild.key,
        // 经过新列表的key获得旧列表的指引
        j = prevIndexMap[nextKey];
  
      //保存新列表key和指引i的关系
      nextIndexMap[nextKey] = i
      
      if (j === undefined) {
      //添加节点
        let refNode = i === 0
                      ? prevChildren[0].el
                      : nextChildren[i - 1].el.nextSibling;
        mount(nextChild, parent, refNode)
      } else {
        patch(prevChildren[j], nextChild, parent)
        if (j < lastIndex) {
        //移动节点：移动到前一个节点的后面
          let refNode = nextChildren[i - 1].el.nextSibling;
          parent.insertBefore(nextChild.el, refNode)
        } else {
         // 不须要移动节点，记录当前位置，与以后的节点进行对比
          lastIndex = j
        }
      }
    }
  
  //删除节点
    for (let i = 0; i < prevChildren.length; i++) {
      let { key } = prevChildren[i]
      if (!nextIndexMap.hasOwnProperty(key)) parent.removeChild(prevChildren[i].el)
    }
  }
  /*
  vue3 diff
  */
 {
    function vue3diff() {

    }
    function patchVnode() {
      if (j > prevEnd && j <= nextEnd) {
        // ...插入到j对应的dom节点后面
      } else if (j > nextEnd && j <= prevEnd) {
        // ...删除旧节点对应的dom节点
      } else {
        let prevStart = j,
        nextStart = j,
        nextLeft = nextEnd - nextStart + 1,
        source = new Array(nextLeft).fill(-1),
        nextIndexMap = {},
        move = false,
        patched = 0;
        for(let i = nextStart;i < nextLeft;i ++) {
            let key = nextChildren[i].key;
            nextIndexMap[key]= i;
        }
        for(let i = prevStart;i < prevEnd + 1;i ++) {
            let prevNode = prevChildren[i],
            prevKey = prevNode.key,
            nextIndex = nextIndexMap[prevKey];
            if(nextIndex == undefined || patched >= nextLeft) {
                parent.removeChild(prevNode.el);
                continue;
            }
            let nextNode = nextChildren[nextIndex];
            patch(prevNode, nextNode, parent);
            source[nextIndex - nextStart] = i;
            patched ++;

            if(nextIndex < lastIndex) {
              move = false; // 递增方法，判断是否需要移动
            } else {
              lastIndex = nextIndex;
            }
        }
        if(move) {
          //需要移动
          const seq = lis(source); // source中递增元素位置
          let j = seq.length - 1; //最长子序列的指针
          for(let i = nextLeft - 1;i >= 0;i --) {
            let pos = nextStart + i,
            nextNode = nextChildren[pos],
            nextPos = pos + 1,
            refNode = nextPos >= nextChildren.length ? null : nextChildren[nextPos].el,
            cur = source[i]; //当前source的值，用来判断是否移动
            if(cur === -1) {
              mount(nextNode, parent, refNode); //状况1，该节点是全新节点
            } else if(cur === seq[j]) {
              //状况2 是递增子序列，该节点不需要移动
              j --;
            } else {
              //状况3 不是递增子序列，该节点需要移动
              parent.insertBefore(nextNode.el, refNode);
            }
          }
        } else {
          // 不需要移动:只需要判断是否有全新的节点【在source中对应的值就是-1】，给他添加进去
          for(let i = nextLeft - 1; i >= 0;i --) {
            let cur = source[i];
            if(cur === -1) {
              let pos = nextStart + i,
              nextNode = nextChildren[pos],
              nextPos = pos +1,
              refNode = nextPos >= nextChildren.length ? null : nextChildren[nextPos].el;
              mount(nextNode, parent, refNode);
            }
          }
        }
      }
    }
 }
 {
    // async function fn1() {
    //   console.log('async fn1');
    //   return Promise.resolve(1).then((data) => {
    //     console.log('async fn1 then', data);
    //     return 'then end';
    //   });
    // }
    function fn1() {
      return new Promise((resolve,reject) => {
        console.log('async fn1');
        resolve();
      }).then(() => {
        return Promise.resolve(1).then((data) => {
          console.log('async fn1 then', data);
          return 'then end';
        })
      });
    }
    async function fn2() {
      console.log('async fn2 start')
      let fn = await fn1();
      console.log(fn)
      console.log('async fn2 end');
    }
    fn2();
 }