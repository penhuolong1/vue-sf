<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="80%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div class="wrapper">
      <div v-if="fileList && fileList.length > 0 && fileIndex!==0" class="prev btn" @click="prev">
        <i class="el-icon-arrow-left" />
      </div>
      <div class="content">
        <img v-if="isImgFlag" :src="url" alt="">
        <iframe v-if="!isImgFlag" class="iframe" :src="url" alt="" />
      </div>
      <div v-if="fileList && fileList.length > 0 && fileIndex < fileList.length-1" class="next btn" @click="next">
        <i class="el-icon-arrow-right" />
      </div>
    </div>
    <div v-if="isDown" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="downLoad">下载</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  SERVICEURL,
  HWYURL
} from '@/utils/constVal.js'
import { getPreviewUrl, fileDownload } from '@/api/common/common.js'
export default {
  components: {

  },
  props: {
    title: {
      type: String,
      default: '预览'
    },
    fileList: {
      type: Array,
      default: null
    },
    fileUrl: {
      type: String,
      default: ''
    },
    isDown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      url: '',
      fileIndex: 0,
      isImgFlag: true
    }
  },
  computed: {
  },
  watch: {
    fileUrl() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    // 初始化数据
    init() {
      if (!this.fileUrl) {
        return
      }
      this.getUrl(this.fileUrl)
      this.getFileIndex()
    },
    getUrl(url) {
      if (!url || url.length == 0) {
        return
      }
      if (url.indexOf(HWYURL) === -1) {
        url = SERVICEURL + url
      }
      this.url = url
      if (this.isImg(url)) {
        // if (url[0] != '/') {
        //   url = '/' + url
        // }
      } else {
        if (this.isPdf(url)) {
        } else {
          getPreviewUrl(this.url).then(res => {
            if (res.code === 200) {
              this.url = res.data.wpsUrl
            } else {
              this.$message.error('预览文件失败')
            }
          })
        }
      }
    },
    isPdf(url) {
      if (url.indexOf('pdf') > -1) {
        return true
      } else {
        return false
      }
    },
    isImg(url) { // 判断是不是图片
      if (!url || url.length == 0) {
        return
      }
      const imgArr = ['img', 'IMG', 'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
      const label = url.split('.').pop()
      let flag = false
      if (
        imgArr.indexOf(label) == -1
      ) {
        flag = false
      } else {
        flag = true
      }
      this.isImgFlag = flag
      return flag
    },
    getFileIndex(list, url) {
      list = list || this.fileList
      const url1 = url || this.fileUrl
      this.fileIndex = list.findIndex(item => {
        return url1.indexOf(item) != -1
      })
      console.log(this.fileIndex)
    },
    prev() {
      this.fileIndex--
      this.url = this.fileList[this.fileIndex]
      this.getUrl(this.url)
    },
    next() {
      this.fileIndex++
      this.url = this.fileList[this.fileIndex]
      this.getUrl(this.url)
    },
    show(url, list) {
      this.getUrl(url || this.fileUrl)
      this.getFileIndex(list, url)
      this.dialogVisible = true
    },
    downLoad() {
      let url = this.fileList[this.fileIndex]
      if (url.indexOf(HWYURL) === -1) {
        url = SERVICEURL + url
      }
      fileDownload(url)
      // const a = document.createElement('a')
      // a.download = ''
      // a.href = this.fileList[this.fileIndex]
      // console.log(this.fileList[this.fileIndex])
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  min-height: 300px;
  position: relative;
  display: flex;
  align-content: center;
  padding: 0 100px;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    img {
      max-width: 100%;
    }
    .iframe {
      width: 100%;
      min-height: 500px;
    }
  }
  .btn {
    position: absolute;
    top: 50%;
    width: 50px;
    height: 50px;
    left: 0px;
    color: #000;
    border-radius: 50%;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(-50%);
    cursor: pointer;
    &.next {
      right: 0px;
      left: auto;
    }
  }
}
</style>
