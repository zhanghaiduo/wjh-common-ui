const table = {
  data() {
    return {
      tableData: {
        // 组件替换起来
        pageData: {
          total: 0,
          currentPage: 1,
          handleCurrentChange: this.handleCurrentChange,
          handleSizeChange: this.handleSizeChange
        }
      },
      searchBoxVal: { // 搜索栏数据

      },
      defaultPageSizes: [20, 40, 80, 100],
      delLoading: false,
      delMsg: { // 删除相关的数据
        del: null, // 请求方法
        noChooseTip: '', // 没有选择要删除项时的提示
        tip: '' // 删除弹窗提示
      }
    }
  },
  methods: {
    // async handleChangeStatus (item) {
    //   const confirmRes = await this.$confirm('是否确认切换', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).catch(() => { // 取消
    //     this.$message({
    //       type: 'info',
    //       message: '已取消切换',
    //     });
    //   });
    //   if (confirmRes === 'confirm') {
    //     this.changeStatus({
    //       ids: [item.id],
    //       status: item.status === 0 ? 1 : 0,
    //     }).then((res) => {
    //       if (!res.failed) {
    //         this.$message({
    //           type: 'success',
    //           message: '已成功切换',
    //         });
    //         item.status = item.status === 0 ? 1 : 0;
    //         item.checked = !item.checked;
    //       }
    //     });
    //   }
    // },
    /**
     * @param {Array} arr 要删除的数组
     * @param {Boolean} confirmStatus 删除前是否不要确认
     * @returns {void}
     * @description 删除操作
     */
    // async handleDel (arr, confirmStatus) {
    //   if (arr.length === 0) { // 没有选中任何项时
    //     this.$message({
    //       type: 'info',
    //       message: this.delMsg.noChooseTip || '请先选择删除项', // 没有选中的提示
    //     });
    //   } else if (!confirmStatus) {
    //     const confirmRes = await this.$confirm(this.delMsg.tip || '是否确认删除', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning',
    //     }).catch(() => { // 取消删除
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除',
    //       });
    //     });
    //     if (confirmRes === 'confirm') {
    //       await this.delAxios(arr);
    //     }
    //   } else {
    //     await this.delAxios(arr);
    //   }
    // },

    // async delAxios (arr) {
    //   this.delLoading = true;
    //   // 发送删除请求
    //   await this.del({
    //     ids: arr,
    //   }).then((res) => {
    //     if (!res.failed) { // 删除成功
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!',
    //       });
    //       this.getData();
    //     } else { // 删除失败
    //       this.$alert('删除失败', '警告', {
    //         confirmButtonText: '确定',
    //       });
    //     }
    //   });
    //   this.delLoading = false;
    // },

    /**
     * @param {Array} arr 表格中选中的数组
     * @returns {void}
     * @description 表格出发选中事件时，把选中的结果存起来
     */
    // handleSelectionChange (arr) {
    //   this.tableData.selectResult = []; // 先情况原有数组
    //   arr.map((item) => { // 循环选中项数组
    //     this.tableData.selectResult.push(item.id); // 加到选中数组里
    //     return null;
    //   });
    // },

    /**
     * @param {Object} searchBoxVal 搜索栏数据
     * @returns {void}
     * @description 搜索栏出发了搜索事件，将搜索栏数据保存起来并刷新表格数据
     */
    saveSearchBoxData(searchBoxVal) {
      this.searchBoxVal = searchBoxVal // 保存从搜索栏带过来的数据
      // 当前页码置为1 offset设置为0
      if (this.tableData.pageData) {
        this.tableData.pageData.currentPage = 1
        // 已经传了limit和currentPage  建议这个参数后端自己算
        this.tableData.pageData.offset = 0
        // 兼容其他系统的参数
        this.tableData.pageData.page = 1
        this.tableData.pageData.size = this.tableData.pageData.limit
      }
      // 获取表格数据
      this.getData()
    },

    sortHandler(column, prop, order) {
      console.log(column, prop, order)
      this.getData()
    },

    /**
     * @param {String} target 过滤的目标
     * @param {String} value 当前选中值
     * @param {Object} row 当前列的数据
     * @returns {boolean} true：显示 false：隐藏
     * @description 重置表单数据，并出发sub方法
     */
    filterHandler(target, value, row) {
      return row[target] === value
    },

    /**
     * @param {Number} num 条数
     * @returns {void}
     * @description 一页显示的条数改变时
     */
    handleSizeChange(num) {
      if (this.tableData.pageData) {
        this.tableData.id && localStorage.setItem(`${this.tableData.id}PageLimit`, num)
        this.tableData.pageData.limit = num
        this.tableData.pageData.size = num
      }
      // 每页条数改变会触发change BUG， 所以条数改变默认到第一页吧
      this.handleCurrentChange(1)
      // 获取表格数据,需要表格置顶
      // this.tableData.data = []
      // this.$nextTick(() => {
      //   this.getData()
      // })
    },

    /**
     * @param {Number} num 页码
     * @returns {void}
     * @description 页码改变时
     */
    handleCurrentChange(num) {
      if (this.tableData.pageData) {
        this.tableData.pageData.currentPage = num
        this.tableData.pageData.offset = Number(this.tableData.pageData.limit) * (Number(num) - 1)
        // 兼容其他系统的参数
        this.tableData.pageData.size = this.tableData.pageData.limit
        this.tableData.pageData.page = num
      }
      // 获取表格数据,需要表格置顶
      this.tableData.data = []
      this.$nextTick(() => {
        this.getData()
      })
    },
    /**
     * @returns {void}
     * @description 请求数据方法
     */
    async getData() {
      try {
        this.tableData.emptyType = 'noData'
        this.tableData.loading = true
        // 如果按照格式来存在searchBoxData对象的话，给搜索头按钮加上loading
        if (this.searchBoxData) {
          this.searchBoxData.loading = true
        }
        const resData = await this.getList({
          ...this.tableData.pageData,
          ...this.searchBoxVal,
          ...this.$refs.searchBox && this.$refs.searchBox.getVal()
        })
        if (this.searchBoxData) {
          this.searchBoxData.loading = false
        }
        this.tableData.loading = false
        if (resData.failed) {
          return false
        }
        this.tableData.data = [] // 结果数组
        if (resData.data) {
          if (resData.data instanceof Array) {
            this.tableData.data = resData.data.map((item, index) => ({
              ...item,
              seq: this.tableData.pageData.offset + index + 1
            }))
          } else {
            this.tableData.pageData.total = resData.data.total * 1 // 总条数
            this.tableData.data = resData.data.rows.map((item, index) => ({
              ...item,
              seq: this.tableData.pageData.offset + index + 1
            }))
          }
        }
        // 成功需要单独执行的方法
        this.getDataSuccess && typeof this.getDataSuccess === 'function' && this.getDataSuccess(resData.data)
      } catch (error) {
        // 失败需要单独执行的方法
        this.getDataError && typeof this.getDataError === 'function' && this.getDataError(error)
        console.log(error)
        this.tableData.loading = false
        if (this.searchBoxData) {
          this.searchBoxData.loading = false
        }
      }
    },
    /**
     * @param {Object} item 修改的项
     * @returns {void}
     * @description 打开编辑弹窗
     */
    showEdit(item) {
      this.$refs.editDialog.show(item)
    },

    // 高亮当前行
    cellContextMenuEvent({
      row
    }) {
      this.$refs.tableBox.setCurrentRow(row)
    },
    /**
     * @description 本地缓存记忆拖拽功能, 复杂表格比如报价单详情, 合并过的暂时不支持，如果有强烈需求再说
     */
    columnDrop(opt = {}) {
      const {
        ref
      } = opt
      this.$nextTick(() => {
        let xTable = this.$refs[ref || 'tableBox']
        if (!xTable) {
          console.log('拖拽初始化失败，找不到table')
          return
        }
        // 创建一个变量tableTitleKey
        this.tableTitleKey = `${xTable.id || 'none'}TitleList`
        const sortTitleList = JSON.parse(localStorage.getItem(this.tableTitleKey) || '[]')
        let {
          fullColumn
        } = xTable.getTableColumn()
        const newList = []
        sortTitleList.forEach((v, i) => {
          // title不存在的应该是第一列的多选框吧，有别的再说
          !v ? newList.push(fullColumn[i]) : newList.push(fullColumn.find(item => item.title === v))
        })
        // 如果字段长度都相等才重新排序表头，预防表格需求变动新增减字段，否则不管。
        if (newList.length === fullColumn.length) {
          xTable.loadColumn(newList)
        }
        const Sortable = require('sortablejs').Sortable
        if (!Sortable) {
          console.log('拖拽初始化失败，请 npm i sortablejs')
          return
        }
        this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
          handle: '.vxe-header--column:not(.col--fixed):not(.col--checkbox):not(.disabledDrop)',
          onEnd: ({
            item,
            newIndex,
            oldIndex
          }) => {
            let {
              fullColumn,
              tableColumn
            } = xTable.getTableColumn()
            let targetThElem = item
            let wrapperElem = targetThElem.parentNode
            // debugger
            let newColumn = tableColumn[newIndex]
            if (newColumn.fixed || newColumn.type === 'checkbox' || newColumn.headerClassName === 'disabledDrop') {
              // 错误的移动
              if (newIndex > oldIndex) {
                wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex])
              } else {
                wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex + 1])
              }
              return this.$XModal.message({
                message: `${newColumn.title || newColumn.type}禁止拖动！`,
                status: 'error'
              })
            }
            // 转换真实索引
            let oldColumnIndex = xTable.getColumnIndex(tableColumn[oldIndex])
            let newColumnIndex = xTable.getColumnIndex(tableColumn[newIndex])
            // 移动到目标列
            let currRow = fullColumn.splice(oldColumnIndex, 1)[0]
            fullColumn.splice(newColumnIndex, 0, currRow)
            xTable.loadColumn(fullColumn)
            localStorage.setItem(this.tableTitleKey, JSON.stringify(fullColumn.map(item => item.title)))
          }
        })
      })
    },
    /**
     * @description 行拖拽
     */
    rowDrop(opt = {}) {
      const {
        ref,
        onEnd
      } = opt
      this.$nextTick(() => {
        let xTable = this.$refs[ref || 'tableBox']
        if (!xTable) {
          console.log('拖拽row初始化失败，找不到table')
          return
        }
        const Sortable = require('sortablejs').Sortable
        this.sortable = Sortable.create(
          xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
            handle: '.rowDropBtn',
            onEnd: ({
              item,
              newIndex,
              oldIndex
            }) => {
              const { fullData } = xTable.getTableData()
              try {
                onEnd({
                  item,
                  newIndex,
                  oldIndex,
                  fullData
                })
              } catch (error) {
                console.log(error)
              }
            }
          }
        )
      })
    },
    /**
     * @description 本地缓存选中过的页数limit值，下次进来默认填上
     */
    initPage() {
      try {
        if (this.tableData.pageData) {
          // 如果自己设置了pageSizes，就当做是个性化了，我就不管，否则就取公共配置
          if (!this.tableData.pageData.pageSizes) {
            this.tableData.pageData.pageSizes = this.defaultPageSizes
          }
        }
        const tablePageLimit = this.tableData.id && localStorage.getItem(`${this.tableData.id}PageLimit`) || ''
        // 如果缓存有limit,并且分页数组里有这个数字,直接替换默认的
        if (tablePageLimit && this.tableData.pageData.pageSizes.includes(tablePageLimit * 1)) {
          this.tableData.pageData.limit = tablePageLimit * 1
        }
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * @description 切换路由回来，记住原本滚动条位置，并设置高亮
     */
    getDataAndSetScroll(opt = {}) {
      try {
        setTimeout(async() => {
          const el = this.$refs[opt.ref || 'tableBox'].$el.querySelector('.vxe-table--body-wrapper')
          this.tableData.scrollTop = el.scrollTop
          this.tableData.scrollLeft = el.scrollLeft
          this.currentRow = this.$refs[opt.ref || 'tableBox'].getCurrentRecord()
          await this.getData()
          setTimeout(() => {
            this.$refs[opt.ref || 'tableBox'].scrollTo(this.tableData.scrollLeft, this.tableData.scrollTop)
            console.log(this.tableData.scrollTop, this.tableData.scrollLeft)
            let setCurrent = null
            const findItem = ({ list, childList }) => {
              if (list instanceof Array && list.length) {
                setCurrent = list.find(item => item.id === this.currentRow.id)
                list.forEach(v => {
                  if (v.id === this.currentRow.id) {
                    setCurrent = v
                  }
                  if (!setCurrent && v.childList) {
                    findItem({ list: v.childList })
                  }
                })
              } else {
                return null
              }
            }
            findItem({ list: this.tableData.data })
            this.currentRow && this.$refs[opt.ref || 'tableBox'].setCurrentRow(setCurrent)
          }, 50)
        }, 50)
      } catch (error) {
        console.log(error)
      }
    }
  },
  watch: {

  },
  created() {
    this.initPage()
  }
}

export default table
