<template>
  <div class="wisdom-judgment-wrapper">
    <span style="position:absolute;top:-60px;left:30px;color:#fff;cursor:pointer;z-index:10" @click="goBack()"><Icon type="ios-undo-outline" size="24" />返回</span>
    <el-row :gutter="20" class="one-wrapper">
      <!-- <h1 class="h1class">2019年厦门万人成讼率157.12，同比增加<img src="../../../assets/bigData/xm/red.png" alt=""> 14.52%</h1> -->
      <h1 class="h1class">{{ title1 }}</h1>
      <div class="selectBox" style="right:160px">
        <Select v-model="thisTime" style="width:100px">
          <Option :value="year">{{ year }}年</Option>
          <Option :value="year-1">{{ year-1 }}年</Option>
          <Option :value="year-2">{{ year-2 }}年</Option>
        </Select>
      </div>
    </el-row>
    <el-row :gutter="20" class="two-wrapper">
      <el-col :span="8">
        <div class="left-wrapper">
          <complaintRateInfoOne :title="dataArray[0].title" :renkou="dataArray[0].people" :anjianshu="dataArray[0].caseNum" :cengshu="dataArray[0].value" :tongbi="dataArray[0].percent" :state="dataArray[0].state" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="center-wrapper">
          <complaintRateInfoOne :title="dataArray[1].title" :renkou="dataArray[1].people" :anjianshu="dataArray[1].caseNum" :cengshu="dataArray[1].value" :tongbi="dataArray[1].percent" :state="dataArray[1].state" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right-wrapper">
          <complaintRateInfoOne :title="dataArray[2].title" :renkou="dataArray[2].people" :anjianshu="dataArray[2].caseNum" :cengshu="dataArray[2].value" :tongbi="dataArray[2].percent" :state="dataArray[2].state" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="three-wrapper">
      <el-col :span="8">
        <div class="left-wrapper">
          <complaintRateInfoOne :title="dataArray[3].title" :renkou="dataArray[3].people" :anjianshu="dataArray[3].caseNum" :cengshu="dataArray[3].value" :tongbi="dataArray[3].percent" :state="dataArray[3].state" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="center-wrapper">
          <complaintRateInfoOne :title="dataArray[4].title" :renkou="dataArray[4].people" :anjianshu="dataArray[4].caseNum" :cengshu="dataArray[4].value" :tongbi="dataArray[4].percent" :state="dataArray[4].state" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right-wrapper">
          <complaintRateInfoOne :title="dataArray[5].title" :renkou="dataArray[5].people" :anjianshu="dataArray[5].caseNum" :cengshu="dataArray[5].value" :tongbi="dataArray[5].percent" :state="dataArray[5].state" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import mtitle from './title'
import echarts from 'echarts'
import complaintRateInfoOne from './complaintRateInfoOne'
import { getLine5 } from '@/api/bigdata'
export default {
  components: {
    mtitle,
    complaintRateInfoOne
  },
  props: {
  },
  data() {
    return {
      thisTime: '',
      year: '',
      title1: '',
      dataArray: [
        { title: '' }, { tutle: '' }, { title: '' }, { title: '' }, { title: '' }, { title: '' }
      ]
    }
  },
  watch: {
    thisTime(newVal, oldVal) {
      console.log(this.thisTime)
      this.getData()
    }
  },
  created() {
    this.year = new Date().getFullYear()
    this.thisTime = this.year
    this.getData()
  },
  mounted() {
  },
  methods: {
    goBack() {
      this.$store.commit('SET_MENUINDEX', 1)
    },
    getData() {
      const params = {
        startTime: this.thisTime
      }
      console.log(this.dataArray)
      this.dataArray = [
        { title: '' }, { tutle: '' }, { title: '' }, { title: '' }, { title: '' }, { title: '' }
      ]
      getLine5(params).then(res => {
        if (res.state === 100) {
          this.title1 = res.data.title
          const dataList = res.data.list.map((item) => {
            if (item.percent > 0) {
              item.state = 1
            } else {
              item.state = 0
            }
            return item
          })
          this.dataArray = dataList
          console.log(this.dataArray)
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">

.myTimeBox{
  .triangle{
    position: absolute;
    top: 10px;
    right: 85px;
    z-index: 10;
  }
  ::v-deep .el-picker-panel {
    background-color: #03183F!important;
  }
  ::v-deep .el-date-editor {
    width: 190px!important;
    margin-left:40px!important;
    height: 30px;
    margin-top:5px;
    border:1px solid #243A58;
    background-color: #03183F;
    color: #fff!important;
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
      // background-color: #03183F;
    }
  }

  .el-range-editor.is-active, .el-range-editor.is-active:hover{
    border:none;
  }
}
.wisdom-judgment-wrapper{
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
  .one-wrapper{
    height: 10%;
    padding-bottom: 20px!important;
    .time-wrapper{
      height: 100%;
      float: right;
      width: 300px;
      padding-right: 30px!important;

      // background-image: url('../../../assets/bigData/xm/timebg.png');
      // background-repeat: no-repeat;
    }
  }
  .two-wrapper{
    height: 45%;
    background-color: #020D32;
  }
  .three-wrapper{
    height: 45%;
    background-color: #020D32;
  }
  &>.el-row {
    width: 100%;
    padding-bottom:40px;
    &>.el-col {
      height: 100%;
      .left-wrapper {
          height: 100%;
          width: 100%;
      }
      .center-wrapper {
          height: 100%;
          width: 100%;
      }
      .right-wrapper {
          height: 100%;
          width: 100%;
      }
    }

  }
}
 .selectBox{
    position: absolute;
    top:0px;
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
  .h1class{
    color:#fff;
    position:absolute;
    left:20px;
    font-size:24px;
    img{
      height: 26px;
      position: relative;
      top: 6px;
      left:5px;
      right:5px;
    }
  }
</style>
