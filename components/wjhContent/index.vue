<template>
  <div class="wjhContent">
    <!--  slot name="searchBox" 搜索searchBox插槽 -->
    <slot name="searchBox" />
    <!--  wjhContentBox 容器,里面花里胡哨的是继承slot props等 -->
    <wjhContentBox v-bind="$attrs" is-content-child>
      <slot v-for="(_, name) in $slots" :slot="name" :name="name" />
      <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </wjhContentBox>
  </div>
</template>

<script>
import wjhContentBox from '../wjhContentBox'
export default {
  name: 'WjhContent',
  components: {
    wjhContentBox
  },
  inheritAttrs: false,
  props: {
  },
  data() {
    return {}
  },
  mounted() {
    console.log(this.$scopedSlots)
    console.log(this.$slots)
  },
  created() { },
  methods: {}
}
</script>

<style lang="scss" scoped>
// @import 'wjh-common/styles/config.scss'; // 配置样式
</style>
