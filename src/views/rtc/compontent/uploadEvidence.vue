<template>
  <div class="upload-evidence-wrapper">
    <materials
      ref="materials"
      :max-img-num="6"
      :is-edit="true"
      :is-button="false"
      :tip="tip"
      :title="materials"
    />
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
  </div>
</template>

<script>
import materials from '@/components/materials/materials'
export default {
  components: {
    materials
  },
  props: {},
  data() {
    return {
      materials: '照片上传',
      tip: 'png,jpg最大20M'
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 隐藏上传图片组件
    back() {
      this.$emit('back')
    },
    // 提交发到聊天记录
    submit() {
      const imgArray = this.$refs.materials.imgsUrlData
      if (!imgArray || imgArray.length == 0) {
        this.$message({
          showClose: true,
          message: '至少上传一张图片',
          type: 'error'
        })
        return
      }
      this.$emit('submitImg', imgArray)
    },
    // 添加图片
    add() {
      this.$refs.materials.uploadImg()
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.upload-evidence-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px) brightness(110%);
  z-index: 10;
  .back {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 40px;
    top: 20px;
    right: 20px;
    cursor: pointer;
    i {
      color: $themeColor;
      font-size: 18px;
      font-weight: bold;
      position: relative;
      top: 2px;
    }
  }
  .submit,
  .add {
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
</style>
