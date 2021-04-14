
export * from './date'
export * from './chineseFormat'
import { KEYS } from '../constants/index.js'
/**
 * 常用辅助函数.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 解构路径参数
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 将一维数组转化为树形数组
 * @param {Array} data
 * @param {String} pidKey
 * @param {String} rootVal
 * @returns {Array}
 */
export function treeData(data, pidKey, rootVal = 0) {
  const parents = data.filter(
    value => value[pidKey] === rootVal || value[pidKey] == null
  )
  const children = data.filter(
    value => value[pidKey] !== rootVal && value[pidKey] != null
  )
  const translator = (parents, children) => {
    parents.forEach(parent => {
      children.forEach((current, index) => {
        if (current[pidKey].toString() === parent.id.toString()) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }

  translator(parents, children)

  return parents
}

/**
 * 检测字符串是否url
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isUrl(str) {
  return (/^(http|https):\/\/*/.test(str))
}

/**
 * 检测字符串是否邮箱
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isEmail(str) {
  return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str))
}

/**
 * 检测字符串是否身份证号码
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isIdCard(str) {
  return (/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str))
}

/**
 * 检测字符串是否手机号码
 * @param {string} str 需要检测的字符串
 * @returns {boolean}
 */
export function isPhoneNumber(str) {
  return (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str))
}

/**
 * 生成随机GUID
 * @return {string}
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  }).toUpperCase()
}

/**
 * 防抖函数
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */

export function debounce(method, delay = 20) {
  let timer = null
  return function() {
    const self = this
    const args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function() {
      method.apply(self, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param method 事件触发的操作
 * @param mustRunDelay 间隔多少毫秒需要触发一次事件
 */

export function throttle(method, mustRunDelay) {
  let timer
  const args = arguments
  let start
  return function loop() {
    const self = this
    const now = Date.now()
    if (!start) {
      start = now
    }
    if (timer) {
      clearTimeout(timer)
    }
    if (now - start >= mustRunDelay) {
      method.apply(self, args)
      start = now
    } else {
      timer = setTimeout(function() {
        loop.apply(self, args)
      }, 50)
    }
  }
}

/**
 * 遍历树数据节点，查找符合条件的节点
 * @param {Array|Object} data 数据树，如 {id:1, children:[{id:2}]}
 * @param {Boolean} isFindOne 是否只找最先符合条件的一个
 * @param {Function} fn 查找回调函数，回调参数：item 节点，index节点当前兄弟节点中的索引，data 查找的数据树，函数返回true表示符合条件
 * @param {string} [field=children] 子级字段名称
 * @returns {Array|Object} 查找结果，isFindOne为true时返回Object， false时返回Array
 */
export function traverse(data = [], isFindOne, fn, field = 'children') {
  let result = []
  data = Array.isArray(data) ? data : [data]
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    const checked = fn(item, i, data)
    const children = item[field]
    if (checked) {
      result.push(item)
      if (isFindOne) break
    }
    if (children) {
      const child = traverse(children, isFindOne, fn, field)
      if (child) result = result.concat(child)
    }
  }
  return isFindOne ? result[0] || null : result
}

/**
 * 获取日期
 * @param num
 * @param str
 * @returns {string}
 */
export function getDay(num, str) {
  var today = new Date()
  var nowTime = today.getTime()
  var ms = 24 * 3600 * 1000 * num
  today.setTime(parseInt(nowTime + ms))
  var oYear = today.getFullYear()
  var oMoth = (today.getMonth() + 1).toString()
  if (oMoth.length <= 1) oMoth = '0' + oMoth
  var oDay = today.getDate().toString()
  if (oDay.length <= 1) oDay = '0' + oDay
  return oYear + str + oMoth + str + oDay
}

// 格式化日期
export function dateFormat(date, format) {
  var map = {
    'YY': date.getYear(),
    'M': date.getMonth() + 1, // 月份
    'd': date.getDate(), // 日
    'h': date.getHours(), // 小时
    'm': date.getMinutes(), // 分
    's': date.getSeconds(), // 秒
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  format = format.replace(/([YMdhmsqS])+/g, function(all, t) {
    var v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'Y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })
  return format
}

// 格式化四舍五入小数点问题
export function toDecimal(number, precision) {
  let d = 1
  if (number < 0 & number > -1) {
    d = -1
  }
  const temp = number
  number = Number(number)
  // 判断是否为数字，不是数字抛出异常
  if (Number.isNaN(number)) {
    console.log('无效的数字:' + temp)
    throw new Error('无效的数字:' + temp)
  }
  number = String(number)
  const numbers = number.split('.')
  // 如果不是小数，补充对应的0
  if (numbers.length === 1) {
    return number + '.' + '0'.repeat(precision)
  } else {
    // 如果是小数 但位数比要保留的位数少 也是要补0
    if (numbers[1].length < precision) {
      return number + '0'.repeat(precision - numbers[1].length)
    } else {
      // 取整数部分
      let intNumber = parseInt(number.split('.')[0])
      // 取小数部分
      const decimal = number.split('.')[1]
      // 取出要保留的小数
      let frontDecimal = parseInt(decimal.substr(0, precision))
      // 去除要保留小数的后一位
      const lastDecimal = parseInt(decimal.substr(precision, 1))
      // 如果最后以为大于5 就进位
      if (lastDecimal >= 5) {
        frontDecimal += 1
      }
      // 判断小数部位是否需要进位 类似于19.996 保留2位小数 就是20.00
      if (frontDecimal === Math.pow(10, precision)) {
        frontDecimal = '0'.repeat(precision)
        intNumber += 1
      }
      // 处理 0.015 0.009 保留的小数中有0出现的情况
      frontDecimal = '0'.repeat(precision - String(frontDecimal).length) + frontDecimal
      let res = `${intNumber}.${frontDecimal}`
      if (res > 0 && d < 0) {
        res = '-' + res
      }
      return res
    }
  }
}

/**
 * 错误信息转换
 * @param {String} str
 * @returns {String}
 */

export function errCodeToStr(str = '') {
  let code = {
    '4': 'gateway网络异常',
    '5': 'gateWay服务器异常',
    '401': '请求要求身份验证。对于需要登录的网页，服务器可能返回此响应',
    '404': '服务器找不到请求的网页',
    '500': '服务器遇到错误，无法完成请求',
    '502': '服务器作为网关或代理，从上游服务器收到无效响应',
    '505': '服务器不支持请求中所用的HTTP协议版本',
    'timeout': '接口请求超时',
    'Network Error': '网络故障' }
  let errStr = str
  Object.keys(code).forEach((key) => {
    if (str.indexOf(key) >= 0) {
      errStr = code[key]
    }
  })
  return errStr
}
// 加价率验证
export const validatePriceScale = ({ cellValue }) => {
  return new Promise((resolve, reject) => {
    console.log('validatePriceScale-value:' + cellValue)
    if (cellValue !== '' && cellValue != null) {
      const reg = /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/
      if (!new RegExp(reg).test(cellValue) || cellValue * 1 > 9999 || cellValue * 1 < -9999) {
        reject(new Error('请输入数值，小数位最多2位'))
      } else {
        resolve()
      }
    } else {
      reject(new Error('请输入数值，小数位最多2位'))
    }
    resolve()
  })
}
/**
 * @param {Object} {} Object
 * @param {num} cellValue 校验的值
 * @param {num} fixed 保留多少位小数
 * @param {num} max 最大值
 * @param {num} min 最小值
 * @param {Array} maxLastNum 最大位小数的最后一位数字校验(例如斤公斤最大小数末尾为[0,5])
 * @param {boolean} returnMsg 是否reject返回的是字符串，catch提示用。 默认是返回错误，表格报红的错误。
 * @param {boolean} more 大于。
 * @param {boolean} less 小于。
 * @returns {Promise}
 * @description 的价格验证
  */
export const validatePrice = ({ cellValue, fixed = 2, max = 9999, min = 0, maxLastNum = [], returnMsg = false, more = false, less = false }) => {
  return new Promise((resolve, reject) => {
    console.log('validatePrice-value:' + cellValue, 'fixed' + fixed, 'maxLastNum' + maxLastNum, 'more' + more, 'less' + less)
    if (cellValue !== '' && cellValue != null) {
      const reg = new RegExp(`^\\d+(\\.\\d{0,${fixed}})?$`)
      if (!new RegExp(reg).test(cellValue) || (less ? cellValue * 1 >= max : cellValue * 1 > max) || (more ? cellValue * 1 <= min : cellValue * 1 < min)) {
        reject(returnMsg
          ? `请输入${more ? '大于' : ''}${min}${less ? '小于' : '到'}${max} ${fixed ? `，小数位最多${fixed}位` : '整数'}`
          : new Error(`请输入${more ? '大于' : ''}${min}${less ? '小于' : '到'}${max} ${fixed ? `，小数位最多${fixed}位` : '整数'}`)
        )
      } else {
        const str = (cellValue + '').split('.')[1]
        if (str && str.length === fixed) {
          const lastStr = str.charAt(str.length - 1) * 1
          if (maxLastNum.length && !maxLastNum.includes(lastStr)) {
            return reject(
              returnMsg
                ? `请输入${more ? '大于' : ''}${min}${less ? '小于' : '到'}${max} ${fixed ? `，小数位最多${fixed}位` : '整数'}，最大末位只能为${maxLastNum}`
                : new Error(`请输入${more ? '大于' : ''}${min}${less ? '小于' : '到'}${max} ${fixed ? `，小数位最多${fixed}位` : '整数'}，最大末位只能为${maxLastNum}`)
            )
          }
        }
        resolve()
      }
    } else {
      reject(
        returnMsg
          ? `请输入${more ? '大于' : ''}${min}${less ? '小于' : '到'}${max} ${fixed ? `，小数位最多${fixed}位` : '整数'}`
          : new Error(`请输入${more ? '大于' : ''}${min}${less ? '小于' : '到'}${max} ${fixed ? `，小数位最多${fixed}位` : '整数'}`)
      )
    }
    resolve()
  })
}
// // 同步价格验证
export const commonPrice = ({ cellValue, fixed = 2, max = 9999, min = 0, maxLastNum = [], more = false, less = false }) => {
  const reg = new RegExp(`^\\d+(\\.\\d{0,${fixed}})?$`)
  if (!new RegExp(reg).test(cellValue) || (less ? cellValue * 1 >= max : cellValue * 1 > max) || (more ? cellValue * 1 <= min : cellValue * 1 < min)) {
    return false
  }
  const str = (cellValue + '').split('.')[1]
  if (str && str.length === fixed) {
    const lastStr = str.charAt(str.length - 1) * 1
    if (maxLastNum.length && !maxLastNum.includes(lastStr)) {
      return false
    }
  }
  return true
}
// // 价格只校验数字和大小
// export const validatePriceNum = ({ cellValue, max }) => {
//   return new Promise((resolve, reject) => {
//     console.log('validatePriceNum-value:' + cellValue)
//     if (cellValue !== '' && cellValue != null) {
//       if (isNaN(cellValue) || cellValue * 1 > (max || 9999) || cellValue * 1 < 0) {
//         reject(new Error(`请输入0-${max || 9999}`))
//       } else {
//         resolve()
//       }
//     } else {
//       reject(new Error(`请输入0-${max || 9999}`))
//     }
//     resolve()
//   })
// }
// // 价格只校验数字和大小(公斤)
// export const validatePriceKG = ({ cellValue }) => {
//   return validatePriceNum({ cellValue, max: 19998 })
// }

// 百度统计代码
export const baiduInit = () => {
  debugger
  var _hmt = _hmt || []
  window._hmt = _hmt; // 必须把_hmt挂载到window下，否则找不到

  // 统计代码获取
  (function() {
    let key = getBaiduKey()
    var hm = document.createElement('script')
    hm.src = `https://hm.baidu.com/hm.js?${key}`
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  })()
}
// 通过域名获取百度统计key
export const getBaiduKey = () => {
  try {
    let host = window.location.host
    let key = ''
    KEYS.forEach(el => {
      if (el.host === host) {
        key = el.key
      }
    })
    return key
  } catch (error) {
    console.log(error)
  }
}

/**
 * @param {object} to 必填 路由信息
 * @param {object} referer_url 选填 来源页面域名
 * @description 对路由信息统计
  */
export const trackPageview = (to = {}, referer_url = '') => {
  try {
    // eslint-disable-next-line no-undef
    // if (_hmt) { // 百度统计
    //   if (to.path) {
    //     // eslint-disable-next-line no-undef
    //     _hmt.push(['_trackPageview', '/#' + to.path])
    //   }
    // }
    // eslint-disable-next-line no-undef
    if (_czc && process.env.NODE_ENV === 'production') { // 友盟统计
      if (to.path) {
        // eslint-disable-next-line no-undef
        _czc.push(['_trackPageview', '/' + to.path])
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// 友盟统计代码
export const umengInit = () => {
  var _czc = _czc || []
  window._czc = _czc;
  (function() {
    var el = document.createElement('script')
    el.type = 'text/javascript'
    el.charset = 'utf-8'
    el.async = true
    var ref = document.getElementsByTagName('script')[0]
    ref.parentNode.insertBefore(el, ref)
    el.src = 'https://v1.cnzz.com/z_stat.php?id=1279783901&web_id=1279783901'
  })()
}

