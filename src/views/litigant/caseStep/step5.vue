<template>
  <div class="last-wrapper">
    <div class="step5-wrapper">
      <!-- <div class="step5-item">
        <receivingUnit />
      </div> -->
      <div class="step5-item">
        <mediationOrg />
      </div>
      <div class="step5-item">
        <mediator />
      </div>
    </div>
    <div style="text-align: right;">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="finish()">完成</el-button>
    </div>
  </div>
</template>

<script>
import mediationOrg from './components/mediationOrg'
import mediator from './components/mediator'
import { submitCase } from '@/api/litigant/litigant'
import { updateCase, detailCase, supply } from '@/api/case/index.js'
export default {
  components: {
    mediationOrg,
    mediator
  },
  props: {

  },
  data() {
    return {
      caseInfo: {}
    }
  },
  created() {
    this.getdetailCase()
  },
  mounted() {
    this.$emit('update:step', 3)
  },
  methods: {
    prev() {
      this.$router.push({ name: 'step4' })
    },
    // 获取案件详情
    getdetailCase() {
      if (!this.$store.getters.getLawCaseId) {
        return
      }
      detailCase({ lawCaseId: this.$store.getters.getLawCaseId }).then(res => {
        if (res.state === 100) {
          this.caseInfo = res.lawCase
        }
      })
    },
    finish() {
      const params = {
        // flowCourtId: this.$store.state.litigant.registerCourt.id,
        mediateCourtId: this.$store.state.litigant.courtData.id,
        mediaterId: this.$store.state.litigant.mediator.id
      }
      if (this.$store.state.user.userRole == 3) {
        params.lawCaseId = this.$store.getters.getLawCaseId || window.localStorage.getItem('lawCaseId')
        params.caseSource = this.caseInfo.caseSource
        params.isOverApplication = 1
        if (this.caseInfo.process == '-1') { // 假如该案件是补正的
          supply({ caseId: this.caseInfo.id })
        }
        submitCase(params).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.$store.commit('SET_COURT', {})
            this.$store.commit('SET_COURTDATA', {})
            this.$store.commit('SET_MEDIATOR', {})
            window.localStorage.setItem('brief', '')
            this.$router.push({ name: 'litigant' })
          }
        })
      } else {
        params.caseId = this.$store.getters.getLawCaseId || window.localStorage.getItem('lawCaseId')
        updateCase(params).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.$store.commit('SET_COURT', {})
            this.$store.commit('SET_COURTDATA', {})
            this.$store.commit('SET_MEDIATOR', {})
            window.localStorage.setItem('brief', '')
            this.$router.push({ name: 'homeIndex' })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.step5-wrapper {
  display: flex;
  .step5-item {
    flex: 1;
    margin-right: 50px;
    min-height: 550px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>
