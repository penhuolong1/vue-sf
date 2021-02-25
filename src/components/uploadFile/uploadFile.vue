<template>
  <div class="upload-file-wrapper1">
    <editBtn
      v-if="isButton"
      :is-edit="isEditData"
      :is-need-add="imgsUrlData.length > 0 && imgsUrlData.length < maxImgNum"
      :is-need-del="false"
      :is-add-file="isAddFile"
      @edit="edit"
      @save="save"
      @add="uploadFile"
    />
    <div class="upload-has-file">
      <div
        v-for="(item, index) in imgsUrlData"
        :key="index"
        class="file-item"
        @click="lookFile(item)"
      >
        <div class="name">{{ getFileName(item) }}</div>
        <div
          v-show="isEditData"
          class="del"
          @click.stop
          @click="delFile(index)"
        >
          <i class="el-icon-delete" />
        </div>
      </div>
    </div>
    <input
      ref="file"
      type="file"
      style="display:none;"
      :accept="acceptType"
      @change="getFile($event)"
    >
    <div
      v-show="imgsUrlData.length == 0"
      class="upload-file-btn"
    >
      <img
        class="upload-img"
        src="@/assets/img/uploadEnclosure.png"
        @click="uploadFile"
      >
      <div class="tip">{{ tip }}</div>
      <div class="title">{{ title }}</div>
    </div>
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
    </modal>
  </div>
</template>

<script>
import modal from '@/components/modal/modal'
import editBtn from '@/components/button/editButton'
import { uploadProof } from '@/api/case/index.js'
import { limitFileSize } from '@/utils/tools.js'
import { getPreviewUrl } from '@/api/common/common.js'
import {
  BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID
} from '@/utils/constVal.js'
export default {
  components: {
    editBtn,
    modal
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
      default: 'docx,doc&pdf最大20MB'
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
      isEditData: this.isEdit,
      acceptType: '.doc,.pdf,.docx',
      isSubmit: false, // 模态框是否需要提交按钮
      modalVisible: false,
      lookUrl: '', // 预览文件路径
      isImg: true // 判断是否为图片
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
    imgUrls: {
      handler() {
        this.imgsUrlData = this.imgUrls
        console.log('--证据信息--')
        console.log(this.imgsUrlData)
      },
      deep: true
    },
    isEdit() {
      this.isEditData = this.isEdit
    }
  },
  created() {
    this.imgsUrlData = this.imgUrls || []
    console.log('--证据信息--')
    console.log(this.imgsUrlData)
  },
  mounted() {},
  methods: {
    edit() {
      this.isEditData = true
    },
    save() {
      this.$emit('saveFile')
      this.isEditData = false
    },
    uploadFile() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    // 上传图片
    getFile(e) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      this.isEditData = true
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return
      }
      param.append('file', file) // 通过append向form对象添加数据
      uploadProof(param).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.imgsUrlData.push(res.url)
        }
      })
    },
    // 删除文件
    delFile(index) {
      this.imgsUrlData.splice(index, 1)
    },
    // 预览文件
    lookFile(file) {
      // this.modalVisible = true
      this.isImg1(file)
      if (this.isImg) {
        this.lookUrl = file
        window.open(this.lookUrl)
      } else {
        if (file.split('.').pop() == 'pdf' || file.split('.').pop() == 'PDF') {
          window.open(this.lookUrl)
          return
        }
        getPreviewUrl(file).then(res => {
          this.lookUrl = res.data.wpsUrl
          window.open(this.lookUrl)
        })
        // this.lookUrl = `${OFFICE365RUL}?i=${OFFICE365ID}&ssl=1&furl=${SERVICEURL}/${file}`
      }
    },
    // 模态框关闭事件
    changeModalVisible() {
      this.modalVisible = false
    },
    // 判断是否为图片
    isImg1(url) {
      let flag = false
      if (
        url.indexOf('doc') > -1 ||
        url.indexOf('docx') > -1
      ) {
        flag = false
      } else {
        flag = true
      }
      this.isImg = flag
    }
  }
}
</script>

<style scoped lang="scss">
.upload-file-wrapper1 {
  width: 100%;
  height: 100%;
  .upload-has-file {
    width: 100%;
    max-width: 500px;
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer;
    .file-item {
      display: flex;
      line-height: 25px;
      justify-content: space-between;
      .del {
        cursor: pointer;
      }
    }
  }
  .upload-file-btn {
    width: 100%;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 10px;
    .tip {
      font-size: 12px;
      color: #8a92a5;
      margin-top: 5px;
    }
    .title {
      font-size: 16px;
      color: #2475fe;
      margin-top: 5px;
    }
    .upload-img {
      width: 115px;
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
}
</style>
