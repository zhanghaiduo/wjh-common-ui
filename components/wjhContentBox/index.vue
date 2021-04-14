<template>
  <div class="contentBox">
    <!--slot name="header" 工具栏顶部，一般放文字说明什么的 -->
    <slot name="header" />
    <!--  v-if="showToolbarBox" 是否显示工具栏，默认ture -->
    <span v-if="showToolbarBox" class="vxeToolbarBox">
      <vxe-toolbar :custom="toolbarCustom">
        <template v-slot:buttons>
          <!--slot name="toolbarBox" 工具栏box，顶部操作按钮什么的放这里 -->
          <slot name="toolbarBox" />
        </template>
      </vxe-toolbar>
    </span>
    <div class="tableBox">
      <!-- 默认slot，可以放表格，或者什么乱七八糟的， 自适应高度容器布局，随便放只会在里面显示滚动条 -->
      <div class="customBodyBox">
        <slot />
      </div>
    </div>
    <div class="footerBox">
      <!-- slot name="customPage" 自定义分页插槽  -->
      <slot name="customPage" />
      <!--  如果有pageData传入则显示分页 -->
      <el-pagination
        v-if="pageData&&pageData.currentPage"
        :current-page="pageData.currentPage"
        :page-sizes="pageData.pageSizes"
        :page-size="pageData.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @size-change="pageData.handleSizeChange"
        @current-change="pageData.handleCurrentChange"
      />
      <div class="footerHandleBox">
        <!-- 底部操作栏,一般是提交按钮什么的 -->
        <slot name="footerHandleBox" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WjhContentBox',
  props: {
    // 是否显示工具栏
    showToolbarBox: {
      type: Boolean,
      default: true
    },
    // 是否显示分页
    showPage: {
      type: Boolean,
      default: true
    },
    // 工具栏配置，看vxe文档
    toolbarCustom: {
      type: [Boolean, Object],
      default: true
    },
    // 分页data,包含el-pagination所有方法
    pageData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
// @import 'wjh-common/styles/config.scss'; // 配置样式
.tableBox {
  position: relative;
  .customBodyBox {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    overflow: auto;
  }
}
</style>
