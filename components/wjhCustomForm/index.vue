<template>
  <section class="customForm">
    <slot name="header" />
    <!-- 表单 -->
    <el-form
      ref="form"
      :size="formData.size || size"
      :inline="formData.inline"
      :model="form"
      :rules="formData.rules"
      :label-width="labelLine ? '0px' : labelWidth"
      :class="{ labelLine: labelLine }"
      @submit.native.prevent
    >
      <!-- 拖拽容器 -->
      <Draggable v-model="formList" :disabled="!formData.draggable" @end="dragEnd">
        <el-col
          v-for="(item, index, key) in formData.form"
          :key="key"
          :span="item.span || commonSpan || formData.commonSpan "
        >
          <el-form-item
            v-if="!item.hide"
            :prop="item.value"
            :label="item.label"
            :class="{ noLabel: item.noLabel }"
          >
            <template v-if="!item.slot">
              <!-- 只是展示 -->

              <span
                v-if="item.type === 'show'"
                :style="`font-size:${item.fontSize || 12}px`"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :disabled="isShowTooltip"
                  :content="form[item.value]"
                  placement="top"
                >
                  <div class="overFlow" @mouseover="tipMouseOver(item.value)">
                    <span :ref="item.value">{{ form[item.value] }}</span>
                  </div>
                </el-tooltip>
              </span>
              <!-- 只是展示 end -->
              <!-- 如果写了component组件名，则是自定义组件，需要支持v-model双向绑定写法的组件 -->
              <component
                :is="item.component"
                v-if="item.type === 'component'"
                v-model="form[item.value]"
                :name="item.component"
                v-bind="item.attr"
                v-on="item.event"
                @keydown.enter.native="item.event&&item.event.enter ? item.event.enter(form[item.value], $event) : null"
              />
              <el-input
                v-if="item.type === 'input'"
                v-model.trim="form[item.value]"
                v-bind="item.attr"
                :style="`width:${item.width}`"
                :disabled="disabled || item.disabled"
                :type="item.attr ? item.attr.type : null"
                :maxlength="item.attr ? item.attr.maxlength : null"
                :autosize="item.attr ? item.attr.autosize : null"
                :rows="item.attr ? item.attr.rows : null"
                :show-word-limit="item.attr ? item.attr.showWordLimit : null"
                :clearable="item.attr ? item.attr.clearable : true"
                :readonly="item.readonly"
                :placeholder="item.placeholder ? item.placeholder : '请输入'"
                v-on="item.event"
                @change="
                  item.onChange ? item.onChange(form[item.value], $event) : null
                "
                @blur="item.onBlur ? item.onBlur(form[item.value], $event) : null"
                @keyup.enter.native="
                  item.onEnter ? item.onEnter(form[item.value], $event) : null
                "
              >
                <span
                  v-if="item.attr && item.attr.suffix"
                  slot="suffix"
                  class="slot"
                  v-html="item.attr && item.attr.suffix"
                />
                <span
                  v-if="item.attr && item.attr.prefix"
                  slot="prefix"
                  class="slot"
                  v-html="item.attr && item.attr.prefix"
                />
              </el-input>
              <!-- input end -->
              <!-- radio -->
              <el-radio-group
                v-if="item.type === 'radio'"
                v-model="form[item.value]"
                class="radioBox"
                :disabled="disabled || item.disabled"
                :clearable="item.attr ? item.attr.clearable : true"
                :placeholder="item.placeholder ? item.placeholder : '请选择'"
                @change="item.onChange ? item.onChange(form[item.value]) : null"
              >
                <el-radio
                  v-for="{ label, value, disabled } in item.options ||
                    formData[`${item.value}Options`]"
                  :key="value"
                  :disabled="disabled"
                  :label="value"
                >{{ label }}</el-radio>
              </el-radio-group>
              <!-- radio end -->
              <!-- select -->
              <el-select
                v-if="item.type === 'select'"
                v-model="form[item.value]"
                :filter-method="item.filterMethod && item.filterMethod"
                :remote="item.remote && item.remote"
                :style="`width:${item.width}`"
                :disabled="disabled || item.disabled"
                :multiple="item.multiple || item.attr ? item.attr.multiple : null"
                :filterable="
                  (item.filterable && item.filterable) ||
                    (item.attr ? item.attr.filterable : true)
                "
                :loading="item.loading"
                :clearable="item.attr ? item.attr.clearable : true"
                :placeholder="item.placeholder ? item.placeholder : '请选择'"
                :remote-method="item.remoteMethod"
                :collapse-tags="item.attr ? item.attr.collapseTags : false"
                @blur="item.onBlur ? item.onBlur(form[item.value], $event) : null"
                @change="
                  item.onChange ? item.onChange(form[item.value], $event) : null
                "
                @keyup.enter.native="
                  item.onEnter ? item.onEnter(form[item.value], $event) : null
                "
                @visible-change="
                  (v) => item.onVisibleChange && item.onVisibleChange(v)
                "
              >
                <span v-if="item.attr && item.attr.group">
                  <el-option-group
                    v-for="{ label, value, disabled, options } in item.options"
                    :key="value"
                    :label="label"
                    :disabled="disabled"
                  >
                    <el-option
                      v-for="{ label, value, disabled } in options ||
                        formData[`${item.value}Options`]"
                      :key="value"
                      :label="label"
                      :value="value"
                      :disabled="disabled"
                    />
                  </el-option-group>
                </span>
                <span v-else>
                  <el-option
                    v-for="{ label, value, disabled } in item.options ||
                      formData[`${item.value}Options`]"
                    :key="value"
                    :label="label"
                    :value="value"
                    :disabled="disabled"
                  />
                </span>
              </el-select>
              <!-- select end -->
              <!-- checkbox -->
              <el-checkbox-group
                v-if="item.type === 'checkbox'"
                v-model="form[item.value]"
                :disabled="disabled || item.disabled"
                :loading="item.loading"
                @change="item.onChange ? item.onChange(form[item.value]) : null"
              >
                <el-checkbox
                  v-for="{ label, value } in item.options ||
                    formData[`${item.value}Options`]"
                  :key="value"
                  :label="value"
                >{{ label }}</el-checkbox>
              </el-checkbox-group>

              <!-- <el-checkbox v-if="item.type === 'checkbox'" v-model="form[item.value]">{{ item.label }}</el-checkbox> -->
              <!-- checkbox end -->
              <!-- date -->
              <el-date-picker
                v-if="item.type === 'date'"
                v-model="form[item.value]"
                :value-format="
                  (item.attr && item.attr.valueFormat) || 'timestamp'
                "
                :style="`width:${item.width}`"
                :disabled="disabled || item.disabled"
                :clearable="item.attr ? item.attr.clearable : true"
                :type="(item.attr && item.attr.type) || 'date'"
                :start-placeholder="item.startPlaceholder || '开始日期'"
                :end-placeholder="item.endPlaceholder || '结束日期'"
                :placeholder="item.placeholder || '请选择日期'"
                :picker-options="item.attr&&item.attr.pickerOptions ? item.attr.pickerOptions() : item.attr&&item.attr.type === 'daterange' ? pickerOptions() : null "
                :default-time="
                  item.attr && item.attr.type ? ['00:00:00', '23:59:59'] : null
                "
                @change="item.onChange ? item.onChange(form[item.value]) : null"
              />
              <!-- data end -->
              <!-- editor -->
              <qx-editor
                v-if="item.type === 'editor'"
                v-model="form[item.value]"
              />
              <!-- editor end -->
              <slot :name="`${item.value}Tip`" :form="form" />
            </template>
            <slot :name="item.value" :form="form" />
          </el-form-item>
        </el-col>
      </Draggable>
      <slot name="btnFront" />
      <!-- 按钮 -->
      <el-col
        v-if="formData.showSubBtn"
        :span="
          commonSpan || formData.commonSpan || (formData.showSubBtn ? 4 : 0)
        "
        class="pull-left"
      >
        <el-form-item prop="btn" label class="noLabel">
          <p
            class="btnLine"
            :class="{ subBtnLine: subBtnLine || formData.subBtnLine }"
          >
            <el-button
              :size="formData.size || size"
              class="sub"
              :loading="formData.subLoading"
              :type="formData.btnType ? formData.btnType : 'primary'"
              @click.native="sub"
            >{{ formData.btnWord ? formData.btnWord : '确认' }}</el-button>
            <slot name="moreBtn" />
          </p>
        </el-form-item>
      </el-col>
      <!-- 按钮 end -->
      <slot name="footer" />
    </el-form>
  </section>
