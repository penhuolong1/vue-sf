<template>
  <div class="wisdom-judgment-wrapper">
    <span style="position:absolute;top:-60px;left:30px;color:#fff;cursor:pointer;z-index:10" @click="goBack()"><Icon type="ios-undo-outline" size="24" />返回</span>
    <div class="time-wrapper myTimeBox ">
      <el-date-picker
        v-model="value1"
        type="monthrange"
        range-separator="-"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        value-format="yyyy-MM"
        :clearable="false"
        @change="changeTime()"
      />
      <!-- <div  class="triangle"><Icon type="ios-arrow-down" /></div> -->
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="left-wrapper">
          <heatmap :points="points" />
        </div>
      </el-col>
      <el-col :span="8">
        <el-row class="center-wrapper-top">
          <el-row class="center-text" style="height:25%">
            <el-col :span="24">
              <span>收案</span>
              <img style="margin: -5px 16px;" src="../../assets/bigData/xm/line.png" alt="">
              <span>{{ shouAn }}件</span>
            </el-col>
          </el-row>
          <el-row class="center-text" style="height:25%">
            <el-col :span="24">
              <img style="padding-top:10px" src="../../assets/bigData/xm/linebg.png" alt="">
            </el-col>
          </el-row>
          <el-row style="height:50%">
            <el-col :span="8" style="text-align: center">
              <img style="width: 70%;" src="../../assets/bigData/xm/linghtRing.png" alt="">
              <label class="dashboard-label"><span style="font-size:16px;color: #fff;">{{ shouAn2 }}件</span><br>当事人申请</label>
            </el-col>
            <el-col :span="8" style="text-align: center;">
              <img style="width: 70%;" src="../../assets/bigData/xm/darkRing.png" alt="">
              <label class="dashboard-label" style="color:#079FE8"><span style="font-size:16px;color: #fff;">{{ shouAn3 }}件</span><br>联动单位</label>
            </el-col>
            <el-col :span="8" style="text-align: center;">
              <img style="width: 70%;" src="../../assets/bigData/xm/linghtRing.png" alt="">
              <label class="dashboard-label"><span style="font-size:16px;color: #fff;">{{ shouAn4 }}件</span><br>人民法院调解平台</label>
            </el-col>
          </el-row>
        </el-row>
        <el-row class="center-arrow" />
        <el-row class="center-text">
          <el-col :span="24" class="bgline">
            <span>分流</span>
            <img style="margin: -5px 16px;" src="../../assets/bigData/xm/line.png" alt="">
            <span>{{ data2[0] ? data2[0].value : '' }}件</span>
            <!-- <span>17973件</span> -->
          </el-col>
        </el-row>
        <el-row class="center-arrow" />
        <el-row class="center-text">
          <el-col :span="24" class="bgline">
            <span>受理</span>
            <img style="margin: -5px 16px;" src="../../assets/bigData/xm/line.png" alt="">
            <span>{{ data3[0] ? data3[0].value : '' }}件</span>
            <!-- <span>17973件</span> -->
          </el-col>
        </el-row>
        <el-row class="center-arrow" />
        <el-row class="center-wrapper-bottom">
          <el-row class="center-text" style="height:25%">
            <el-col :span="24">
              <span>化解</span>
              <img style="margin: -5px 16px;" src="../../assets/bigData/xm/line.png" alt="">
              <span>{{ huaJie }}件</span>
            </el-col>
          </el-row>
          <el-row class="center-text">
            <el-col :span="24">
              <img src="../../assets/bigData/xm/linebg.png" alt="">
            </el-col>
          </el-row>
          <el-row style="height:50%">
            <el-col :span="8" style="text-align: center">
              <img style="width: 70%;" src="../../assets/bigData/xm/linghtRing.png" alt="">
              <label class="dashboard-label"><span style="font-size:16px;color: #fff;">{{ successNum }}件</span><br>成功</label>
            </el-col>
            <el-col :span="8" style="text-align: center;">
              <div style="width:100%;height:20px" />
              <!-- <img style="width: 70%;" src="../../assets/bigData/xm/darkRing.png" alt=""> -->
              <!-- <label class="dashboard-label" style="color:#079FE8"><span style="font-size:16px;color: #fff;">315件</span><br>仲裁</label> -->
            </el-col>
            <el-col :span="8" style="text-align: center;">
              <img style="width: 70%;" src="../../assets/bigData/xm/linghtRing.png" alt="">
              <label class="dashboard-label"><span style="font-size:16px;color: #fff;">{{ failNum }}件</span><br>失败</label>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="8" class="local1-wrapper">
        <el-row class="complaint-rate-wrapper">
          <complaintRate :success-data="successData" />
        </el-row>
        <el-row class="case-type-wrapper">
          <caseType :case-type-data="data6" />
        </el-row>
        <el-row class="hot-case-wrapper">
          <hotCase :hot-case-data="data7" />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import heatmap from './compontents/heatmap' // 地图模块
