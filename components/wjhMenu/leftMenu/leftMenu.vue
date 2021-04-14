<template>
  <div class="leftMenuBox" :class="{collapse:collapse}">
    <div class="navbar">
      <Hamburger class="hamburger-container" @toggleClick="toggleSideBar" />
    </div>
    <el-scrollbar style="height:100%">
      <CollapseMenu v-if="collapse" v-bind="$attrs" @handleSelect="handleMenuSelect" @homeClick="homeClick">
        <slot v-for="(_, name) in $slots" :slot="name" :name="name" />
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </CollapseMenu>
      <OpenMenu v-else v-bind="$attrs" @handleSelect="handleMenuSelect" @homeClick="homeClick">
        <slot v-for="(_, name) in $slots" :slot="name" :name="name" />
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </OpenMenu>
    </el-scrollbar>
    <footer v-show="collapse" class="menuFooter">
      <div class="textCenter collapseFooterBox">
        <!-- <i class="iconfont" @click="setClick">&#xe602;</i> -->
        <slot name="footer" />
      </div>
    </footer>
    <footer v-show="!collapse" class="menuFooter openFooter">
      <slot name="footer" />
      <slot name="footerRight" />
    </footer>
  </div>

</template>

<script>
import OpenMenu from '../openMenu' // 展开的菜单
import CollapseMenu from '../collapseMenu' // 折叠起来的的菜单
import Hamburger from '../../Hamburger'
import {
  mapState
} from 'vuex'
export default {
  components: {
    OpenMenu, // 菜单
    CollapseMenu,
    Hamburger
  },
  inheritAttrs: false,
  props: {

  },
  data() {
    return {
      showSet: false,
      menuLoading: false, // 菜单加载中
      collapse: true
    }
  },
  computed: {
    ...mapState({
      menu: (state) => state.menu.menu, // 菜单
      activeIframe: (state) => state.active.activeIframe, // 选中的Iframe
      activeMenu: (state) => state.menu.activeMenu // 选中的菜单
    })
  },
  watch: {
  },
  async created() {
  },
  methods: {
    // 折叠菜单的设置按钮点击事件，暂时不懂怎么交互，让他展出展开菜单吧
    setClick() {
      this.toggleSideBar()
    },
    toggleSideBar() {
      this.collapse = !this.collapse
    },
    // 点击首页事件
    homeClick() {
      this.$emit('homeClick')
    },
    // 菜单选择
    handleMenuSelect(item) {
      console.log('select', item)
      this.$emit('select', item)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/config.scss';
.leftMenuBox{
  height: calc(100% - 30px);
  width: 200px;
  position: relative;
  background-image: linear-gradient(0deg, #121927 0%, #08243E 100%);
}
.collapse{
  width: 64px;
}
.collapseFooterBox{
  flex: 1;
  i{
    cursor: pointer;
  }
  .helpBox{
    text-align: center;
  }
}
.openFooter{
  padding: 0 10px;
  .collapseSetBox{
    display: none;
  }
}
.collapseFooterShow{
  width: 200px;
  position: absolute;
}
.textCenter{
  text-align: center;
}
/deep/.el-scrollbar__wrap{
  overflow-x: hidden;
}
.menuFooter{
  height: 30px;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  background-image: linear-gradient(0deg, #121927 0%, #08243E 100%);
  color:rgba(255, 255, 255, .56);
  // padding:0 10px;
  font-size: 12px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: absolute;
  right:-9px;
  top: 50%;
  margin-top: -25px;
  z-index: 999;
  background-image: url(../../../assets/fold.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
  }
}
</style>
