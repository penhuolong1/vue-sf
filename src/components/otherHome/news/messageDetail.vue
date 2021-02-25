<template>
  <div class="message-box">
    <div class="header top">
      <div>
        {{ detail.sendName }}
      </div>
      <div>
        {{ detail.sendDate | timeDate('YYYY-MM-DD H:m') }}
      </div>
      <div style="text-align: right;">
        <el-button type="text" @click="back">返回列表</el-button>
      </div>
    </div>
    <el-row class="header" style="height: auto;">
      <el-row>
        {{ detail.title }}
      </el-row>
      <el-row v-html="detail.content" />
    </el-row>
    <el-row class="file">
      <div>附件</div>
      <el-tag v-if="detail.fileUrl && detail.fileUrl.length == 0" tsype="warning" style="margin-left: 20px;">无</el-tag>
      <div v-if="detail.fileUrl && detail.fileUrl.length > 0" class="fileBox">
        <el-tag v-for="(item,index) in detail.fileUrl" :key="index" type="success" style="cursor: pointer;margin-bottom: 10px;" @click="showFileInfo(item)">{{ detail.fileName[index] }}</el-tag>
      </div>
    </el-row>
    <el-dialog
      title="预览附件"
      :visible.sync="dialogVisible1"
      :modal-append-to-body="true"
      append-to-body
    >
      <div style="display: flex;justify-content: center;">
        <el-image
          v-if="isImg"
          :src="lookUrl"
        />
        <iframe
          v-if="!isImg"
          :src="lookUrl"
          width="100%"
          height="100%"
          style="min-height: 500px;"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="downLoad">下 载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detailById } from '@/api/news/news'
import { mapGetters } from 'vuex'
import {
  BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID,
  HWYURL
} from '@/utils/constVal.js'
import { getPreviewUrl } from '@/api/common/common.js'
export default {
  name: 'MessageDetail',
  props: {
    getCount: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      detail: {},
      dialogVisible1: false,
      isImg: false,
      lookUrl: '',
      downloadUrl: ''
    }
  },
  computed: {
    ...mapGetters(['getUniqueId'])
  },
  watch: {
    getUniqueId() {
      console.log(1)
      this.detailById()
    }
  },
  mounted() {
    console.log(2)
    this.detailById()
    this.getCount()
  },
  methods: {
    back() {
      this.$emit('show', 'messageBox')
    },
    downLoad() {
      const a = document.createElement('a')
      a.download = ''
      a.href = `${location.origin}${this.downloadUrl}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    // 文件预览
    showFileInfo(path) {
      this.isImg1(path)
      console.log(this.isImg)
      this.lookUrl = ''
      this.downloadUrl = path
      const name = path.substring(path.lastIndexOf('.') + 1)
      console.log(path)
      if (path.indexOf(HWYURL) == -1) {
        path = `${SERVICEURL}${path}`
      }
      if (this.isImg || name == 'pdf') {
        this.lookUrl = path
      } else {
        getPreviewUrl(path).then(res => {
          if (res.code === 200) {
            this.lookUrl = res.data.wpsUrl
          } else {
            this.$message.error('预览文件失败')
          }
        })
      }
      this.dialogVisible1 = true
    },
    // 判断是否为图片
    isImg1(url) {
      const imgArr = ['img', 'IMG', 'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
      let flag = false
      const name = url.substring(url.lastIndexOf('.') + 1)
      if (
        imgArr.indexOf(name) == -1
      ) {
        flag = false
      } else {
        flag = true
      }
      this.isImg = flag
    },
    // 查询公告详情
    detailById() {
      this.detail = {}
      detailById({ afficheId: this.getUniqueId }).then(res => {
        if (res.state == 100) {
          this.detail = { ...res.affiche }
          if (this.detail.fileUrl) {
            this.detail.fileUrl = res.affiche.fileUrl.split(';;')
          } else {
            this.detail.fileUrl = []
          }
          if (this.detail.fileName) {
            this.detail.fileName = res.affiche.fileName.split(';;')
          } else {
            this.detail.fileName = []
          }
          console.log(this.detail)
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
  .message-box {
    padding: 25px;
    .header {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #E8ECEF;
    }
    .top{
      display: flex;
      justify-content: space-between;
    }
    .file{
      display: flex;
      margin-top:20px;
      border-bottom: 1px solid #E8ECEF;
    }
    .fileBox{
      display: flex;
      flex-direction: column;
      margin-left: 20px;
    }
  }
</style>
