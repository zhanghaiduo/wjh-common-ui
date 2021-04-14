<template>
  <div>
    <div
      v-loading="showLoading && loading"
      class="qrCodeBox"
      :style="`justify-content:${textAlign}`"
    >
      <img class="imgCode" :src="qrData.auth_jump_qr_url" :style="`width:${width};height:${width}`">
      <i v-if="showReset" class="iconfont reset" @click="reset">&#xe61a;</i>
    </div>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script>

export default {
  name: 'WxCode',
  props: {
    // 图片宽，通常是等边形状，宽高一样了
    width: {
      type: String,
      default: '96px'
    },
    // 占DIV的位置，默认居中
    textAlign: {
      type: String,
      default: 'center'
    },
    // 底部文字
    text: {
      type: String,
      default: '打开「微信」扫一扫'
    },
    // 是否显示刷新按钮
    showReset: {
      type: Boolean,
      default: true
    },
    // 是否显示加载loading
    showLoading: {
      type: Boolean,
      default: true
    },
    //  轮训扫码状态函数
    getQrStatus: {
      type: Function,
      default: null
    },
    //  轮训扫码状态参数
    getQrStatusParams: {
      type: Object,
      default: () => { }
    },
    // 获取二维码函数
    getQrCode: {
      type: Function,
      default: null
    },
    //  获取二维码参数
    getQrCodeParams: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      qrData: {},
      loading: false
    }
  },
  mounted() {
    this.qrCode()
  },
  beforeDestroy() {
    // 组件销毁时清除异步中的延时器有问题，再加多一个变量isDestroy控制...
    clearTimeout(this.timer)
    this.isDestroy = true
    console.log('中断...')
  },
  methods: {
    reset() {
      this.qrCode()
    },
    async qrCode() {
      try {
        this.loading = true
        this.isDestroy = false
        const reqData = await this.getQrCode({ ...this.getQrCodeParams })
        this.qrData = reqData.data || {}
        this.status()
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async status() {
      try {
        // 别这么频繁吧，至少有响应结果后1s才接着去轮训
        clearTimeout(this.timer)
        this.timer = setTimeout(async() => {
          console.log('轮训中...')
          if (this.isDestroy) {
            console.log('中断..')
            return clearTimeout(this.timer)
          }
          const reqData = {
            authCode: this.qrData.auth_code,
            domain: '',
            ...this.getQrStatusParams
          }
          this.getQrStatus(reqData).then(resData => {
            // 2代表登录成功或者绑定成功，抛出事件
            if (resData.data.status === 2) {
              clearTimeout(this.timer)
              console.log('成功')
              this.$emit('statusSuccess', resData.data)
            } else {
              this.status()
            }
          }).catch(error => {
            this.$emit('catch', error)
            // 需要刷新二维码的错误状态
            const errorCode = [1062, 1063, 1064]
            if (errorCode.includes(error.code)) {
              this.qrCode()
            }
          })
        }, 1000)
      } catch (error) {
        console.log(error)
        // // 需要刷新二维码的错误状态
        // const errorCode = [1062, 1063, 1064]
        // console.log('errorCode.includes(error.code)', errorCode.includes(error.code));
        // if (errorCode.includes(error.code)) {
        //   this.qrCode()
        // } else {
        //   this.status()
        // }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'wjh-common/styles/config.scss'; // 配置样式
.qrCodeBox {
  display: flex;
  align-items: center;
  text-align: center;
  // justify-content: center;
  .reset {
    padding: 3px;
    line-height: 16px;
    margin-left: 12px;
    cursor: pointer;
    background: #e8e8e8;
    border-radius: 50%;
  }
  .reset:hover {
    color: #fff;
    background: $primary;
  }
}
.text {
  white-space: nowrap;
  font-size: 12px;
  margin-top: 12px;
  line-height: 12px;
}
</style>
