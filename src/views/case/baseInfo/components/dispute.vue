<template>
  <div class="dispute-wrapper">
    <header1 :title="'纠纷概况'" :is-edit.sync="isEdit" @save="save" />
    <div class="form-wrapper">
      <div class="label">
        请求事项
      </div>
      <div class="text">
        <span v-if="!isEdit">{{ disputeInfoData.mediateRequest }}</span>
        <el-input
          v-else
          v-model="disputeInfoData.mediateRequest"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
        />
      </div>
      <div class="label">
        事实与理由
      </div>
      <div class="text">
        <span v-if="!isEdit">{{ disputeInfoData.reason }}</span>
        <el-input
          v-else
          v-model="disputeInfoData.reason"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
        />
      </div>
    </div>
  </div>
</template>

<script>
import header1 from './header'
import { mapGetters } from 'vuex'
import { updateCase } from '@/api/case/index.js'
export default {
  components: {
    header1
  },
  props: {

  },
  data() {
    return {
      isEdit: false,
      disputeInfoData: {},
      lawCaseData: {}
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  watch: {
    getCaseInfo() {
      this.init()
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    init() {
      this.lawCaseData = JSON.parse(JSON.stringify(this.getCaseInfo))
      this.disputeInfoData = {
        mediateRequest: this.lawCaseData.mediateRequest,
        reason: this.lawCaseData.reason
      }
    },
    // 保存
    save() {
      this.disputeInfoData.caseId = this.lawCaseData.id
      if (!this.disputeInfoData.caseId) {
        this.$message({
          showClose: true,
          message: '请先添加案件信息',
          type: 'error'
        })
        return
      }
      if (!this.disputeInfoData.mediateRequest) {
        this.$message({
          showClose: true,
          message: '请先输入请求事项',
          type: 'error'
        })
        return
      }
      if (!this.disputeInfoData.reason) {
        this.$message({
          showClose: true,
          message: '请先输入事实与理由',
          type: 'error'
        })
        return
      }
      updateCase(this.disputeInfoData).then(res => {
        if (res.state == 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.isEdit = false
          this.$store.dispatch('GetCaseInfo')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dispute-wrapper {
  margin-top: 20px;
  .form-wrapper {
    display: grid;
    grid-template-columns: 200px 1fr;
    border: 1px solid #EDEDED;
    border-bottom: none;
    border-right: none;
    margin-top: 10px;
    &>div {
      min-height: 60px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #EDEDED;
      border-right: 1px solid #EDEDED;
    }
    .label {
      background-color: #FAFBFB;
    }
    .text {
      justify-content: left;
      padding: 0 20px;
    }
  ::v-deep .el-input{
    width: 200px;
  }
}
}
</style>
