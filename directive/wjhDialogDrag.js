const wjhDialogDrag = (Vue) => {
  /*
   *  使用方法
   *  注册指令
   *  给elementUI的dialog上加上 v-wjhDialogDrag 指令就可以实现弹窗的全屏和拖拽了。
   */

  // v-wjhDialogDrag: 弹窗拖拽+水平方向伸缩

  Vue.directive('wjhDialogDrag', {

    bind(el, binding, vnode, oldVnode) {
      // 获取弹框头部dom（这部分可双击全屏）
      const dialogHeaderEl = el.querySelector('.el-dialog__header')
      // 弹窗dom
      const dragDom = el.querySelector('.el-dialog')
      // 初始默认宽高和位置
      let defaultHeight = 0
      let defaultWidth = 0
      let defaultX = 0
      let defaultY = 0
      // body宽高
      // let bodyClientWidth = 0
      // let bodyClientHeight = 0
      // 弹框可拉伸最小宽高
      // let minWidth = 400
      // let minHeight = 300
      // 初始非全屏
      let isFullScreen = false
      // 当前宽高
      // let nowWidth = 0;
      // let nowHeight = 0;
      // 当前顶部高度
      // let nowMarginTop = 0;
      // 给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
      // dragDom.style.overflow = "auto";
      // 清除选择头部文字效果
      // dialogHeaderEl.onselectstart = new Function("return false");
      // 头部加上可拖动cursor
      dialogHeaderEl.style.cursor = 'move'
      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
      let moveDown = (e) => {
        // wjh弹框默认居中，所以拖拽的时候把默认居中样式清除，并附上xy坐标
        const {
          x,
          y,
          height,
          width
        } = el.childNodes[0].getBoundingClientRect()
        // bodyClientWidth = document.body.clientWidth
        // bodyClientHeight = document.body.clientHeight
        // 设置默认宽高
        defaultWidth = width
        defaultHeight = height
        defaultX = x
        defaultY = y
        dragDom.style.left = `${x}px`
        dragDom.style.top = `${y}px`
        if (dragDom.style.transform !== 'none') {
          dragDom.style.transform = `none`
          dialogHeaderEl.style.userSelect = 'none'
        }
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop
        // 获取到的值带px 正则匹配替换
        let styL, styT
        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
        } else {
          styL = +sty.left.replace(/\px/g, '')
          styT = +sty.top.replace(/\px/g, '')
        }

        document.onmousemove = function(e) {
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX
          const t = e.clientY - disY
          const styleLeft = l + styL
          const styleTop = t + styT
          // 移动当前元素
          dragDom.style.left = `${styleLeft < 0 ? 0
            //  : (styleLeft + defaultWidth) > bodyClientWidth ? bodyClientWidth < defaultWidth ? 0
            //  : bodyClientWidth - defaultWidth
            : styleLeft}px`
          dragDom.style.top = `${styleTop < 0 ? 0
            //  :  (styleTop + defaultHeight) > bodyClientHeight  ? bodyClientHeight < defaultHeight ? 0
            //  : bodyClientHeight - defaultHeight
            : styleTop}px`

          // 将此时的位置传出去
          // binding.value({x:e.pageX,y:e.pageY})
        }
        document.onmouseup = function(e) {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
      dialogHeaderEl.onmousedown = moveDown
      // 双击头部全屏效果
      dialogHeaderEl.ondblclick = (e) => {
        if (isFullScreen === false) {
          dragDom.style.maxHeight = '100%'
          dragDom.style.maxWidth = '100%'
          // nowHeight = dragDom.clientHeight;
          // nowWidth = dragDom.clientWidth;
          // nowMarginTop = dragDom.style.marginTop;
          dragDom.style.left = 0
          dragDom.style.top = 0
          dragDom.style.height = '100VH'
          dragDom.style.width = '100VW'
          // dragDom.style.marginTop = 0;
          isFullScreen = true
          dialogHeaderEl.style.cursor = 'initial'
          dialogHeaderEl.onmousedown = null
        } else {
          dragDom.style.width = `${defaultWidth}px`
          dragDom.style.height = `${defaultHeight}px`
          dragDom.style.left = `${defaultX}px`
          dragDom.style.top = `${defaultY}px`
          // dragDom.style.marginTop = nowMarginTop;
          isFullScreen = false
          dialogHeaderEl.style.cursor = 'move'
          dialogHeaderEl.onmousedown = moveDown
        }
      }
      // dragDom.onmousemove = function (e) {
      //   let moveE = e;
      //   if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {
      //     dragDom.style.cursor = 'w-resize';
      //   } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {
      //     dragDom.style.cursor = 's-resize';
      //   } else {
      //     dragDom.style.cursor = 'default';
      //     dragDom.onmousedown = null;
      //   }
      //   dragDom.onmousedown = (e) => {
      //     const clientX = e.clientX;
      //     const clientY = e.clientY;
      //     let elW = dragDom.clientWidth;
      //     let elH = dragDom.clientHeight;
      //     let EloffsetLeft = dragDom.offsetLeft;
      //     let EloffsetTop = dragDom.offsetTop;
      //     dragDom.style.userSelect = 'none';
      //     let ELscrollTop = el.scrollTop;
      //     //判断点击的位置是不是为头部
      //     if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {
      //       //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
      //     } else {
      //       document.onmousemove = function (e) {
      //         e.preventDefault(); // 移动时禁用默认事件
      //         //左侧鼠标拖拽位置
      //         if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
      //           //往左拖拽
      //           if (clientX > e.clientX) {
      //             dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
      //           }
      //           //往右拖拽
      //           if (clientX < e.clientX) {
      //             if (dragDom.clientWidth < minWidth) {} else {
      //               dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';
      //             }
      //           }
      //         }
      //         //右侧鼠标拖拽位置
      //         if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
      //           //往左拖拽
      //           if (clientX > e.clientX) {
      //             if (dragDom.clientWidth < minWidth) {} else {
      //               dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
      //             }
      //           }
      //           //往右拖拽
      //           if (clientX < e.clientX) {
      //             dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
      //           }
      //         }
      //         //底部鼠标拖拽位置
      //         if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
      //           //往上拖拽
      //           if (clientY > e.clientY) {
      //             if (dragDom.clientHeight < minHeight) {} else {
      //               dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px';
      //             }
      //           }
      //           //往下拖拽
      //           if (clientY < e.clientY) {
      //             dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px';
      //           }
      //         }
      //       };
      //       //拉伸结束
      //       document.onmouseup = function (e) {
      //         document.onmousemove = null;
      //         document.onmouseup = null;
      //       };
      //     }
      //   }
      // }
    },
    update(el, binding, vnode, oldVnode) {
      // console.log('update',el, binding, vnode, oldVnode)
    }
  })
}
export default wjhDialogDrag
