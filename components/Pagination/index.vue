<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination :current-page.sync="currentPage" :page-size.sync="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" v-bind="$attrs" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { scrollTo } from '../../utils/scroll-to.js'

export default {
  name: 'Pagination',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    offset: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 30
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        if (this.page !== 1) {
          return this.page
        }
        return (this.offset / this.limit + 1)
      },
      set(val) {
        this.$emit('update:page', val)
        this.$emit('update:offset', [val - 1] * this.limit)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, offset: [this.currentPage - 1] * this.limit, size: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, offset: [val - 1] * this.limit, size: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #F0F1F2;
  border: solid 1px #dddddd;
  margin-top: 12px;
}
.pagination-container.hidden {
  display: none;
}
</style>

