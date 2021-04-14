// 引入组件
import Card from './Card' // 测试卡片
import wjhLayout from './wjhLayout'// 通用layout
import wjhCustomForm from './wjhCustomForm'// 自定义表单
import wjhSearchBox from './wjhSearchBox'// 通用搜索头
import wjhDialogBox from './wjhDialogBox'// 通用弹框，默认赠送form表单
import wjhPrintSets from './wjhPrintSets' // 新版打印机
import wjhQrCode from './wjhQrCode' // 二维码轮训组件
import wjhContent from './wjhContent' // 新完整布局
import wjhContentBox from './wjhContentBox' // 新容器布局
// import wjhTextImport from './wjhTextImport' // 文本导入   只有订单使用改动太频繁，已提取到项目中
import wjhOrderSearchGoods from './wjhOrderSearchGoods' // 订单的搜索商品
import wjhInputNumber from './wjhInputNumber' // 二次封装InputNumber
import wjhEmpty from './wjhEmpty' // 表格空数据显示的图片
import wjhMenu from './wjhMenu/leftMenu/leftMenu.vue'
import wjhEditor from './wjhEditor'
import wjhDrawer from './wjhDrawer'
import wjhDateSelect from './wjhDateSelect'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'

import ClassSelect from './ClassSelect'
import Pagination from './Pagination'

import SearchSelect from './SearchSelect'
import SizeSelect from './SizeSelect'

import Sticky from './Sticky'

import SvgIcon from './SvgIcon'

import Upload from './Upload'
import UploadExcel from './UploadExcel'
const init = (Vue) => {
  Vue.component('Card', Card)
  Vue.component('wjhLayout', wjhLayout)
  Vue.component('wjhCustomForm', wjhCustomForm)
  Vue.component('wjhSearchBox', wjhSearchBox)
  Vue.component('wjhDialogBox', wjhDialogBox)
  Vue.component('wjhPrintSets', wjhPrintSets)
  Vue.component('wjhQrCode', wjhQrCode)
  Vue.component('wjhContent', wjhContent)
  Vue.component('wjhContentBox', wjhContentBox)
  // Vue.component('wjhTextImport', wjhTextImport)
  Vue.component('wjhOrderSearchGoods', wjhOrderSearchGoods)
  Vue.component('wjhInputNumber', wjhInputNumber)
  Vue.component('wjhEmpty', wjhEmpty)
  Vue.component('wjhMenu', wjhMenu)
  Vue.component('wjhEditor', wjhEditor)
  Vue.component('wjhDrawer', wjhDrawer)
  Vue.component('wjhDateSelect', wjhDateSelect)

  Vue.component('Breadcrumb', Breadcrumb)
  Vue.component('Hamburger', Hamburger)

  Vue.component('ClassSelect', ClassSelect)
  Vue.component('Pagination', Pagination)
  Vue.component('SearchSelect', SearchSelect)
  Vue.component('SizeSelect', SizeSelect)
  Vue.component('Sticky', Sticky)
  Vue.component('SvgIcon', SvgIcon)
  Vue.component('Upload', Upload)
  Vue.component('UploadExcel', UploadExcel)
}
export default init

export {
  Card,
  wjhLayout,
  wjhCustomForm,
  wjhSearchBox,
  wjhDialogBox,
  wjhPrintSets,
  wjhQrCode,
  wjhContent,
  wjhContentBox,
  // wjhTextImport,
  wjhOrderSearchGoods,
  wjhInputNumber,
  wjhEmpty,
  wjhMenu,
  wjhEditor,
  wjhDrawer,
  wjhDateSelect,

  Breadcrumb,
  ClassSelect,
  Hamburger,
  Pagination,
  SearchSelect,
  SizeSelect,
  Sticky,
  SvgIcon,
  Upload,
  UploadExcel
}
