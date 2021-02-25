<template>
  <el-dialog
    :close-on-click-modal="false"
    width="500px"
    title="结案"
    append-to-body
    :visible.sync="modalVisible"
    @close="closeDialog"
  >
    <el-row class="form-item">
      <el-col :span="4">
        <label>化解结果:</label>
      </el-col>
      <el-col :span="16">
        <el-select v-model="form.endType" style="width: 100%;" placeholder="请选择化解结果">
          <el-option v-for="(item,index) in isMediateResult" :key="index" :label="item.label" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>
    <el-row class="form-item">
      <el-col :span="4">
        <label>结案时间:</label>
      </el-col>
      <el-col :span="16">
        <el-date-picker
          v-model="form.closeTime"
          type="datetime"
          placeholder="选择日期时间"
          style="width: 100%"
        />
      </el-col>
    </el-row>
    <el-row class="form-item">
      <el-col :span="4">
        <label>移送法院:</label>
      </el-col>
      <el-col :span="16">
        <el-select v-model="form.courtId" style="width: 100%;" placeholder="请选择法院">
          <el-option v-for="(item,index) in courtData" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatDate } from '@/utils/format.js'
import {
  updateCaseClose
} from '@/api/case/index.js'
import { mapGetters } from 'vuex'
import { listCourtToFile } from '@/api/dossier/dossier.js'
export default {
  components: {

  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      register: null,
      caseId: '',
      form: {},
      modalVisible: false,
      isLoading: false,
      mediateResult: [
        {
          id: '当事人达成和解',
          label: '当事人达成和解'
        },
        {
          id: '当事人撤诉',
          label: '当事人撤诉'
        },
        {
          id: '联系不到当事人',
          label: '联系不到当事人'
        },
        {
          id: '当事人撤回调解请求',
          label: '当事人撤回调解请求'
        },
        {
          id: '当事人明确表示不接受调解',
          label: '当事人明确表示不接受调解'
        },
        {
          id: '双方分歧较大且难以达成调解协议',
          label: '双方分歧较大且难以达成调解协议'
        },
        {
          id: '其他',
          label: '其他(请备注说明)'
        }
      ],
      courtData: []
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo']),
    // 判断是否调解成功
    isMeditorSuccess() {
      return this.endtypes.indexOf(this.endTypeStr) == -1
    },
    // 假如没有调解员的话化解结果只有当事人撤诉
    isMediateResult() {
      if (this.getCaseInfo.mediater) {
        return this.mediateResult
      } else {
        return this.mediateResult.filter(item => {
          return item.id == '当事人撤诉'
        })
      }
    }
  },
  watch: {
    dialogFormVisible() {
      this.modalVisible = this.dialogFormVisible
    },
    getCaseInfo() {
      this.init()
    }
  },
  created() {
    this.init()
    this.getListCourtToFile()
  },
  mounted() {
    console.log('.env.development=' + process.env)
    console.log(process.env.VUE_APP_BASE_SERVE)
  },
  methods: {
    // 重置数据
    reset() {
      this.moveType = ''
    },
    // 初始化数据
    init() {
      this.caseId = this.getCaseInfo.id
      this.endTypeStr = this.getCaseInfo.endType
      this.form.closetime = formatDate(new Date())
      if (this.getCaseInfo.mediater) {
        this.form = {
          endType: this.getCaseInfo.endType,
          closeTime: formatDate(new Date(this.getCaseInfo.caseEndDate).getTime())
        }
      } else {
        this.form = {
          endType: '当事人撤诉',
          closeTime: formatDate(new Date())
        }
      }
    },
    // 结案
    submit() {
      this.form.closeTime = formatDate(new Date(this.form.closeTime).getTime())
      const params = {
        ...this.form,
        caseId: this.getCaseInfo.id
      }
      if (this.getCaseInfo.mediater) {
        if (!this.form.courtId) {
          this.$message.error('请选择移送的法院')
          return
        }
      }
      updateCaseClose(params).then(res => {
        if (res.state === 100) {
          this.$message.success(res.message)
          this.modalVisible = false
          this.cancel()
          this.$store.dispatch('GetCaseInfo')
        }
      })
    },
    // 取消
    cancel() {
      this.$emit('update:dialogFormVisible', false)
    },
    closeDialog() {
      this.$emit('update:dialogFormVisible', false)
    },
    getReceiveType(index) {
      this.receiveType = index
    },
    getListCourtToFile() {
      listCourtToFile({ pageSize: 1000 }).then(res => {
        if (res.state === 100) {
          this.courtData = res.content
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.form-item {
  margin-bottom: 10px;
  label {
    text-align: right;
    display: flex;
    justify-items: center;
    align-content: center;
  }
}
</style>
