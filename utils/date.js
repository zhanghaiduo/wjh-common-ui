/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
export function formatDate(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

/**
 * 格式化毫秒数
 * @param {*} ms 毫秒数
 * @param {*} fmt 格式
 */
export function formatMs(ms, fmt) {
  if (!ms) {
    return ''
  }
  var msNum = typeof (ms) === 'number' ? ms : Number(ms)
  var date = new Date(msNum)
  return formatDate(date, fmt)
}

/**
 * 日期往前或者后调几天
 * @param {*} date 日期
 * @param {*} days 天数
 */
export function addDays(date, days) {
  date.setDate(date.getDate() + days)
  return date
}

/**
 * @returns {void}
 * @description 日期和时间范围的快捷选项
 */
export function pickerOptions() {
  const oneDay = 3600 * 1000 * 24
  return {
    shortcuts: [
      {
        text: '本月',
        onClick(picker) {
          const end = getCurrentMonthLast()
          const start = getCurrentMonthFirst()
          picker.$emit('pick', [start, end])
          function getCurrentMonthFirst() {
            var date = new Date()
            console.log(date)
            date.setDate(1)
            return date
          }
          // 获取当前月的最后一天
          function getCurrentMonthLast() {
            var date = new Date()
            var currentMonth = date.getMonth()
            var nextMonth = ++currentMonth
            var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
            var oneDay = 1000 * 60 * 60 * 24
            return new Date(nextMonthFirstDay - oneDay)
          }
        }
      },
      {
        text: '上月',
        onClick(picker) {
          const end = gettimeEnd()
          const start = gettimeStart()
          picker.$emit('pick', [start, end])
          function gettimeStart() {
            const nowdays = new Date()
            let year = nowdays.getFullYear()
            let month = nowdays.getMonth()
            if (month === 0) {
              month = 12
              year = year - 1
            }
            if (month < 10) {
              month = '0' + month
            }
            let firstDayOfPreMonth = year + '-' + month + '-' + '01'
            firstDayOfPreMonth = firstDayOfPreMonth.toString()
            return new Date(firstDayOfPreMonth)
          }
          function gettimeEnd() {
            const nowdays = new Date()
            let year = nowdays.getFullYear()
            let month = nowdays.getMonth()
            if (month === 0) {
              month = 12
              year = year - 1
            }
            if (month < 10) {
              month = '0' + month
            }
            const lastDay = new Date(year, month, 0)
            let lastDayOfPreMonth = year + '-' + month + '-' + lastDay.getDate()
            lastDayOfPreMonth = lastDayOfPreMonth.toString()
            return new Date(lastDayOfPreMonth)
          }
        }
      },
      {
        text: '今天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime())
          end.setTime(end.getTime())
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '昨天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - oneDay)
          end.setTime(end.getTime() - oneDay)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近7天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - oneDay * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近30天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - oneDay * 30)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近90天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - oneDay * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  }
}
