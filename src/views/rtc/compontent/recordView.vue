<template>
  <div class="record-view-wrapper">
    <div class="content-top">
      <div
        class="back-btn"
        @click="hideRecordView"
      >
        <i class="el-icon-arrow-right" />
      </div>
      <div
        class="view-box"
        @click="viewPDF"
      >
        <div
          class="click-div"
          @click="viewPDF"
        />
        <mIframe
          :url="href"
          :width="200"
          :height="300"
        />
      </div>
      <div
        v-show="isShowQrcode"
        class="qrcode-wrappper"
      >
        <div
          id="qrcode"
          ref="qrcode"
        />
      </div>
    </div>
    <div class="content-bottom">
      <div class="btn-wrapper1">
        <el-button
          round
          class="code-btn"
          @click="getQRcode"
        >扫码确认签字</el-button>
      </div>
      <div class="btn-wrapper1">
        <el-button
          round
          class="down-btn"
          @click="download"
        >下载笔录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { OFFICE365RUL, OFFICE365ID, SERVICEURL } from '@/utils/constVal.js'
import mIframe from '@/components/mIframe/mIframe.vue'
export default {
  components: {
    mIframe
  },
  props: {
    href: null,
    caseId: null
  },
  data() {
    return {
      isShowQrcode: false
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 隐藏预览部分
    hideRecordView() {
      this.$emit('hideRecordView')
    },
    // 下载笔录
    download() {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = `https://cstj.olcourt.cn/api/${this.href}`
      document.body.appendChild(link)
      link.click()
    },
    // 预览pdf
    viewPDF() {
      console.log('123')
      window.open(
        `${OFFICE365RUL}?i=${OFFICE365ID}&ssl=1&furl=${SERVICEURL}${this.href}`
      )
    },
    // 生成二维码
    getQRcode() {
      this.isShowQrcode = !this.isShowQrcode
      // https://cstj.olcourt.cn/handWriting
      document.getElementById('qrcode').innerHTML = ''
      const url = `${SERVICEURL}handWriting?userId=${this.$store.state.user.loginId}&caseId=${this.caseId}`
      console.log(url)
      new QRCode('qrcode', {
        width: 100,
        height: 100,
        text: url
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.record-view-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  width: 370px;
  height: 100%;
  backdrop-filter: blur(20px) brightness(110%);
  .content-top {
    position: relative;
    width: 100%;
    height: 60%;
    background-color: rgba(0, 0, 0, 0.2);
    position: relative;
    .qrcode-wrappper {
      position: absolute;
      height: 250px;
      width: 100%;
      backdrop-filter: blur(10px);
      bottom: 0;
      background: rgba(255, 255, 255, 0.5);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .view-box {
      position: absolute;
      bottom: 0px;
      right: 85px;
      background-color: #fff;
      width: 200px;
      height: 300px;
      z-index: 1;
      cursor: pointer;
      .click-div {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }
      iframe {
        width: 100%;
        height: 100%;
      }
    }
    .back-btn {
      position: absolute;
      top: 70px;
      left: 20px;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.12);
      cursor: pointer;
      i {
        color: $themeColor;
        font-size: 18px;
        font-weight: bold;
        position: relative;
        top: 2px;
      }
    }
  }
  .content-bottom {
    width: 100%;
    height: 40%;
    background-color: rgba(0, 0, 0, 0.9);
    padding-top: 40px;
    .btn-wrapper1 {
      text-align: center;
      width: 100%;
      .el-button {
        width: 150px;
        margin-top: 15px;
      }
      .code-btn {
        background: $themeColor;
        color: #fff;
        border-color: $themeColor;
      }
      .down-btn {
        background: rgba(0, 0, 0, 1);
        color: $themeColor;
        border-color: $themeColor;
      }
    }
  }
  :v-deep .WACFrameWord {
    background: red;
  }
}
</style>
