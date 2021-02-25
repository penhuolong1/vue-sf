<template>
  <div class="form-wrapper">
    <el-row :gutter="20" class="form-item">
      <el-col :span="12">
        <div class="btn-item" :class="{'active': receiveType == 1}" @click="getReceiveType(1)">接收</div>
      </el-col>
      <el-col :span="12">
        <div class="btn-item" :class="{'active': receiveType == 2}" @click="getReceiveType(2)">退回</div>
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1 && !isFlowCenter" :gutter="20" class="form-item">
      <el-col :span="12">
        <div class="btn-item" :class="{'active': acceptType == 1}" @click="getAcceptType(1)">自行受理</div>
      </el-col>
      <el-col :span="12">
        <div class="btn-item" :class="{'active': acceptType == 2}" @click="getAcceptType(2)">下发单位</div>
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1 && acceptType == 1 && !isFlowCenter" :gutter="20" class="form-item">
      <el-col :span="8">
        <div class="btn-item" :class="{'active': reviewType == 1}" @click="getReviewType(1)">同意</div>
      </el-col>
      <el-col :span="8">
        <div class="btn-item" :class="{'active': reviewType == 2}" @click="getReviewType(2)">补正</div>
      </el-col>
      <el-col :span="8">
        <div class="btn-item" :class="{'active': reviewType == 3}" @click="getReviewType(3)">不予受理</div>
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1 && acceptType == 1 && reviewType == 1 && !isFlowCenter" :gutter="20" class="form-item">
      <el-col :span="4">
        <label>诉非号</label>
      </el-col>
      <el-col :span="13">
        <el-input v-model="caseNo" type="text" />
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="getCaseNo">重新获取</el-button>
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1 && acceptType == 1 && reviewType == 1 && !isFlowCenter" :gutter="20" class="form-item">
      <el-col :span="4">
        <label>事由</label>
      </el-col>
      <!-- <el-col :span="20">
        <el-select
          v-model="selectbriefId"
          class="form"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in briefData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col> -->
      <brief v-model="selectbriefId" :name="briefName" style="width: 100%;" />
    </el-row>
    <el-row v-show="isNeedReason" :gutter="20" class="form-item">
      <el-col :span="4">
        <label>理由</label>
      </el-col>
      <el-col :span="20">
        <el-input v-model="remark" type="textarea" />
      </el-col>
    </el-row>
    <el-row v-show="(isFlowCenter && receiveType == 1) || (receiveType == 1 && acceptType == 2)" :gutter="20" class="form-item">
      <el-col :span="5">
        <label>受理单位</label>
      </el-col>
      <el-col :span="19">
        <el-select v-model="courtId" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in countData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
    </el-row>
    <div class="form-item footer">
      <el-button
        size="small"
        class="submit"
        icon="el-icon-check"
        :loading="loading"
        @click="examine"
      >确定</el-button>
      <el-button
        size="small"
        class="cancel"
        icon="el-icon-close"
        @click="reset"
      >取消</el-button>
    </div>
  </div>
</template>

