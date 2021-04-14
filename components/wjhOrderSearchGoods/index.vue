
<template>
  <div
    ref="reference"
    v-clickoutside="() => toggleDropDownVisible(false)"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    @click="() => toggleDropDownVisible(true)"
    @keydown="handleKeyDown"
  >
    <span v-if="checkedNodes.ssuName" class="checkedBox" :class="{hideText:inputValue}">
      <span class="text">
        <span>{{ checkedNodes.ssuName }}</span>
        <span class="spec">【{{ checkedNodes.ssuSpec }}<span v-if="checkedNodes.ssuSpec">/</span>{{ checkedNodes.ssuUnit }}】</span>
        <span class="price">￥{{ checkedNodes.ssuPrice }}/{{ checkedNodes.ssuUnit }}</span>
      </span>
      <el-button type="text" class="resetBtn" @click="clear">清空</el-button>
    </span>
    <el-input ref="input" v-model="inputValue" size="mini" :placeholder="checkedNodes.ssuName?'':'搜索选择商品'" @input="onInput" @focus="onFocus" />
    <div class="downBox">
      <transition name="el-zoom-in-top">
        <el-cascader-panel
          v-show="dropDownVisible"
          ref="cascaderPanel"
          :key="resetKey"
          v-model="value"
          v-loading="loading"
          expand-trigger="hover"
          :options="options"
          :props="props"
          @change="onChange"
        >
          <template slot-scope="{ node, data }">
            <div v-if="!data.ssuId" :class="{isParent:!data.ssuId}" class="pItemBox" @mouseover="(e) => onMouseover(data,e)" @mouseout="(e) => onMouseout(data,e)">
              <span>{{ data.spuName }}</span>
              <span class="spec">【{{ data.spuSpec ? data.spuSpec+'/':data.spuSpec }}{{ data.spuUnit }}】</span>
              <span class="createType">[{{ data.createType === '1' ? '标品' :'非标品' }}]</span>
            </div>
            <div v-else class="cTtemBox">
              <span class="spec">【{{ data.ssuSpec }}<span v-if="data.ssuSpec">/</span>{{ data.ssuUnit }}】</span>
              <span class="price">￥{{ data.ssuPrice }}/{{ data.ssuUnit }}</span>
              <span class="shelfBox">
                <span v-if="!data.appState" class="shelfText">APP已下架</span>
              </span>
            </div>
          </template>
        </el-cascader-panel>
      </transition>
    </div>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import AriaUtils from 'element-ui/src/utils/aria-utils'
