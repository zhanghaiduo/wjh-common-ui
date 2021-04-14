
// 引入组件
import componentsInit from './components'
// 引入原型方法
import prototypeFnInit from './prototypeFn'
// 引入指令
import directiveInit from './directive'
// 导入mixin
import * as mixinObj from './mixin'
// 友盟统计代码
import { umengInit } from './utils'
export const mixin = mixinObj

// 组件
export * from './components'
const obj = {
  install: (Vue) => {
    componentsInit(Vue)
    prototypeFnInit(Vue)
    directiveInit(Vue)
    umengInit()
  }
}

export default obj
