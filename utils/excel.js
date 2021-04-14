
const formatJson = (value, jsonData) => {
  return jsonData.map(v => value.map(j => v[j]))
}

export const exportExcel = (opt = {}) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async(reslove, reject) => {
    try {
      const {
        showValueTitle, // 是否显示value的英文title
        value, // value数组
        title, // 表头
        data, // 数据
        filename // 文件名
      } = opt
      const excel = await import('@/vendor/Export2Excel')
      const exportData = formatJson(value, data)
      let header = []
      if (showValueTitle) {
        header = value
        exportData.unshift(title)
      } else {
        header = title
      }
      excel.export_json_to_excel({
        header,
        data: exportData,
        filename
      })
      reslove()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}
