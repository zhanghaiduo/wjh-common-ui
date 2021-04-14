<template>
  <section class="app-main">
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
    <!-- </transition> -->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 35px);
  width: 100%;
  padding-left:10px;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}
.noTagsView{
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    //  min-height: calc(100vh - 84px);
    height:100vh;
    overflow-y: auto;
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    //  min-height: calc(100vh - 84px);
    height: calc(100vh - 84px);
    overflow-y: auto;
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

</style>
