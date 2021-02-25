<template>
  <div class="wrapper" @click="upload">
    <span v-if="!name" class="tip">请选择</span>
    <span v-if="name" class="file-name">{{ name }}</span>
    <span class="btn">
      <i v-if="!name" class="el-icon-upload" />
      <i v-if="name" class="el-icon-error" @click.stop="reset" />
    </span>
    <input ref="file" type="file" style="display: none" accept=".pdf,.PDF,.doc,.docx" @change="getFile($event)">
  </div>
</template>

<script>
import { upFile } from '@/api/case/index'
export default {
  components: {

  },
  props: {
    fileName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      name: '',
      file: null
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 重置
    reset() {
      this.name = ''
      this.file = null
      this.$emit('input', null)
    },
    // 获取文件流
    upload() {
      this.$refs.file.value = ''
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      this.name = file.name
      const param = new FormData() // 创建form对象
      param.append('file', file)
      param.append('name', this.fileName)
      upFile(param).then(res => {
        if (res.state === 100) {
          this.$emit('input', res.data)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  height: 40px;
  border-radius: 5px;
  padding: 0 15px;
  padding-right: 40px;
  position: relative;
  cursor: pointer;
  .file-name {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  }
  .tip {
    color: #C0C4CC;
  }
  .btn {
    position: absolute;
    right: 0px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    color: #007aff;
    i {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
