<template>
  <div class="form-wrapper">
    <el-row :gutter="20" class="form-item">
      <el-col :span="8">
        <div class="btn-item" :class="{'active': receiveType == 1}" @click="getReceiveType(1)">接收</div>
      </el-col>
      <el-col :span="8">
        <div class="btn-item" :class="{'active': receiveType == 2}" @click="getReceiveType(2)">补正退回</div>
      </el-col>
      <el-col :span="8">
        <div class="btn-item" :class="{'active': receiveType == 3}" @click="getReceiveType(3)">不予受理</div>
      </el-col>
    </el-row>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item v-show="receiveType == 2 " label="理由" label-width="80px">
        <el-input v-model="remark" type="textarea" placeholder="请输入理由" />
      </el-form-item>
      <el-form-item v-show="receiveType == 3" label="不予受理通知书">
        <uploadinstrument v-model="file" file-name="不予受理通知书" />
      </el-form-item>
      <span v-if="receiveType == 1">
        <el-form-item label="案号" prop="caseNo">
          <el-input v-model="form.caseNo" placeholder="请输入案号" />
        </el-form-item>
        <el-form-item label="立案日期" prop="filingDate">
          <el-date-picker
            v-model="form.filingDate"
            type="datetime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="法官" prop="judge">
          <el-input v-model="form.judge" placeholder="请输入法官" />
        </el-form-item>
        <el-form-item label="法官助理">
          <el-input v-model="form.assistant" placeholder="请输入法官助理" />
        </el-form-item>
        <el-form-item label="书记员" prop="clerk">
          <el-input v-model="form.clerk" placeholder="请输入书记员" />
        </el-form-item>
        <el-form-item v-if="getCaseInfo.moveType" label="司法确认受理通知书" prop="noticeFile">
          <uploadinstrument v-model="form.noticeFile" file-name="司法确认受理通知书" />
        </el-form-item>
        <el-form-item v-if="getCaseInfo.moveType" label="民事裁定书" prop="rulingFile">
          <uploadinstrument v-model="form.rulingFile" file-name="民事裁定书" />
        </el-form-item>
      </span>
    </el-form>

    <div class="form-item footer">
      <el-button
        size="small"
        class="submit"
        icon="el-icon-check"
        :loading="loading"
        @click="submit"
      >确定</el-button>
      <el-button
        size="small"
        class="cancel"
        icon="el-icon-close"
        @click="cancel"
      >取消</el-button>
    </div>
    <preview ref="preview" />
  </div>
</template>

<script>
import { saveInfo, back, rejection } from '@/api/case/index'
import { mapGetters } from 'vuex'
import preview from '@/components/preview/index'
import { formatDate } from '@/utils/format.js'
import uploadinstrument from './uploadinstrument'
export default {
  components: {
    preview,
    uploadinstrument
  },
  props: {

  },
  data() {
    return {
      receiveType: 1, // 接收状态 1 接收 2退回
      remark: '',
      caseId: '',
      mediaterData: [],
      selectMediaterid: '',
      endtypes: ['当事人达成和解', '当事人撤诉'],
      loginCourtId: '',
      checkList: [],
      form: {},
      fileList: [],
      rules: {
        caseNo: [
          { required: true, message: '请输入案号', trigger: 'blur' }
        ],
        judge: [
          { required: true, message: '请输入法官', trigger: 'blur' }
        ],
        filingDate: [
          { required: true, message: '请选择立案日期', trigger: 'blur' }
        ],
        noticeFile: [
          { required: true, message: '请上传司法确认受理通知书', trigger: 'blur' }
        ],
        rulingFile: [
          { required: true, message: '请上传民事裁定书', trigger: 'blur' }
        ]
      },
      file: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo']),
    isMeiSuccess() {
      return this.endtypes.indexOf(this.getCaseInfo.endType) == -1
    }
  },
  watch: {
    getCaseInfo: {
      deep: true,
      handler() {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$set(this.form, 'filingDate', formatDate(new Date(), 'YYYY-MM-DD H:m:s'))
  },
  methods: {
    // 初始化数据
    init() {
      this.caseId = this.getCaseInfo.id
    },
    // 改变接收状态
    getReceiveType(index) {
      this.receiveType = index
    },
    // 取消
    cancel() {
      this.receiveType = 1 // 接收状态 1 接收 2退回
    },
    // 提交
    submit() {
      const params = {
        caseId: this.getCaseInfo.id,
        ...this.form
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        if (this.receiveType === 1) { // 接收
          console.log(params)
          this.loading = true
          saveInfo(params).then(async res => {
            if (res.state === 100) {
              this.$message.success(res.message)
              await this.$store.dispatch('GetCaseInfo')
              this.loading = false
            } else {
              this.loading = false
            }
          })
        } else if (this.receiveType === 2) {
          const params = {
            caseId: this.getCaseInfo.id,
            remark: this.remark
          }
          this.loading = true
          back(params).then(async res => {
            if (res.state === 100) {
              this.$message.success(res.message)
              await this.$store.dispatch('GetCaseInfo')
              this.loading = false
            } else {
              this.loading = false
            }
          })
        } else if (this.receiveType === 3) {
          const params = {
            caseId: this.getCaseInfo.id,
            file: this.file
          }
          this.loading = true
          rejection(params).then(async res => {
            if (res.state === 100) {
              this.$message.success(res.message)
              await this.$store.dispatch('GetCaseInfo')
              this.loading = false
            } else {
              this.loading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
@import './style.scss';
.text-downline {
  text-decoration: underline;
}
</style>
