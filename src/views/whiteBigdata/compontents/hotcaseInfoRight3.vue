<template>
  <!-- 化解成功率趋势 -->
  <div class="right1-wrapper">
    <mtitle :title="title" />
    <div class="content">
      <div id="bar3" style="height: 100%;" />
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
    title: {
      type: Array,
      default() {
        return ['']
      }
    },
    successRate: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // title: ['化解成功率趋势'],
    }
  },
  watch: {
    successRate: {
      handler() {
        this.initBar()
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    initBar() {
      const myChart = echarts.init(document.getElementById('bar3'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.successRate.xAxis,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff', // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
            }
          },
          // 隐藏横坐标
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(16,78,139,0.5)',
              width: 15,
              type: 'solid'
            }
          },
          // 隐藏刻度线
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            margin: 22, // 刻度标签与轴线之间的距离
            textStyle: {
              color: '#fff', // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
            }
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitNumber: 4 // 调整y轴得间距
        },
        // 设置canvas内部表格的内距
	   	grid: {
          x: 80,
          y: 30,
          x2: 50,
          y2: 30,
          borderWidth: 10
        },
        series: [{
          data: this.successRate.series,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#00F5FF', // 改变折线点的颜色
              lineStyle: {
                color: '#21CFFA', // 改变折线颜色
                width: 4
              },
              label: {
                show: true,
                formatter: '{c}%',
                color: '#fff'
              }
            }
          },
          symbolSize: 7, // 折线圆点的大小
          areaStyle: {
            normal: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#025D79' // 0% 处的颜色
                }, {
                  offset: 0.7,
                  color: 'rgba(3, 27, 65)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          }
        }]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.right1-wrapper {
  height: 100%;
  .content {
    height: calc(100% - 50px);
    background-color: #03183F;
    opacity: 0.7;
    #bar {
      width: 100%;
      height: 100%;
      padding: 10px;
    }
  }
}
</style>
