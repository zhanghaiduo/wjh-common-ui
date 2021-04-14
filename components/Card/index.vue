<template>
  <section class="card"
    :class="{noTitle, shadow, cardList}"
    :style="{
      height,
      padding: `0 ${padding} ${padding}`,
    }"
  >
    <!-- title部分 -->
    <section class="titleBox clearPa" v-if="!noTitle">
      <article class="left title" v-if="title">
        {{title}}
      </article>
      <!-- title右侧slot -->
      <section class="right">
        <slot name="titleRight" />
      </section>
      <!-- title右侧slot end -->
    </section>
    <!-- title部分 end -->
    <!-- 内容slot -->
    <slot />
    <!-- 内容slot end -->
  </section>
</template>

<script>
export default {
  props: {
    title: { // 标题
      type: String,
    },
    noTitle: { // 是否不显示标题区域
      type: Boolean,
      default: false,
    },
    height: { // 高度
      type: String,
    },
    shadow: { // 是否有阴影
      type: Boolean,
      default: false,
    },
    padding: { // 内边距
      type: String,
    },
    cardList: { // 有内边距的列表
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.card{
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 0 24px 24px;
  box-sizing: border-box;
  .titleBox{ // title部分
    height: 64px;
    line-height: 64px;
    box-sizing: border-box;
    .title{
      font-size: 18px;
      height: 18px;
      line-height: 18px;
      margin-top: 23px;
      padding-left: 8px;
      border-left: 3px solid red;
    }
  }
}
.cardList{
  padding: 0 12px 24px;
  .titleBox{
    padding: 0 12px;
  }
}
.noTitle{
  padding-top: 24px;
}
.shadow{
  box-shadow: 2px 5px 8px rgba(0, 0, 0, .1);
}
</style>
