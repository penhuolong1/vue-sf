<template>
  <div class="disputenum-wrapper">
    <mtitle :title="title" :title2="title2" @click.native="go()" />
    <div class="content">
      <div id="bar" style="height: 100%;" />
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
    hotCaseData: {
      name: [],
      value: [],
      max: []
    }
  },
  data() {
    return {
      title: ['频发纠纷预警'],
      data1: [],
      title2: '案件数/件',
      rangeY: []
    }
  },
  watch: {
    hotCaseData: {
      handler() {
        this.initBar()
      },
      deep: true
    }
  },
  created() {
    this.getData1()
  },
  mounted() {
  },
  methods: {
    go() {
      this.$store.commit('SET_MENUINDEX', 10)
    },
    getData1() {
      this.data1 = this.hotCaseData.value.map(item => {
        return {
          value: item,
          symbolPosition: 'end'
        }
      })
    },
    initBar() {
      const myChart = echarts.init(document.getElementById('bar'))
      // 绘制图表
      myChart.setOption({
        title: {
        },
        grid: {
          top: '10%',
          left: '10px',
          right: '25px',
          bottom: '5px',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        textStyle: {
          color: '#fff',
          fontSize: '20px'
        },
        xAxis: {
          data: this.hotCaseData.name,
          boundaryGap: false,
          // 隐藏横坐标的刻度线
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: { // 竖向网格线设置
            show: true, // 设置true是显示
            lineStyle: {
              color: '#05224E',
              width: 16, // 竖向网格线粗细
              type: 'solid'// 竖向网格线样式
            }
          },
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function(params) {
              var newParamsName = ''
              var paramsNameNumber = params.length
              var provideNumber = 4 // 一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''
                  var start = p * provideNumber
                  var end = start + provideNumber
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }
              return newParamsName
            }
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 24 // 刻度标签与轴线之间的距离，可以调整y轴文字和图表的距离
          }
        },
        series: [
          // { // For shadow
          //   type: 'bar',
          //   itemStyle: {
          //     normal: {
          //       color: '#05224E'
          //     }
          //   },
          //   barWidth: 16,
          //   barGap: '-100%',
          //   data: this.hotCaseData.max  //柱状阴影

          // },
          {
            type: 'pictorialBar', // 上圈圈
            symbolSize: [16, 7],
            symbolOffset: [0, -5],
            symbolPosition: 'end',
            z: 12,
            itemStyle: {
              normal: {
                color: '#13B3ED'
              }
            },
            data: this.hotCaseData.value
          },
          {
            type: 'pictorialBar', // 下圈圈
            symbolSize: [16, 7],
            symbolOffset: [0, 5],
            z: 12,
            itemStyle: {
              normal: {
                color: '#1B7BE4'
              }
            },
            data: this.hotCaseData.value // 真实数据
          },
          {
            type: 'bar',
            offset: [0, 20],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 1, 0, 0,
                  [
                    { offset: 0, color: '#1CBCF3' },
                    { offset: 1, color: '#1E7FE3' }
                  ]
                )
              }
            },
            barWidth: 16,
            data: this.hotCaseData.value // 真实数据
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.disputenum-wrapper {
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
