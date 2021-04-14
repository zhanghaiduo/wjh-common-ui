/** 重置message，防止重复点击重复弹出message弹框 */
import {
  Message
} from 'element-ui'
let messageInstance = null
let mainMessage = function DoneMessage(options) {
  // 如果弹窗已存在先关闭
  if (messageInstance) {
    messageInstance.close()
  }
  // 全局加上关闭按钮
  if (typeof options === 'string') {
    options = {
      message: options,
      showClose: true,
      type: 'info'
    }
  }
  // 全局加上关闭按钮
  if (typeof options === 'object') {
    options.showClose = true
  }
  messageInstance = Message(options)
}
let arr = ['success', 'warning', 'info', 'error']
arr.forEach(function(type) {
  mainMessage[type] = function(options) {
    if (typeof options === 'string') {
      options = {
        message: options,
        showClose: true
      }
    }
    options.type = type
    return mainMessage(options)
  }
})
export const message = mainMessage
