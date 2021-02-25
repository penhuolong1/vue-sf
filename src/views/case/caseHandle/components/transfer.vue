<template>
  <el-dialog
    :close-on-click-modal="false"
    width="500px"
    title="移送法院"
    append-to-body
    :visible.sync="modalVisible"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item v-if="!isMeditorSuccess" label="是否赋强" prop="" label-width="120px">
        <el-radio v-model="radio" label="1">是</el-radio>
        <el-radio v-model="radio" label="2">否</el-radio>
      </el-form-item>
      <el-form-item v-if="!isMeditorSuccess && radio == 1" label="赋强类型" prop="moveType" label-width="120px">
        <el-select v-model="form.moveType" style="width: 300px;" placeholder="请选择赋强类型" @change="getMoveType">
          <el-option v-for="(item,index) in moveTypeData" :key="index" :label="item.label" :disabled="item.disabled" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="移送法院" prop="courtId" label-width="120px">
        <el-select v-model="form.courtId" style="width: 300px;" placeholder="请选择法院">
          <el-option v-for="(item,index) in courtData1" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="诉讼请求" prop="ssqq" label-width="120px">
        <el-input v-model="form.ssqq" type="textarea" style="width: 300px;" placeholder="请输入诉讼请求" />
      </el-form-item>
      <el-form-item label="事实与理由" prop="reason" label-width="120px">
        <el-input v-model="form.reason" type="textarea" style="width: 300px;" placeholder="请输入事实与理由" />
      </el-form-item>
      <el-form-item v-if="!isMeditorSuccess && form.moveType == 1 && radio == 1" label="调解协议" label-width="120px" prop="protocolId">
        <elSelectRadio ref="elSelectRadio2" v-model="form.protocolId" :type="1" style="width: 300px;" :placeholder="'请选择调解协议'" @change="changeProtocolId" />
      </el-form-item>
      <el-form-item v-if="!isMeditorSuccess && form.moveType == 1 && radio == 1" label="司法确认申请书" label-width="120px" prop="applyId">
        <elSelectRadio ref="elSelectRadio1" v-model="form.applyId" :type="2" style="width: 300px;" :placeholder="'请选择司法确认申请书'" />
      </el-form-item>
      <el-form-item label="移送时间" prop="moveTime" label-width="120px">
        <el-date-picker
          v-model="form.moveTime"
          style="width: 300px;"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="transfer">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  afterEnd,
  updateResult
} from '@/api/case/index.js'

