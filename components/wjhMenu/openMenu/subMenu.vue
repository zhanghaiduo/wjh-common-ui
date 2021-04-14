<template>
  <el-submenu :index="data.value.toString()">
    <template slot="title">
      <img v-if="data.icon" :src="data.icon">
      <span v-else>
        <i class="iconfont open">&#xe620;</i>
        <i class="iconfont close">&#xe61f;</i>
      </span>
      <span>{{ data.label }}</span>
    </template>
    <template v-for="(item,index) in data.children">
      <sub-menu
        v-if="item.children && item.children.length>0"
        :key="item.value+index"
        :theme="theme"
        :data="item"
        @handleSelect="handleSelect"
      />
      <el-menu-item v-else :key="item.value" :index="item.value.toString()" @click.native="handleSelect(item,data,'2')">
        <span class="cLabel">
          {{ item.label }}
        </span>
      </el-menu-item>
    </template>
  </el-submenu>
</template>
<script>
export default {
  name: 'SubMenu',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    data: [Array, Object],
    textCenter: {
      // 文本是否居中
      type: Boolean,
      default: false
    },
    theme: { // 菜单主题
      type: String,
      default: ''
    }
  },
  methods: {
    handleSelect(item, parentData, isItem) {
      // 子应用抛出来的路由拼起来
      const newItem = { ...{}, ...item }
      // if (isItem) {
      //   newItem.url = `${parentData.url}/${newItem.url}`
      // }
      this.$emit('handleSelect', newItem, parentData)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../styles/config.scss';
/deep/ .el-menu-item{
    padding-left: 68px !important
}
// 折叠起来加减号
/deep/ .el-submenu__title{
  .close{
    display: none;
  }
}
/deep/ .is-opened{
  // .el-submenu__icon-arrow{
  //   display: none !important
  // }
  &>.el-submenu__title>span>.open{
    display: none;
  }
  &>.el-submenu__title>span>.close{
    display: inline;
  }
}
.iconfont {
  font-size: 14px;
  padding-left: 3px ;
  margin-right: 16px;
}
.el-menu-item {
  padding: 0;
}
.subitem {
  font-size: 14px;
  padding-left: 98px !important;
}
.dark.subitem.is-active span {
  color: #fff;
}
.subitem.is-active span {
  color: $primary;
}
img {
  height: 24px;
  width: 24px;
  margin-right: 10px;
  position: relative;
  top: -1px;
  opacity: .65;
}
// .logoActive {
//   display: none;
// }
.is-active {
  // & > img {
  //   display: none;
  // }
  // & > .logoActive {
  //   display: inline;
  // }
}
.cLabel{
  padding-left:20px
}
</style>
