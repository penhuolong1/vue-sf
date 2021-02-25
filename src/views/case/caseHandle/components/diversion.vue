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
        <label>受理单位</label>
      </el-col>
      <el-col :span="19">
        <el-select
          v-model="selectFlowCountId"
          class="form"
          placeholder="请选择"
          filterable
          style="width: 100%"
        >
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
        @click="flowCase"
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
  flowCase
} from '@/api/case/index.js'
import {
  listCourtByCourId
} from '@/api/team/team.js'
import { getMediater1 } from '@/api/common/common.js'
import { mapGetters } from 'vuex'
import { getCourtList } from './getCourt'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      receiveType: 1, // 接收状态 1 接收 2退回
      disOpinion: '',
      selectFlowCountId: '',
      countData: null,
      caseId: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo'])
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
    // 获取受理机关
    getMediater() {
      getCourtList().then(res => {
        this.countData = res
      })
    },
    // 分流
    flowCase() {
      console.log()
      const params = {
        caseId: this.caseId,
        acceptance: this.receiveType
      }
      if (this.receiveType == 1) {
        if (!this.selectFlowCountId) {
          this.$message({
            showClose: true,
            message: '请选择受理单位',
            type: 'error'
          })
          return
        }
        params.courtId = this.selectFlowCountId
        this.loading = true
        flowCase(params).then(async res => {
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
          }
          await this.$store.dispatch('GetCaseInfo')
          this.loading = false
        })
      } else {
        if (!this.disOpinion) {
          this.$message({
            showClose: true,
            message: '请输入退回理由',
            type: 'error'
          })
          return
        }
        params.disOpinion = this.disOpinion
        this.loading = true
        flowCase(params).then(async res => {
          if (res.state === 100) {
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
    // 取消
    cancel() {
      this.receiveType = 1 // 接收状态 1 接收 2退回
      this.disOpinion = ''
      this.selectFlowCountId = ''
    }
  }
}
</script>

<style scoped lang = "scss">
@import './style.scss';
</style>
