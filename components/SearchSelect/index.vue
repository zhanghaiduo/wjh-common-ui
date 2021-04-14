<template>
  <div>
    <el-select
      v-model="selecteddata"
      :multiple="ismultiple"
      clearable
      filterable
      v-bind="$attrs"
      :disabled="isDisabled"
      :remote="remote"
      :size="sizeType"
      class="search-select"
      :placeholder="placeholderText"
      :remote-method="remoteMethod"
      @change="getSelectedData">
      <el-option
        v-for="item in options"
        :key="item.value"
        label-in-value
        :label="item.label"
        :value="item.value" />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'Searchlect',
  // 父组件传递过来的属性
  props: {
    // 提示信息
    placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    // 是否多选
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    // 下拉框大小
    size: {
      type: String,
      required: false,
      default: 'small'
    },
    // 默认值
    value: {
      type: [String, Array, Number],
      required: false,
      default: ''
    },
    // 是否远程请求数据
    remote: {
      type: Boolean,
      required: false,
      default: false
    },
    // options数据
    optionData: {
      type: Array,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    // 是否远程请求数据
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      selecteddata: this.value,
      placeholderText: this.placeholder,
      ismultiple: this.multiple,
      options: this.optionData,
      sizeType: this.size,
      isDisabled: this.disabled
    }
  },
  // 监控optionData值的变化，更新options
  watch: {
    optionData(val) {
      this.options = val
    },
    value(val) {
      this.selecteddata = val
    },
    disabled(val) {
      this.isDisabled = val
    }
  },
  methods: {
    // 获取选中的数据
    getSelectedData(value) {
      this.selecteddata = value
      // 获取选中文本信息
      let getName = ''
      if (!Array.isArray(value) && value !== '') {
        let selectData = {}
        selectData = this.options.find((item) => {
          return item.value === value
        })
        if (selectData) {
          getName = selectData.label
        }
      }
      // 子组件调用父组件方法
      this.$emit('getSelectedData', value, getName)
    },
    // 远程获取数据
    remoteMethod(query) {
      this.$emit('getList', query)
    }
  }
}
</script>
<style scoped>
  .search-select{
    width: 100%
  }
</style>
