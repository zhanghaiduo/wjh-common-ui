<template>
  <div class="box">
    <span v-if="type === undefined">
      <img :src="noSearch">
      <p>请您输入条件后查询</p>
    </span>
    <span v-else>
      <img :src="noData">
      <p>暂无更多数据哦</p>
    </span>
  </div>

</template>

<script>
export default {
  name: 'WjhEmpty',
  props: {
    // 显示类型，默认没值代表未查询
    type: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      noData: require('../../assets/noData.png'),
      noSearch: require('../../assets/noSearch.png')
    }
  },
  mounted() {
  },
  created() { },
  methods: {}
}
</script>

<style lang="scss" scoped>
// @import 'wjh-common/styles/config.scss'; // 配置样式
.box{
  color:#9093A0;
  user-select:none;
  img{
    width:200px
  }
}
</style>
