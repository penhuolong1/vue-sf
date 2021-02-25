<template>
  <el-col :span="12">
    <div class="title">综合考评指标数据</div>
    <div class="card">
      <div class="ECharts">
        <pro :title="'法院委派、委托案件'" :percent="percent1" :toptitle="topTitle1" :color="'#FF8C00'" />
        <pro :title="'3日内未接收案件'" :percent="percent2" :toptitle="topTitle2" :color="'#FFA500'" />
        <pro :title="'30日未化解案件数'" :percent="percent3" :toptitle="topTitle3" :color="'#7FFFAA'" />
        <pro :title="'委派、委托案件调解成功率'" :percent="percent4" :toptitle="topTitle4" :color="'#00FFFF'" />
        <pro :title="'委派、委托案件在线调解率'" :percent="percent5" :toptitle="topTitle5" :color="'#2770ED'" />
      </div>
    </div>
  </el-col>
</template>

<script>
import pro from './progress'
import { target } from '@/api/otherHome/otherHome'
export default {
  name: 'Examination',
  components: {
    pro
  },

  data() {
    return {
      percent1: 88.0,
      percent2: 80.0,
      percent3: 28.0,
      percent4: 58.0,
      percent5: 10,
      topTitle1: '15件',
      topTitle2: '37件',
      topTitle3: '389件',
      topTitle4: '58%',
      topTitle5: '10%'
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      target().then(res => {
        console.log(res.data)
        this.percent1 = res.data[0].percent
        this.percent2 = res.data[1].percent
        this.percent3 = res.data[2].percent
        this.percent4 = res.data[3].percent
        this.percent5 = res.data[4].percent
        this.topTitle1 = res.data[0].value + '件'
        this.topTitle2 = res.data[1].value + '件'
        this.topTitle3 = res.data[2].value + '件'
        this.topTitle4 = res.data[3].percent + '%'
        this.topTitle5 = res.data[4].percent + '%'
      })
    }
  }
}
</script>

<style scoped lang = "scss">
.title{
    padding: 0 15px 15px;
    font-size: 18px;
    font-weight: 700;
    color:#000;
    font-family: Segoe UI, Segoe UI-Bold;
}
    .card {
        padding: 15px;
        width: 100%;
        height: 290px;
        background: #ffffff;
        border-radius: 10px;
        /* box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16); */
        box-shadow: 0px 0px 13px 0px rgba(54, 184, 163, 0.15);
        .title1 {
        width: 70%;
        display: inline-block;
        height: 25px;
        font-size: 20px;
        font-family: Segoe UI, Segoe UI-Bold;
        font-weight: 700;
        color: #000000;
        line-height: 26px;
        }
    }
    .ECharts{
        height: 100%;
        /* overflow: hidden; */
    }
</style>