import disputeNum from './compontents/disputeNum'
import caseType from './compontents/caseType' // 化解类型分布
import hotCase from './compontents/hotCase' // 频发纠纷预警
import complaintRate from './compontents/complaintRate' // 万人成诉率
import localCase from './compontents/localCase' // 案件数
import { char1, getLocation } from '../../api/common/common.js'
import { getLine4 } from '@/api/bigdata'
export default {
  components: {
    heatmap,
    disputeNum,
    caseType,
    hotCase,
    complaintRate,
    localCase
  },
  props: {

  },
  data() {
    return {
      value1: '',
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      data5: [],
      data6: [], // 化解类型分布数据
      data7: { // 热点案由预警数据
        name: [],
        value: [],
        max: []
      },
      successData: [], // 万人成讼率
      shouAn: 0,
      shouAn2: 0,
      shouAn3: 0,
      shouAn4: 0,
      huaJie: 0,
      successNum: 0, // 化解成功数
      failNum: 0, // 化解失败数
      points: []
    }
  },
  created() {

  },
  mounted() {
    var now = new Date()
    var year = now.getFullYear() // 得到年份
    var month = now.getMonth() // 得到月份
    this.value1 = [now.getFullYear() + '-' + '01', now.getFullYear() + '-' + '12']
    const params = {
      startTime: this.value1[0],
      endTime: this.value1[1]
    }
    this.getSuccessData(params)// 获得万人成讼率
    this.getchar1(params)
  },
  methods: {
    goBack() {
      this.$store.commit('SET_MENUINDEX', 0)
    },
    changeTime() {
      console.log(this.value1)
      const params = {
        startTime: this.value1[0],
        endTime: this.value1[1]
      }
      this.getchar1(params)
      this.getSuccessData(params)// 获得万人成讼率
    },
    // 获得万人成讼率
    getSuccessData(params) {
      getLine4(params).then(res => {
        if (res.state == 100) {
          this.successData = res.data
        }
      })
    },
    getchar1(params) {
      // 获取地图坐标
      getLocation(params).then(res => {
        if (res.state == 100) {
          this.points = res.data
        }
      })
      char1(params).then(res => {
        if (res.state == 100) {
          this.data1 = res.data.data1
          this.data2 = res.data.data2
          this.data3 = res.data.data3
          this.data4 = res.data.data4
          this.data5 = res.data.data5
          this.data6 = res.data.data6
          this.data7.name = res.data.data7.map(item => item.name)
          this.data7.value = res.data.data7.map(item => item.value)
          const maxValue = this.data7.value.reduce((a, b) => {
            return b > a ? b : a
          })
          for (let i = 0; i < res.data.data4.length; i++) {
            if (res.data.data4[i].name == '化解') {
              this.huaJie = res.data.data4[i].value
            } else if (res.data.data4[i].name == '成功') {
              this.successNum = res.data.data4[i].value
            } else if (res.data.data4[i].name == '失败') {
              this.failNum = res.data.data4[i].value
            }
          }
          for (let i = 0; i < res.data.data1.length; i++) {
            if (res.data.data1[i].name == '收案') {
              this.shouAn = res.data.data1[i].value
            } else if (res.data.data1[i].name == '当事人申请') {
              this.shouAn2 = res.data.data1[i].value
            } else if (res.data.data1[i].name == '联动单位') {
              this.shouAn3 = res.data.data1[i].value
            } else if (res.data.data1[i].name == '人民法院调解平台') {
              this.shouAn4 = res.data.data1[i].value
            }
          }
          for (let i = 0; i < this.data7.value.length; i++) {
            this.data7.max.push(maxValue)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
    .el-picker-panel{
      background-color: #03183F!important;
      border:none;
      color:#fafbfb;
      .el-picker-panel__icon-btn{
        color: #fff !important;
      }
      .el-month-table{
        color:#fafbfb!important;
      }
      .el-date-range-picker__content.is-left{
        border-right:none;
      }
      .el-month-table td .cell {
          color:#fafbfb;
      }
      .el-month-table td.end-date .cell, .el-month-table td.start-date .cell {
          color: #FFF;
          background-color: #11A5DE;
      }
      .el-picker-panel .el-month-table td.start-date .cell {
          color: #FFF;
          background-color: #11A5DE;
      }
      .el-month-table td.in-range div, .el-month-table td.in-range div:hover {
          background-color:#03183F;
      }
    }
</style>
<style scoped lang="scss">
.myTimeBox{
  .triangle{
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 10;
  }

  ::v-deep .el-date-editor {
    width: 190px!important;
    margin-left:33px!important;
    background:none;
    height: 30px;
    margin-top:5px;
    color: #fff!important;
    border:1px solid #243A58;
    background-color: #03183F;
    .el-range__icon{
      line-height: 25px;
    }
    .el-range__close-icon{
      display: none;
    }
    input{
      background-color: #03183F;
      color: #fff!important;
    }
    span{
      color: #fff;
      display: contents;
    }
    .el-range-editor.is-active, .el-range-editor.is-active:hover{
      border:none;
    }
  }
}
.wisdom-judgment-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0px;
  padding-left: 30px;
  position: relative;
  .time-wrapper{
      height: 52px;
      float: right;
      width: 230px;
      padding-right: 30px!important;
      position:absolute;
      top:-60px;
      right: 75px;
      background-size: 100% 100%;
    }
  &>.el-row {
    height: 100%;
    &>.el-col {
      height: 100%;
      &:nth-child(1) {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../assets/bigData/xm/mapbg.png');
        padding: 1px!important;
      }
      &:nth-child(2) {
        padding-right:30px!important;
        padding-left:20px!important;
      }
    }
  }
  .left-wrapper {
    height: 100%;
    width: 100%;
  }
  .center-wrapper {
    height: 100%;
    width: 100%;
  }
  .center-arrow{
    height: 8%;
    background-position:center;
    background-repeat: no-repeat;
    background-image: url('../../assets/bigData/xm/arrow.png');
  }
  .center-text{
    height: 8%;
    font-size: 24px;
    color:#05E0FE;
    font-weight: 600;
    line-height: 63px;
    text-align: center;
  }
  .center-wrapper-top{
    height: 30%;
    width: 100%;
    border:1px solid #00C9DA;
    border-radius: 10px;
    margin-left: 10px;
    margin-right: 20px;
  }
  .center-wrapper-bottom{
    height: 30%;
    width: 100%;
    border:1px solid #00C9DA;
    border-radius: 10px;
    margin-left: 10px;
    margin-right: 20px;
  }
  // .dispute-wrapper, .caseType-wrapper {
  //   height: 50%;
  // }
  .hot-case-wrapper {
    height: 32%;

  }
  .complaint-rate-wrapper {
    height: 32%;
  }
  .case-type-wrapper{
    height: 38%;
    min-height: 290px;
  }
  .bgline{
    border:1px solid #00C9DA;
    height: 100%;
    border-radius: 10px;
    margin-left: 10px;
    margin-right: 20px;
  }
  .dashboard-label {
    display: block;
    font-size: 12px;
    text-align: center;
    color:#07CFE3;
    line-height: 20px;
    margin: -40px 0px;
  }
  // .local1-wrapper {
  //   height: 100%;
  //   background-color: #03183F;
  //   padding: 20px!important;
  // }
}
</style>
