<template>
  <div>
    <!-- <div :class="classPath === '' ? 'classOp' : 'classOpSelected'" @click="changeClassOp()">
      <div>分 类</div>
    </div> -->
    <el-button v-if="classPath === ''" v-bind="$attrs" @click="changeClassOp()">商品分类</el-button>
    <el-button v-if="classPath !== ''" v-bind="$attrs" type="primary" @click="changeClassOp()">商品分类</el-button>

    <!-- 商品分类 -->
    <el-dialog center :visible="class_select_visible" width="60%" v-bind="$attrs" :append-to-body="true" :before-close="classSelectvisiblehandleClose" :close-on-click-modal="false" custom-class="select_class_dialog">
      <div class="class_select_dialog">
        <div style="width:100%;min-height:170px;overflow: auto;">
          <div style="width: 100%;height: 40px;margin-bottom: 20px;padding-left:20px;color: black;line-height: 40px;font-size: 25px;text-align: left;background-color: #1AB394;">
            一级分类
          </div>
          <div v-for="(item,i) in list1" :key="i" :class="[ item.selected === true ? 'class_select_selected' : 'class_select_no_selected' ]" tyle="width:auto;" @click="selectClassLevel1(item)">
            <div>{{ item.name }}</div>
          </div>
        </div>
        <div style="width:100%;min-height:290px;overflow: auto;">
          <div style="width: 100%;height: 40px;margin-bottom: 20px;padding-left:20px;color: black;line-height: 40px;font-size: 25px;text-align: left;background-color: #1AB394;">
            二级分类
          </div>
          <div v-for="(item2,i) in list2" :key="i" :class="[ item2.selected === true ? 'class_select_selected' : 'class_select_no_selected' ]" style="width:auto;" @click="changeSelectClassLevel2(item2)">
            <div>{{ item2.name }}</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" center>
        <el-button round type="primary" @click="classSelectvisiblehandleClose()">取 消</el-button>
        <el-button round type="primary" @click="selectClassReset()">重 置</el-button>
        <el-button round type="primary" @click="selectClassCommit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'ClassSelect',
  props: {
    classPath: {
      type: String,
      default: ''
    },
    classListLevel1: {
      type: Array,
      default: function() {
        return []
      }
    },
    classListLevel2: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      class_select_visible: false,
      local_path: '',
      list1: [],
      list2: []
    }
  },
  watch: {

  },
  created() {
    this.getClassList()
  },
  methods: {
    // 获取商品类别列表
    async getClassList() {
      if (!this.classListLevel1 || this.classListLevel1.length === 0) {
        console.log(this.$store.getters)
        var localClassList = this.$store.getters.classList
        if (!localClassList || localClassList.length === 0) {
          localClassList = await this.$store.dispatch('skuClass/listAllActive')
        }
        this.list1 = localClassList
        this.$emit('update:classListLevel1', localClassList)
      } else {
        this.classListLevel1.forEach(e => {
          if (e.selected) {
            this.list2 = e.chirdList
            this.$emit('update:classListLevel2', e.chirdList)
            return
          }
        })
      }
    },
    changeClassOp() {
      // 弹窗初始化数据为上次保存的分类
      this.list1 = JSON.parse(JSON.stringify(this.classListLevel1))
      this.list2 = JSON.parse(JSON.stringify(this.classListLevel2))
      this.local_path = JSON.parse(JSON.stringify(this.classPath))
      this.class_select_visible = true
    },
    selectClassLevel1(item) {
      // 默认都未选中
      item.selected = true
      this.list1.forEach(e => {
        if (e.id === item.id) {
          e.selected = true
        } else {
          e.selected = false
        }
      })
      item.chirdList.forEach(e => {
        e.selected = false
      })
      this.list2 = item.chirdList
      this.local_path = item.path
      this.$forceUpdate()
    },
    changeSelectClassLevel2(item2) {
      this.list2.forEach(e => {
        if (e.id === item2.id) {
          e.selected = true
        } else {
          e.selected = false
        }
      })
      this.local_path = item2.path
      this.$forceUpdate()
    },
    classSelectvisiblehandleClose() {
      this.class_select_visible = false
      if (!this.classPath) {
        for (let i = 0; i < this.list1.length; i++) {
          this.list1[i].selected = false
        }
        this.list2 = []
      }
    },
    selectClassReset() {
      // 默认都未选中
      this.list1.forEach(e => {
        e.selected = false
      })
      this.list2 = []
      this.local_path = ''
      this.selectClassCommit()
    },
    // 提交
    selectClassCommit() {
      this.local_path = ''
      for (var i = 0; i < this.list1.length; i++) {
        if (this.list1[i].selected) {
          this.local_path = this.list1[i].path
          break
        }
      }
      for (var j = 0; j < this.list2.length; j++) {
        if (this.list2[j].selected) {
          this.local_path = this.list2[j].path
          break
        }
      }
      // 只有提交的时候才传值给父组件
      this.$emit('update:classListLevel1', this.list1)
      this.$emit('update:classListLevel2', this.list2)
      this.$emit('update:classPath', this.local_path)
      this.$emit('classCommit', this.local_path)
      this.class_select_visible = false
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.classOp{
  margin: auto;
  margin-top: 16px;
  margin-right: 0px;
  font-size: 20px;
  width: 80px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  background-color: #ffffff;
  color: black;
  border-radius: 22px;
  font-weight: bold;
}
.classOpSelected{
  margin: auto;
  margin-top: 16px;
  margin-right: 0px;
  font-size: 20px;
  width: 80px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  background-color: rgb(180, 191, 94);
  color: black;
  border-radius: 22px;
  font-weight: bold;
}
.class_select_dialog{
  min-height: 500px;
  width: 100%;
}
.class_select_no_selected{
  float: left;
  border: 0.5px solid #606266;
  /* background-color: rgb(72, 89, 34); */
  color: #606266;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 25px;
}
.class_select_selected{
  float: left;
  border: 0.5px solid #1AB394;
  background-color: #1AB394;
  color: rgb(255, 255, 255);
  height: 40px;
  font-size: 20px;
  /* font-weight: bold; */
  line-height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 25px;
}
</style>
<style>
.select_class_dialog{
  border-radius: 10px;
}
.select_class_dialog .el-dialog__close{
  font-size: 30px;
  font-weight: bold;
}
</style>
