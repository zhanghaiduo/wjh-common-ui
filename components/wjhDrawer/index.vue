<template>
  <el-drawer
    ref="drawer"
    class="drawers"
    :title="drawerData.title"
    :visible.sync="drawerFormVisible"
    :direction="drawerData.direction"
    :show-close="drawerData.showClose"
    :modal="drawerData.modal"
    :with-header="drawerData.withHeader"
    :size="drawerData.drawerSize"
    :custom-class="drawerData.customClass"
    :destroy-on-close="true"
    :before-close="handleClose"
    :wrapper-closable="!!drawerData.wrapperClosable"
  >
    <div slot="title" class="custom-header">
      <slot name="title" />
      {{ drawerData.title }}
      <span
        v-if="drawerData.noticeTitle"
        class="msg"
      >{{ drawerData.noticeTitle }}</span>
    </div>
    <section v-if="drawerData.form" v-loading="drawerData.dialogLoading" class="drawer-main">
      <wjhCustomForm ref="customForm" :no-sub-btn="true" :form-data="drawerData" :disabled="drawerData.disabled" @sub="sub">
        <span slot="header">
          <slot name="header" />
        </span>
        <div
          v-for="(item,index) in drawerData&&drawerData.form"
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
    <section v-else v-loading="drawerData.dialogLoading" class="drawer-main">
      <slot name="customBody" />
      <slot />
    </section>
    <!-- 提交 -->
    <section class="drawer-footer">
      <slot v-if="drawerData.customFooter" name="customFooter" />
      <span v-else>
        <span class="footerLeft">
          <slot name="footerLeft" />
        </span>
        <span>
          <el-button size="mini" @click="$refs.drawer.closeDrawer()">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            :loading="drawerData.subLoading || drawerData.dialogLoading"
            @click="customFormPost"
          >确 定</el-button>
        </span>
      </span>
    </section>
  </el-drawer>
</template>
<script>
export default {
  name: 'WjhDrawer',
  components: {
  },
  props: {
    drawerData: {
      type: Object,
      default: () => { }
    },
    ruleForm: {
      type: Object,
      default: () => { }
    }, // 用于判断是否编辑过
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 弹框
      drawerFormVisible: false,
      formData: {} // 刚进入的值
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
      if (this.drawerData.form) {
        // 默认form
        this.formData = Object.assign(this.formData, this.drawerData.form)
      } else {
        // 自定义form
        this.formData = Object.assign(this.formData, val)
      }
      console.log('this.formData', this.formData)
      this.drawerFormVisible = true // 打开弹窗
      this.$refs.customForm && this.$refs.customForm.reset()
      if (tar) { // 编辑
        this.$nextTick(() => {
          this.$refs.customForm && this.$refs.customForm.setVal(tar, val)
        })
      } else { // 新增

      }
    },
    customFormPost() {
      if (this.drawerData.form && this.drawerData.form.length > 0) {
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
    // 关闭时判断是否保存
    handleClose(done) {
      if (this.drawerData.status === 3) {
        this.hide(done)
        return
      }
      // 原有的数据和修改后的数据对比
      let objEqual = this.isObjEqual(this.formData, this.drawerData.form ? this.drawerData.form : this.ruleForm)
      if (objEqual) {
        this.formData = {}
        this.hide(done)
        console.log('没有变化')
      } else {
        this.$emit('handleClose', done)
        console.log('有变化')
      }
    },
    // 比较2个对象是否相同
    isObjEqual(objA, objB) {
      // props1原有的数据，props2修改后的数据对比
      // 相等
      if (objA === objB) return objA !== 0 || 1 / objA === 1 / objB
      // 空判断
      if (objA === null || objB === null) return objA === objB
      // 类型判断
      if (Object.prototype.toString.call(objA) !== Object.prototype.toString.call(objB)) return false
      switch (Object.prototype.toString.call(objA)) {
        case '[object RegExp]':
        case '[object String]':
          // 字符串转换比较
          return '' + objA === '' + objB
        case '[object Number]':
          // 数字转换比较,判断是否为NaN
          if (+objA !== +objA) {
            return +objB !== +objB
          }
          return +objA === 0 ? 1 / +objA === 1 / objB : +objA === +objB
        case '[object Date]':
        case '[object Boolean]':
          return +objA === +objB
        case '[object Array]':
          // 判断数组
          for (let i = 0; i < objA.length; i++) {
            if (!this.isObjEqual(objA[i], objB[i])) return false
          }
          return true
        case '[object Object]':
          // 判断对象
          let keys = Object.keys(objA)
          for (let i = 0; i < keys.length; i++) {
            if (!this.isObjEqual(objA[keys[i]], objB[keys[i]])) return false
          }
          keys = Object.keys(objB)
          for (let i = 0; i < keys.length; i++) {
            if (!this.isObjEqual(objA[keys[i]], objB[keys[i]])) return false
          }
          return true
        default:
          return false
      }
    },
    hide(done) {
      this.drawerFormVisible = false
      sessionStorage.removeItem('drawer-new')
      this.formData = {}
      if (done) {
        done()
      }
      // this.$emit('hide')
    },
    open() {
      console.log('open')
    },
    /**
    * @returns {void}
    * @description 获取弹框表单的值
    */
    getVal() {
      // 如果是传form表单进来才能获取值
      if (this.drawerData.form && this.drawerData.form.length > 0) {
        return this.$refs['customForm'].getVal()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drawers {
  .custom-header {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    .msg {
      font-size: 14px;
      font-weight: normal;
      line-height: 30px;
      color: #f00;
      padding-left: 5px;
    }
  }
  /deep/ .el-drawer__header {
    span:focus,
    .el-icon-close:focus,
    .el-drawer__close-btn:focus {
      outline: none;
    }
  }
  .el-drawer{}
  /deep/ .el-drawer__body {
    padding: 20px;
    padding-top: 0;
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
  }
  .drawer-main {
    flex: 1;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .drawer-footer {
    text-align: right;
  }
  /deep/ .custom-body{
    height: -webkit-fill-available;
  }
  // 表单
  .footerLeft {
    float: left;
  }
  /deep/ .el-form-item__label {
    color: #000;
    font-size: 12px;
    font-weight: normal;
    overflow: hidden;
    white-space: nowrap;
  }
  /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 12px;
  }
  /deep/ .el-dialog {
    min-width: 420px;
    width: 60%;
  }
}
</style>
