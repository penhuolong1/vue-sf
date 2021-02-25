<template>
  <el-form ref="form" :inline="true" :rules="step1rules" :model="form" label-width="120px">
    <el-form-item label="申请类型" style="width: 100%;">
      <ul class="dispute-type">
        <li v-for="(item, index) in typeImg" :key="index" @click="selectApplyType(item.id)">
          <img :src="form.applyType == item.id ? item.activeUrl:item.url">
        </li>
      </ul>
    </el-form-item>
    <!-- 扫码添加的案件不需要添加分流中心 -->
    <el-form-item v-if="!getFromScan" label="分流中心" prop="centerCourtId" style="width: 49%;">
      <el-select v-model="form.centerCourtId" style="width: 350px;">
        <el-option
          v-for="item in centerCourtData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="纠纷事由" prop="briefId">
      <!-- <el-select v-model="form.briefId" style="width: 350px;" @change="selectBrief">
        <el-option
          v-for="item in brief"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select> -->
      <brief v-model="form.briefId" :name="briefName" style="width: 350px;" />
    </el-form-item>
    <el-form-item label="纠纷金额(元)" prop="applyStandard" style="width: 49%;">
      <el-input v-model="form.applyStandard" type="number" style="width: 350px;" placeholder="纠纷金额(不涉及填0)" />
    </el-form-item>
    <el-form-item class="form-item" prop="mediateRequest" label="请求事项">
      <el-input
        v-model="form.mediateRequest"
        type="textarea"
        :rows="4"
        placeholder="请输入请求事项"
        style="width: 100%;"
      />
    </el-form-item>
    <el-form-item class="form-item" prop="reason" label="事实与理由">
      <el-input
        v-model="form.reason"
        type="textarea"
        :rows="4"
        placeholder="请输入事实与理由"
        style="width: 100%;"
      />
    </el-form-item>
    <div style="text-align: right;">
      <el-button type="warning" @click="cancel">返回首页</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </el-form>
</template>

<script>
import rules from '@/utils/rules'
import { getCourtInfoByType } from '@/api/otherHome/otherHome.js'
import { getMediater1 } from '@/api/common/common.js'
import { addCase, getBrief, applyCase, detailsCase, scanCase } from '@/api/litigant/litigant'
import brief from '@/components/brief/index.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Step1',
  components: {
    brief
  },
  mixins: [rules],
  data() {
    return {
      form: {
        lawCaseId: '',
        applyType: '',
        briefId: '',
        applyStandard: '',
        mediateRequest: '',
        reason: '',
        centerCourtId: ''
      },
      centerCourtData: [],
      registerCourt: '', // 受理单位
      typeImg: [{
        id: '调解',
        url: require('@/assets/img/mediation.png'),
        activeUrl: require('@/assets/img/mediation-active.png')
      }, {
        id: '仲裁',
        url: require('@/assets/img/arbitration.png'),
        activeUrl: require('@/assets/img/arbitration-active.png')
      }, {
        id: '行政复议',
        url: require('@/assets/img/reconsideration.png'),
        activeUrl: require('@/assets/img/reconsideration-active.png')
      }, {
        id: '行政裁决',
        url: require('@/assets/img/ruling.png'),
        activeUrl: require('@/assets/img/ruling-active.png')
      }, {
        id: '公证',
        url: require('@/assets/img/notarization.png'),
        activeUrl: require('@/assets/img/notarization-active.png')
      }, {
        id: '其他',
        url: require('@/assets/img/other.png'),
        activeUrl: require('@/assets/img/other-active.png')
      }],
      brief: [],
      briefName: ''
    }
  },
  computed: {
    ...mapGetters(['getFromScan', 'getScanCourtId'])
  },
  mounted() {
    this.form.lawCaseId = this.$store.getters.getLawCaseId || window.localStorage.getItem('lawCaseId')
    this.$emit('update:step', 0)
    this.getCourtInfoByType()
    if (this.form.lawCaseId) {
      this.getDetail()
    }
    getBrief().then(({ briefPage: { content }, state }) => {
      state === 100 && (this.brief = content)
    })
  },
  methods: {
    next() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.form.applyType) {
          this.$message.error('请选择申请类型')
          return
        }
        if (this.form.lawCaseId) { // 如果有案件id
          const params = { ...this.form }
          if (this.getFromScan) { // 如果是扫码添加的案件
            params.mediateCourtId = this.getScanCourtId
            scanCase(params).then(({ state, message }) => {
              if (state === 100) {
                this.$message.success(message)
                this.$router.push({ name: 'step3' })
                return
              }
              this.$message.warning(message)
            })
          } else {
            applyCase(params).then(({ state, message }) => {
              if (state === 100) {
                this.$message.success(message)
                this.$router.push({ name: 'step3' })
                return
              }
              this.$message.warning(message)
            })
          }
        } else { // 如果没有案件id 需先掉接口获取案件id在保存数据
          addCase().then(({ lawCaseId, state }) => {
            if (state === 100) {
              this.$store.commit('SET_CASEID', lawCaseId)
              window.localStorage.setItem('lawCaseId', lawCaseId)
              this.form.lawCaseId = this.$store.getters.getLawCaseId || window.localStorage.getItem('lawCaseId')
              const params = { ...this.form }
              applyCase(params).then(({ state, message }) => {
                if (state === 100) {
                  this.$message.success(message)
                  this.$router.push({ name: 'step3' })
                  return
                }
                this.$message.warning(message)
              })
            }
          })
        }
      })
    },
    getDetail() {
      const data = {
        lawCaseId: this.form.lawCaseId
      }
      detailsCase(data).then(({ state, lawCase }) => {
        if (state === 100) {
          this.form.applyType = lawCase.applyType
          // this.registerCourt = lawCase.registerCourt ? lawCase.registerCourt.name : ''
          // this.form.registerCourtId = lawCase.registerCourt ? lawCase.registerCourt.id : ''
          this.form.briefId = lawCase.brief ? lawCase.brief.id : ''
          this.form.applyStandard = lawCase.applyStandard
          this.form.mediateRequest = lawCase.mediateRequest
          this.form.reason = lawCase.reason
          this.form.caseSource = lawCase.caseSource
          this.form.centerCourtId = lawCase.centerCourt ? lawCase.centerCourt.id : ''
          this.briefName = lawCase.brief.name
          window.localStorage.setItem('brief', lawCase.brief ? lawCase.brief.name : '')
          this.$store.commit('SET_BRIEF', lawCase.brief ? lawCase.brief.name : '')
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'litigant' })
    },
    // 选择申请类型
    selectApplyType(id) {
      this.form.applyType = id
    },
    // 选择案由
    selectBrief(e) {
      const item = this.brief.find(item => item.id == e)
      window.localStorage.setItem('brief', item.name)
      this.$store.commit('SET_BRIEF', item.name)
    },
    // 获取分流中心数据
    getCourtInfoByType() {
      const params = {
        courtType: 0,
        pageSize: 100
      }
      getMediater1(params).then(res => {
        if (res.state === 100) {
          this.centerCourtData = res.content
        }
      })
    }
  }
}
</script>

<style scoped lang = "scss">
  $borderColor:#409EFF;
  .isSelect {
    background: $borderColor;
    border-color: $borderColor;
    color: #FFF;
  }
  .dispute-type {
    display: inline-flex;
    img {
      width: 180px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .form-item {
    width: 100%;
    ::v-deep .el-form-item__content {
      width: calc(100% - 120px);
    }
  }
</style>
