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
    <div class="form-item footer">
      <el-button
        size="small"
        class="submit"
        icon="el-icon-check"
        :loading="isLoading"
        @click="receive"
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
  accept
} from '@/api/case/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      receiveType: 1,
      disOpinion: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 改变接收状态
    getReceiveType(index) {
      this.receiveType = index
    },
    // 接收
    receive() {
      if (this.receiveType == 1) { // 接收
        const params = {
          caseId: this.getCaseInfo.id
        }
        this.isLoading = true
        accept(params).then(async res => {
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            await this.$store.dispatch('GetCaseInfo')
            this.isLoading = false
            this.cancel()
          } else {
            this.isLoading = false
          }
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
        const params = {
          caseId: this.getCaseInfo.id,
          process: this.getCaseInfo.process - 1,
          disOpinion: this.disOpinion
        }
        if (this.getCaseInfo.flowCourt.id == this.getCaseInfo.court.id) { // 假如分流机构和调解机构相等则退回到process = 2 其他退回到3
          params.process = this.getCaseInfo.process - 2
        } else {
          params.process = this.getCaseInfo.process - 1
        }
        this.isLoading = true
        operateCase(params).then(async res => {
          if (res.state == 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            await this.$store.dispatch('GetCaseInfo')
            this.isLoading = false
            this.reset()
            this.cancel()
          } else {
            this.isLoading = false
          }
        })
      }
    },
    // 取消
    cancel() {
      this.receiveType = 1
      this.disOpinion = ''
    }
  }
}
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
