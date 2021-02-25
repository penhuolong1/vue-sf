<template>
  <el-dialog
    :title="'预览证据'"
    :visible.sync="dialogVisible1"
    :modal-append-to-body="true"
    append-to-body
  >
    <div class="look-wrapper">
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
      <el-button type="primary" @click="download">下 载</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID
} from '@/utils/constVal.js'
export default {
  name: 'Preview',
  data() {
    return {
      dialogVisible1: false,
      isImg: false,
      lookUrl: ''
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    preview(item) {
      let url = ''
      const file = item.url
      this.isImg1(file)
      if (this.isImg) {
        url = `${BASEIMGURL}/${file}`
      } else {
        if (this.isPdf(file)) {
          url = `${SERVICEURL}/${file}`
        } else {
          url = `${OFFICE365RUL}?i=${OFFICE365ID}&ssl=1&furl=${SERVICEURL}/${file}`
        }
      }
      this.lookUrl = url
      this.dialogVisible1 = true
    },
    // 判断是否为图片
    isImg1(url) {
      let flag = false
      const imgArr = ['img', 'IMG', 'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
      if (
        imgArr.indexOf(url) == -1
      ) {
        flag = false
      } else {
        flag = true
      }
      this.isImg = flag
    },
    isPdf(url) { // 判断文件是否为pdf
      let flag = false
      if (
        url.indexOf('pdf') > -1
      ) {
        flag = true
      } else {
        flag = false
      }
      return flag
    },
    // 下载证据
    download() {
      this.downFile(this.downUrl)
    }
  }
}
</script>

<style scoped lang = "scss">

</style>
