<template>
  <wjhDialogBox
    ref="dialogBox"
    :dialog-data="dialogBoxData"
    @sub="dialogBoxSub"
  >
    <div class="flexBox">
      <div class="left leftBox">
        <wjhCustomForm
          ref="customForm"
          label-width="35px"
          :form-data="formData"
          @sub="formSub"
        >
          <div slot="slotBtn" class="slotBtn">
            <upload-excel
              v-if="noType==='ssuNo'"
              btn-type="text"
              btn-text="选择文件导入"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :show-loading="false"
              style="margin-right:10px;float:left"
            />
            <el-button class="minimal" @click="formResetClick">清空</el-button>
            <el-button
              :loading="formData.subLoading"
              type="primary"
              class="minimal"
              @click="formSubClick"
            >导入</el-button>
          </div>
        </wjhCustomForm>
      </div>
      <div class="right">
        <wjhContent>
          <vxe-table
            id="textImportTable"
            ref="tableBox"
            v-loading="tableData.loading"
            :edit-rules="tableData.rules"
            :cell-style="cellStyle"
            :custom-config="{ storage: true }"
            height="99%"
            :data="tableData.data"
            auto-resize
            border
            highlight-current-row
            highlight-hover-row
            resizable
            :mouse-config="{ selected: true }"
            :edit-config="{
              trigger: 'dblclick',
              mode: 'cell',
              autoClear: true,
              activeMethod,
            }"
            :keyboard-config="tableData.keyboardConfig"
            @keydown="keydown"
            @edit-closed="editClosedEvent"
          >
            <vxe-table-column
              v-for="(item, index) in tableData.title"
              :key="index"
              :field="item.field"
              :title="item.title"
              :width="item.width"
              :min-width="item.minWidth || '80'"
              :edit-render="item.editRender"
              :type="item.type"
            >
              <template v-if="item.field === 'ssuName'" v-slot:edit="{ row }">
                <el-select
                  ref="chooseGoods"
                  v-model="row.chooseGoods"
                  filterable
                  clearable
                  remote
                  placeholder="请搜索选择商品"
                  :remote-method="getSearchGoodsData"
                  size="mini"
                  style="width: 100%"
                  @change="goodsChange"
                >
                  <el-option
                    v-for="v in goodsData"
                    :key="v.value"
                    :label="v.label"
                    :value="v"
                  >
                    <span>{{ v.label }}</span>
                  </el-option>
                </el-select>
              </template>

              <template v-else slot-scope="scope">
                <span v-if="item.field === 'no'"> {{ noType==='ssuNo' ? scope.row['ssuNo'] : scope.row['skuNo'] }}</span>
                <span v-if="item.field === 'unit'"> {{ noType==='ssuNo' ? scope.row['orderUnit'] : scope.row['skuUnit'] }}</span>
                <!-- 送货数公斤 -->
                <span v-if="item.field === 'orderPreQtyKG'"> {{ scope.row.orderUnit === '斤' ? scope.row[item.field] : '-' }}</span>
                <!-- 本期报价（公斤） -->
                <span
                  v-else-if="scope.row[item.field] !== undefined && item.field ==='custPriceKG'"
                  :class="{warning:scope.row[item.field] !== undefined && scope.row[item.field] == 0 && validate.kgActive }"
                ><span
                  v-if="item.show$ && scope.row[item.field] !== undefined && scope.row.skuUnit === '斤' && scope.row[item.field] !=='-'"
                >￥</span>{{ scope.row.skuUnit !== '斤' ? '-' : formatPrice(scope.row[item.field])*1 }}</span>
                <!-- 导入名称拼规格 -->
                <span v-else-if="item.field === 'txtGoodsName'">{{ scope.row.txtGoodsName }}{{ scope.row.txtSpec }}</span>
                <span v-else>{{ scope.row[item.field] }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" width="60px">
              <template slot-scope="scope">
                <el-button
                  class="minimal"
                  type="text"
                  @click="removeClick(scope)"
                >
                  <i class="iconfont danger">&#xe608;</i>
                </el-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </wjhContent>
      </div>
    </div>
  </wjhDialogBox>
</template>

<script>
import { ChineseToNumber, chineseChar2englishChar, commonPrice, toDecimal, validatePrice } from '../../utils'
import UploadExcel from '../UploadExcel/index.vue'
export default {
  name: 'TextImport',
  components: {
    UploadExcel
  },
  props: {
    // 按照skuNo 还是 ssuNo查
    noType: {
      type: String,
      default: ''
    },
    //  相关搜索参数
    params: {
      type: Object,
      default: () => { }
    },
    //  相关校验参数
    validate: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 获取文本数据接口方法
    getTextFn: {
      type: Function,
      default: null
    },
    // 获取商品接口方法
    getGoodFn: {
      type: Function,
      default: null
    },
    // 输入框内提示
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 搜索商品列表
      goodsData: [],
      dialogBoxData: {
        // 宽度
        // width: '420px',
        // 标题
        title: '文本导入',
        // 弹框Loading
        dialogLoading: false,
        // 弹框提交Loading
        subLoading: false
      },
      // 表格相关数据
      tableData: {
        loading: false,
        keyboardConfig: { isArrow: true, isEnter: true, isTab: true, isEdit: true, Backspace: true, editMethod: this.editMethod },
        pageData: {
          limit: 20,
          currentPage: 1,
          total: 0,
          offset: 0,
          groupId: 0
        },
        title: [// 简单的表格建议循环出来,复杂自己写吧...
        ],
        data: [],
        rules: {
          custPrice: [
          // 报价多一位
            { validator: ({ cellValue, row }) => validatePrice({ cellValue, fixed: this.validate.fixed }) }
          ],
          custPriceKG: [
            { validator: ({ cellValue }) => validatePrice({ cellValue, fixed: this.validate.fixed, max: 19998 }) }
          ]
        }
      },
      // 表单数据
      formData: {
        subLoading: false,
        form: [
          {
            noLabel: true,
            value: 'text',
            type: 'input',
            attr: {
              type: 'textarea',
              autosize: { minRows: 20, maxRows: 20 }
            },
            default: '',
            placeholder: this.placeholder
          },
          {
            noLabel: true,
            slot: true,
            value: 'slotBtn'
          }
        ],
        // 表单验证规则
        rules: {
          text: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {

  },
  mounted() {
  },
  created() { },
  methods: {
    // 删除
    removeClick({ rowIndex }) {
      this.tableData.data.splice(rowIndex, 1)
      // 刷新索引
      this.tableData.data.forEach((v, i) => {
        v.seq = i + 1
        v.item = i + 1
      })
      console.log(rowIndex)
    },
    // 初始化列数
    initTitle() {
      const defaultTitle = [
        {
          title: '序号',
          field: 'seq',
          minWidth: 50
        },
        {
          title: '分公司商品编码',
          field: 'no',
          minWidth: 110
        },
        {
          title: '分公司商品名称',
          field: 'ssuName',
          minWidth: 120,
          editRender: {}
        },
        {
          title: '商品名称',
          field: 'txtGoodsName',
          minWidth: 70
        }, {
          title: '系统单位',
          field: 'unit',
          minWidth: 70
        }, {
          title: '规格',
          field: 'spec',
          minWidth: 50
        }

      ]
      const otherTitle = this.noType === 'ssuNo'
        ? [{
          title: '订货数',
          field: 'orderPreQty',
          minWidth: 80,
          editRender: { name: 'input' }
        }, {
          title: '订货数（公斤）',
          field: 'orderPreQtyKG',
          minWidth: 120,
          editRender: { name: 'input' }
        }, {
          title: '售价',
          field: 'importPrice',
          minWidth: 70
        }, {
          title: '单位',
          field: 'txtGoodsUnit',
          minWidth: 50
        }, {
          title: '备注',
          field: 'note',
          minWidth: 70,
          editRender: { name: 'input' }
        }]
        : [{
          title: '报价',
          field: 'custPrice',
          minWidth: 80,
          editRender: { name: 'input' }
        }, {
          title: '报价(公斤)',
          field: 'custPriceKG',
          minWidth: 100,
          editRender: { name: 'input' }
        }]
      this.tableData.title = [...defaultTitle, ...otherTitle]
    },
    goodsChange(val) {
      console.log(val)
    },
    // 编辑框激活的方法
    activeMethod({ row, column }) {
      this.editRow = JSON.parse(JSON.stringify(row))
      try {
        // 编辑的时候禁用方向键，以免出现跳屏BUG
        setTimeout(() => {
          if (this.$refs.chooseGoods) {
            this.$refs.chooseGoods[0].focus()
          }
        }, 50)
        // 开启公斤之后不允许斤编辑

        if (this.validate.kgActive) {
          if (column.property === 'orderPreQty' && row.orderUnit === '斤') {
            return false
          }
          if (column.property === 'orderPreQtyKG' && row.orderUnit !== '斤') {
            return false
          }
          if (column.property === 'custPrice' && row.skuUnit === '斤') {
            this.tableData.keyboardConfig.isArrow = false
            return false
          }
          if (column.property === 'custPriceKG' && row.skuUnit !== '斤') {
            this.tableData.keyboardConfig.isArrow = false
            return false
          }
        } else {
          if (column.property === 'custPriceKG' || column.property === 'orderPreQtyKG') {
            console.log(this.validate.kgActive)
            this.tableData.keyboardConfig.isArrow = false
            return false
          }
        }
        this.tableData.keyboardConfig.isArrow = false
        return true
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑框状态结束的方法
    async editClosedEvent({ row, column }) {
      if (row.chooseGoods) {
        const { ssuUnit, ssuId, ssuName, ssuNo, id, skuNo, skuUnit, spec } = row.chooseGoods.item
        row.orderUnit = ssuUnit
        row.skuUnit = skuUnit
        row.ssuId = ssuId
        row.ssuName = ssuName
        row.ssuNo = ssuNo
        row.skuNo = skuNo
        row.spec = spec
        row.id = id
      }
      console.log(row)

      switch (column.property) {
        case 'orderPreQtyKG':
          row.orderPreQty = (!row.orderPreQtyKG || isNaN(row.orderPreQtyKG)) ? '-' : toDecimal(row.orderPreQtyKG * 2, 2) * 1
          break
        case 'orderPreQty':
          row.orderPreQtyKG = (!row.orderPreQty || isNaN(row.orderPreQty)) ? '-' : toDecimal(row.orderPreQty / 2, 2) * 1
          break
        case 'custPrice':
          // 本期报价
          try {
            if (row.skuUnit === '斤') {
              await validatePrice({ cellValue: row.custPrice, fixed: this.validate.fixed, maxLastNum: [0, 5], returnMsg: true })
            } else {
              await validatePrice({ cellValue: row.custPrice, fixed: this.validate.fixed, returnMsg: true })
            }
            row.custPriceKG = this.formatPrice(row.custPrice * 2) * 1
          } catch (error) {
            setTimeout(() => {
              row.custPrice = this.editRow.custPrice
              row.custPriceKG = this.editRow.custPriceKG
            }, 50)
            this.$message.error(error)
          }
          break
        case 'custPriceKG':
          try {
            await validatePrice({ cellValue: row.custPriceKG, fixed: this.validate.fixed, max: 19998, returnMsg: true })
            row.custPrice = this.formatPrice(row.custPriceKG / 2, this.validate.fixed) * 1
          } catch (error) {
            setTimeout(() => {
              row.custPrice = this.editRow.custPrice
              row.custPriceKG = this.editRow.custPriceKG
            }, 50)
            this.$message.error(error)
          }
          break
        default:
          break
      }
      this.tableData.keyboardConfig.isArrow = true
    },
    formatPrice(val, fixed) {
      try {
        return val !== undefined && !isNaN(val) && toDecimal(val, fixed || this.validate.fixed) || val
      } catch (error) {
        console.log(error)
      }
    },
    // 列样式
    cellStyle({ $rowIndex, column, columnIndex, $columnIndex, row }) {
      if (this.noType === 'ssuNo') {
        if (column.property === 'ssuName' && (row.ssuName !== row.txtGoodsName || row.orderUnit !== row.txtGoodsUnit)) {
          return {
            background: '#FFDADA'
          }
        }
        switch (column.property) {
          case 'orderPreQty':
            return {
              color: !commonPrice({ cellValue: row.orderPreQty, fixed: 2 }) ? '#d11' : '#000',
              background: (this.validate.kgActive && row.orderUnit === '斤') ? '#F5F5F5' : '#fff'
            }
          case 'orderPreQtyKG':
            return {
              background: (this.validate.kgActive && row.orderUnit === '斤') ? '#fff' : '#F5F5F5'
            }
          default:
            break
        }
      } else {
        switch (column.property) {
          case 'ssuName':
            if (row.ssuName !== row.txtGoodsName) {
              return { background: '#FFDADA' }
            }
            break
          case 'custPrice':
            if (!commonPrice({ cellValue: row.custPrice, ...this.validate, fixed: this.validate.fixed, maxLastNum: (row.skuUnit === '斤' ? [0, 5] : []) })) {
              return {
                color: '#d11'
              }
            } else {
              return {
                color: (this.validate.kgActive && row.skuUnit === '斤') ? '#999' : '#000'
              }
            }
          case 'custPriceKG':
            return {
              color: (!this.validate.kgActive || this.validate.kgActive && row.skuUnit !== '斤') ? '#999' : '#000'
            }
          default:
            break
        }
      }
    },
    // 	当表格被激活且键盘被按下时会触发的事件
    async keydown({ $event }) {
      const codeList = ['Tab', 'Enter']
      if (codeList.includes($event.code)) {
        this.$refs.tableBox.clearActived()
      }
      setTimeout(() => {
        let { row } = this.$refs.tableBox.getActiveRecord() || {}
        // 设置高亮行
        row = row || (this.$refs.tableBox.getSelectedCell() || {}).row
        this.$refs.tableBox.setCurrentRow(row)
      }, 50)
    },
    // 弹框确定
    async dialogBoxSub() {
      try {
        if (!this.tableData.data.length) {
          return this.$message.error('无数据')
        }
        // 抛出表格数据
        this.$emit('sub', this.tableData.data)
      } catch (error) {
        this.$emit('subError')
        this.dialogBoxData.subLoading = false
        console.log(error)
      }
    },
    // 导入相关方法
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message.error('文件大小不能超过1M')
      return false
    },
    handleSuccess({ results, header }) {
      // 把解析的数据发送到后台
      // 数据转换
      let importList = []
      for (let i in results) {
        let r = results[i]
        let item = {}
        item.txtGoodsName = r['商品名称'] || r['菜品'] || r['品名'] || r['物品名称'] || ''
        item.txtSpec = r['规格'] || ''
        item.orderPreQty = r['数量'] || r['订货数'] || ''
        // 报价的话可能也要
        item.custPrice = r['数量'] || ''
        item.importPrice = r['单价'] || r['售价'] || ''
        item.importPrice = (isNaN(item.importPrice) || item.importPrice * 1 < 0) ? '' : item.importPrice
        item.note = r['备注'] || ''
        item.txtGoodsUnit = r['单位'] || ''
        importList.push(item)
      }
      this.formSub({}, importList)
    },
    // 导入按钮
    async formSub(form, importList) {
      try {
        if (!importList) {
          importList = this.resText(form.text)
        }
        if (!importList.length) {
          return this.$message.error('解析失败,请重新输入')
        }
        this.tableData.loading = true
        this.formData.subLoading = true
        this.tableData.data = []
        const resData = await this.getTextFn({ ...this.params, importList })
        this.tableData.data = resData.data.map((item, index) => {
          return {
            ...item,
            seq: index + 1,
            chooseGoods: null,
            // 兼容订单详情索引字段
            item: index + 1,
            custPriceKG: this.formatPrice(item.custPrice * 2) * 1,
            orderPreQtyKG: toDecimal((item.orderPreQty || 0) / 2, 2) * 1
          }
        })
        this.tableData.loading = false
        this.formData.subLoading = false
      } catch (error) {
        this.tableData.loading = false
        this.formData.subLoading = false
        console.log(error)
      }
    },
    formSubClick() {
      this.$refs.customForm.sub()
    },
    // 解析文本内容
    resText(val) {
      try {
        var str = val
        var strs = []
        var resultArr = []
        str = chineseChar2englishChar(str).replace(/,$/gi, '').replace(/。/g, ',')
        str = str.trim()
        strs = str.split(',')
        strs.forEach((value, index) => {
          var data = {}
          // 取备注 以括号内容
          let reg = /\((.*?)\)/g
          value = String(value)
          var arrs = value.match(reg)
          // 取备注
          if (arrs && arrs.length > 0) {
            data.note = arrs[arrs.length - 1].replace(/\s/g, '')
            value = value.replace(data.note, '')
          }
          // 取数字
          arrs = value.match(/[\d.]+/g)
          if (arrs && arrs.length > 0) {
            // 数字的话 订货数和报价都加上吧，就这两种情况，其他再说
            data.num = arrs[arrs.length - 1]
            // data.orderPreQty = arrs[arrs.length - 1]
            data.txtGoodsName = value.substring(0, value.lastIndexOf(data.num)).replace(/\s/g, '')
            if (this.noType !== 'ssuNo') {
              data.note && (data.txtGoodsName += data.note)
            }
          } else {
            let reg = /([\u4e00 \u4e8c \u4e09 \u56db \u4e94 \u516d \u4e03 \u516b \u4e5d \u5341 \u4e24 \u003b \uff1b \u000d\u000a]+)/g
            arrs = value.match(reg)
            if (arrs && arrs.length) {
              data.num = ChineseToNumber(arrs[arrs.length - 1])
              data.txtGoodsName = value.substring(0, value.lastIndexOf(arrs[arrs.length - 1])).replace(/\s/g, '')
              if (this.noType !== 'ssuNo') {
                data.note && (data.txtGoodsName += data.note)
              }
              arrs = value.split(arrs[arrs.length - 1])
              data.txtGoodsUnit = arrs[arrs.length - 1]
            }
            // console.log(arrs);
          }
          // 数字的话 订货数和报价都加上吧，就这两种情况，其他再说
          data.orderPreQty = data.num
          data.custPrice = data.num
          console.log(data.num)
          // 取订货单位
          arrs = value.split(/[\d.]+/g)
          if (arrs && arrs.length > 0 && !('txtGoodsUnit' in data) && arrs[arrs.length - 1]) {
            data.txtGoodsUnit = arrs[arrs.length - 1].replace(/\s/g, '')
          }
          // 取商品名
          if (JSON.stringify(data) !== '{}') {
            resultArr.push(data)
          }
        })
        return resultArr
      } catch (error) {
        console.log(error)
        this.$message.error('解析失败')
        return []
      }
    },
    formResetClick() {
      this.$refs.customForm.reset()
    },
    hide() {
      this.$refs.dialogBox.hide()
    },
    show() {
      this.initTitle()
      this.dialogBoxData.subLoading = false
      this.$refs.dialogBox.show()
      this.tableData.data = []
      this.$nextTick(() => {
        this.formResetClick()
      })
    },
    // 搜索商品
    async getSearchGoodsData(val) {
      const resData = await this.getGoodFn({ keyword: val, ...this.params })
      this.goodsData = resData.data.map(item => {
        return {
          value: this.noType === 'ssuNo' ? item.ssuId : item.id,
          label: `${item.ssuName}【${item.ssuSpec}/${item.ssuUnit}】`,
          item
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flexBox {
  height: 100%;
  display: flex;
  flex-direction: row;

  .left {
    width: 260px;
    height: 100%;
    margin-right: 5px;
    overflow: auto;
    .customForm {
      margin-top: 0;
    }
  }

  .right {
    flex: 1;
    flex-grow: 1;
    height: 100%;
    width: 1%;
  }
}
.slotBtn {
  text-align: right;
}
/deep/.el-input__inner{
  height: 24px;
  line-height: 24px;
}
</style>
