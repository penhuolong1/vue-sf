<template>
  <el-col :span="12">
    <div class="card">
      <div class="title1">热点案由</div>
      <ve-ring :data="chartData" :settings="chartSettings" />
    </div>
  </el-col>
</template>

<script>
import { searchReason, hotBrief } from '@/api/otherHome/otherHome'
export default {
  name: 'HotCase',
  data() {
    this.chartSettings = {
      radius: [80, 120],
      offsetY: 250
    }
    return {
      chartData: {
        columns: ['name', 'value'],
        rows: []
      }
    }
  },
  computed: {

  },
  mounted() {
    // searchReason().then(res => {
    //   console.log(res.data.series[0].data)
    //   if (res.state === 100) {
    //     this.chartData.rows = res.data.series[0].data.filter((item, index) => {
    //       return index < 10
    //     })
    //   }
    // })
    hotBrief().then(res => {
      // console.log(res.data)
      this.chartData.rows = res.data
    })
  },
  methods: {

  }
}
</script>

<style scoped lang = "scss">
  .card {
    padding: 15px;
    width: 100%;
    height: 535px;
    background: #ffffff;
    border-radius: 10px;
    /* box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16); */
    box-shadow: 0px 0px 13px 0px rgba(54, 184, 163, 0.15);
    .title1 {
      width: 70%;
      display: inline-block;
      height: 50px;
      font-size: 20px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      color: #000000;
      line-height: 26px;
    }
  }

</style>