<script>
import brief from '@/components/brief/index.vue'
import {
  operateCase,
  caseNo,
  acceptCase
} from '@/api/case/index.js'
import { mapGetters } from 'vuex'
import { getCourtList } from './getCourt'
export default {
  components: {
    brief
  },
  props: {

  },
  data() {
    return {
      caseNo: '',
      receiveType: 1, // 接收状态 1 接收 2退回
      acceptType: 1, // 受理状态 1自行受理 2下发
      reviewType: 1, // 审核状态 1同意 2补正 3不予受理
      remark: '',
      briefData: null,
      countData: [],
      courtId: '',
      selectbriefId: null,
      briefName: '',
      acceptance: 1, // 1同意 2 不予理会 3补正 4下发
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo']),
    isNeedReason() { // 判断是否需要输入理由
      let flag = false
      if (this.receiveType == 1) { // 如果接收状态为退回则需要输入理由
        if (this.acceptType == 1) { // 如果受理状态为下发则不需要理由
          if (this.reviewType == 1) { // 如果审核状态为同意则不需要理由
            flag = false
          } else {
            flag = true
          }
        } else {
          flag = false
        }
      } else {
        flag = true
      }
      return flag
    },
    isFlowCenter() {
      return this.getUserInfo.courtType === 0 // 判断是否为分流中心 是的化只能下发不能审核
    }
  },
  watch: {
    getCaseInfo() {
      this.init()
    }
  },
  created() {
    this.getCaseNo()
    // this.getBrief()
    this.getMediater()
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      this.selectbriefId = this.getCaseInfo.brief ? this.getCaseInfo.brief.id : ''
      this.briefName = this.getCaseInfo.brief ? this.getCaseInfo.brief.name : ''
    },
    // 初始化数据
    reset() {
      this.receiveType = 1 // 接收状态 1 接收 2退回
      this.acceptType = 1 // 受理状态 1自行受理 2下发
      this.reviewType = 1 // 审核状态 1同意 2补正 3不予受理
      this.remark = ''
      this.courtId = ''
      this.selectbriefId = ''
      this.acceptance = 1
    },
    // 改变接收状态
    getReceiveType(index) {
      this.receiveType = index
    },
    // 改变受理状态
    getAcceptType(index) {
      this.acceptType = index
      this.getAcceptance()
    },
    // 改变审核状态
    getReviewType(index) {
      this.reviewType = index
      this.getAcceptance()
    },
    // 获取案号
    getCaseNo() {
      caseNo({ type: 2 }).then(res => {
        if (res.state == 100) {
          this.caseNo = res.data
        }
      })
    },
    // 获取解纷机构
    getMediater() {
      // getMediater1({ pageSize: 100, courtType: '1' }).then(res => {
      //   if (res.state == 100) {
      //     this.countData = res.content
      //   }
      // })
      // const params = {
      //   courtType: 1,
      //   dept: 1,
      //   courtId: this.getUserInfo.courtId,
      //   type: 2,
      //   pageSize: 1000
      // }
      // listCourtByCourId(params).then(res => {
      //   this.countData = res.content
      // })
      getCourtList().then(res => {
        this.countData = res
      })
    },
    // 获取acceptance
    getAcceptance() {
      if (this.acceptType == 1) {
        if (this.reviewType == 1) {
          this.acceptance = 1
        } else if (this.reviewType == 2) { // 补正的时候acceptance为3
          this.acceptance = 3
        } else if (this.reviewType == 3) { // 不予理会的时候acceptance为2
          this.acceptance = 2
        }
      } else {
        this.acceptance = 4
      }
    },
    // 审核
    examine() {
      const params = {
        caseId: this.getCaseInfo.id
      }
      if (this.receiveType == 1) { // 审核
        if (this.isFlowCenter) {
          params.acceptance = 4
        } else {
          params.sqCaseNo = this.caseNo
          params.briefId = this.selectbriefId
          params.acceptance = this.acceptance
        }
        if (params.acceptance == 2 || params.acceptance == 3) {
          params.opinion = this.remark
          if (!params.opinion) {
            this.$message({
              showClose: true,
              message: '请输入理由',
              type: 'error'
            })
            return
          }
        }
        if (params.acceptance == 4) {
          params.courtId = this.courtId
          if (!params.courtId) {
            this.$message({
              showClose: true,
              message: '请选择下发单位',
              type: 'error'
            })
            return
          }
        }
        this.loading = true
        acceptCase(params).then(async res => {
          this.loading = false
          if (res.state == 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            this.reset()
            await this.$store.dispatch('GetCaseInfo')
            this.loading = false
          } else {
            this.loading = false
          }
        })
      } else {
        if (!this.remark) {
          this.$message({
            showClose: true,
            message: '请输入退回理由',
            type: 'error'
          })
          return
        }
        const params = {
          caseId: this.getCaseInfo.id,
          disOpinion: this.remark
        }
        if (this.getCaseInfo.flowCourtNum > 1) {
          params.process = this.getCaseInfo.process
        } else {
          params.process = this.getCaseInfo.process - 1
        }
        this.loading = true
        operateCase(params).then(async res => {
          if (res.state == 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            this.reset()
            await this.$store.dispatch('GetCaseInfo')
            this.loading = false
          } else {
            this.loading = false
          }
        })
      }
    }
  }
}
</script>

<style scoped lang = "scss">
@import './style.scss';
</style>
