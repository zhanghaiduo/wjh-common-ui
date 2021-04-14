<template>
  <div>
    <div v-if="showHome" class="menuBox" :class="{active: (!activeMenu || !activeMenu.value) && $route.path==='/home/index'}" @click="homeClick">
      <div class="itemBox menuPopper">
        <div class="leftIcon" />
        <div class="imgBox">
          <i class="iconfont">&#xe622;</i>
        </div>
        <div class="label">
          首页
        </div>
      </div>
    </div>
    <div v-for="(item,index) in menu" :key="index" :class="['menuBox',{active:false}]" @click="handleSelect(item)">
      <el-popover
        popper-class="popoverBox menuPopoverBox"
        placement="right-start"
        :offset="-16"
        trigger="hover"
        :visible-arrow="false"
      >
        <el-scrollbar style="width:100%">
          <div class="childBox">
            <template v-if="item.children.length">
              <div v-for="(item,index) in item.children" :key="index" class="childItemBox">
                <div v-if="item.children.length" class="childTitle">
                  {{ item.label }}
                </div>
                <div v-else class="childTitle pointer" @click="handleSelect(item)">
                  {{ item.label }}
                </div>
                <div v-for="(cItem,index) in item.children" :key="'childItem'+index" :class="['childItem',{active:activeMenu && activeMenu.value === cItem.value},{fristChild:index===0}]" @click="handleSelect(cItem)">
                  {{ cItem.label }}
                </div>
              </div>
            </template>
            <div v-else>
              <div class="childTitle" @click="handleSelect(item)">
                {{ item.label }}
              </div>
            </div>
          </div>
        </el-scrollbar>

        <div slot="reference" class="itemBox menuPopper">
          <div class="leftIcon" />
          <div class="imgBox">
            <img v-if="item.icon" :src="item.icon">
            <i v-else class="iconfont">&#xe618;</i>
          </div>
          <div class="label">
            {{ item.label.substring(0,2) }}
          </div>
        </div>

      </el-popover>
    </div>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  components: {
    // Menu // 菜单
  },
  props: {
    customSelect: {
      // 是否自定义选中事件
      type: Boolean,
      default: true
    },
    showHome: { // 显示首页按钮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuLoading: false // 菜单加载中
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
    handleSelect(item) {
      if (!item.children.length) {
        if (this.customSelect) {
          this.$emit('handleSelect', item)
        } else {
          this.$router.push({
            query: {
              menuActive: item.value
            }
          })
        }
      }
    }
  }

}
</script>
<style>
.childBox{
  display: flex;
}
.childItemBox{
  padding: 0 20px;
  color:#fff;
}
.childTitle{
  font-size: 12px;
  font-weight: bold;
}
.pointer{
   cursor: pointer;
}
.fristChild{
  margin-top: 15px;
}
.childItem{
  margin-bottom: 8px;
  font-size: 12px;
  cursor: pointer;
  opacity: .65;
  padding: 2px;
}
.childItem.active{
  color:#1890FF;
  font-weight: bold;
}
.childItem:hover{
  color:#fff;
  opacity: 1;
  background: #505D7F;
  border-radius: 2px;
}
</style>
<style scoped lang="scss">
@import '../../../styles/config.scss';

.menuBox{
  height:64px;
  width: 64px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-content: center;
  cursor: pointer;
  position: relative;
  .leftIcon{
    position: absolute;
    height: 100%;
    width: 4px;
    border-radius: 0 57px 57px 0;
    background:#54B9DE;
    display: none;
    left: 0;
    top: 0;
  }
  .label{
    color:rgba(#fff, .56);
    margin-top: 3px;
  }
  .itemBox{
    padding: 0 8px;
  }
  .imgBox{
    text-align: center;
    margin-top: 15px;
    img{
      width: 24px;
      height: 24px;
      opacity: .65;
    }
    .iconfont{
      font-size: 20px;
      color:rgba(#fff, .56);
    }
  }
}
/deep/ .menuBox.active{
   background: linear-gradient(270deg, rgba(#54B9DE, 0.08) 0%, rgba(#54B9DE, 0.4) 100%);
    .leftIcon{
      display: block
    }
   .label{
      color:#fff
    }
    img{
      opacity: 1;
    }
    .iconfont{
      color:rgba(#fff, 1);
    }
}
.menuBox:hover{
  background: linear-gradient(270deg, rgba(#54B9DE, 0.08) 0%, rgba(#54B9DE, 0.4) 100%);
    .leftIcon{
      display: block;
    }
    .label{
      color:#fff
    }
}
</style>
