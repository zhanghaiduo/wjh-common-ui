const init = (Vue) => {
  /**
 * @param {object} form 表单节点
 * @param {fn} success 成功回调
 * @param {fn} fail 失败回调
 * @param {fn} final 总会执行的回调
 * @returns {void}
 * @description 表单验证
  */
  Vue.prototype.validForm = ({ form, success, fail, final }) => {
    form.validate((valid) => {
      if (valid) {
        if (success) {
          success()
        }
      } else if (fail) {
        fail()
      }
      if (final) {
        final()
      }
    })
  }
  /**
   * @param {object} data 请求参数
   * @return {void}
   * @description 选择文件上传
    */
  Vue.prototype.uploadFile = (isMultiple = false) => new Promise((resolve, reject) => {
    const domInput = document.createElement('input') // 创建input标签
    domInput.setAttribute('type', 'file') // 设置为上传文件
    if (isMultiple) {
      domInput.setAttribute('multiple', 'multiple') // 设置为多文件文件
    }
    domInput.setAttribute('accept', 'image/gif,image/jpeg,image/jpg,image/png,image/svg') // 设置为多文件文件
    domInput.onchange = () => { // 监听文件选择了
      // 上传的方法
      resolve(domInput.files)
    }
    domInput.click() // 点击input
  })
  /**
 * @param {String} err 报错信息
 * @param {object} vm this
 * @param {String} info 特定的错误信息，比如错误所在的生命周期钩子
 * @description 捕获组件生命周期钩子里的错误
  */
  // Vue.config.errorHandler = (err, vm, info) => {
  //   console.log(vm.$route)
  //   console.log(window.location)
  //   console.log(err, vm, info)
  // }
  /**
 * @param {object}
 * @description 判断系统环境  这里要判断是本地的话才显示左侧和上方菜单 
  */
  Vue.prototype.checkEnv = (opt = {}) => {
    try {
      // 只有是新版的入口页需要去掉旧菜单
      const portalAdminNew = sessionStorage.getItem('portal-admin-new')
      const drawerNew = sessionStorage.getItem('drawer-new')
      const url = window.location.href
      let env = ''
      // 由于环境变量本地开发 和 dev打包重复了，才使用此方法判断是否本地
      if (url.includes('localhost') || url.includes('//10') || url.includes('//172') || url.includes('//192') || !portalAdminNew) {
        env = 'local'
      }
      if (portalAdminNew) {
        env = 'portalAdminNew'
      }
      if (drawerNew) {
        env = 'drawerAdminNew'
      }
      return env
    } catch (error) {
      console.log(error)
    }
  }
  /**
 * @param {object} opt 跳转的路由信息 url：系统地址
 * @description 发送命令到父窗口   跳转到其他系统
  */
  Vue.prototype.goSystem = (opt = {}) => {
    try {
      window.parent.postMessage({ cmd: opt.cmd || 'toSys', params: opt }, '*')
    } catch (error) {
      console.log(error)
    }
  }
  /**
 * @param {object} toRoute 跳转的路由名称
 * @description 获取父窗口传递路由信息，跳转到指定模块
  */
  Vue.prototype.getRouterStr = (toRoute = {}, _this) => {
    try {
      var data = toRoute.data
      switch (data.cmd) {
        case 'getRouterJson':
          if (data.params) {
            _this.$router.push(data.params)
          }
          break
      }
    } catch (error) {
      console.log(error)
    }
  }
  /**
 * @param {object} toRoute
 * @description 父组件发送命令，做指定操作
  */
  Vue.prototype.parentMsg = (opt = {}, _this) => {
    try {
      const data = opt.data
      switch (data.cmd) {
        case 'closeSelectedTag':
          _this.$refs.TagsView.closeSelectedTag(data.params)
          break
        case 'refreshSelectedTag':
          _this.$refs.TagsView.refreshSelectedTag(data.params)
          break
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
 * @param {String} category（必填）,  要监控的目标的类型名称，通常是同一组目标的名字，比如”视频”、”音乐”、”软件”、”游戏”等等。该项必选
 * @param {String} action（必填）, 用户跟目标交互的行为，如”播放”、”暂停”、”下载”等等。该项必选
 * @param {String} opt_label（选填）, 事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选
 * @param {String} opt_value（选填）, 事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
 * @param {Int} nodeid（选填）, 事件元素div的id。
 * @description 对事件统计
  */
  Vue.prototype.trackEvent = (category, action, opt_label = '', opt_value = '', nodeid = '') => {
    try {
      // eslint-disable-next-line no-undef
      // if (_hmt) { // 百度统计
      //   // eslint-disable-next-line no-undef
      //   _hmt.push(['_trackEvent', category, action, opt_label, opt_value])
      // }
      // eslint-disable-next-line no-undef
      if (_czc && process.env.NODE_ENV === 'production') { // 友盟统计
        // eslint-disable-next-line no-undef
        _czc.push(['_trackEvent', category, action, opt_label, opt_value, nodeid])
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
 * @param {String} name（必填）, 自定义访客种类
 * @param {String} value（必填）, 自定义访客值
 * @param {String} time（选填）, 有效时长
 * @description 对自定义标记的请求统计
  */
  Vue.prototype.setCustomVar = (name, value, time = 0) => {
    try {
      // eslint-disable-next-line no-undef
      if (_czc && process.env.NODE_ENV === 'production') { // 友盟统计
      // eslint-disable-next-line no-undef
        _czc.push(['_setCustomVar', name, value, time])
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default init
