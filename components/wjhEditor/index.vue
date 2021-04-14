<template>
  <section>
    <quill-editor
      v-if="!isDetail"
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      class="editor"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    />
    <section v-if="isDetail" class="detailBox" v-html="detailContent" />
  </section>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: {
    quillEditor
  },
  model: {
    prop: 'pContent', // 父级传进来的值
    event: 'cc'
  },
  props: {
    pContent: {
      type: String,
      default: ''
    },
    detailContent: {
      type: String,
      default: ''
    },
    isDetail: {
      default: false,
      type: Boolean
    },
    isMultiple: {
      default: false,
      type: Boolean
    } // 是否可多选
  },
  data() {
    return {
      content: this.pContent,
      editorOption: {
        modules: {
          toolbar: { // 工具栏
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              [
                {
                  header: 1
                },
                {
                  header: 2
                }
              ],
              [
                {
                  list: 'ordered'
                },
                {
                  list: 'bullet'
                }
              ],
              ['link', 'image', 'video']
            ],
            handlers: {
              image: (value) => { // 自定义图片上传逻辑
                if (value) {
                  this.uploadFile(this.isMultiple).then((res) => {
                    if (res) {
                      this.$emit('getUploadImg', res)
                    }
                  })
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  watch: {
    pContent(newVal) {
      if (newVal !== this.content) {
        this.content = newVal // 同步父级和组件内的值
      }
    }
  },
  methods: {
    getShowImg(res) {
      // 获取富文本组件实例
      const QUILL = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.length > 0) {
        console.log('返回的图片地址', res)
        for (let i = 0; i < res.length; i++) {
          // 获取光标所在位置
          const LENGTH = QUILL.getSelection().index
          // 插入图片，res为服务器返回的图片链接地址
          QUILL.insertEmbed(LENGTH, 'image', res[i].furl)
          // 调整光标到最后
          QUILL.setSelection(LENGTH + 1)
        }
      } else {
        // 提示信息，需引入Message
        this.$message({
          type: 'error',
          message: '文件上传失败'
        })
      }
    },
    onEditorBlur() { // 失去焦点事件
    },
    onEditorFocus() { // 获得焦点事件
    },
    onEditorChange(val) { // 内容改变事件
      this.$emit('cc', val.html)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor{
    /deep/ .ql-editor{
        min-height:200px;
    }
}
.detailBox{
  padding: 24px;
  img{
    max-width: 100%;
  }
}
</style>
