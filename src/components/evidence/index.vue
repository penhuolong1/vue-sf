<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      width="500px"
      :title="title"
      append-to-body
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="form" :model="form" :class="{'isNoEdit':!isEdit }" :rules="eviRules">
        <el-form-item label="提供人" prop="litigantId" :label-width="formLabelWidth">
          <el-select v-if="isEdit" v-model="form.litigantId" style="width: 100%;" placeholder="请选择当事人">
            <el-option v-for="(item,index) in litigantList" :key="index" :label="item.litigantName" :value="item.id" />
          </el-select>
          <div v-if="!isEdit" class="label">{{ litigantName }}</div>
        </el-form-item>
        <el-form-item label="证据名称" prop="eviName" :label-width="formLabelWidth">
          <el-input v-if="isEdit" v-model="form.eviName" maxlength="120" />
          <div v-if="!isEdit" class="label">{{ form.eviName }}</div>
        </el-form-item>
        <el-form-item label="提供时间" prop="provideDate" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.provideDate" /> -->
          <el-date-picker
            v-if="isEdit"
            v-model="form.provideDate"
            style="width: 100%;"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
          <div v-if="!isEdit" class="label">{{ form.provideDate }}</div>
        </el-form-item>
        <el-form-item label="证据文件" :label-width="formLabelWidth">
          <el-upload
            v-if="isEdit"
            ref="upload"
            action="/api/court/evidence/uploadProof.jhtml"
            :on-success="handleSuccess"
            accept=".jpg,.png,.doc,.docx,.pdf"
            :limit="10"
            name="file"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadSectionFile"
            :on-preview="handlePreview"
            :on-remove="remove"
            :on-exceed="exceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">证据份数不超过10份</span>
          </el-upload>
          <span v-if="!isEdit" class="img-wrapper">
            <el-tag
              v-for="(item, index) in fileList"
              :key="index"
              style="cursor: pointer;"
              type="success"
              @click="preview(item.url)"
            >{{ item.name }}</el-tag>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="upEvi">确 定</el-button>
      </div>
    </el-dialog>
    <preview ref="preview" :is-down="true" :file-list="fileUrl" :file-url="fileUrl1" />
  </div>
</template>

<script>
import rules from '@/utils/rules'
import { formatDate } from '@/utils/format.js'
import { addOrUpdateEvi } from '@/api/litigant/litigant'
import { detailEviById, uploadProof } from '@/api/case/index.js'
import preview from '@/components/preview/index'
import { limitFileSize } from '@/utils/tools.js'
export default {
  components: {
    preview
  },
  mixins: [rules],
  props: {
    litigantList: {
      type: Array,
      default: () => ([])
    },
    title: {
      type: String,
      default: '新增证据'
    }
  },
  data() {
    return {
      isLoading: false,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      fileUrl: [],
      isEdit: true,
      form: {
        litigantId: '',
        eviId: '',
        eviName: '',
        provideDate: '',
        // objectOfProof: '',
        // count: '',
        // source: '',
        urls: ''
      },
      litigantName: '',
      fileList: [],
      fileList1: [],
      fileUrl1: ''
    }
  },
  computed: {
  },
  watch: {
    dialogFormVisible(cur, old) {
      !cur && this.reset()
    }
  },
  mounted() {

  },
  methods: {
    // 上传依据
    uploadSectionFile(e) {
      var fileObj = e.file
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      uploadProof(form).then((res) => {
        this.$Message.destroy()
        if (res.state === 100) {
          const obj = {
            name: res.name,
            url: res.url
          }
          this.fileList.push(obj)
          this.fileUrl = this.fileList.map(item => { return item.url })
        }
      })
    },
    beforeAvatarUpload(file) {
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return false
      }
    },
    show(id, isEdit = true) {
      this.isEdit = isEdit
      this.getDetailEvi(id)
      this.dialogFormVisible = true
    },
    reset() {
      this.form = {
        litigantId: '',
        eviId: '',
        eviName: '',
        provideDate: '',
        urls: ''
      }
      this.fileUrl = []
      this.fileList = []
      // this.$refs['from'] && this.$refs['from'].resetFields()
    },
    upEvi() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.form.urls = this.fileUrl.join(',')
        if (!this.form.urls) {
          this.$message.error('请上传附件')
          return
        }
        this.form.count = Number(this.form.count)
        this.isLoading = true
        addOrUpdateEvi(this.form).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.$refs.upload.clearFiles()
            this.$emit('done')
          }
        }).finally(() => {
          this.isLoading = false
        })
      })
    },
    handleSuccess(response, file, fileList) {
      this.fileUrl.push(response.url)
      this.fileList = fileList
    },
    exceed() {
      this.$message.warning('最多上传10个文件！')
    },
    edit(item) {
      this.dialogFormVisible = true
      this.form = {
        litigantId: item.litigantId,
        eviId: item.id,
        provideDate: item.provideDate,
        eviName: item.evidenceName
      }
      this.fileList = []
      if (item.evidenceAttachments && item.evidenceAttachments.length > 0) {
        item.evidenceAttachments.forEach(item1 => {
          this.fileList.push({
            name: item1.name,
            url: item1.url
          })
          this.fileUrl.push(item1.url)
        })
      }
    },
    // 移除
    remove(e) {
      if (e.status != 'success') { // 判断是否是主动删除的主动删除才需要真正删除数据（解决beforeAvatarUpload会触发该事件造成bug）
        return
      }
      const index = this.fileList.findIndex(item => item.uid == e.uid)
      this.fileList.splice(index, 1)
      this.fileUrl.splice(index, 1)
    },
    // 预览文件
    handlePreview(e) {
      this.fileUrl1 = e.url
      this.$refs.preview.show(e.url, this.fileUrl)
    },
    // 预览
    preview(url) {
      this.$refs.preview.show(url)
    },
    // 获取证据详情
    getDetailEvi(id) {
      if (!id) {
        return
      }
      this.$nextTick(() => {
        this.reset()
      })
      detailEviById({ eviId: id }).then(res => {
        if (res.state === 100) {
          let url = ''
          if (res.evi.evidenceAttachments && res.evi.evidenceAttachments.length > 0) {
            url = res.evi.evidenceAttachments.map(item => {
              const obj = {
                name: item.name,
                url: item.url
              }
              this.fileUrl.push(obj.url)
              this.fileList.push(obj)
              return item.url
            }).join(',')
          }
          this.litigantName = res.evi.litigantMan
          this.form = {
            litigantId: res.evi.litigantId,
            eviId: res.evi.id,
            eviName: res.evi.evidenceName,
            provideDate: formatDate(res.evi.provideDate),
            urls: url
          }
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
.img-wrapper {
  display: flex;
  flex-direction: column;
  ::v-deep.el-tag {
    margin-bottom: 10px;
  }
}
::v-deep.el-form.isNoEdit {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
