<template>
  <el-col :span="12">
    <div class="card">
      <div class="title">收案类型</div>
      <ve-pie :data="chartData" />
    </div>
  </el-col>
</template>

<script>
import { searchType } from '@/api/otherHome/otherHome'

export default {
  name: 'CaseType',
  data() {
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
    searchType().then(res => {
      if (res.state === 100) {
        this.chartData.rows = res.data.series[0].data
      }
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
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16);
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
