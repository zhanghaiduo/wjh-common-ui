<template>

  <div class="upload-container">
    <el-dialog :visible.sync="dialogVisibleImg" :title="ImgName" append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-upload
      :class="[disabledInput? 'upLoadShowNone':'']"
      class="upload-demo"
      :accept="accept"
      :action="UploadUrl()"
      :multiple="multiple"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :disabled="disabledInput"
      list-type="picture"
      :file-list.sync="fileList"
    >
      <el-button :size="size" :type="type" icon="el-icon-upload" :plain="plain">
        {{ btnMSg }}
      </el-button>
      <!--<el-button size="small" type="primary" >点击上传</el-button>-->
      <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>
  </div>
</template>

<script>
  // <!--accept=".png,.jpg,.xlsx, .xls"-->
export default {
  name: 'UploadFile',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    disabledInput: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    accept: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'primary'
    },
    btnMSg: {
      type: String,
      default: '点击上传'
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisibleImg: false,
      ImgName: '',
      dialogImageUrl: ''
    }
  },
  computed: {
  },
  methods: {
    // 上传路径
    UploadUrl: function() {
      return `${process.env.BASE_API}/base/fus/uploadFile`
    },
    handleSuccess(res, file, fileList) {
      this.$emit('update:fileList', fileList)
    },
    handleRemove(file, fileList) {
      this.$emit('update:fileList', fileList)
    },
    handlePictureCardPreview(file) {
      let contentType = ''
      if (file.contentType) {
       contentType = file.contentType.split('/')[0]
      } else {
        contentType = file.response.body.contentType.split('/')[0]
      }

      if (contentType === 'image') {
        this.dialogImageUrl = file.url
        this.dialogVisibleImg = true
        this.ImgName = file.name
      } else {
        window.open(file.url)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/*@import "~@/styles/mixin.scss";*/
.upload-container {
  .el-upload{
    text-align: left;
  }
}
</style>
