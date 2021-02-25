<template>
  <div class="pdf-iframe">
    <!-- <div class="iframe-box" @click="open(srcAry[pdfIndex])"> -->
    <div class="iframe-box">
      <iframe :src="srcAry[pdfIndex]" class="iframe" />
      <div v-if="pdfLenth > 1" class="btn-wrapper">
        <a v-show="pdfIndex != 0"><i class="el-icon-arrow-left" @click.stop="prev" /></a>
        <a v-show="pdfIndex != srcAry.length-1"><i class="el-icon-arrow-right" @click.stop="next" /></a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID,
  HWYURL
} from '@/utils/constVal.js'
import { getPreviewUrl } from '@/api/common/common.js'
export default {
  components: {

  },
  props: {
    pdfUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      srcAry: [],
      pdfLenth: '',
      pdfIndex: 0
    }
  },
  created() {
    this.dealSrc()
  },
  mounted() {

  },
  methods: {
    open(url) {
      window.open(url)
    },
    dealSrc() {
      this.srcAry = []
      this.pdfLenth = this.pdfUrl.split(',').length
      this.pdfUrl.split(',').forEach(item => {
        let url = item
        if (item.indexOf(HWYURL) == -1) {
          url = `${SERVICEURL}${item}`
        }
        if (this.isPdf(url)) {
          this.srcAry.push(`${url}`)
        } else {
          getPreviewUrl(`${url}`).then(res => {
            if (res.code === 200) {
              this.lookUrl = res.data.wpsUrl
              this.srcAry.push(res.data.wpsUrl)
            } else {
              this.$message.error('预览文件失败')
              return ''
            }
          })
        }
      })
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
    // 上一张
    prev() {
      if (this.pdfIndex == 0) {
        return
      }
      this.pdfIndex--
    },
    next() {
      if (this.pdfIndex == this.pdfLenth - 1) {
        return
      }
      this.pdfIndex++
    }
  }
}
</script>

<style scoped lang="scss">
.pdf-iframe {
  width: 100%;
  height: 100%;
  .iframe-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .iframe {
    width: 80%;
    height: 95%;
  }
  .btn-wrapper {
    position: absolute;
    z-index: 100;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    width: 80%;
    padding: 0px 40px;
    a {
      height: 50px;
      width: 50px;
      cursor: pointer;
      transition: .3s;
      border-radius: 50%;
      background-color: rgba(31,45,61,.11);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      float: left;
      &:last-child {
        float: right;
      }
    }
  }
}
</style>
