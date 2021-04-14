<template>
  <section class="searchBox">
    <!-- 初次进来提示遮罩层 -->
    <!-- <div class="tagModal" /> -->
    <div v-if="isFristTip" class="contentModal" :style="`height:calc(100% - ${formHeight}px);top:${formHeight}px`" />
    <slot name="header" />
    <!-- 表单 -->
    <CustomForm
      v-if="isInitOk"
      ref="customForm"
      :common-span="6"
      v-bind="$attrs"
      :label-width="labelWidth ? labelWidth : '80px'"
      :form-data="formData"
      v-on="$listeners"
      @dragEnd="dragEnd"
    >
      <div
        v-for="(item,index) in formData&&formData.form"
        :key="index"
        :slot="item.value"
        slot-scope="props"
      >
        <slot :name="item.value" :form="props.form" />
      </div>
      <el-col
        v-if="!hideSub||showReset||searchBoxData.more&&searchBoxData.more.length>0"
        slot="footer"
        :span="6"
        class="pull-right"
      >
        <!-- 初次进来提示遮罩层表单部分 -->
        <div v-if="isFristTip" class="formModal" />
        <span class="el-form-item el-form-item--small">
          <span class="pull-right">
            <el-button v-if="isDraggable" type="text" size="mini">
              <el-popover
                v-if="!seting"
                v-model="setVisible"
                placement="bottom"
              >
                <p>让我们开始拖拽框框来排序吧~</p>
                <div style="text-align: right;">
                  <el-button size="mini" type="text" @click="setVisible=false">取消</el-button>
                  <el-button type="primary" size="mini" @click="setClick">开启</el-button>
                </div>
                <el-tooltip slot="reference" class="item" effect="dark" content="设置查询条件排序" placement="left">
                  <i class="iconfont">&#xe602;</i>
                </el-tooltip>
              </el-popover>
              <span v-else @click="setClick"><i class="iconfont success">&#xe61d;</i>关闭</span>
            </el-button>
            <!-- 搜索 -->
            <span v-if="!hideSub&&showSub" class="searchBtnBox">
              <el-button type="primary" size="mini" :loading="searchBoxData.subLoading || searchBoxData.loading" @click="sub">
                <i v-if="!searchBoxData.subLoading&&!searchBoxData.loading" class="el-icon-search" />
                查询
              </el-button>
              <!-- 初次进来提示遮罩层tip部分 -->
              <div v-if="isFristTip" class="tipModal">
                <p class="tipText">请输入条件后查询</p>
                <el-button type="primary" size="mini" class="minimal" @click="fristTipClick">
                  我知道了
                </el-button>
              </div>
            </span>

            <!-- 搜索 end -->
            <!-- 重置 -->
            <el-button v-if="showReset" size="mini" :loading="searchBoxData.resetLoading || searchBoxData.loading" @click="reset">
              <i v-if="!searchBoxData.resetLoading&&!searchBoxData.loading" class="el-icon-refresh" />
              重置
            </el-button>
            <!-- 重置 end -->
            <el-button
              v-if="searchBoxData.more&&searchBoxData.more.length>0"
              size="mini"
              class="moreBtn"
              @click="showMoreSearchDialog"
            >
              {{ showMore?'收起':'更多' }}
              <i
                :class="`el-icon-arrow-${showMore?'up':'down'} el-icon--right`"
              />
            </el-button>
            <slot name="right" />
          </span>
        </span>
      </el-col>
    </CustomForm>
    <!-- 表单 end -->
    <slot name="footer" />
  </section>
</template>

