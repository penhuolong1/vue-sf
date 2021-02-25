<template>
  <!-- 上传图片组件 -->
  <div
    class="upload-wrapper"
    :class="{borderStyle: isBorder}"
  >
    <div class="editBtn-wrapper">
      <editBtn
        v-if="isButton"
        :is-edit="isEditData"
        :is-need-add="imgsUrlData.length > 0 && imgsUrlData.length < maxImgNum"
        :is-need-del="false"
        :is-add-file="isAddFile"
        @edit="edit"
        @save="saveImg"
        @add="uploadImg"
      />
    </div>
    <input
      ref="file"
      type="file"
      style="display:none;"
      :accept="acceptType"
      @change="getFile($event)"
    >
    <div class="mater-upload-wrapper">
      <div
        class="content image-show-wrapper"
        :style="{justifyContent: justifyContent}"
      >
        <div
          v-if="imgsUrlData.length < 1"
          class="upload-content"
          @click="uploadImg()"
        >
          <img
            src="@/assets/img/materUpload.png"
            alt=""
            style="width: 115px;"
          >
          <div class="tip">{{ tip }}</div>
          <div class="title">{{ title }}</div>
        </div>
        <div
          v-for="(item, index) in imgsUrlData"
          :key="index"
          class="img-wrapper"
        >

          <img
            v-if="isImg(item)"
            :src="item"
            :preview="preview"
          >
          <mIframe
            v-if="!isImg(item)"
            style="width: 150px;height:200px;"
            :url="item"
            :width="150"
            :height="200"
          />
          <div
            v-if="isEditData"
            class="del-icon"
            @click="delImg(item)"
          >
            <i class="el-icon-error" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editBtn from '@/components/button/editButton'
import { uploadImg, uploadProof } from '@/api/case/index.js'
import { BASEIMGURL } from '@/utils/constVal.js'
import mIframe from '@/components/mIframe/mIframe.vue'
import { limitFileSize } from '@/utils/tools.js'
export default {
  components: {
    editBtn,
    mIframe
  },
  props: {
    maxImgNum: {
      type: Number,
      default: 10
    }, // 最大上传图片数
    imgUrls: null, // 父组件传来的图片数据
    isEdit: null,
    title: {
      type: String,
      default: '身份证明材料复印件上传'
    },
    isButton: {
      type: Boolean,
      default: true
    },
    isBorder: {
      type: Boolean,
      default: false
    },
    justifyContent: {
      type: String,
      default: 'center'
    },
    tip: {
      type: String,
      default: 'png、jpg、doc&pdf最大10MB'
    },
    types: {
      type: String,
      default: 'img'
    },
    isAddFile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgsUrlData: [], // 接收组件传过来的图片地址
      baseImgUrl: BASEIMGURL,
      preview: new Date().getTime(), // vue图片预览插件所需要的插件
      isEditData: this.isEdit
    }
  },
  computed: {
    // 判读类型限制上传类型
    acceptType() {
      let accept = ''
      if (this.types == 'img') {
        accept = `image/jpg,image/jpeg,image/png,`
      } else {
        accept = `.jpg,.jpeg,.png,.doc,.pdf,.docx`
      }
      return accept
    },
    isImg() {
      return function(url) {
        let flag = false
        if (
          url.indexOf('jpg') > -1 ||
          url.indexOf('jpeg') > -1 ||
          url.indexOf('png') > -1
        ) {
          flag = true
        } else {
          flag = false
        }
        return flag
      }
    }
  },
  watch: {
    imgUrls: {
      handler() {
        this.imgsUrlData = this.imgUrls
      },
      deep: true
    },
    isEdit() {
      this.isEditData = this.isEdit
    }
  },
  created() {
    this.imgsUrlData = this.imgUrls || []
    this.isEditData = this.isEdit
  },
  mounted() {},
  methods: {
    uploadImg() {
      if (this.imgsUrlData.length == this.maxImgNum) {
        this.$message({
          showClose: true,
          message: `最多能上传${this.maxImgNum}张图片`,
          type: 'error'
        })
        return
      }
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    getFile(e) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      this.isEditData = true
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return
      }
      param.append('file', file) // 通过append向form对象添加数据
      if (this.types == 'img') {
        uploadImg(param).then(res => {
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            this.imgsUrlData.push(res.url)
          }
        })
      } else {
        uploadProof(param).then(res => {
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            this.imgsUrlData.push('/' + res.url)
          }
        })
      }
    },
    delImg(img) {
      const index = this.imgsUrlData.indexOf(img)
      this.imgsUrlData.splice(index, 1)
    },
    edit() {
      this.isEditData = true
    },
    saveImg() {
      this.$emit('saveImg')
      this.isEditData = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.upload-wrapper {
  height: 100%;
  &.borderStyle {
    border: 1px dashed $themeColor;
  }
}
.mater-upload-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    text-align: center;
    .tip {
      font-size: 12px;
      color: #8a92a5;
      margin-top: 5px;
    }
    .title {
      font-size: 16px;
      color: $themeColor;
      margin-top: 5px;
    }
  }
  .image-show-wrapper {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    align-items: center;
    .no-img {
      font-size: 20px;
      color: #bababa;
    }
    .upload-content {
      flex: 1;
      cursor: pointer;
      overflow: auto;
    }
    .img-wrapper {
      flex: 1;
      height: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      padding: 10px;
      margin-right: 10px;
      position: relative;
      max-height: 500px;
      min-width: 200px;
      max-width: 400px;
      &:first-child {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
      img {
        max-height: 300px;
        max-width: 200px;
      }
      .del-icon {
        position: absolute;
        text-align: center;
        bottom: 40px;
        z-index: 40;
        cursor: pointer;
        i {
          color: #ec4c4d;
          font-size: 30px;
        }
      }
    }
  }
}
</style>
