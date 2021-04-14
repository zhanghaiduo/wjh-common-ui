<template>
  <div>
    <section class="leftMenu posifix">
      <!-- 顶部title -->
      <p class="title">
        <img class="logo" :src="logo || defaultLogo">
        <span class="divide">|</span>
        <span><slot name="title" /></span>
      </p>
      <!-- 顶部title end -->
      <!-- 首页按钮 -->
      <p v-if="showHome" class="textCenter">
        <el-button
          class="indexBtn"
          size="small"
          :class="{active: (!activeMenu || !activeMenu.value) && $route.path==='/home/index'}"
          @click="homeClick"
        >
          <span class="iconfont">&#xe622;</span>
          <span class="label posire">首页</span>
        </el-button>
      </p>
      <!-- 首页按钮 -->
      <!-- 菜单 -->
      <Menu
        v-loading="menuLoading"
        theme="dark"
        :menu="menu"
        :custom-select="true"
        background-color="#f5f5f5"
        @handleSelect="handleMenuSelect"
      />
      <!-- 菜单 end -->
    </section>
  </div>

</template>

<script>
import Menu from './menu' // 菜单
import {
  mapState
  // mapMutations
} from 'vuex'
export default {
  components: {
    Menu
  },
  props: {
    logo: { // logo
      type: String,
      default: ''
    },
    showHome: { // 显示首页按钮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuLoading: false, // 菜单加载中
      defaultLogo: require('../../../assets/defaultLogo.png')
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
    // 点击首页事件
    homeClick() {
      this.$emit('homeClick')
    },
    // 菜单选择
    handleMenuSelect(item) {
      console.log('handleSelect', item)
      this.$emit('handleSelect', item)
    }
  }

}
</script>

<style scoped lang="scss">
@import '../../../styles/config.scss';
/deep/ .storeNameText{
  top:3px !important
}
.leftMenu {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  // background-image: linear-gradient(0deg, #121927 0%, #08243E 100%);
  color: rgba(255, 255, 255, .56);
  z-index: 3;
  .textCenter{
    text-align: center;
  }
  .title {
    // 顶部title
    height: 64px;
    line-height: 64px;
    padding-left: 32px;
    box-sizing: border-box;
    // margin-bottom: 32px;
    font-size: 12px;
    color: rgba(255, 255, 255, .56);
    .logo {
      // logo
      width: 36px;
      vertical-align: middle;
      // height: 36px;
    }
    .titleName{
      color:#54B9DE ;
      font-size: 17px;
      font-weight: 600
    }
    .divide {
      // 分割线
      margin: 0 12px;
      opacity: 0.24;
    }
  }
  .indexBtn {
    // 回到首页按钮
    width: 160px;
    background: none;
    border: 1px solid rgba(255, 255, 255, .32);
    color: #fff;
    border-radius: 4px;
    // margin-bottom: 32px;
    // padding: 0;
    color: rgba(255, 255, 255, .56);
    span{
      color: rgba(255, 255, 255, .56);
    }
    .iconfont{
      margin-right: 7px;
    }
    .label{
      top: -1px;
    }
  }
  .indexBtn:hover,.indexBtn.active {
    background: #54B9DE;
    border-color: #54B9DE;
    color: #fff;
    span{
      color: #fff;
    }
  }
}

</style>