<script>
import CustomForm from '../wjhCustomForm' // 自定义表单生成
export default {
  name: 'SearchBox',
  components: {
    CustomForm // 自定义表单生成
  },
  props: {
    searchBoxData: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: ''
    },
    // 显示刷新按钮
    showReset: {
      type: Boolean,
      default: false
    },
    // 显示提交按钮  之前命名有问题，跟hideSub重复了，随便用哪个都可以
    showSub: {
      type: Boolean,
      default: true
    },
    // 隐藏提交按钮
    hideSub: {
      type: Boolean,
      default: false
    },
    autoSub: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tipSearch: require('../../assets/tipSearch.png'),
      // 是否第一次进来开启提示
      isFristTip: false,
      // 是否初始化完成，才显示，避免重复触发
      isInitOk: false,
      setVisible: false,
      // 是否正在设置拖拽
      seting: false,
      // 是否开启拖拽
      isDraggable: false,
      showMore: false,
      defaultData: {},
      // 最大默认能显示七个,但取决于form的长度，
      defaultMax: 7,
      // 表单的高度，遮罩层要去掉这个距离
      formHeight: 0,
      // 本地缓存的USERID
      localUserId: ''
    }
  },
  computed: {
    formData() {
      return {
        inline: true,
        ...this.searchBoxData,
        form: this.searchBoxData.form
      }
    }
  },
  created() {
    try {
      this.localUserId = JSON.parse(sessionStorage.getItem('userInfo') || '{}').id
      console.log('localUserId', this.localUserId)
    } catch (error) {
      console.log(error)
    }
    this.init()
  },
  async mounted() {
    // 是否打开页面自动请求
    if (this.autoSub) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.sub()
        })
      }, 50)
    }
    this.getFormHeight()
  },
  methods: {
    // 我知道了  缓存本地 来过
    fristTipClick() {
      this.isFristTip = false
      this.localUserId && localStorage.setItem(`${this.localUserId}${this.searchBoxData.id}localIsFristTip`, '1')
    },
    // 获取表单高度，遮罩层距离下移这个距离
    getFormHeight() {
      this.formHeight = this.$refs.customForm.$el.clientHeight + 8
    },
    // 设置是否开启拖拽
    setClick() {
      this.seting = !this.seting
      this.searchBoxData.draggable = !this.searchBoxData.draggable
      this.setVisible = false
      console.log(this.seting)
    },
    // 初始化数据，表单有缓存取缓存
    init() {
      try {
        // 是否第一次进来，要显示tip
        const localIsFristTip = this.localUserId && localStorage.getItem(`${this.localUserId}localIsFristTip`) || ''
        console.log(localIsFristTip)
        this.isFristTip = this.localUserId && this.searchBoxData.fristTip && !localIsFristTip
        // 是否有开启缓存
        this.defaultData = this.searchBoxData
        this.defaultMax = this.searchBoxData.form.length
        // 是否是开启拖拽
        this.isDraggable = this.searchBoxData.draggable === undefined && this.searchBoxData.id ? true : !!this.searchBoxData.draggable && this.searchBoxData.id
        this.$set(this.searchBoxData, 'draggable', false)
        const localData = JSON.parse(localStorage.getItem(this.localUserId + this.searchBoxData.id) || localStorage.getItem(this.searchBoxData.id) || '{}')
        if (localData.form) {
          const defaultForm = [...this.defaultData.form.map(item => item.value), ...this.defaultData.more.map(item => item.value)].sort()
          const localFormMap = localData.form.map(item => item.value)
          const localMoreMap = localData.more.map(item => item.value)
          // 如果localForm大于最大defaultMax显示数量代表包含了更多more,不需要推进去一起对比
          const localForm = [...localFormMap, ...(localFormMap.length > this.defaultMax ? [] : localMoreMap)].sort()
          console.log(JSON.stringify(defaultForm) === JSON.stringify(localForm))
          // 默认表单和缓存表单进行key对比，如果有不一样就认为是搜索栏字段改变了，需要清空缓存
          if (JSON.stringify(defaultForm) === JSON.stringify(localForm)) {
            localData.form.forEach(v => {
              const item = [...this.defaultData.form, ...this.defaultData.more].find(item => item.value === v.value)
              Object.keys(item).forEach(key => {
                v[key] = item[key]
              })
            })
            console.log(localData)
            this.searchBoxData.form = localData.form
            this.searchBoxData.more = localData.more
            this.showMore = true
            this.showMoreSearchDialog()
          } else {
            localStorage.removeItem(this.searchBoxData.id)
          }
        }
        this.isInitOk = true
      } catch (error) {
        console.log(error)
        this.isInitOk = true
      }
    },
    /**
     * @param {Arrny} formList 拖拽完后的数组
     * @returns {void}
     * @description 拖拽结束后重新设置form
     */
    dragEnd(formList) {
      // 最多只能显示defaultMax个
      this.searchBoxData.form = [...formList.slice(0, this.defaultMax)]
      if (formList.length > this.defaultMax) {
        this.searchBoxData.more = [...formList.slice(this.defaultMax, formList.length)]
        this.showMore = false
        this.showMoreSearchDialog()
      }
      console.log(this.searchBoxData)
      this.searchBoxData.id && localStorage.setItem(this.searchBoxData.id, JSON.stringify(this.searchBoxData))
    },
    /**
     * @returns {void}
     * @description 展开更多
     */
    showMoreSearchDialog() {
      this.showMore = !this.showMore
      if (this.showMore) {
        this.searchBoxData.formLength = this.searchBoxData.form.length
        this.searchBoxData.form.push(...this.searchBoxData.more)
      } else {
        // this.searchBoxData.form.splice(this.searchBoxData.formLength, this.searchBoxData.form.length - this.searchBoxData.formLength)
        this.searchBoxData.more = this.searchBoxData.form.length > this.defaultMax ? [...this.searchBoxData.form.slice(this.defaultMax, this.searchBoxData.form.length)] : this.searchBoxData.more
        this.searchBoxData.form = [...this.searchBoxData.form.slice(0, this.defaultMax)]
        console.log(this.searchBoxData)
      }
    },

    /**
     * @param {String} tar 设置的对象
     * @param {Object} val 设置的值
     * @param {String} formTar 设置到哪个表单
     * @returns {void}
     * @description 设置表单数据
     */
    setVal(tar, val, formTar = 'customForm') {
      this.$refs[formTar].setVal(tar, val)
    },

    /**
     * @param {String} tar 获取的对象
     * @param {String} formTar 设置到哪个表单
     * @returns {void}
     * @description 设置表单数据
     */
    getVal(tar, formTar = 'customForm') {
      return this.$refs[formTar].getVal(tar)
    },
    /**
     * @returns {void}
     * @description 单独提供表单校验方法，实际sub也能带校验功能
     */
    async validate() {
      return this.$refs.customForm.validate()
    },
    /**
     * @returns {void}
     * @description 搜索栏触发搜索事件，将数据抛给父级去处理
     */
    sub() {
      this.$refs.customForm.sub()
    },

    /**
     * @param {String} formName 表单名称
     * @returns {void}
     * @description 重置表单数据，并出发sub方法
     */
    async reset() {
      this.$emit('resetBefore')
      this.$refs.customForm.reset() // 重置表单数据
      this.sub() // 刷新表格数据
      this.$emit('resetAfter')// 重置我统一处理，仅抛出重置after的方法，供例如清空自定义相关内容...
    }
  }
}
</script>

