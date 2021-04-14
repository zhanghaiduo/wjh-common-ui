<template>
  <!-- 修改了el-input-number源码，去掉自动补零精度 -->
  <newElInputNumber
    ref="inputNumber"
    :value="value"
    v-bind="$attrs"
    :min="min"
    :max="max"
    :precision="precisionAttr"
    @keydown.enter.native="onEnter"
    v-on="$listeners"
    @change="onChange"
    @blur="onBlur"
  />

</template>

<script>
import newElInputNumber from './new-el-input-number'
const skuMeatureModeMap = {
  1: { key: 'WEIGHT', name: '计重', min: 0.01, precision: 2 },
  2: { key: 'PIECE', name: '计件', min: 1, precision: 0 }
}
const skuMeatureModeMin = (model) => {
  return skuMeatureModeMap[model] ? skuMeatureModeMap[model].min : undefined
}
export default {
  name: 'WjhInputNumber',
  components: {
    newElInputNumber
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  // 父组件传递过来的属性
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: 9999999
    },
    skuMeatureMode: {
      type: Number,
      default: 1
    },
    // 精度
    precision: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {

    }
  },
  computed: {
    minAttr() {
      return this.min !== undefined ? this.min : skuMeatureModeMin[this.skuMeatureMode]
    },
    // 计算精度， 有传precision 优先使用， 否则是
    precisionAttr() {
      return this.precision === undefined ? skuMeatureModeMap[this.skuMeatureMode] && skuMeatureModeMap[this.skuMeatureMode].precision : this.precision
    }
  },
  watch: {

  },
  methods: {
    // 获取焦点方法
    focus() {
      this.$refs.inputNumber.focus()
    },
    // 回车改值
    onEnter(e) {
      //  blur触发change事件
      e.target.blur(e)
      this.$emit('onChange', this.$refs.inputNumber.currentValue)
      this.$emit('enter', this.$refs.inputNumber.currentValue)
      // 空值聚焦
      if (this.$refs.inputNumber.currentValue === undefined) {
        e.target.focus()
      }
    },
    // 失去焦点事件
    onBlur(e) {
      this.$emit('onBlur', this.$refs.inputNumber.currentValue)
    },
    // change事件
    onChange(v) {
      this.$emit('onChange', v)
    }
  }
}
</script>
