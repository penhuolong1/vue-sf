<template>
  <div class="case-handle-wrapper" :style="{'max-height': wrapperHeight}">
    <el-row :gutter="100">
      <el-col :span="12">
        <h1 class="title">当前办理</h1>
        <div class="wrapper">
          <div class="content">
            <diversion v-if="process == 1 && flowStatus == 0 && isCaseFlowCenter && !getCaseInfo.caseClose" />
            <reviewForm v-if="process == 1 && (flowStatus == 1 || flowStatus == 2 || flowStatus == 3) && isCourt && roleType !=2 && !getCaseInfo.caseClose" />
            <distribution v-if="process == 2 && isCourt && roleType != 2 && !getCaseInfo.caseClose" />
            <allocation v-if="process == 3 && isMeditorCourt && roleType != 2 && !getCaseInfo.caseClose" />
            <receive v-if="process == 4 && roleType == 2 && !getCaseInfo.accept && !getCaseInfo.caseClose" />
            <judicalConfirm v-if="process == 8 && roleType == 4 && !getCaseInfo.caseClose" />
            <courtAccept v-if="process==9 && roleType == 4 && !getCaseInfo.caseClose" />
          </div>
          <div class="nan">暂无</div>
        </div>
        <h1 class="title">路径推荐</h1>
        <div class="wrapper">
          <recommend />
        </div>
      </el-col>
      <el-col :span="12">
        <h1 class="title">办理日志</h1>
        <list :case-line-data="caseLineData" />
      </el-col>
    </el-row>
    <!-- <recommend />
    <list :case-line-data="caseLineData" /> -->
    <myFooter />
  </div>
</template>

<script>
import list from './components/list'
import reviewForm from './components/reviewForm'
import diversion from './components/diversion'
import distribution from './components/distribution'
import myFooter from './components/footer'
import allocation from './components/allocation'
import recommend from './components/recommend'
import judicalConfirm from './components/judicalConfirm'
import courtAccept from './components/courtAccept'
import receive from './components/receive'
import { historyList } from '@/api/case/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    list,
    reviewForm,
    diversion,
    distribution,
    myFooter,
    allocation,
    recommend,
    receive,
    judicalConfirm,
    courtAccept
  },
  props: {

  },
  data() {
    return {
      caseLineData: [],
      lawCaseData: null,
      process: '',
      flowStatus: '',
      loginCourtId: '', // 登录的机构id
      loginMediaterId: '', // 登陆解纷员的id
      roleType: '', // 角色信息
      caseCourtId: '', // 案件分流机构id
      meditorCourtId: '', // 案件解纷机构id
      caseMediaterId: '', // 案件解纷员id
      flowCenter: '', // 分流中心id
      wrapperHeight: '' // 容器最大高度
    }
  },
  computed: {
    ...mapGetters(['getCaseId', 'getCaseInfo', 'getUserInfo']),
    // 判断当前机构是否当前案件的分流中心
    isCaseFlowCenter() {
      return this.loginCourtId == this.flowCenter
    },
    // 判断当前登记的机构是否为当前的受理机构
    isCourt() {
      console.log(this.loginCourtId == this.caseCourtId)
      return this.loginCourtId == this.caseCourtId
    },
    // 判断当前机构是否为当前的解纷机构
    isMeditorCourt() {
      return this.loginCourtId == this.meditorCourtId
    },
    // 判断当前解纷员是否为案件的解纷员
    isMeditor() {
      return this.loginMediaterId == this.caseMediaterId
    }
  },
  watch: {
    getCaseInfo: {
      handler() {
        this.init()
        this.getLawCaseLine()
      },
      deep: true
    }
  },
  created() {
    this.getLawCaseLine()
    this.init()
    this.roleType = this.$store.state.user.userRole
    this.loginCourtId = this.getUserInfo.courtUid
    this.loginMediaterId = this.getUserInfo.mediaterId
  },
  mounted() {
    this.wrapperHeight = document.body.clientHeight - 70 - 85 - 120 + 'px' // 获取容器的最大高度 屏幕高度-顶部菜单-案件菜单-底部预留
  },
  methods: {
    // 初始化数据
    init() {
      this.lawCaseData = JSON.parse(JSON.stringify(this.getCaseInfo))
      if (this.lawCaseData) {
        this.process = this.lawCaseData.process
        this.flowStatus = this.lawCaseData.flowStatus
        this.caseCourtId = this.lawCaseData ? this.lawCaseData.flowCourt ? this.lawCaseData.flowCourt.id : '' : ''
        this.meditorCourtId = this.lawCaseData ? this.lawCaseData.court ? this.lawCaseData.court.id : '' : ''
        this.caseMediaterId = this.lawCaseData.mediater ? this.lawCaseData.mediater.id : ''
        this.flowCenter = this.lawCaseData.centerCourt ? this.lawCaseData.centerCourt.id : ''
      }
    },
    // 获取时间线数据
    getLawCaseLine() {
      const params = {
        lawCaseId: this.getCaseId
      }
      historyList(params).then(res => {
        console.log(res)
        if (res.state === 100) {
          this.caseLineData = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.case-handle-wrapper {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px 0px;
  .title {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    color: #007aff;
    margin-bottom: 8px;
  }
  .wrapper {
    border: 1px solid #d9d9d9;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    width: 100%;
    min-height: 200px;
    margin-bottom: 20px;
    position: relative;
    .nan {
      width: 50px;
      font-size: 16px;
      color:rgba(0,0,0,0.5);
      position: absolute;
      z-index: 1;
      left: 50%;
      top: 40px;
      margin-left: -25px;
      text-align: center;
    }
    .content {
      position: relative;
      z-index: 2;
      background-color: #fff;
    }
  }
}
</style>