import { MOVETYPEMAP } from '@/utils/constVal.js'
import { transferCourt, listCourtToFile, returnFileParams } from '@/api/dossier/dossier.js'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
import elSelectRadio from '@/components/elSelectRadio/index'
export default {
  components: {
    elSelectRadio
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      register: true,
      endtypes: ['当事人达成和解', '当事人撤诉'],
      endTypeStr: '',
      caseId: '',
      form: {
      },
      modalVisible: false,
      moveTypeData: [],
      moveType: '',
      isLoading: false,
      wxradio: '1',
      wxcourtId: '',
      courtData1: [],
      rules: {
        moveType: [{ required: true, message: '请选择赋强类型', trigger: ['change', 'blur'] }],
        courtId: [{ required: true, message: '请选择法院', trigger: ['change', 'blur'] }],
        ssqq: [{ required: true, message: '请输入诉讼请求', trigger: ['blur'] }],
        reason: [{ required: true, message: '请输入事实与理由', trigger: ['blur'] }],
        moveTime: [{ required: true, message: '请输入移送时间', trigger: ['blur'] }],
        protocolId: [{ required: true, message: '请选择调解协议', trigger: ['change', 'blur'] }],
        applyId: [{ required: true, message: '请选择司法确认申请书', trigger: ['change', 'blur'] }]
      },
      radio: '2' // 是否需要富强
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getDirList', 'getTableId']),
    // 判断是否调解成功
    isMeditorSuccess() {
      return this.endtypes.indexOf(this.endTypeStr) == -1
    }
  },
  watch: {
    dialogFormVisible() {
      this.modalVisible = this.dialogFormVisible
    },
    getCaseInfo() {
      this.init()
    },
    radio() {
      this.getSsqqAndReason()
    }
  },
  created() {
    this.init()
    this.getMoveTypeData()
    this.getListCourtToFile()
  },
  mounted() {

  },
  methods: {
    // 获取富强类型
    getMoveTypeData() {
      this.moveTypeData = []
      this.moveTypeData1 = []
      for (const key in MOVETYPEMAP) {
        if (parseInt(key) > 1) {
          this.moveTypeData.push({
            id: parseInt(key),
            label: MOVETYPEMAP[key],
            disabled: true
          })
        } else {
          this.moveTypeData.push({
            id: parseInt(key),
            label: MOVETYPEMAP[key]
          })
        }
      }
    },
    // 重置数据
    reset() {
      this.moveType = ''
      this.form = {}
      if (!this.isMeditorSuccess) {
        this.$refs.elSelectRadio1 && this.$refs.elSelectRadio1.reset()
        this.$refs.elSelectRadio2 && this.$refs.elSelectRadio2.reset()
      }
    },
    // 初始化数据
    init() {
      this.caseId = this.getCaseInfo.id
      this.endTypeStr = this.getCaseInfo.endType
      this.form = {
        ssqq: this.getCaseInfo.mediateRequest || '',
        reason: this.getCaseInfo.reason || ''
      }
      this.$set(this.form, 'moveTime', formatDate(new Date(), 'YYYY-MM-DD H:m:s'))
    },
    // 调解协议改变
    changeProtocolId(id) {
      this.getSsqqAndReason(id)
    },
    // 司法确认的情况下获取诉讼请求和事实与理由
    async getSsqqAndReason(id) {
      if (this.form.moveType === 1 && this.radio == 1) { // 如果是司法确认需要按照格式来
        let applicant = []
        let respondent = []
        this.getCaseInfo.litigants.forEach(item => {
          if (item.enable) {
            if (item.litigationStatus.id == 5) {
              respondent.push(item.litigantName)
            } else {
              applicant.push(item.litigantName)
            }
          }
        })
        if (applicant && applicant.length > 0) {
          applicant = applicant.join(',')
        }
        if (respondent && respondent.length > 0) {
          respondent = respondent.join(',')
        }
        const dirList = [...this.getDirList]
        const medAgree = dirList.filter(item => { // 得到调解协议
          return item.id == 10
        })
        let medAgreeTime = ''
        if (medAgree[0].listFile && medAgree[0].listFile.length > 0) {
          let createDate = medAgree[0].listFile.find((item, index) => {
            return index === medAgree[0].listFile.length - 1
          }).createDate
          if (id) {
            const obj = medAgree[0].listFile.find(item => item.id == id)
            createDate = obj.createDate
          }
          medAgreeTime = formatDate(new Date(createDate), 'YYYY-MM-DD')
        }
        console.log(medAgree)
        const method = this.getCaseInfo.method
        this.form.ssqq = `确认申请人${applicant}与被申请人${respondent}于${medAgreeTime}达成的调解协议有效`
        this.form.reason = `${medAgreeTime},申请人${applicant}与被申请人${respondent}, 达成如下调解协议: ${method}`
      } else {
        this.form.reason = this.getCaseInfo.mediateRequest || ''
        this.form.ssqq = this.getCaseInfo.reason || ''
      }
    },
    getMoveType() {
      this.getSsqqAndReason()
    },
    // 移送
    transfer() {
      const params = {
        caseId: this.caseId,
        ...this.form
      }
      if (this.isMeditorSuccess) {
        params.state = false
        params.protocolId = ''
        params.applyId = ''
        params.moveType = ''
      } else {
        if (this.radio == 2) { // 成功的时候选择不富强的时候
          params.state = false
          params.protocolId = ''
          params.applyId = ''
          params.moveType = ''
        } else {
          params.state = true
        }
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.isLoading = true
        afterEnd(params).then(res => {
          this.isLoading = false
          if (res.state === 100) {
            this.modalVisible = false
            this.$message.success(res.message)
            this.$store.dispatch('GetCaseInfo')
            this.reset()
            this.$emit('update:dialogFormVisible', false)
          }
        })
      })
    },
    // 获取是否立案
    getregister(val) {
      this.register = val
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
    // 获取法院
    getListCourtToFile() {
      transferCourt({ pageSize: 1000 }).then(res => {
        if (res.state === 100) {
          this.courtData1 = res.content
          this.$nextTick(() => {
            this.init()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import './style.scss';
.btn1 {
  line-height: unset;
}
</style>
