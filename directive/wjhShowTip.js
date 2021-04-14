const wjhShowTip = (Vue) => {
  Vue.directive('wjhShowTip', {
    bind(el, binding) {
      console.log(el)
      // console.log(el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'));
    },
    update(el) {
    },
    unbind(el) {

    }
  })
}
export default wjhShowTip
