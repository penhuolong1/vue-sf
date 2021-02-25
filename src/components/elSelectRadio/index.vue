<template>
  <el-select v-model="selectValue" :size="size" style="width: 100%;" :placeholder="placeholder" clearable @clear="reset" @change="change">
    <el-option :value="option" style="height: auto">
      <div @click.stop="stopClick">
        <el-button type="primary" size="mini" @click.stop="uploadFile">上传</el-button>
        <span class="tip">(只能选择pdf格式的文件)</span>
      </div>
      <input ref="file" type="file" style="display: none;" accept=".pdf" @change="getFile2($event)">
      <el-radio-group v-model="radio" @click.stop.native="stopClick">
        <el-radio v-for="item in listFile" :key="item.id" :label="item.id" :disabled="item.disabled">
          <span @click.stop="preview(item)">{{ item.name }}</span>
        </el-radio>
      </el-radio-group>
      <div v-if="!listFile || listFile.length < 1" class="no-data">暂无数据</div>
    </el-option>
    <preview v-if="fileList" ref="preview" :file-url="fileUrl" :file-list="fileList" />
  </el-select>
</template>

<script>
import {
  uploadMediateFiles
} from '@/api/dossier/dossier.js'
import { saveMediateFile } from '@/api/case/index.js'
import { mapGetters } from 'vuex'
import { limitFileSize } from '@/utils/tools.js'
import preview from '@/components/preview/index'
export default {
  components: {
    preview
  },
  props: {
    size: { // select 大小 medium/small/mini
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择所属单位'
    },
    type: {
      type: Number,
      default: 1 // 1为调解协议 2为司法确认申请书
    }
  },
  data() {
    return {
      selectValue: '',
      option: null,
      searchInput: '',
      isTree: true,
      listFile: [],
      radio: null,
      fileUrl: null,
      fileList: null
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getDirList', 'getCaseInfo'])
  },
  watch: {
    radio() {
      this.$emit('input', this.radio)
      this.$emit('change', this.radio)
      if (!this.radio) {
        return
      }
      this.selectValue = this.listFile.find(item => item.id === this.radio).name
    },
    getDirList() {
      this.init()
    }
  },
  created() {
    console.log(this.getDirList)
    this.init()
  },
  mounted() {

  },
  methods: {
    change() {
    },
    // 清空
    reset() {
      this.selectValue = ''
      this.radio = null
      this.$emit('input', '')
    },
    init() {
      if (this.type === 1) { // 调解协议
        console.log('调解协议')
        this.listFile = this.getDirList.find(item => item.type === 10).listFile
      } else { // 司法确认申请书
        console.log('司法确认申请书')
        this.listFile = this.getDirList.find(item => item.type === 12).listFile
      }
      console.log(this.listFile)
      if (!this.listFile && this.listFile.length === 0) {
        return
      }
      this.listFile = this.listFile.map(item => {
        item.path = item.path || item.wordPath
        if (item.name.indexOf('.pdf') === -1) {
          item.disabled = true
        }
        return item
      })
      this.fileList = this.listFile.map(item => {
        return item.path
      })
    },
    stopClick() {
      console.log('阻止事件冒泡')
    },
    preview(item) {
      this.fileUrl = item.path
      this.$refs.preview.show(this.fileUrl, this.fileList)
    },
    // 上传文件
    uploadFile() {
      this.$refs.file.value = ''
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    getFile2(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      param.append('caseId', this.getCaseInfo.id) // 通过append向form对象添加数据
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return
      }
      this.$Message.loading({
        content: '正在上传，请稍后...',
        duration: 0
      })
      uploadMediateFiles(param).then(res => {
        if (res.state === 100) {
          saveMediateFile({
            caseId: this.getCaseInfo.id,
            url: res.url,
            dirTypeId: this.type === 1 ? '10' : '12',
            upload: true
          }).then(rs => {
            this.$Message.destroy()
            if (rs.state === 100) {
              this.$message({
                showClose: true,
                message: '上传成功',
                type: 'success'
              })
              this.$store.dispatch('GetListDirType')
            }
          })
        } else {
          this.$Message.destroy()
        }
      })
    }
  }
}
</script>
<style>
.ivu-message {
  z-index: 9999!important;
}
</style>
<style scoped lang="scss">
::v-deep.el-select-dropdown__item.hover{
  background-color: #fff;
}
::v-deep.el-radio {
  display: block;
  margin: 8px 0px;
}
.no-data {
  text-align: center;
}
.tip {
  color: #c0c4cc;
}
</style>
