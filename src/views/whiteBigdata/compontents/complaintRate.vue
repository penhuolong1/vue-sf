<template>
  <div class="hot-case">
    <mtitle :title="title" @click.native="go()" />
    <div class="content">
      <div id="radar" />
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
    successData: {
      type: Array,
      default() {}
    }

  },
  data() {
    return {
      title: ['万人成讼率']
    }
  },
  watch: {
    successData() {
      this.init()
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    go() {
      this.$store.commit('SET_MENUINDEX', 11)
    },
    init() {
      console.log(this.successData)
      const titleArray = this.successData.map((item) => {
        return item.title
      })
      const valueArray = this.successData.map((item) => {
        return item.value
      })
      const myChart = echarts.init(document.getElementById('radar'))
      myChart.setOption({
        textStyle: {
          color: '#fff',
          fontSize: '20px'
        },
        grid: {
          top: '25px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //         dataView: {readOnly: false},
        //         restore: {},
        //         saveAsImage: {}
        //     }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: titleArray,
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(16,78,139,0.9)',
              width: 15,
              type: 'solid'
            }
          }
        },
        yAxis: {
          type: 'value',
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
            margin: 22 // 刻度标签与轴线之间的距离
          }
        },
        legend: {
          left: 'right',
          tooltip: {
            show: true
          },
          data: ['区万人诉讼率值', '平均值'],
          textStyle: {
            color: '#fff',
            fontSize: '20px'
          }
        },
        series: [
          {
            name: '区万人诉讼率值',
            data: valueArray,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#00F5FF',
                width: 10
              }
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(4, 93, 124)'
              }, {
                offset: 1,
                color: 'rgb(3, 26, 64)'
              }])
            },
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              normal: {
                color: '#02526F'
              }
            },
            markLine: { // 平均线设置
              silent: false, // true 去掉鼠标悬浮该线上的动画
              symbol: 'none', // 该线无样式
              label: {
                show: true // 该线上的值
              },
              lineStyle: { // 设置该线样式
                normal: {
                  type: 'dashed',
                  color: '#019BFF'
                }
              },

              data: [{
                type: 'average',
                name: '平均值'
              }],
              label: {
                formatter: '{b}: {c}',
                position: 'middle'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.hot-case {
  height: 100%;
  .content {
    height: calc(100% - 50px);
    background-color: #03183F;
    opacity: 0.7;
    #radar {
      width: 100%;
      height: 100%;
      padding: 10px;
    }
  }
}
</style>
