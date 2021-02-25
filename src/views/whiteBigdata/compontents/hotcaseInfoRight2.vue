<template>
  <!-- 收案数同比环比趋势 -->
  <div class="right1-wrapper">
    <mtitle :title="title" />
    <div class="content">
      <div id="bar2" style="height: 100%;" />
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
    comparison: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // title: ['收案数同比环比趋势'],
    }
  },
  watch: {
    comparison: {
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
      const myChart = echarts.init(document.getElementById('bar2'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['同比', '环比'],
          textStyle: {
            color: '#fff', // 更改坐标轴文字颜色
            fontSize: 16 // 更改坐标轴文字大小
          },
          y: 'top', // 延Y轴居中
          x: 'right' // 居右显示
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.comparison.xAxis,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff', // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitNumber: 4, // 调整y轴得间距
          axisLabel: {
            margin: 22, // 刻度标签与轴线之间的距离
            show: true,
            textStyle: {
              color: '#fff', // 更改坐标轴文字颜色
              fontSize: 16 // 更改坐标轴文字大小
            }
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(74,112,139,0.9)',
              width: 1
            }

          },
          axisTick: {
            show: false
          }
        },
        // 设置canvas内部表格的内距
        grid: {
          x: 80,
          y: 40,
          x2: 50,
          y2: 30,
          borderWidth: 10
        },
        series: [{
          name: '同比',
          data: this.comparison.series1,
          type: 'line',

          // itemStyle : {
          //     normal : {
          //         color:'#00F5FF', //改变折线点的颜色
          //         lineStyle:{
          //             color:'#21CFFA', //改变折线颜色
          //         }
          //     }
          // },
          symbolSize: 7, // 折线圆点的大小
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#00AEFF' // 0% 处的颜色
              }, {
                offset: 1, color: '#0337A3' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            normal: {
              color: '#00AEFF', // 改变折线点的颜色
              lineStyle: {
                width: 4
              }

            }
          }
        },
        {
          name: '环比',
          data: this.comparison.series2,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#0352F6', // 改变折线点的颜色
              lineStyle: {
                color: '#0352F6', // 改变折线颜色
                width: 4
              },
              symbolSize: 30,
              label: {
                show: true,
                formatter: '{c}%',
                color: '#fff'
              }
            }
          },
          symbolSize: 7 // 折线圆点的大小
          // areaStyle: {
          //     normal: {
          //         color: {
          //             x: 0,
          //             y: 0,
          //             x2: 0,
          //             y2: 1,
          //             colorStops: [{
          //                 offset: 0,
          //                 color: "#025D79" // 0% 处的颜色
          //                 }, {
          //                 offset: 0.7,
          //                 color: "rgba(3, 27, 65)" // 100% 处的颜色
          //             }],
          //             globalCoord: false // 缺省为 false
          //         }
          //     }
          // }
        }
        ]
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
