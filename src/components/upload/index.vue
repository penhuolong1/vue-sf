<template>
  <div>
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="action"
      :file-list="fileList"
      :data="data"
      :name="name"
      :accept="accept"
      :limit="limit"
      :on-success="success"
      :disabled="loading"
      :on-remove="remove"
      :on-exceed="exceed"
      :on-preview="preview"
      :before-upload="beforeUplod"
    >
      <el-button slot="trigger" :loading="loading" size="small" type="primary">上传</el-button>
      <span slot="tip" class="el-upload__tip">{{ tip }}</span>
    </el-upload>
    <preview v-if="previewList && previewList.length>0" ref="preview" :file-url="fileUrl" :file-list="previewList" />
  </div>
</template>

<script>
import { limitFileSize } from '@/utils/tools.js'
import preview from '@/components/preview'
export default {
  components: {
    preview
  },
  props: {
    action: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
    name: {
      type: String,
      default: 'file'
    },
    accept: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: null
    },
    filelable: {
      type: String,
      default: 'url'
    },
    tip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      loading: false,
      fileList1: [],
      fileUrl: '',
      previewList: []
    }
  },
  watch: {
    fileList1() {
      this.$emit('input', this.fileList1)
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 调用该方法初始化赋值
    assign(list) {
      if (!list && list.length == 0) {
        return
      }
      const list1 = list.map((item, index) => {
        return {
          uid: new Date().getTime() + index,
          name: item.split('/').pop(),
          [this.filelable]: item
        }
      })
      const list2 = list.map((item, index) => {
        return {
          id: new Date().getTime() + index,
          [this.filelable]: item
        }
      })
      this.fileList = list1
      this.fileList1 = list2
    },
    remove(file, fileList) {
      const index = this.fileList1.findIndex(item => {
        return item.id == file.uid
      })
      this.fileList1.splice(index, 1)
    },
    exceed() {
      this.$message.error(`上传文件数不能超过${this.limit}份`)
    },
    // 预览
    preview(file) {
      const id = file.uid
      const url = this.fileList1.find(item => {
        return item.id == id
      })[this.filelable]
      this.fileUrl = url
      const list = this.fileList1.map(item => {
        return item[this.filelable]
      })
      this.previewList = list
      this.$nextTick(() => {
        this.$refs.preview && this.$refs.preview.show(url, list)
      })
    },
    // 成功时的函数
    success(response, file, fileList) {
      this.loading = false
      this.load1 && this.load1.close()
      if (response.state === 100) {
        this.$message.success(response.message)
        this.fileList1.push({
          id: file.uid,
          url: file.response[this.filelable]
        })
      }
    },
    // 文件开始上传时的函数
    beforeUplod(file) {
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return false
      }
      this.loading = true
      this.load1 = this.$loading({
        lock: true,
        text: '文件上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
      this.fileList1 = []
    }
  }
}
</script>

<style scoped lang="scss">

</style>
