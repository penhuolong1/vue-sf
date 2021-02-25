<template>
  <div class="complaint-rate">
    <mtitle :title="title" />
    <div class="content">
      <div id="complaintRate" />
    </div>
  </div>
</template>

<script>
import mtitle from './title'
import echarts from 'echarts'
export default {
  components: {
    mtitle
  },
  props: {

  },
  data() {
    return {
      title: ['万人成讼率']
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const myChart = echarts.init(document.getElementById('complaintRate'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        textStyle: {
          color: '#fff',
          fontSize: '20px'
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          splitLine: { // 修改网格颜色
            show: true,
            lineStyle: {
              color: ['#1C3D61'],
              width: 1,
              type: 'solid'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: ['思明区', '湖里区', '海沧区', '集美区', '同安区', '翔安区'],
         
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  1, 0, 0, 0, // 4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                  [
                    { offset: 1, color: '#0799F4' },
                    { offset: 0, color: '#19F6FF' }
                  ] // 数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
                )
              }
            },
            data: [30, 60, 50, 40, 56, 36]
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.complaint-rate {
  height: 100%;
  .content {
    height: calc(100% - 50px);
    background-color: #03183F;
    opacity: 0.7;
    #complaintRate {
      width: 100%;
      height: 100%;
      padding: 10px;
    }
  }
}
</style>
