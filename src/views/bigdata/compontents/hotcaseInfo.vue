<template>
  <div class="wisdom-judgment-wrapper" style="background-color:#030F34!important;">
    <span style="position:absolute;top:-60px;left:30px;color:#fff;cursor:pointer;z-index:10" @click="goBack()"><Icon type="ios-undo-outline" size="24" />返回</span>
    <div class="selectBox">
      <div>
        <Select v-model="model1" style="width:100px">
          <Option :value="year">{{ year }}年</Option>
          <Option :value="year-1">{{ year-1 }}年</Option>
        </Select>
      </div>
      <!-- <div>
        <Select v-model="model2" style="width:200px">
          <Option v-for="item in selectLabel" :key="item" :value="item">{{ item }}</Option>
        </Select>
      </div> -->
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="left-wrapper">
          <hotcaseInfoLeft :warning-data="warningData" :year="model1" />
        </div>
      </el-col>
      <el-col :span="12" class="right-wrapper">
        <el-row class="Right1">
          <hotcaseInfoRight1 :title="[model1+'-'+'收案数']" :case-number="caseNumber" :year="model1" />
        </el-row>
        <el-row class="Right2">
          <hotcaseInfoRight2 :title="[model1+'-'+'收案数同/环比趋势']" :comparison="comparison" :year="model1" />
        </el-row>
        <el-row class="Right3">
          <hotcaseInfoRight3 :title="[model1+'-'+'化解成功率趋势']" :success-rate="successRate" :year="model1" />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import hotcaseInfoLeft from './hotcaseInfoLeft' // 频发纠纷预警
import hotcaseInfoRight1 from './hotcaseInfoRight1'
import hotcaseInfoRight2 from './hotcaseInfoRight2'
import hotcaseInfoRight3 from './hotcaseInfoRight3'
import { getType, getLine, getLine2, getLine3 } from '@/api/common/hotcaseInfo.js'
export default {
  components: {
    hotcaseInfoLeft,
    hotcaseInfoRight1,
    hotcaseInfoRight2,
    hotcaseInfoRight3
  },
  props: {

  },
  data() {
    return {
      year: '',
      model1: '',
      warningData: {}, // 频发纠纷预警数据
      caseNumber: {}, // 收案数
      comparison: {}, // 收案数同/环比趋势 的数据
      successRate: {} // 化解成功率趋势 的数据
      // model2: '房屋租赁合同纠纷',
      // selectLabel: ['房屋租赁合同纠纷', '离婚纠纷', '追偿权纠纷', '合同纠纷', '金融借款合同纠纷', '信用卡纠纷', '机动车交通事故责任纠纷', '物业服务合同纠纷', '买卖合同纠纷', '民间借贷纠纷']
    }
  },
  watch: {
    model1(newVal, oldVal) {
      this.getType()
      this.getLine()
      this.getLine2()
      this.getLine3()
    }
  },
  created() {
    this.year = new Date().getFullYear()
    this.model1 = this.year
  },
  mounted() {
  },
  methods: {
    goBack() {
      this.$store.commit('SET_MENUINDEX', 1)
    },
    // 获取频发纠纷预警数据
    getType() {
      const params = {
        year: this.model1
      }
      getType(params).then(res => {
        if (res.state == 100) {
          this.warningData = res.data
        }
      })
    },
    // 获取收案数得数据
    getLine() {
      const params = {
        year: this.model1
      }
      getLine(params).then(res => {
        if (res.state == 100) {
          this.caseNumber = {
            x: res.data.xAxis,
            y: res.data.series[0].data
          }
        }
      })
    },
    // 获取收案数同/环比趋势 的数据
    getLine2() {
      const params = {
        year: this.model1
      }
      getLine2(params).then(res => {
        if (res.state == 100) {
          this.comparison = {
            xAxis: res.data.xAxis,
            series1: res.data.series[0].data, // 同比
            series2: res.data.series[1].data // 环比
          }
        }
        console.log(this.comparison)
      })
    },
    // 获取化解成功率趋势 的数据
    getLine3() {
      const params = {
        year: this.model1
      }
      getLine3(params).then(res => {
        if (res.state == 100) {
          this.successRate = {
            xAxis: res.data.xAxis,
            series: res.data.series[0].data
          }
        }
        console.log(this.comparison)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.wisdom-judgment-wrapper{
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0px;
  padding-left: 30px;
  position: relative;
  .selectBox{
    position: absolute;
    top:-40px;
    right: 10%;
    display: flex;
    justify-content: space-evenly;
    width: 330px;
    ::v-deep .ivu-select-selection{
      background-color: #03183F;
      border:1px solid #243A58;
      color: #c5c8ce;
    }
    ::v-deep .ivu-select-dropdown{
      background-color: #03183F;
      color: #c5c8ce;
    }
  }
  &>.el-row {
    height: 100%;
    &>.el-col {
      height: 100%;
      .left-wrapper {
          height: 100%;
          width: 100%;
      }
      .right-wrapper {
          height: 100%;
          width: 100%;
      }
      .Right1{
        height: 33%;
      }
      .Right2{
        height: 33%;
      }
      .Right3{
        height: 33%;
      }
    }

  }
}
</style>