</template>

<script>
import Draggable from 'vuedraggable'
import { pickerOptions } from '../../utils'
export default {
  name: 'CustomForm',
  components: {
    Draggable
  },
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    commonSpan: {
      type: Number,
      default: null
    },
    formData: {
      type: Object,
      // 用于生成表单的模板数据
      default: () => null
    },
    labelWidth: {
      type: String,
      // label宽度
      default: '80px'
    },
    disabled: {
      type: Boolean,
      // 是否禁用
      default: false
    },
    labelLine: {
      // label是否独占一行
      type: Boolean,
      default: null
    },
    subBtnLine: {
      // 提交按钮是否独占一行
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      pickerOptions,
      form: this.defaultForm(),
      isShowTooltip: false,
      formList: []
    }
  },
  computed: {
  },
  watch: {
    // 解决类似搜索框更多，操作form数组改变后默认值没绑定上输入不了的BUG
    'formData.form': {
      handler(newVal, objVal) {
        this.form = { ...this.defaultForm(), ...this.getVal() }
        this.formList = newVal
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // 拖拽结束，抛出formList给父组件
    dragEnd() {
      // 清除校验,否则存在残留校验BUG
      this.$refs.form.clearValidate()
      this.$emit('dragEnd', this.formList)
    },
    /**
     * @param {String} el ref
     * @contentription 判断是否开启tooltip功能
     */
    tipMouseOver(el) {
      try {
        let parentWidth = this.$refs[el][0].parentNode.offsetWidth
        let contentWidth = this.$refs[el][0].offsetWidth
        this.isShowTooltip = parentWidth > contentWidth
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * @returns {void}
     * @contentription 返回默认值的form值
     */
    defaultForm() {
      const FORM = {}
      this.formData.form.map((item) => {
        FORM[item.value] = item['default']
      })
      return FORM
    },
    /**
     * @param {String} data 文件地址拼接
     * @returns {void}
     * @contentription 文件组件数据回显
     */
    handleFileList(data) {
      if (!data) {
        return []
      }
      const RESULT = []
      data.map((url) => {
        const tmpl = url.split('/')
        const name = tmpl[tmpl.length - 1]
        RESULT.push({
          name,
          url
        })
        return null
      })
      return RESULT
    },

    /**
     * @param {String} tar 要赋值的对象
     * @param {String} url 文件地址
     * @returns {void}
     * @contentription 图片移除处理
     */
    uploadRemove(tar, url) {
      const index = this.form[tar].indexOf(url)
      this.form[tar].splice(index, 1)
    },

    /**
     * @param {String} tar 要赋值的对象
     * @param {String} arrUrl 文件地址数组
     * @returns {void}
     * @contentription 文件上传成功之后把地址保存起来
     */
    uploadSuccess(tar, arrUrl) {
      arrUrl.forEach((url) => {
        this.form[tar].push(url)
      })
    },

    /**
     * @returns {void}
     * @description 重置表单数据，并出发sub方法
     */
    reset() {
      if (this.form.originData) {
        this.form.originData = null
      }
      // 解决类似搜索框更多，操作form数组改变后默认值没绑定上输入不了的BUG
      this.form = this.defaultForm()
      this.$refs.form.resetFields() // 重置表单数据
      this.setVal('id', null)
      return this.getVal()
    },

    /**
     * @param {String} tar 要获取的对象
     * @returns {Object} 返回要获取的对象
     * @description 获取表单里的值
     */
    getVal(tar) {
      if (tar === 'form' || !tar) {
        return this.form
      } else {
        return this.form[tar]
      }
    },

    /**
     * @param {String} tar 设置的对象
     * @param {Object} val 设置的值
     * @returns {void}
     * @description 设置表单数据
     */
    setVal(tar, val) {
      if (tar === 'form') {
        this.form = JSON.parse(JSON.stringify(val))
        this.$refs.form.clearValidate()
      } else {
        this.form[tar] = val
        this.$refs.form.clearValidate(tar) // 重置表单校验红框
      }
    },
    /**
     * @returns {void}
     * @description 单独提供表单校验方法，实际sub也能带校验功能
     */
    async validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log('success validate')
            resolve(JSON.parse(JSON.stringify(this.form)))
          } else {
            reject('error submit!!')
          }
        })
      })
    },
    /**
     * @returns {void}
     * @description 点击了提交按钮，验证表单数据，通过则提交
     */
    async sub() {
      let res = null
      await this.validForm({
        form: this.$refs.form,
        success: () => {
          const FORM = JSON.parse(JSON.stringify(this.form))
          res = FORM
          this.$emit('sub', FORM)
        }
      })
      return res
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .is-disabled .el-input__inner {
  color: #000;
}
/deep/ .el-range-editor.is-disabled input {
  color: #000 !important;
}
/deep/ .el-date-editor {
  width: 100%;
}
.radioBox {
  margin-bottom: 10px;
  margin-left: 10px;
  // margin-left: -10px;
  .el-radio.is-bordered {
    margin-left: 10px;
    margin-right: 10px;
    min-width: 110px;
  }
  .el-radio {
    margin-top: 1px;
  }
}
/deep/ .el-select {
  width: 100%;
}
.labelLine {
  /deep/ .el-form-item__label {
    min-width: 200px;
    text-align: left;
  }
}
.btnLine {
  display: inline;
  // margin-top: 16px;
  margin: 0;
}
.subBtnLine {
  /deep/ .el-button {
    width: 100%;
  }
}
.uploadIsMax {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
.customForm{
  margin-top: 4px;
}
.customForm > .el-form > .el-form-item {
  display: none;
}
.noLabel {
  /deep/.el-form-item__content {
    margin-left: 0 !important;
    // height: 28px;
  }

  /deep/ .el-checkbox {
    font-size: 12px;
    color: #000;
    font-weight: normal;
    margin-right: 0;
    margin-left: 20px;
    /deep/ .el-checkbox__inner {
      margin-bottom: 4px;
    }
    /deep/ .el-checkbox__label {
      font-size: 12px;
    }
  }
}
// 禁止多选框自动撑开
/deep/ .el-cascader__tags {
  display: inline-block !important;
  max-width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 10px;
}
// 禁止多选框自动撑开
/deep/ .el-select__tags {
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .el-select__input {
    font-size: 12px;
  }
  .el-tag--mini {
    height: 14px;
    line-height: 14px;
  }
}
/deep/ .el-tag:nth-child(1) {
  max-width: calc(100% - 26px);
}
/deep/ .el-select__tags > span {
  display: flex;
  // max-width: calc(100% - 16px);
}
/deep/ .el-tag__close {
  display: none;
}
.overFlow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/deep/ .el-rate {
    line-height: 1.7;
}
</style>
