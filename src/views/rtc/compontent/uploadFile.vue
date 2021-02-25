<template>
  <div class="upload-file-wrapper">
    <div
      class="back"
      @click="back"
    >
      <i class="el-icon-arrow-left" />
    </div>
    <div
      class="submit"
      @click="submit"
    >
      <img src="@/assets/img/submit.png">
    </div>
    <div
      class="add"
      @click="add"
    >
      <img src="@/assets/img/add.png">
    </div>
    <div class="content">
      <uploadFile
        ref="uploadFile"
        :is-edit="isEditData"
        :img-urls="imgUrls"
        :max-img-num="12"
        :tip="tip"
        :title="meterialsTitle"
        :is-button="false"
      />
    </div>
  </div>
</template>

<script>
import uploadFile from '@/components/uploadFile/uploadFile.vue'
export default {
  components: {
    uploadFile
  },
  props: {},
  data() {
    return {
      fileUrlArray: [],
      isEditData: true,
      tip: 'pdf,jpg,doc&pdf最大20M',
      imgUrls: [],
      meterialsTitle: '附件上传'
    }
  },
  created() {},
  mounted() {},
  methods: {
    getFile(e) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      this.isEditData = true
      param.append('file', file) // 通过append向form对象添加数据
      uploadFile(param).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          const data = res.data
          const obj = {
            name: data.picture_show_name,
            url: data.picture_server_path
          }
          this.fileUrlArray.push(obj)
        }
      })
    },
    back() {
      this.$emit('backFile')
    },
    submit() {
      // let fileUrlArray = this.$refs.file
      // console.log(this.$refs.uploadFile.imgsUrlData)
      const array = this.$refs.uploadFile.imgsUrlData
      this.$emit('submitFile', array)
    },
    add() {
      this.$refs.uploadFile.uploadFile()
    },
    delFile(url) {
      const index = this.fileUrlArray.indexOf(url)
      this.fileUrlArray.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.upload-file-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px) brightness(110%);
  z-index: 10;
  display: flex;
  .back {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    -webkit-box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.12);
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 40px;
    top: 20px;
    right: 20px;
    cursor: pointer;
    i {
      color: #2475fe;
      font-size: 18px;
      font-weight: bold;
      position: relative;
      top: 2px;
    }
  }
  .content {
    width: 100%;
    padding-top: 200px;
  }
  .add,
  .submit {
    position: absolute;
    width: 40px;
    height: 40px;
    cursor: pointer;
    top: 20px;
    right: 150px;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .add {
    right: 90px;
  }
}
.file-item {
  color: white !important;
}
</style>