<style lang="scss" scoped>
.tagModal{
  position: fixed;
  height:30px ;
  width:100%;
  background: rgba(#000,.6) ;
  z-index: 2000;
  left: 0px;
  top: 0px;
}
.contentModal{
  position: absolute;
  width:100%;
  background: rgba(#000,.6) ;
  z-index: 2001;
  left: 0px;
  user-select: none
}
.customForm{
  position: relative;
}
.customForm:after,
.customForm:before {
    content: "";
    display: block;
    clear: both;
}
.formModal{
  position: absolute;
  z-index: 2002;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(#fff,.6) ;
}
.searchBtnBox{
  position: relative;
  .tipModal{
    position: absolute;
    z-index: 2003;
    right: -40px;
    top: 40px;
    background-image: url(../../assets/tipSearch.png);
    height:200px;
    width: 303px;
    text-align: center;
  }
  .tipText{
    color:#060606;
    font-size: 14px;
    margin:118px 0 8px 0 ;
  }
  .minimal{
    font-size: 12px;
    border-radius:13px ;
    padding:5px 13px !important
  }
}

@media screen and (max-width: 1350px) {
  /deep/ .el-date-editor .el-range__icon {
    display: none;
  }
  /deep/ .el-date-editor .el-range-input {
    width: 50%;
  }
  /deep/ .el-range-editor.el-input__inner {
    padding: 3px;
  }
}
.pull-right {
  float: right;
}
/deep/ .customForm > form > .el-form-item {
  display: none;
}
/deep/ .el-form-item {
  width: 100%;
}
/deep/ .el-form-item {
  margin: 6px 0 !important;
}
/deep/ .el-form-item__content {
  width: calc(100% - 80px);
}
/deep/ .el-form-item__label {
  width: 80px !important;
  font-size: 12px;
  color: #000;
  font-weight: normal;
  padding: 0 6px 0 0;
  overflow: hidden;
  white-space: nowrap;
}
/deep/ .el-form--inline .el-form-item {
  margin-right: 0;
}
.searchBox {
  padding: 3px 0 6px 0;
  /deep/  .el-button + .el-button {
    margin-left: 3px;
  }
   /deep/  .el-button {
    padding: 6px ;
    .el-icon--right {
      margin: 0;
    }
   /deep/ i{
      margin: 0;
      font-size: 12px;
    }
  }
  .moreBtn {
    background: #efefef;
    border-color: #efefef;
  }
  /deep/ .el-input,
  /deep/ .el-date-editor {
    width: 100%;
  }
  /deep/ .el-date-editor .el-range-separator {
    padding: 0;
  }
  .btnBox {
    width: 25%;
  }
  /deep/ .el-col {
    height: 40px;
  }
  /deep/ .el-button [class*="el-icon-"]+span{
    margin-left:0
  }
}
</style>
