<template>
  <el-col :span="span">
    <div v-if="role==4||role==5" class="card" :class="{card2:role==5}">
      <el-col :span="12" style="border-right:1px solid #CCCCD5;border-bottom:1px solid #CCCCD5;">
        <div>
          <div class="title1">司法确认案件数</div>
          <div class="content">
            <div>
              <div class="queTitle1">{{ que }}件</div>
              <div v-if="add>0">
                <span>本日</span>
                <div class="imgBox"><img src="../../../assets/icon/up.png"></div>
                <span>{{ add }}件</span>
              </div>
              <div v-else>
                <span>本日</span>
                <div class="imgBox"><img src="../../../assets/icon/down(2).png"></div>
                <span>{{ add }}件</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="border-bottom:1px solid #CCCCD5;">
        <div>
          <div class="title1">
            <span>平均化解周期</span>
            <span class="titleRight">{{ average }}天</span>
          </div>
          <div class="content">
            <!-- <div id="bar" style="height: 100%;" /> -->
            <div id="bar">
              <proy :value="hotCaseData" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="padding-top:10px;border-right:1px solid #CCCCD5;">
        <div>
          <div class="title1">调解成功率</div>
          <div class="content">
            <div class="circleBox">
              <el-progress :width="circle1.progressWidth" type="circle" :percentage="success" :color="circle1.color" :stroke-width="8" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="padding-top:10px;">
        <div>
          <div class="title1">在线调解率</div>
          <div class="content">
            <div class="circleBox">
              <el-progress :width="circle2.progressWidth" type="circle" :percentage="onLineSuccess" :color="circle2.color" :stroke-width="8" />
            </div>
          </div>
        </div>
      </el-col>
    </div>
    <div v-else class="card">
      <div style="height:33.3%">
        <div class="title1">调解成功率</div>
        <div class="circleBox">
          <el-progress :width="circle1.progressWidth" type="circle" :percentage="success" :color="circle1.color" :stroke-width="10" />
        </div>
      </div>
      <div style="height:33.3%">
        <div class="title1">在线调解率</div>
        <div class="circleBox">
          <el-progress :width="circle2.progressWidth" type="circle" :percentage="onLineSuccess" :color="circle2.color" :stroke-width="10" />
        </div>
      </div>
      <div style="height:33.3%">
        <div class="title1">
          <span>平均化解周期</span>
          <span class="titleRight">{{ average }}天</span>
        </div>
        <div class="content" style="height:130px">
          <!-- <div id="bar" style="height: 100%;" /> -->
          <div id="bar">
            <proy :value="hotCaseData" />
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import { searchCaseInfo } from '@/api/otherHome/otherHome'
import proy from './progressY'
export default {
  name: 'Mediate',
  components: {
    proy
  },
  props: {
    role: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      span: 6,
      success: 0, // 调解成功率
      que: 0, // 件
      add: 0, // 新增
      onLineSuccess: 0, // 在线调解率
      average: 0, // 平均化解天数
      circle1: {
        progressWidth: 100,
        color: '#0392fd'
      },
      circle2: {
        progressWidth: 100,
        color: '#f3820f'
      },
      hotCaseData: []
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {
    // this.initBar()
  },
  methods: {
    init() {
      if (this.role == 4 || this.role == 5) {
        this.span = 12
        this.circle1.progressWidth = 100
        this.circle2.progressWidth = 100
      }
      searchCaseInfo().then(res => {
        if (res.state == 100) {
          // console.log(res)
          this.que = res.data.que ? res.data.que : 0
          this.add = res.data.add ? res.data.add : 0
          this.average = res.data.average ? res.data.average : 0
          this.success = res.data.success ? res.data.success : 0
          this.onLineSuccess = res.data.onLineSuccess ? res.data.onLineSuccess : 0
          const d = res.data
          this.hotCaseData = [
            { name: '3以下', value: d.one ? d.one : 0, percent: d.onePercent ? d.onePercent : 0 },
            { name: '3-7', value: d.two ? d.two : 0, percent: d.twoPercent ? d.twoPercent : 0 },
            { name: '7-15', value: d.three ? d.three : 0, percent: d.threePercent ? d.threePercent : 0 },
            { name: '15-30', value: d.four ? d.four : 0, percent: d.fourPercent ? d.fourPercent : 0 },
            { name: '30以上', value: d.five ? d.five : 0, percent: d.fivePercent ? d.fivePercent : 0 }
          ]
          // console.log(this.hotCaseData)
        }
      })
    }

  }
}
</script>

<style scoped lang = "scss">
  .card {
    padding: 15px;
    width: 100%;
    height:480px;
    background: #ffffff;
    border-radius: 10px;
    /* box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16); */
    box-shadow: 0px 0px 13px 0px rgba(54, 184, 163, 0.08);
    .title1 {
      width: 100%;
      display: inline-block;
      height: 15%;
      font-size: 18px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      color: #000000;
      line-height: 26px;
    }
  }
  .circleBox{
    width: 100%;
    height:85%;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .titleRight{
    float: right;
  }
  .content{
    height: 190px;
    display: flex;
    justify-content: center;
    align-items: center;
    #bar {
      width: 100%;
      height: 100%;
      padding: 10px;
    }
  }
  .imgBox{
    display: inline-block;
    height:20px;
    /* vertical-align: middle; */
    margin: 0 10px;
    img{
      vertical-align: middle;
      height: 15px;
    }
  }
  .queTitle1{
    font-size:26px;
    padding-bottom:20px;
    text-align:center;
  }
  .card2{
    height:650px;
      .content{
        height: 280px;
        display: flex;
        justify-content: center;
        align-items: center;
        #bar {
          width: 100%;
          height: 100%;
          padding: 10px;
        }
    }
  }
</style>
