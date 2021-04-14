<template>
  <wjhDialogBox ref="printDialog" :dialog-data="dialogData" @sub="dialogSub">
    <div slot="tips" class="success">
      以下设置纸张参数的单位为 厘米
    </div>
  </wjhDialogBox>
</template>

<script>
import wjhDialogBox from '../wjhDialogBox'
import $ from 'jquery'
export default {
  name: 'PrintSets',
  components: {
    wjhDialogBox
  },
  props: {
    // 本地缓存key值
    paperSetPrefix: {
      type: String,
      default: 'paperSetData'
    },
    // 默认纸张
    defaultPaper: {
      type: Number,
      default: 0
    }
  },
  data() {
    const paperSetData = {
        value: 1,
        paperData: [
          { value: 0, label: 'A4-纵向', paperWidth: 21, paperHeight: 29.7, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: true },
          { value: 1, label: '送货单-纵向', paperWidth: 24.1, paperHeight: 27.94, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: true },
          { value: 2, label: 'A4-横向', paperWidth: 29.7, paperHeight: 21, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: true },
          { value: 3, label: '送货单-横向', paperWidth: 27.94, paperHeight: 24.1, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: true },
          { value: 4, label: '1/2送货单-横向', paperWidth: 24.1, paperHeight: 13.97, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: true },
          { value: 5, label: '自定义', paperWidth: 24.1, paperHeight: 27.94, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: false },
          { value: 6, label: 'A5-纵向', paperWidth: 21, paperHeight: 14.8, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: true },
          { value: 7, label: '1/2送货单-纵向', paperWidth: 13.97, paperHeight: 24.1, topMargin: '', leftMargin: '', rightMargin: '', bottomMargin: '', paperSetReadonly: true }
        ]
      }
    return {
      // 传过来的弹窗值
      dialogSet: {

      },
      paperSetData,
      // 弹框表单数据
      dialogData: {
        // 宽度
        width: '600px',
        // 标题
        title: '纸张设置',
        // 弹框Loading
        dialogLoading: false,
        // 弹框提交Loading
        subLoading: false,
        // 是否自定义底部,如需要自定义则 slot="customFooter"
        customFooter: false,
        // 如果有form则有一套模板，优先使用，不需要的话自己写 slot="customBody"
        form: [
          {
            label: '纸张设置',
            value: 'value',
            type: 'select',
            placeholder: '请选择',
            options: [],
            default: 3,
            span: 24,
            onChange: this.loadSelectPaperForm
          },
           {
            label: '',
            value: 'tips',
            slot: true,
            span: 24
          },
          {
            label: '纸张宽度',
            value: 'paperWidth',
            type: 'input',
            placeholder: '请输入纸张宽度',
            span: 12
          },
          {
            label: '纸张高度',
            value: 'paperHeight',
            type: 'input',
            placeholder: '请输入纸张高度',
            span: 12
          },
          {
            label: '左侧边距',
            value: 'leftMargin',
            type: 'input',
            placeholder: '请输入左侧边距',
            span: 12
          },
          {
            label: '顶部边距',
            value: 'topMargin',
            type: 'input',
            placeholder: '请输入顶部边距',
            span: 12
          },
          {
            label: '右侧边距',
            value: 'rightMargin',
            type: 'input',
            placeholder: '请输入右侧边距',
            span: 12
          },
          {
            label: '底部边距',
            value: 'bottomMargin',
            type: 'input',
            placeholder: '请输入底部边距',
            span: 12
          }

        ],
        rules: { // 表单验证规则
          value: [{ required: true, message: '请选择纸张', trigger: 'change' }],
          paperWidth: [{ required: true, message: '纸张宽度不能为空', trigger: 'blur' }],
          paperHeight: [{ required: true, message: '纸张高度不能为空', trigger: 'blur' }]
        }
      }

    }
  },
  methods: {
    show(item = {}) {
      this.dialogSet = item
      this.loadSelectPaperForm()
    },
    // 根据纸张选择的值，导入相应的Form属性数据
    loadSelectPaperForm(selectValue) {
      var selectOptions = this.getPaperSelectOptions()
      var selectData = selectOptions[typeof selectValue !== 'undefined' ? selectValue : this.getPaperSelectValue()]
      this.dialogData.form.forEach(item => {
         item.options = item.value === 'value' ? selectOptions : []
         item.disabled = selectData.paperSetReadonly && (item.value === 'paperWidth' || item.value === 'paperHeight')
      })
      this.$refs.printDialog.show('form', selectData)
    },
    // 获取页面选项
    getPaperSelectOptions() {
      var dataSet = this.getPaperDataSet()
      var result = dataSet.paperData || this.paperSetData.paperData
      return result
    },
    // 获取纸张选择的值
    getPaperSelectValue() {
      var dataSet = this.getPaperDataSet()
      return typeof dataSet.value !== 'undefined' ? dataSet.value : (this.paperSetData.value || this.defaultPaper)
    },
    // 重置
    onRest() {
      localStorage.removeItem(this.paperSetPrefix)
      localStorage.setItem(this.paperSetPrefix, JSON.stringify(this.paperSetData))
    },
    // 获取纸张宽度
    getPaperWith() {
      var scale = 27.94
      var dataSet = this.getPaperDataSet()
      var jugResult = dataSet.paperData && dataSet.paperData[dataSet.value] && dataSet.paperData[dataSet.value].paperWidth
      scale = jugResult ? dataSet.paperData[dataSet.value].paperWidth : this.paperSetData.paperData[this.defaultPaper].paperWidth
      return parseFloat(scale * 10).toFixed(1)
    },
    // 获取纸张高度
    getPaperHeight() {
      var scale = 24.1
      var dataSet = this.getPaperDataSet()
      var jugResult = dataSet.paperData && dataSet.paperData[dataSet.value] && dataSet.paperData[dataSet.value].paperHeight
      scale = jugResult ? dataSet.paperData[dataSet.value].paperHeight : this.paperSetData.paperData[this.defaultPaper].paperHeight
      return parseFloat(scale * 10).toFixed(1)
    },
    // 获取顶部边距
    getTopMargin() {
      var dataSet = this.getPaperDataSet()
      var scale = dataSet.paperData && dataSet.paperData[dataSet.value] && dataSet.paperData[dataSet.value].topMargin || ''
      return scale === '' ? scale : parseFloat(Number(scale) * 10).toFixed(1)
    },
    // 获取右侧边距
    getRightMargin() {
      var dataSet = this.getPaperDataSet()
      var scale = dataSet.paperData && dataSet.paperData[dataSet.value] && dataSet.paperData[dataSet.value].rightMargin || ''
      return scale === '' ? scale : parseFloat(Number(scale) * 10).toFixed(1)
    },
    // 获取左侧边距
    getLeftMargin() {
      var dataSet = this.getPaperDataSet()
      var scale = dataSet.paperData && dataSet.paperData[dataSet.value] && dataSet.paperData[dataSet.value].leftMargin || ''
      return scale === '' ? scale : parseFloat(Number(scale) * 10).toFixed(1)
    },
    // 获取底部边距
    getBottomMargin() {
      var dataSet = this.getPaperDataSet()
      var scale = dataSet.paperData && dataSet.paperData[dataSet.value] && dataSet.paperData[dataSet.value].bottomMargin || ''
      return scale === '' ? scale : parseFloat(Number(scale) * 10).toFixed(1)
    },
    // 获取本地设置
    getLocalStoreageDataSet() {
        var localStorageSetString = localStorage.getItem(this.paperSetPrefix) || '{}'
        var reg = new RegExp('disabled', 'g')
        return JSON.parse(localStorageSetString.replace(reg, 'paperSetReadonly'))
    },
    getPaperDataSet() {
        var dataSet = this.getLocalStoreageDataSet()
        var arr = Object.keys(dataSet)
        if (arr.length === 0) {
          this.paperSetData.value = this.defaultPaper
          return this.paperSetData
        }
        return dataSet
    },
    // 检查是否在打印程序中运行
    checkBrowser() {
      if (typeof webBrowser !== 'undefined') {
          return true
      }
      var version = this.getVersion()
      if (version) {
        return true
      }
      this.$message({
          message: '请使用专用打印程序进行打印！',
          type: 'warning'
        })
       return false
    },
    getVersion() {
      var version = ''
				$.ajax({
					url: 'http://localhost:' + 1688 + '/getVersion',
					dataType: 'json',
					type: 'POST',
					async:false,
					data:"",
					success: function (res) {
						version= res.data.version
						console.log('success......'+version)
					},
					error: function () {
						console.log('error......')
						version= ''
					}
				})
				return version
    },
    getReportSet(templateFileName,preShow,setShow){
      var reportSet = {}
      reportSet.width = this.getPaperWith()
      reportSet.height = this.getPaperHeight()
      reportSet.topMargin = this.getTopMargin()
      reportSet.leftMargin = this.getLeftMargin()
      reportSet.rightMargin = this.getRightMargin()
      reportSet.bottomMargin = this.getBottomMargin()
      reportSet.name = templateFileName
      reportSet.settingShow = 0
      if (setShow && setShow === '1') {
        reportSet.settingShow = 1
      }
      if (preShow) {
        reportSet.show = preShow
      } else {
        reportSet.settingShow = 0
      }
      return reportSet
    },
   // 打印 传入参数：{模板类型、打印数据、是否预览}
    printData({templateFileName, data ,preShow,setShow}) {
      // 拼接打印数据
      var printData = {}
      // 拼接打印设置
      printData.report = this.getReportSet(templateFileName,preShow,setShow)
      printData.data = data
      console.log(printData)
      // 执行打印
     return this.printMulLev(printData)
    },
    //标签打印时调用，纸张等信息集成在打印数据中
    printMulLev(printData){
      // 执行打印
      if (typeof webBrowser !== 'undefined') {
         // eslint-disable-next-line no-undef
         return webBrowser.printMulLev(JSON.stringify(printData))
      }
      return this.printToLocalServer(printData,'printData')
    },
    showPrintErrorMsg(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      })
    },
    // 批量打印不同模板 reportData 格式： [{templateFileName:'',data:[master:[],detail:[]]}...]
    batchPrintData({reportData ,preShow,setShow}){
      var reportSet = this.getReportSet('',preShow,setShow)
      var printDataArray=[]
      //遍历
      for(var i = 0; i < reportData.length; i++){
          var tempReportset = JSON.parse(JSON.stringify(reportSet))
          tempReportset.name = reportData[i].templateFileName
          reportData[i].report= tempReportset
          printDataArray.push(reportData[i])
      }
      console.log(printDataArray)
      if (typeof webBrowser !== 'undefined') {        
        return webBrowser.batchPrintMainDtl(JSON.stringify(printDataArray))
      }
      return this.printToLocalServer(printDataArray,'batchPrintData')
    },
    // 保存设置
    dialogSub(form) {
      if ((form.topMargin * 1 + form.bottomMargin * 1 > form.paperHeight * 1) || (form.leftMargin * 1 + form.rightMargin * 1 > form.paperWidth * 1)) {
         this.$message({
          message: '间距不能大于宽高！',
          type: 'error'
        })
        return
      }
      var localPaperSetData = this.getPaperDataSet()
      localPaperSetData.value = form.value
      localPaperSetData.paperData[form.value].topMargin = form.topMargin
      localPaperSetData.paperData[form.value].leftMargin = form.leftMargin
      localPaperSetData.paperData[form.value].rightMargin = form.rightMargin
      localPaperSetData.paperData[form.value].bottomMargin = form.bottomMargin
      if (!localPaperSetData.paperData[form.value].disabled) {
        localPaperSetData.paperData[form.value].paperWidth = form.paperWidth
        localPaperSetData.paperData[form.value].paperHeight = form.paperHeight
      }
      localStorage.setItem(this.paperSetPrefix, JSON.stringify(localPaperSetData))
      this.$refs.printDialog.hide()
    },
    printToLocalServer(printData,url){
      var printResult=''
      var that=this;
      $.ajax({
        url: 'http://localhost:'+1688+'/'+url,
        dataType: 'json',
        timeout: 300000,
        type: 'POST',
        async:false,
        data:JSON.stringify(printData),
        success: function (res) {
          if(res.code===-1){
            that.showPrintErrorMsg(res.msg)
            return
          }
          printResult=res.data.printResult
          console.log('success......')
        },
        error: function () {
          console.log('error......');
          printResult= '-1'
          that.showPrintErrorMsg("打印超时，请检查程序是否正常运行！")
        }
      })
      return printResult
    }
  }
}
</script>

<style scoped lang="scss"></style>
