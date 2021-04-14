<template>
  <div class="select-date">
    <div class="title">{{dateData.title}}</div>
    <template v-if="dateData.type == 1">
      <span class=""></span>
      <el-popover
        v-model="visible"
        popper-class="popover-date"
        placement="top-start"
        :trigger="dateData.trigger || 'hover'"
      >
        <dateList switch :index="dateValueIndex" class="ul-date" @enterDate="enterDate" ref="dateListRef">
          <dateItme
            v-for="(item, index) in dateList"
             :key="index" 
            :class="item == dateValues ? 'ul-li li-selected' : 'ul-li'" :value="item"
            >
            <span @click="changeDate(item,index)">{{ item }}</span>
          </dateItme>
        </dateList>
        <el-input
          slot="reference"
          v-model="dateValuesName"
          readonly
          size="mini"
          placeholder="请选择日期"
        >
          <i slot="suffix" class="el-input__icon el-icon-date" />
        </el-input>
      </el-popover>
    </template>
    <template v-if="dateData.type == 2">
      <span class=""></span>
      <el-select v-model="dateValues" placeholder="请选择日期" size="mini" @change="addDate">
        <el-option
          v-for="(item, index) in dateList"
          :key="index"
          :label="item + '日'"
          :value="item">
        </el-option>
      </el-select>
    </template>
  </div>
</template>

<script>
export default {
  name: 'wjhDateSelect',
  components: {
    dateList: () => import('./dateList'),
    dateItme: () => import('./item'),
  },
  model: {
    prop: 'dateValue', // 父级传进来的值
    event: 'sub'
  },
  props: {
    dateData: {
      type: Object,
      default: () => { }
    },
    dateValue: {
      type: [Number, String],
      default: ''
    },
  },
  data() {
    return {
      dateValues: this.dateValue,
      dateValuesName: '',
      dateValueIndex: '',
      visible: false,
      dateList: [],
    }
  },
  watch: {
    dateValue: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.dateValues = newVal // 同步父级和组件内的值
          this.dateValueIndex = newVal - 1
          this.dateValuesName = newVal + '日' // 同步父级和组件内的值
        }
      },
    },
  },
  mounted() {
    this.dateData.minNum = this.dateData.minNum ? this.dateData.minNum : 1
    this.dateData.maxNum = this.dateData.maxNum ? this.dateData.maxNum : 28
    this.getDate()
  },
  created() {

  },
  methods: {
    getDate() {
      this.dateList = []
      for (let i = this.dateData.minNum; i <= this.dateData.maxNum; i++) {
        this.dateList.push(i)
      }
    },
    addDate(item) {
      this.$emit('sub', item)
      this.visible = false
    },
    enterDate(item, index) {
      this.dateValueIndex = index
      this.addDate(item.bindData, index)

    },
    changeDate(item, index) {
      this.$refs.dateListRef.leftOrEnterMove('enter', index)
    },
  }
}
</script>
<style scoped lang="scss">
.select-date{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 12px;
  .title{
    font-size: 12px;
    color: #000;
    font-weight: normal;
    padding: 0 6px 0 0;
    overflow: hidden;
    white-space: nowrap;
  }
}
.ul-date{
  width: 352px;
  display: flex;
  justify-content: flex-start;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  list-style: none;
  border: 1px solid #f0f0f0;
  border-right: transparent;
  border-bottom: transparent;
  padding: 0;
  margin: 0;
  .ul-li{
    width: 14.28%;
    height: 50px;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 12px;
    span{
      padding: 5px;
      width: 100%;
      height: 100%;
      display: inline-block;
    }
  }
  .ul-li:hover{
    color:#1890FF;
    background:#dbeeff;
    cursor:pointer; // 鼠标移入变手势
  }
  .li-selected{
    color:#1890FF;
    background:#dbeeff;
    cursor:pointer; // 鼠标移入变手势
  }
}
</style>
<style>
</style>
