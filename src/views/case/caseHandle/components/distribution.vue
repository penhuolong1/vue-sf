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
    <el-row v-show="receiveType == 2" :gutter="20" class="form-item">
      <el-col :span="4">
        <label>理由</label>
      </el-col>
      <el-col :span="20">
        <el-input v-model="disOpinion" type="textarea" />
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1" :gutter="20" class="form-item">
      <el-col :span="5">
        <label>解纷组织</label>
      </el-col>
      <el-col :span="19">
        <el-select
          v-model="courtId"
          class="form"
          filterable
          placeholder="请选择"
          style="width: 100%"
          @change="selectCourt"
        >
          <el-option
            v-for="item in courtData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row v-show="receiveType == 1 && courtId == getUserInfo.courtUid" :gutter="20" class="form-item">
      <el-col :span="5">
        <label>解纷员</label>
      </el-col>
      <el-col :span="19">
        <el-select
          v-model="selectMediaterid"
          class="form"
          filterable
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in mediaterData"
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
        @click="distribution"
      >确定</el-button>
      <el-button
        size="small"
        class="cancel"
        icon="el-icon-close"
        @click="cancel"
      >取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  operateCase,
  distributeCase
} from '@/api/case/index.js'
import {
  getCourt
} from '@/api/team/team.js'
import { mapGetters } from 'vuex'
import { getMediaterUser } from '@/api/common/common.js'
import { getMediater1 } from '@/api/common/common.js'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      receiveType: 1, // 接收状态 1 接收 2退回
      disOpinion: '',
      caseId: '',
      mediaterData: [],
      selectMediaterid: '',
      loginCourtId: '',
      courtId: '',
      courtData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo']),
    // 只有当选择的调解组织和当前调解组织一样时才能选择调解员
    isMeditor() {
      return this.loginCourtId == this.selectFlowCountId
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
    this.loginCourtId = this.getUserInfo.courtUid
    this.getMediaterUser(this.getUserInfo.courtUid)
    this.getMediater()
  },
  mounted() {

  },
  methods: {
    // 初始化数据
    init() {
      this.caseId = this.getCaseInfo.id
      this.selectFlowCountId = this.getCaseInfo.flowCourtTempId || ''
    },
    // 改变接收状态
    getReceiveType(index) {
      this.receiveType = index
    },
    // 分发
    // 取消
    cancel() {
      this.receiveType = 1 // 接收状态 1 接收 2退回
      this.disOpinion = ''
      this.selectFlowCountId = ''
    },
    // 获取解纷人员
    getMediaterUser(id) {
      const params = {
        courtId: id,
        pageSize: 1000
      }
      getMediaterUser(params).then(res => {
        if (res.state === 100) {
          this.mediaterData = res.dataPage.content
        }
      })
    },
    // 分配
    distribution() {
      if (this.receiveType == 1) { // 分配
        const params = {
          caseId: this.caseId,
          mediaterId: this.selectMediaterid,
          courtId: this.courtId
        }
        if (this.courtId == this.getUserInfo.courtUid) {
          if (!this.selectMediaterid) {
            this.$message({
              showClose: true,
              message: '请先选择解纷员',
              type: 'error'
            })
            return
          }
        } else {
          params.mediaterId = ''
        }
        this.loading = true
        distributeCase(params).then(async res => {
          if (res.state == 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            await this.$store.dispatch('GetCaseInfo')
            this.loading = false
          } else {
            this.loading = false
          }
        })
      } else { // 退回
        if (!this.disOpinion) {
          this.$message({
            showClose: true,
            message: '请输入退回理由',
            type: 'error'
          })
          return
        }
        const params = {
          caseId: this.caseId,
          process: this.getCaseInfo.process - 1,
          disOpinion: this.disOpinion
        }
        this.loading = true
        operateCase(params).then(async res => {
          if (res.state == 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            await this.$store.dispatch('GetCaseInfo')
            this.loading = false
          } else {
            this.loading = false
          }
        })
      }
    },
    // 获取受理机关
    getMediater() {
      // getMediater1({ pageSize: 100, courtType: '2' }).then(res => {
      //   if (res.state == 100) {
      //     this.courtData = res.content
      //     this.courtData.unshift({
      //       name: '无',
      //       id: this.getCaseInfo.court.id
      //     })
      //   }
      // })
      const params = {
        courtType: 2,
        courtId: this.getUserInfo.courtId,
        type: 2,
        pageSize: 1000
      }
      getCourt(params).then(res => {
        this.courtData = res.content
        this.courtData.unshift({
          name: '无',
          id: this.getUserInfo.courtUid
        })
      })
    },
    selectCourt(e) {
      this.getMediaterUser(e)
    }
  }
}
</script>

<style scoped lang = "scss">
@import './style.scss';
</style>
