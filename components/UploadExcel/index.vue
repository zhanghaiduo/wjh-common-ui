<template>
  <div class="excel-upload-div">
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div v-if="drag" class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      将文件拖拽此区域,仅支持上载.xlsx，.xls，.csv后缀文件
      <el-button :loading="loading" style="margin-left:8px;" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>
    <div v-else class="excel-upload-div" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <el-button v-if="showLoading" :loading="loading" size="mini" :type="btnType" @click="handleUpload">
        {{ btnText }}
      </el-button>
      <el-button v-else size="mini" :type="btnType" @click="handleUpload">
        {{ btnText }}
      </el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
/*
*使用说明：https://panjiachen.gitee.io/vue-element-admin-site/zh/feature/component/excel.html
*/
export default {
  props: {
    btnText: {
      type: String,
      default: '导入'
    },
    showLoading: {
      type: Boolean,
      default: true
    },
    btnType: {
      type: String,
      default: 'primary'
    },
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function,// eslint-disable-line
    drag: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
      console.log(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('只支持上传一个文件!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('仅支持上载.xlsx，.xls，.csv后缀文件 ')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          // const results = XLSX.utils.sheet_to_json(worksheet)
          // 原本导入数字例如2.100出现2.099999精度问题，现改成导入字符串
          // 文档地址 https://docs.sheetjs.com/#json
          const results = XLSX.utils.sheet_to_json(worksheet, { raw: false })
          // 导入成字符串后去掉前后空格
          results.forEach(v => {
            Object.keys(v).forEach(k => {
              v[k] = this.trim(v[k])
            })
          })
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    // 去左右空格;
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, '')
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* 从第一排开始 */
      for (C = range.s.c; C <= range.e.c; ++C) { /* 循环遍历每一列  */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* 在第一行中查找单元格 */
        let hdr = 'UNKNOWN ' + C // <-- 替换为所需的默认值
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-div{
  display: inline;
}
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 700px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
