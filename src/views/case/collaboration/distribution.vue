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
    <el-row v-show="receiveType == 1 && getUserInfo.roleType != 2" :gutter="20" class="form-item">
      <el-col :span="5">
        <label>办理单位</label>
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
    <el-row v-show="receiveType == 1 && courtId == getUserInfo.courtUid && getUserInfo.roleType != 2" :gutter="20" class="form-item">
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
  getCourt, getCourtByLevel2
} from '@/api/team/team.js'
import { dispenseCaseForTeam, rejectTeam, acceptTeam } from '@/api/collaboration/index'
import { mapGetters } from 'vuex'
import { getMediaterUser } from '@/api/common/common.js'
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
      courtData: []
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo', 'getTeamData']),
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
    if (this.getUserInfo.roleType != 2) { // 如果登陆角色为调解员的化 只走接收操作不需要掉以下接口
      this.getMediaterUser(this.getUserInfo.courtUid)
      this.getMediater()
    }
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
        if (this.getUserInfo.roleType == 2) { // 调解员掉接收接口 机构掉下发接口
          const params = {
            caseId: this.caseId
          }
          acceptTeam(params).then(res => {
            if (res.state == 100) {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'success'
              })
              const params = {
                caseId: this.caseId,
                courtId: this.getUserInfo.courtUid
              }
              this.$store.dispatch('getListTeamByCase', params)
              this.$store.dispatch('GetTeamData')
            }
          })
        } else {
          const params = {
            caseId: this.caseId,
            mediaterId: this.selectMediaterid,
            courtId: this.courtId
          }
          if (this.courtId != this.getUserInfo.courtUid) {
            if (!this.courtId) {
              this.$message({
                showClose: true,
                message: '请先选择办理单位',
                type: 'error'
              })
              return
            }
            delete params.mediaterId
          } else {
            if (!this.selectMediaterid) {
              this.$message({
                showClose: true,
                message: '请先选择解纷员',
                type: 'error'
              })
              return
            }
            delete params.courtId
          }
          params.teamWorkId = this.getTeamData.id
          dispenseCaseForTeam(params).then(res => {
            if (res.state == 100) {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'success'
              })
              const params = {
                caseId: this.caseId,
                courtId: this.getUserInfo.courtUid
              }
              this.$store.dispatch('getListTeamByCase', params)
              this.$store.dispatch('GetTeamData')
            }
          })
        }
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
          rejectReason: this.disOpinion
        }
        params.teamWorkId = this.getTeamData.id
        rejectTeam(params).then(res => {
          if (res.state == 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            const params = {
              caseId: this.caseId,
              courtId: this.getUserInfo.courtUid
            }
            this.$store.dispatch('getListTeamByCase', params)
            this.$store.dispatch('GetTeamData')
          }
        })
      }
    },
    // 获取受理机关
    getMediater() {
      if (this.getUserInfo.courtType == 1) { // 如果是联动单位
        const params = {
          courtType: '1,2',
          courtId: this.getUserInfo.courtUid,
          level: this.getUserInfo.courtLevel < 3 ? this.getUserInfo.courtLevel + 1 : 3,
          pageSize: 1000,
          has: 1
        }
        getCourtByLevel2(params).then(res => {
          this.courtData = res.content.map(item => {
            return {
              id: item.courtUid,
              name: item.courtName
            }
          })
          this.courtData.unshift({
            name: '无',
            id: this.getUserInfo.courtUid
          })
        })
      } else {
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
      }
    },
    selectCourt(e) {
      this.getMediaterUser(e)
    }
  }
}
</script>

<style scoped lang = "scss">
@import '../caseHandle/components/style.scss';
</style>
