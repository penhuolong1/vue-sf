<template>
  <el-col :span="12">
    <div class="card">
      <div>
        <div class="title1">收结数</div>

        <div class="choice-box">
          <span :class="{isChoice:nowSelect === 'week'}" @click="selectDate('week','本周')">本周</span>
          <span :class="{isChoice:nowSelect === 'month'}" @click="selectDate('month','本月')">本月</span>
          <span :class="{isChoice:nowSelect === 'year'}" @click="selectDate('year','本年')">本年</span>
        </div>
      </div>
      <div class="sumBox">
        <div class="sumContent">
          <div class="pointBox">
            <div class="point1">
              <div class="point2" />
            </div>
          </div>
          <div class="textBox">
            <div>{{ nowTitle }}共收案{{ sum1 }}件</div>
            <div>{{ nowTitle }}共结案{{ sum2 }}件</div>
          </div>
        </div>
      </div>
      <ve-line :data="chartData" :settings="chartSettings" />
    </div>
  </el-col>
</template>

<script>
import { searchLine } from '@/api/otherHome/otherHome'
export default {
  name: 'TotalCount',
  data() {
    this.chartSettings = {
      area: true

    }
    return {
      chartData: {
        columns: ['日期', '收案数', '结案数'],
        rows: []
      },
      nowSelect: 'week',
      nowTitle: '本周',
      sum1: 0,
      sum2: 0
    }
  },
  computed: {

  },
  mounted() {
    this.search()
  },
  methods: {
    search() {
      const data = {
        search: this.nowSelect
      }
      searchLine(data).then(({ state, data: { xAxis, series: [fir, sec] }}) => {
        console.log(fir.data)
        console.log(fir.data.reduce((acc, val) => acc + val, 0))
        if (state === 100) {
          const sum1 = fir.data.reduce((acc, val) => acc + val, 0)
          const sum2 = sec.data.reduce((acc, val) => acc + val, 0)
          this.sum1 = sum1
          this.sum2 = sum2
          const rows = xAxis.map((item, index) => {
            return {
              '日期': item,
              '收案数': fir.data[index] ? fir.data[index] : 0,
              '结案数': sec.data[index] ? sec.data[index] : 0
            }
          })
          // console.log(rows)
          this.chartData.rows = rows
        }
      })
    },
    selectDate(word, title) {
      this.nowSelect = word
      this.nowTitle = title
      this.search()
    }
  }
}
</script>

<style scoped lang = "scss">
  .card {
    padding: 15px;
    width: 100%;
    height: 480px;
    background: #ffffff;
    border-radius: 10px;
    /* box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16); */
    box-shadow: 0px 0px 13px 0px rgba(54, 184, 163, 0.10);
    .title1 {
      width: 70%;
      display: inline-block;
      height: 30px;
      font-size: 20px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      color: #000000;
      line-height: 26px;
      vertical-align: top;
    }

    .choice-box {
      vertical-align: top;
      display: inline-block;
      width: 30%;
      top:0;
      span{
        display: inline-block;
        width: 25%;
        height: 30px;
        font-size: 20px;
        font-family: Segoe UI, Segoe UI-Regular;
        font-weight: 400;
        line-height: 26px;
        text-align: center;
        margin-left: 5%;
        cursor: pointer;
      }
    }
  }
  .sumBox{
      width: 100%;
      display: inline-block;
      height: 40px;
      position: relative;
      .sumContent{
        position: absolute;
        top:-33px;
        left: 200px;
        width: 30%;
        height: 50px;
        opacity: 1;
        background: rgba(219,231,238,0.50);
        border-radius: 14px;
        .pointBox{
          float: left;
          height: 100%;
          width: 25%;
          display: flex;
          display: -webkit-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .point1{
            width: 28px;
            height: 28px;
            background: rgba(27,133,207,0.25);
            border-radius: 14px;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .point2{
              width: 8px;
              height: 8px;
              opacity: 1;
              background: #1b85cf;
              border-radius: 50%;
            }
          }

        }
        .textBox{
          float: right;
          font-size: 14px;
          height: 100%;
          width: 75%;
          display: flex;
          display: -webkit-flex;
          flex-direction: column;
          justify-content:center;
          div{
            margin: 1px 0;
          }
        }
      }
    }
  .isChoice {
    color: #1e87f0;
    border-bottom: 3px solid #1e87f0;
  }
</style>
