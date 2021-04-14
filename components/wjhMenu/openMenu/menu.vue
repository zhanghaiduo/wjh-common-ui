<template>
  <section
    class="menuBox"
    :class="theme"
  >
    <el-menu
      v-if="menu && menu.length !==0"
      ref="menu"
      :unique-opened="true"
      :default-active="activeMenu || vuexActiveMenu || menuActive"
      :mode="mode"
      :menu-trigger="menuTrigger"
    >
      <template v-for="item in menu">
        <template v-if="!(item.hide && item.hide())">
          <el-menu-item
            v-if="!item.children || item.children.length===0"
            ref="item.value"
            :key="item.value"
            :class="{textCenter}"
            :index="item.value"
            @click.native="handleSelect(item)"
          >
            <!-- <i v-if="item.icon" class="iconfont" v-html="item.icon" /> -->
            <img v-if="item.icon" :src="item.icon">
            <i v-else class="iconfont" style="margin-right:17px">&#xe618;</i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
          <SubMenu
            v-else
            :key="item.value"
            :theme="theme"
            :text-center="textCenter"
            :data="item"
            @handleSelect="handleSelect"
          />
        </template>
      </template>
    </el-menu>
  </section>
</template>

<script>
import SubMenu from './subMenu'
import {
  mapState
} from 'vuex'
export default {
  components: {
    SubMenu
  },
  props: {
    menu: { // 菜单数组
      type: Array,
      required: true
    },
    customSelect: {
      // 是否自定义选中事件
      type: Boolean,
      default: true
    },
    mode: {
      // 菜单模式
      type: String,
      default: 'vertical'
    },
    menuTrigger: {
    // 菜单打开模式
      type: String,
      default: 'click'
    },
    activeMenu: {
      // 选中的菜单项
      type: String,
      default: ''
    },
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
  data() {
    return {
      menuActive: ''
    }
  },
  computed: {
    ...mapState({
      vuexActiveMenu: (state) => state.menu.activeMenu && state.menu.activeMenu.value // 选中的菜单
    })
  },
  watch: {
    '$route.query.menuActive': function(newVal) {
      // 监听路由变化
      if (newVal !== this.menuActive) {
        this.menuActive = String(newVal)
      }
    }
  },
  created() {
    this.menuActive = this.$route.query.menuActive
  },
  methods: {
    handleSelect(item) {
      if (this.customSelect) {
        this.$emit('handleSelect', item)
      } else {
        this.$router.push({
          query: {
            menuActive: item.value
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/config.scss';
// 深色主题
.dark.menuBox{
  /deep/ .el-submenu__title,/deep/ .el-menu-item{
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-menu{
    background: none;
  }
  /deep/ .el-menu-item {
    color: rgba(255, 255, 255, .56);
  }
  /deep/ .el-submenu__title{
    color: rgba(255, 255, 255, .56);
  }
  /deep/ .el-menu-item.is-active{
    color: #fff;
    img{
      opacity: 1 !important;
    }
  }
  .el-submenu__title:hover{
    color: #fff;
    background: rgba(255, 255, 255, .06);
  }
  /deep/ .el-submenu__title:hover,/deep/  .el-submenu__title:focus{
    color: rgb(255, 255, 255);
    background: rgba(255, 255, 255, .06);
  }
  /deep/ .el-menu-item:hover,/deep/  .el-menu-item:focus{
    color: rgb(255, 255, 255);
    background: rgba(255, 255, 255, .06);
  }
  /deep/ .is-active > .el-submenu__title {
    color: #fff;
    img{
      opacity: 1;
    }
  }
  /deep/ .subitem.is-active span {
    color: #fff;
  }
}
// 深色主题 end
.menuBox {
  /deep/ .el-menu {
    border: none;
  }
  // /deep/ .is-active .el-submenu__title {
  //   color: $primary;
  // }
  // 选中时左边border样式
  /deep/ .el-menu-item{
    position: relative;
    padding-left: 4px;
    box-sizing: border-box;
  }
  /deep/ .el-menu-item:before{
    content: '';
    width: 4px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0);
    border-radius: 0 57px 57px 0;
  }
   /deep/ .el-menu-item.is-active:before{
    background: #54B9DE;
    border-radius: 0 57px 57px 0;
  }
  /deep/ .el-menu-item.is-active{
    background: linear-gradient(270deg, rgba(#54B9DE, 0.08) 0%, rgba(#54B9DE, 0.4) 100%);
  }
  // 选中时左边border样式 end
  .iconfont{
    margin-right: 12px;
  }
  img {
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
    /deep/ .el-submenu__title {
      // img {
      //   display: none;
      // }
      // .logoActive {
      //   display: inline;
      // }
    }
  }
}
</style>