const { keys: KeyCode } = AriaUtils
export default {
  name: 'WjhOrderSearchGoods',
  directives: { Clickoutside },
  // 通过 model 选项配置子组件接收的 prop 名以及派发的事件名
  model: {
    prop: 'val',
    event: 'change'
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    val: {
      required: false,
      type: [Array, String, Number]
    },
    // 是否支持远程搜索 ，支持的话前端输入的条件全都不要 ，提交给后端返回的
    remote: {
      type: Boolean,
      default: true
    },
    // 是否支持远程搜索 ，支持的话前端输入的条件全都不要 ，提交给后端返回的
    getData: {
      type: Function,
      default: null
    },
    // 其他请求参数
    parms: {
      type: Object,
      default: () => {
        return {

        }
      }
    },
    // 支持的属性
    props: {
      type: Object,
      default: () => {
        return {
          multiple: false,
          emitPath: false,
          value: 'ssuId',
          label: 'ssuName',
          children: 'ssuOutPutList',
          expandTrigger: 'click'
        }
      }
    }
  },
  data() {
    return {
      value: '',
      options: [],
      dropDownVisible: false,
      inputValue: '',
      state: false,
      resetKey: 0,
      status: true,
      checkedNodes: {},
      loading: false
    }
  },
  created() {
    // this.init()
  },
  methods: {
    onMouseout(data, e) {
      e.stopPropagation()
      // if (e.target.localName === 'span') {
      //   e.target.parentNode.classList.remove('hoverColor')
      // } else {
      //   e.target.classList.remove('hoverColor')
      // }
    },
    onMouseover(data, e) {
      e.stopPropagation()
      // if (e.target.localName === 'span') {
      //   e.target.parentNode.classList.add('hoverColor')
      // } else {
      //   e.target.classList.add('hoverColor')
      // }
      e.target.click()
      e.target.focus()
    },
    focus() {
      this.$refs.input.focus()
    },
    clear(e) {
      e && e.stopPropagation()
      this.$refs.cascaderPanel.clearCheckedNodes()
      this.value = ''
      this.onChange('')
      this.resetKey++
    },
    // 选中第一列
    focusFirstNode(fristFoucs) {
      this.$nextTick(() => {
        const dom = document.getElementsByClassName('el-cascader-node')[0]
        const firstNode = this.$refs.cascaderPanel.$el.querySelector('.in-active-path')
        if (!firstNode || fristFoucs) {
          dom && dom.focus()
          dom && dom.click()
        }
        this.focusChildrenFirstNode(fristFoucs)
      })
    },
    // 高亮孩子第一列
    focusChildrenFirstNode(fristFoucs) {
      setTimeout(() => {
        if (fristFoucs) {
          const firstItem = this.$refs.cascaderPanel.$children[1] && this.$refs.cascaderPanel.$children[1].$el.querySelector('li')
          firstItem.classList.remove('removeFirstItem')
        }
        const firstItem = this.$refs.cascaderPanel.$children[1] && this.$refs.cascaderPanel.$children[1].$el.querySelector('li')
        if (!firstItem) return
        firstItem.classList.add('firstItem')
      }, 10)
    },
    // 移除高亮孩子第一列
    removeChildrenFirstNode() {
      setTimeout(() => {
        const firstItem = this.$refs.cascaderPanel.$children[1] && this.$refs.cascaderPanel.$children[1].$el.querySelector('li')
        if (!firstItem) return
        firstItem.classList.add('removeFirstItem')
        if (firstItem.classList.value.includes('firstItem')) {
          firstItem.classList.remove('firstItem')
        }
      }, 10)
    },
    // 键盘事件
    handleKeyDown(event) {
      if (this.loading) {
        return
      }
      try {
        switch (event.keyCode) {
          case KeyCode.enter:
            if (!this.$refs.cascaderPanel.$children[1]) return
            if (!(
              this.$refs.cascaderPanel.$children[1].$el.querySelector('li') &&
              this.$refs.cascaderPanel.$children[1].$el.querySelector('li').classList.value.includes('removeFirstItem'))) {
              this.$refs.cascaderPanel.$children[1].$el.querySelector('li').click()
            }
            break
          case KeyCode.left:
            this.focusChildrenFirstNode(true)
            break
          case KeyCode.right:
            this.removeChildrenFirstNode(true)
            break
          case KeyCode.down:
            this.toggleDropDownVisible(true)
            if (event.target.className === 'el-input__inner') {
              this.focusFirstNode(true)
            }
            this.focusChildrenFirstNode()
            event.preventDefault()
            break
          case KeyCode.up:
            if (document.getElementsByClassName('el-cascader-node')[0] && event.target.id === document.getElementsByClassName('el-cascader-node')[0].id) {
              const firstNode = this.$refs.cascaderPanel.$el.querySelector('.in-active-path')
              firstNode && firstNode.classList.remove('in-active-path')
              console.log(firstNode)
              const oldVal = this.inputValue
              this.inputValue = ''
              this.$refs.input.focus()
              setTimeout(() => { this.inputValue = oldVal }, 10)
              this.removeChildrenFirstNode()
            }
            this.focusChildrenFirstNode()
            break
          case KeyCode.esc:
          case KeyCode.tab:
            this.toggleDropDownVisible(false)
            break
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 开启关闭折叠
    toggleDropDownVisible(visible) {
      if (!this.inputValue) {
        this.dropDownVisible = false
        this.resetKey++
        this.options = []
        return
      }
      if (!visible) {
        this.inputValue = ''
        this.resetKey++
        this.options = []
      }
      this.dropDownVisible = visible
    },
    // 节流
    onInput() {
      if (!this.status) { return }
      this.status = false
      this.loading = true
      setTimeout(() => {
        console.log(new Date())
        this.search()
        this.status = true
      }, 100)
    },
    // 搜索
    async search() {
      try {
        this.dropDownVisible = true
        this.value = null
        console.log(this.$refs.cascaderPanel)
        this.$refs.cascaderPanel.clearCheckedNodes()
        const reqData = await this.getData({ ...this.parms, keyword: this.inputValue })
        this.resetKey++
        this.options = (reqData.data && reqData.data) || []
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    onFocus(e) {
      // setTimeout(() => {
      //   this.$nextTick(() => {
      //     this.toggleDropDownVisible(true)
      //   })
      // }, 50)
    },
    // change 抛出当前val  label daa
    onChange(e) {
      console.log(e)
      // label
      const label = this.$refs.cascaderPanel.getCheckedNodes().map(item => {
        return item.label
      })
      // 整个item
      const data = this.$refs.cascaderPanel.getCheckedNodes().map(item => {
        return item.data
      })
      this.inputValue = ''
      // 选中的节点
      this.checkedNodes = this.props.multiple ? data : data[0] || {}
      this.$emit('change', e, this.props.multiple ? label : label[0] || '', this.props.multiple ? data : { ...data[0], obj: data[0] } || {})
      setTimeout(() => {
        this.$nextTick(() => {
          this.toggleDropDownVisible(this.dropDownVisible = this.props.multiple)
        })
      }, 50)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'wjh-common/styles/config.scss'; // 配置样式
.downBox{
  position: absolute;
  z-index: 1000;
  // background: #fff;
}
.el-cascader-panel{
  background:#fff
}
.el-input{
  position: relative;
}
.checkedBox{
  position: absolute;
  z-index: 999;
  height: 28px;
  line-height: 28px;
  pointer-events: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  padding:0 20px ;
  font-size: 12px;
  .resetBtn{
    pointer-events: auto;
    position: absolute;
    right: 10px;
    color:#999;
  }
}
.hideText{
  display: none;
}
/deep/ .el-cascader-node{
  padding: 0;
}
  /deep/ .el-cascader-node__label{
    user-select: none;
    padding: 0px;
   /deep/  .pItemBox{
      padding:0 30px 0 20px ;
      display: flex;
    }
    /deep/ .cTtemBox{
      display: flex;
      // padding:0 30px 0 20px ;
    }
  }

/deep/ .in-active-path{
  .isParent{
    background:rgba($primary,.6);
    color:#fff;
  }
  i,.spec{
    color:#fff
  }
}
  .spec{
    background:none;
  }
 .createType{
   margin-left: auto;
 }
 .price{
    margin:0 12px;
 }
 /deep/.el-cascader-node.in-active-path{
   font-weight: normal;
 }
  /deep/ .firstItem{
   background: #9ACFFF;
 }
 /deep/ .removeFirstItem{
   background: none;
 }

 /deep/.el-cascader-node:not(.is-disabled):hover{
   background:rgba($primary,.6) !important;
     font-weight: normal;
     color:#fff;
     i,.spec{
      color:#fff
   }
 }
  /deep/ .el-cascader-node:not(.is-disabled):focus{
   background: $primary;
   font-weight: normal;
   color:#fff;
     i,.spec{
    color:#fff
  }
 }
// .hoverColor{
//    background: #F5F7FA !important;
//    span{
//      color:#606266;
//    }
//    .spec{
//      color:$primary !important;
//    }
//  }
.shelfBox{
  width: 70px;
  margin-left:auto;
  .shelfText{
    background: #787878;
    color: #fff;
    padding:0 14px;
    border-radius: 0 0 0 12px;
    display:inline-block;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
    transform:scale(.66)
  }
}
/deep/.el-cascader-menu:last-child .el-cascader-node{
  padding: 0;
}
</style>
