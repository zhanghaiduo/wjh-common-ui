<template>
  <div>
    <!-- 顶部title -->
    <p class="title">
      <img class="logo" :src="logo || defaultLogo">
    </p>
    <!-- 顶部title end -->
    <!-- 菜单 -->
    <Menu
      v-loading="menuLoading"
      :show-home="showHome"
      @homeClick="homeClick"
      @handleSelect="handleMenuSelect"
    />
    <!-- 菜单 end -->
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
    Menu // 菜单
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
      this.$emit('handleSelect', item)
    }
  }

}
</script>

<style scoped lang="scss">
@import '../../../styles/config.scss';
.title{
  text-align: center;
  color:#54B9DE ;
  font-size: 17px;
}
.logo{
  width: 36px;
}
</style>
