var chnNumChar = {
  零: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9
}

var chnNameValue = {
  十: {
    value: 10,
    secUnit: false
  },
  百: {
    value: 100,
    secUnit: false
  },
  千: {
    value: 1000,
    secUnit: false
  },
  万: {
    value: 10000,
    secUnit: true
  },
  亿: {
    value: 100000000,
    secUnit: true
  }
}

export function ChineseToNumber(chnStr) {
  var rtn = 0
  var section = 0
  var number = 0
  var secUnit = false
  var str = chnStr.split('')
  for (var i = 0; i < str.length; i++) {
    var num = chnNumChar[str[i]]
    if (typeof num !== 'undefined') {
      number = num
      if (i === str.length - 1) {
        section += number
      }
    } else {
      var unit = chnNameValue[str[i]].value
      secUnit = chnNameValue[str[i]].secUnit
      if (secUnit) {
        section = (section + number) * unit
        rtn += section
        section = 0
      } else {
        section += (number * unit)
      }
      number = 0
    }
  }
  if (chnStr.length === 2 && chnStr.indexOf('十') === 0) {
    return 10 + section
  }
  if (chnStr.length === 1 && chnStr.indexOf('十') === 0) {
    return 10
  }
  return rtn + section
}

/**
 * 将中号文符号转换成英文符
 */
export function chineseChar2englishChar(chineseChar) {
  // 将单引号‘’都转换成'，将双引号“”都转换成"
  var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, '"')
  // 将中括号【】转换成[]，将大括号｛｝转换成{} （） 转()
  str = str.replace(/\【/g, '[').replace(/\】/g, ']').replace(/\｛/g, '{').replace(/\｝/g, '}').replace(/\（/g, '(').replace(/\）/g, ')')
  // 将逗号，转换成,，将：转换成:
  str = str.replace(/，/g, ',').replace(/：/g, ':')
  // 将逗号，转换成,，将：转换成:
  str = str.replace(/；/g, ',').replace(/;/g, ',')
  // 将↵转换成,，将：转换成:
  str = str.replace(/\n/g, ',')
  return str
}
