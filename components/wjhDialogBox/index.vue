<template>
  <el-dialog
    v-wjhDialogDrag
    :width="dialogData.width"
    :close-on-click-modal="false"
    :title="dialogData.title||'-'"
    :lock-scroll="true"
    :visible.sync="dialogFormVisible"
    :class="{autoHeight:(!dialogData.autoHeight&&!dialogData.form)}"
    class="wjhDialogBox"
    :modal="false"
    @open="open"
    @close="close"
    @closed="closed"
  >
    <section v-if="dialogData.form" v-loading="dialogData.dialogLoading">
      <wjhCustomForm
        ref="customForm"
        :no-sub-btn="true"
        :form-data="dialogData"
        @sub="sub"
      >
        <span slot="header">
          <slot name="header" />
        </span>
        <div
          v-for="(item,index) in dialogData&&dialogData.form"
          :key="index"
          :slot="item.value"
          slot-scope="props"
        >
          <template v-if="item.slot">
            <!-- 如果写了component组件名，则是自定义组件，需要支持v-model双向绑定写法的组件 -->
            <component
              :is="item.component"
              v-if="item.component"
              v-model="props.form.customerId"
              :name="item.value"
              :multiple="item.attr&&item.attr.multiple"
            />
            <!-- 否则普通的slot，兼容旧写法 -->
            <slot v-else :name="item.value" :form="props.form" />
          </template>
        </div>
      </wjhCustomForm>
    </section>
    <section v-else v-loading="dialogData.dialogLoading" style="height:100%">
      <slot name="customBody" />
      <slot />
    </section>
    <section slot="footer" class="dialog-footer">
      <slot v-if="dialogData.customFooter" name="customFooter" />
      <span v-else>
        <span class="footerLeft"><slot name="footerLeft" /></span>
        <span>
          <el-button size="mini" @click="hide">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            :loading="dialogData.subLoading || dialogData.dialogLoading"
            @click="customFormPost"
          >确 定</el-button>
        </span>
      </span>
    </section>
  </el-dialog>
</template>

<script>

export default {
  props: {
    dialogData: {
      type: Object,
      default: () => { }
    }
    // customFooter: {
    //   type: Boolean,
    //   default: false
    // }
    // // 弹框宽度
    // width: {
    //   type: String,
    //   default: '420px'
    // },
    // // 弹框标题
    // title: {
    //   type: String,
    //   default: '--'
    // },
    // 自定义底部

    // // 弹框dialogLoading
    // dialogLoading: {
    //    type: Boolean,
    //   default: false
    // },
    // // 提交dialogLoading
    // subLoading: {
    //    type: Boolean,
    //   default: false
    // },
    // formData: {
    //   type: Object,
    //   default: () => { }
    // }
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  methods: {
    /**
     * @param {String} tar 设置的对象
     * @param {Object} val 设置的值
     * @returns {void}
     * @description 设置表单数据
     */
    setVal(tar, val) {
      this.$nextTick(() => {
        this.$refs.customForm.setVal(tar, val)
      })
    },
    /**
     * @param {Object} item 编辑的项
     * @returns {void}
     * @description 打开弹窗并初始化数据
     */
    show(tar, val) {
      this.dialogFormVisible = true // 打开弹窗
      this.$refs.customForm && this.$refs.customForm.reset()
      if (tar) { // 编辑
        this.$nextTick(() => {
          this.$refs.customForm && this.$refs.customForm.setVal(tar, val)
        })
      } else { // 新增

      }
    },

    customFormPost() {
      if (this.dialogData.form && this.dialogData.form.length > 0) {
        this.$refs.customForm.sub()
      } else {
        this.$emit('sub')
      }
    },

    /**
     * @param {Object} form 表单数据
     * @returns {void}
     * @description 弹窗确定按钮事件
     */
    async sub(form) {
      console.log(form)
      this.$emit('sub', form)
    },
    /**
    * @returns {void}
    * @description 隐藏弹框事件
    */
    hide() {
      this.dialogFormVisible = false
      this.$emit('hide')
    },
    open() {
      console.log('open')
    },
    close() {
      // console.log('close')
    },
    closed() {
      this.$emit('closed')
      console.log('closed')
    },
    /**
    * @returns {void}
    * @description 获取弹框表单的值
    */
    getVal() {
      // 如果是传form表单进来才能获取值
      if (this.dialogData.form && this.dialogData.form.length > 0) {
        return this.$refs['customForm'].getVal()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.footerLeft{
  float:left;
}
/deep/ .el-form-item__label {
  color: #000;
  font-size: 12px;
  font-weight: normal;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 4px;
}
/deep/ .el-form-item {
  margin-bottom: 14px;
}
// /deep/ .el-dialog__headerbtn {
//   top: 10px;
//   right: 15px;
//   padding: 0;
// }
// /deep/ .el-dialog__header {
//   background: #f0f1f2;
//   padding: 6px 15px;
//   display: flex;
//   align-items: center;
//   // padding: 15px;
//   span,
//   .el-dialog__close {
//     color: #000;
//     font-size: 14px;
//   }
//   span {
//     font-weight: bold;
//   }
// }
// /deep/ .el-dialog__body {
//   padding: 24px 16px;
//   overflow: auto;
// }
// /deep/ .el-dialog__footer {
//   padding: 4px 19px 14px 19px;
// }
/deep/ .el-form-item--mini.el-form-item {
  margin-bottom: 12px;
}
/deep/ .el-dialog {
  min-width: 420px;
  width: 60%;
}
/deep/ .el-form-item__error {
  padding-top: 0 !important;
}
/deep/ .wjhContent{
  padding-bottom:6px !important;
}
.autoHeight{
  /deep/ .el-dialog {
    height: 80%;
  }
}
/deep/ .customForm{
  overflow: hidden;
}
</style>
