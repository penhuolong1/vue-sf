<template>
  <div class="resolving-disputes-wrapper">
    <span style="position:absolute;top:-60px;left:30px;color:#fff;cursor:pointer;z-index:10" @click="goBack()"><Icon type="ios-undo-outline" size="24" />返回</span>
    <div class="selectBox" style="right:160px">
      <Select v-model="thisTime" style="width:100px">
        <Option :value="year">{{ year }}年</Option>
        <Option :value="year-1">{{ year-1 }}年</Option>
      </Select>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="left-wrapper">
          <resolvingDisputesLeft :this-time="thisTime" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="center-wrapper">
          <div class="center-wrapper-top">
            <resolvingDisputesCenter1 :type-data="typeData" />
          </div>
          <div class="center-wrapper-bottom">
            <resolvingDisputesCenter2 :title="['解纷组织排行榜']" :my-data="org" :column-width="['350']" />
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="local1-wrapper">
        <div class="right-wrapper">
          <div class="right-wrapper-top">
            <resolvingDisputesRight1 :court="court" />
          </div>
          <div class="right-wrapper-bottom">
            <resolvingDisputesCenter2 :title="['解纷人员排行榜']" :my-data="man" :column-width="['200','200','250']" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import resolvingDisputesLeft from './compontents/resolvingDisputesLeft'
import resolvingDisputesCenter1 from './compontents/resolvingDisputesCenter1'
import resolvingDisputesCenter2 from './compontents/resolvingDisputesCenter2'
import resolvingDisputesRight1 from './compontents/resolvingDisputesRight1'
import { char4 } from '@/api/common/resolvingDisputes.js'
export default {
  components: {
    resolvingDisputesLeft,
    resolvingDisputesCenter1,
    resolvingDisputesCenter2,
    resolvingDisputesRight1
  },
  props: {

  },
  data() {
    return {
      thisTime: '',
      year: '',
      typeData: [], // 解纷类型
      court: {}, //   组织类型
      org: [], //  解纷组织排行榜
      man: [] //   解纷人员排行榜
    }
  },
  watch: {
    thisTime(newVal, oldVal) {
      this.char4()
    }
  },
  created() {
    this.year = new Date().getFullYear()
    this.thisTime = this.year
  },
  mounted() {
    var now = new Date()
    this.value1 = [now.getFullYear() + '-' + (now.getMonth()), now.getFullYear() + '-' + (now.getMonth() + 1)]
    this.char4()
  },
  methods: {
    goBack() {
      this.$store.commit('SET_MENUINDEX', 0)
    },
    char4() {
      const params = {
        startTime: this.thisTime
      }
      char4(params).then(res => {
        if (res.state == 100) {
          this.typeData = res.data.typeData // 解纷类型
          this.court = res.data.court // 组织类型
          this.org = []
          res.data.org.map((item, index) => { // 解纷组织排行榜
            const obj = [index + 1 + '.' + item.name, '解纷员数量:' + item.mediaterNum, '调解数量:' + item.caseNum]
            this.org.push(obj)
          })
          this.man = []
          res.data.man.map((item, index) => { // 解纷人员排行榜
            const obj = [index + 1 + '.' + item.name, '调解数量:' + item.caseNum, '成功率：' + item.casePercent + '%']
            this.man.push(obj)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.resolving-disputes-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0px;
  padding-left: 30px;
  position: relative;
  .selectBox{
    position: absolute;
    top:-40px;
    right: 40px;
    display: flex;
    justify-content: space-between;
    width: 100px;
    ::v-deep .ivu-select-selection{
      background-color: #03183F;
      border:1px solid #243A58;
      color: #c5c8ce;
    }
    ::v-deep .ivu-select-dropdown{
      background-color: #03335F;
      color: #c5c8ce;
    }
  }
  &>.el-row {
    height: 100%;
    &>.el-col {
      height: 100%;
    }
  }
  .left-wrapper {
    height: 100%;
    width: 100%;
  }
  .center-wrapper {
    height: 100%;
    width: 100%;
    .center-wrapper-top{
        height: 40%;
        width: 100%;
    }
    .center-wrapper-bottom{
        height: 60%;
        width: 100%;
    }
  }
  .right-wrapper {
    height: 100%;
    width: 100%;
    .right-wrapper-top{
        height: 40%;
        width: 100%;
    }
    .right-wrapper-bottom{
        height: 60%;
        width: 100%;
    }
  }

}
</style>
