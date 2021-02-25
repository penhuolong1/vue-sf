<template>
  <div>
    <modal
      :title="'文件预览'"
      :modal-visible="modalVisible"
      :is-submit="isSubmit"
      @changeModalVisible="changeModalVisible"
    >
      <div class="look-wrapper">
        <img
          v-if="isImg"
          :src="lookUrl"
        >
        <iframe
          v-if="!isImg"
          :src="lookUrl"
          width="100%"
          height="100%"
          style="min-height: 500px;"
        />
      </div>
      <div class="look-footer">
        <div v-if="urlIndex != 0" class="look-footer-left" @click="prev">
          <i class="el-icon-arrow-left" />
        </div>
        <div v-if="urlIndex != this.eviData.length-1" class="look-footer-right" @click="next">
          <i class="el-icon-arrow-right" />
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import modal from '@/components/modal/modal'
import { detailEviById, uploadImg, addOrUpdateEvi } from '@/api/case/index'
import {
  BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID
} from '@/utils/constVal.js'
export default {
  components: {
    modal
  },
  props: {
    eviId: null
  },
  data() {
    return {
      eviData: [], // 证据详情
      baseImgUrl: BASEIMGURL,
      preview: new Date().getTime(),
      eviInfo: '', // 证据信息
      modalVisible: false,
      isSubmit: false,
      lookUrl: '',
      isImg: true,
      urlIndex: 0
    }
  },
  computed: {
    getFileName() {
      return url => {
        return url.split('/').pop()
      }
    }
  },
  watch: {
    eviId() {
      this.getEviDetail()
    }
  },
  created() {
    this.getEviDetail()
  },
  mounted() {},
  methods: {
    // 获取证据详情
    getEviDetail() {
      detailEviById({
        eviId: this.eviId
      }).then(res => {
        if (res.state == 100) {
          this.eviData = []
          this.eviInfo = res.evi
          if (
            res.evi.evidenceAttachments &&
            res.evi.evidenceAttachments.length > 0
          ) {
            res.evi.evidenceAttachments.forEach(item => {
              this.eviData.push(item.url)
            })
            this.lookFile(this.eviData[0])
            this.modalVisible = true
          } else {
            this.modalVisible = false
            this.$message({
              showClose: true,
              message: '无证据材料',
              type: 'error'
            })
          }
        }
      })
    },
    // 点击触发file事件
    uploadImg() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    // 上传文件
    getFile(e) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      this.isEditData = true
      param.append('file', file) // 通过append向form对象添加数据
      uploadImg(param).then(res => {
        if (res.state === 100) {
          this.eviData.push(res.url)
          this.uploadEviImg()
        }
      })
    },
    // 上传证据图片
    uploadEviImg() {
      const params = {
        eviId: this.eviId,
        urls: this.eviData.join(','),
        eviName: this.eviInfo.evidenceName,
        objectOfProof: this.eviInfo.objectOfProof,
        source: this.eviInfo.source
      }
      addOrUpdateEvi(params).then(res => {
        if (res.state == 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    // 返回
    back() {
      this.$emit('backVideoEvi')
    },
    // 删除图片
    delEviImg(index) {
      this.eviData.splice(index, 1)
      this.uploadEviImg()
    },
    // 预览
    lookFile(file) {
      let url = ''
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
      // window.open(url)
    },
    // 判断是否为图片
    isImg1(url) {
      let flag = false
      if (
        url.indexOf('doc') > -1 ||
        url.indexOf('docx') > -1 ||
        url.indexOf('pdf') > -1
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
    changeModalVisible() {
      this.modalVisible = false
      this.$emit('backVideoEvi')
    },
    // 上一个证据
    prev() {
      this.urlIndex--
      this.lookFile(this.eviData[this.urlIndex])
    },
    // 下一个证据
    next() {
      this.urlIndex++
      this.lookFile(this.eviData[this.urlIndex])
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.upload-video-evi-wrapper {
  width: 100%;
  position: absolute;
  height: 350px;
  bottom: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 100;
  padding: 30px;
  display: flex;
  padding-top: 70px;
  .back {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: $themeColor;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
  }
  .img-wrapper {
    display: flex;
    justify-content: space-between;
    line-height: 25px;
    color: white;
    cursor: pointer;
  }
}
.look-wrapper {
  width: 100%;
  max-height: 600px;
  overflow: auto;
  text-align: center;
}
.look-wrapper img {
  min-width: 200px;
  max-width: 500px;
}
.look-footer {
  display: flex;
  justify-content: center;
  &>div{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 10px;
    background-color: #F1F4F7;
    cursor: pointer;
  }
}
</style>
