const appMixin = {
  data() {
    return {
      // 判断是否本地开发
      isLocal: false,
      system_no: require('@/../package.json').name
    }
  },
  watch: {
    $route() {
      this.addTags()
    }
  },
  async mounted() {
    // 接受父页面发来的信息
    this.$nextTick(() => {
      window.addEventListener('message', (event) => this.getRouterStr(event, this))
      window.addEventListener('message', (event) => this.parentMsg(event, this))
    })
    this.postRoutes()
  },
  created() {
    this.isLocal = this.checkEnv() === 'local'
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  destroy() {
    window.removeEventListener('message', this.getRouterStr)
    window.removeEventListener('message', this.parentMsg)
  },
  methods: {
    // 添加页卡
    addTags() {
      const view = {
        fullPath: this.$route.fullPath,
        path: this.$route.path,
        name: this.$route.name,
        query: this.$route.query,
        value: this.$route.name,
        params: this.$route.params,
        meta: this.$route.meta,
        system_no: this.system_no
      }
      this.$nextTick(() => {
        this.goSystem({ cmd: 'addTags', params: view })
      })
    },
    // 搜集路由
    async postRoutes() {
      try {
        const powers = process.env.NODE_ENV === 'production' ? await this.$store.dispatch('user/getUserPower') : await this.$store.dispatch('user/getUserNoPower')
        await this.$store.dispatch('permission/generateRoutes', powers)
        window.parent.postMessage({ cmd: 'postRoutes', system_no: this.system_no, routes: JSON.parse(JSON.stringify(this.$store.state.permission.routes)) }, '*')
        console.log('子应用传出未处理过的路由---', this.$store.state.permission.routes)
      } catch (error) {
        console.log('postRoutesErr', error)
      }
    }
  }
}

export default appMixin
