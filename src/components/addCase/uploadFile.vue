<template>
  <div>
    <input
      ref="selectFile"
      type="file"
      :accept="accept"
      style="display: none;"
      @change="handleChange"
    >
    <el-button size="mini" type="primary" @click="submit">点击上传</el-button>
    <el-tag
      v-for="item in fileList"
      :key="item.name"
      type="success"
      style="cursor: pointer;"
      @click="enlarge"
    >
      {{ item.name }}
      <span>
        <i class="el-icon-close" style="cursor: pointer;" @click.prevent="delFile" />
      </span>
    </el-tag>
    <el-tag
      v-if="fileList.length < 1 && handleIsUpload"
      style="cursor: pointer;"
      type="success"
      @click="enlarge"
    >{{ handleIsUpload }}<span>
      <i class="el-icon-close" style="cursor: pointer;" @click.prevent="delFile" />
    </span></el-tag>
    <!-- <el-dialog
      title="预览图片"
      append-to-body
      :visible.sync="dialogTableVisible"
    >
      <div class="picBox">
        <el-image
          ref="picBox"
          :src="picUrl"
          :preview-src-list="srcList"
          class="enlarge"
        />
      </div>
    </el-dialog> -->
    <preview v-if="fileList1" ref="preview" :file-url="picUrl" :file-list="fileList1" />
  </div>
</template>

<script>
import { uploadFrontImage } from '@/api/litigant/litigant'
import { limitFileSize } from '@/utils/tools.js'
import preview from '@/components/preview/index'
export default {
  name: 'UploadFile',
  components: {
    preview
  },
  props: {
    imgType: {
      type: String,
      default: ''
    },
    isUpload: {
      type: String,
      default: ''
    },
    accept: { // 上传文件的限制格式
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      fileList: [],
      picUrl: '',
      handleIsUpload: '',
      fileList1: []
    }
  },
  computed: {
    srcList() {
      return [this.picUrl]
    }
  },
  watch: {
    isUpload() {
      this.handleIsUpload = this.isUpload && this.isUpload.split('/').pop()
      console.log(this.handleIsUpload)
      this.$forceUpdate()
    }
  },
  created() {
    this.handleIsUpload = ''
    this.fileList = []
  },
  mounted() {

  },
  methods: {
    // 清空
    reset() {
      this.fileList = []
    },
    handleChange(e) {
      if (e.target.files.length < 1) return
      const fileList = Object.values(e.target.files)
      const formData = new FormData()
      console.log(fileList)
      for (const item of fileList) {
        formData.append('file', item)
      }
      if (limitFileSize(fileList[0])) { // 限制文件大小不能超过20M
        return
      }
      uploadFrontImage(formData).then(({ state, url, message }) => {
        if (state === 100) {
          this.$message.success(message)
          this.fileList = fileList
          this.picUrl = url
          this.$emit('getUrl', url, this.imgType)
        }
      })
    },
    submit() {
      this.$refs.selectFile.click()
    },
    clearFiles() {
      this.fileList = []
      return true
    },
    delFile() {
      this.fileList = []
      this.$emit('getUrl', '', this.imgType)
    },
    enlarge() {
      this.isUpload && (this.picUrl = this.isUpload)
      console.log(this.picUrl)
      console.log('this.picUrl')
      this.fileList1 = []
      // this.dialogTableVisible = true
      this.$refs.preview.show()
    }
  }
}
</script>

<style scoped lang = "scss">
  .picBox {
    width: 90%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
