<template>
  <div class="infoLeft-wrapper">
    <mtitle :title="title" />
    <div class="content">
      <div id="bar" style="height: 100%;" />
    </div>
  </div>
</template>

<script>
import mtitle from './title'
import echarts from 'echarts'
// const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90]
export default {
  components: {
    mtitle
  },
  props: {
    warningData: {
      type: Object,
      default() {
        return {}
      }
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    }
  },
  data() {
    return {
      title: ['频发纠纷预警'],
      data1: []
    }
  },
  watch: {
    warningData: {
      handler() {
        console.log(this.year)
        this.initBar()
      },
      deep: true
    }
  },
  created() {
    // this.getData1()
  },
  mounted() {

  },
  methods: {
    // getData1() {
    //   this.data1 = data.map(item => {
    //     return {
    //       value: item,
    //       symbolPosition: 'end'
    //     }
    //   })
    // },
    initBar() {
      const myChart = echarts.init(document.getElementById('bar'))
      // 绘制图表
      myChart.setOption({
        //    tooltip: {
        //         trigger: 'axis',
        //         axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //             type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        //         },
        //         formatter:function(params){
        //             return params[0].name+"<br>"+params[0].seriesName+":"+params[0].data.value+'件'+"<br>"+
        //             params[1].seriesName+":"+(-(params[1].data.value))+"件";
        //         },
        //     },
        legend: {
          data: [this.year - 1 + '年度', this.year + '年度'],
          textStyle: {
            color: '#fff', // 更改坐标轴文字颜色
            fontSize: 16 // 更改坐标轴文字大小
          }
        },
        // grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '3%',
        //     containLabel: true
        // },
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff', // 更改坐标轴文字颜色
                fontSize: 16 // 更改坐标轴文字大小
              },
              formatter: (value) => {
                // 负数取反 显示的就是正数了
                if (value < 0) return -value
                else return value
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

            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            // 去年数据--左边
            data: this.warningData.left.x,
            // data: ['房屋租赁合同纠纷', '离婚纠纷', '追偿权纠纷', '合同纠纷', '金融借款合同纠纷', '信用卡纠纷', '机动车交通事故责任纠纷', '物业服务合同纠纷', '买卖合同纠纷', '民间借贷纠纷'],
            axisLabel: {
              show: true,
              margin: 22, // 刻度标签与轴线之间的距离
              textStyle: {
                color: '#fff' // 更改坐标轴文字颜色
                // fontSize : 16      //更改坐标轴文字大小
              }
              // formatter:function(params) {
              //     var newParamsName = "";
              //     var paramsNameNumber = params.length;
              //     var provideNumber = 6;  //一行显示几个字
              //     var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              //     if (paramsNameNumber > provideNumber) {
              //         for (var p = 0; p < rowNumber; p++) {
              //             var tempStr = "";
              //             var start = p * provideNumber;
              //             var end = start + provideNumber;
              //             if (p == rowNumber - 1) {
              //                 tempStr = params.substring(start, paramsNameNumber);
              //             } else {
              //                 tempStr = params.substring(start, end) + "\n";
              //             }
              //             newParamsName += tempStr;
              //         }

              //     } else {
              //         newParamsName = params;
              //     }
              //     return newParamsName
              // },
            }
          },
          {
            type: 'category',
            axisTick: {
              show: false
            },
            // 今年数据--右边
            data: this.warningData.right.x,
            // data: ['房屋买卖合同纠纷', '房屋租赁合同纠纷', '劳动争议', '机动车交通事故责任纠纷', '合同纠纷', '物业服务合同纠纷', '金融借款合同纠纷', '买卖合同纠纷', '信用卡纠纷', '民间借贷纠纷'],
            axisLabel: {
              show: true,
              margin: 22, // 刻度标签与轴线之间的距离
              textStyle: {
                color: '#fff' // 更改坐标轴文字颜色
                // fontSize : 16      //更改坐标轴文字大小
              }
              // formatter:function(params) {
              //     var newParamsName = "";
              //     var paramsNameNumber = params.length;
              //     var provideNumber = 6;  //一行显示几个字
              //     var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              //     if (paramsNameNumber > provideNumber) {
              //         for (var p = 0; p < rowNumber; p++) {
              //             var tempStr = "";
              //             var start = p * provideNumber;
              //             var end = start + provideNumber;
              //             if (p == rowNumber - 1) {
              //                 tempStr = params.substring(start, paramsNameNumber);
              //             } else {
              //                 tempStr = params.substring(start, end) + "\n";
              //             }
              //             newParamsName += tempStr;
              //         }

              //     } else {
              //         newParamsName = params;
              //     }
              //     return newParamsName
              // },
            }

          }
        ],
        // 设置canvas内部表格的内距
        grid: {
          x: 175,
          y: 80,
          x2: 175,
          y2: 50,
          borderWidth: 10
        },
        series: [
          {
            name: this.year + '年度',
            type: 'bar',
            // yAxisIndex: 1,
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#fff', // 更改文字颜色
                fontSize: 13 // 更改文字大小
              },
              formatter: '{c}件'
            },
            // 今年数据--右边
            data: this.warningData.right.y,
            // data: [{ value: 434 }, { value: 441 }, { value: 444 }, { value: 531 }, { value: 891 }, { value: 908 }, { value: 973 }, { value: 1035 }, { value: 1080 }, { value: 2301 }],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#18F4FE' // 0% 处的颜色
                }, {
                  offset: 0.6,
                  color: '#11CFFA' // 60% 处的颜色
                }, {
                  offset: 1,
                  color: '#079AF4' // 100% 处的颜色
                }], false)
              }
            }
          },
          {
            name: this.year - 1 + '年度',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'left',
              textStyle: {
                color: '#fff', // 更改文字颜色
                fontSize: 13 // 更改文字大小
              },
              // formatter: '{c}件' // 这里是数据展示的时候显示的数据
              formatter: (value) => { // 这里是数据展示的时候显示的数据
                // 值都是负数的 所以需要取反一下
                return -value.data.value + '件'
              }
            },
            // 去年数据--左边
            data: this.warningData.left.y,
            // data: [{ value: -921 }, { value: -913 }, { value: -1084 }, { value: -1542 }, { value: -1763 }, { value: -1867 }, { value: -1953 }, { value: -2098 }, { value: -2338 }, { value: -5378 }],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#0332CF' // 0% 处的颜色
                }, {
                  offset: 0.6,
                  color: '#025BCF' // 60% 处的颜色
                }, {
                  offset: 1,
                  color: '#028BCF' // 100% 处的颜色
                }], false)
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
.infoLeft-wrapper {
  height: 100%;
  .content {
    height: calc(100% - 50px);
    background-color: #03183F;
    opacity: 0.7;
    #bar {
      width: 100%;
      height: 100%;
      padding: 10px;
      background-color:#030F34!important;
    }
  }
}
</style>
