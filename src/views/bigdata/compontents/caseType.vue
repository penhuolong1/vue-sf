<template>
  <div class="case-type-wrapper">
    <mtitle :title="title" />
    <div v-if="caseTypeData" class="content">
      <div id="pie" />
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
    caseTypeData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      title: ['化解类型分布'],
      totalNum: [{ name: '总数', value: 0 }]
    }
  },
  watch: {
    caseTypeData: {
      handler(val, oldVal) {
        for (let i = 0, l = val.length; i < l; i++) {
          this.totalNum.value += val[i].value
        }
        this.initPie()
      },
      deep: true
    }
  },
  created() {

  },
  mounted() {
    // this.initPie()
  },
  methods: {
    initPie() {
      const myChart = echarts.init(document.getElementById('pie'))
      const data =
      {
        dataAge: this.caseTypeData
      }
      console.log(data.dataAge)
      const option = {
        grid: {
          left: '8%'

        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>{c}件'
        },
        color: ['#2AC9FD', '#76FBC0', '#35C96E', '#FCC708', '#48B188', '#5957C2', '#4A5D73'],
        legend: {
          left: 'right',
          top: 'middle',
          align: 'left',
          // type: 'scroll',
          // bottom: 10,
          // left: 'right',
          // align: 'left',
          // right: 50,
          orient: 'vertical',
          type: 'scroll',
          textStyle: {
            color: '#fff'
          },
          formatter: (name) => {
            let total = 0
            let target
            console.log(name)
            console.log(data.dataAge.length)
            for (let i = 0, l = data.dataAge.length; i < l; i++) {
              total += data.dataAge[i].value
              if (data.dataAge[i].name == name) {
                target = data.dataAge[i].value
              }
            }
            let arr = [
              '' + name + '' + ((target / total) * 100).toFixed(2) + '%'
            ]
            if (name == '总数') {
              arr = ['总数100.00%']
            }
            const newTitle = arr.join('')
            return newTitle
          }
        },
        series: [
          {
            color: ['#2AC9FD', '#76FBC0', '#35C96E', '#FCC708', '#48B188', '#5957C2'],
            type: 'pie',
            radius: ['62', '90'],
            labelLine: {
              normal: {
                length: 20,
                length2: 80,
                lineStyle: {
                  type: 'solid'
                }
              }

            },
            label: {
              show: false
            },
            left: -70,
            data: data.dataAge
          },
          {
            type: 'pie',
            radius: ['100', '101'],
            data: this.totalNum,
            left: -70,
            label: {
              show: false
            }
          },
          {
            type: 'pie',
            radius: ['50', '51'],
            data: this.totalNum,
            left: -70,
            label: {
              show: false
            }
          }
        ]
      }
      myChart.setOption(option)

      //      myChart.setOption({
      //         textStyle: {
      //           color: '#fff',
      //           fontSize: '20px'
      //         },
      //         legend: {
      //           bottom: 10,
      //           left: 'right',
      //           align:"left",
      //           orient:'vertical',
      //           top:'center',
      //           // data: ['解纷', '仲裁','公正','行政复议', '行政裁决', '其他'],
      //           textStyle: {
      //             color: '#fff'
      //           }
      //         },
      //         color: ['#FFDB5C', '#445AFF','#0078FF', '#00A2FF', '#32C5E9', '#00FAEB'],
      //         series: [
      //           {
      //             name: '化解类型分布',
      //             type: 'pie',
      //             radius: [30, 110],
      //             center: ['45%', '50%'],
      //             roseType: 'area',
      //             left:'left',
      //             label:{            //饼图图形上的文本标签
      //                 normal:{
      //                    show:true,
      //                    position:'top', //标签的位置
      //                    textStyle : {
      //                      fontWeight : 300 ,
      //                      fontSize : 14    //文字的字体大小
      //                    },
      // //                  formatter:'{d}% {c}件'
      //                     formatter:'{d}%'
      //                 }
      //             },
      //             data:this.caseTypeData
      //           }
      //         ]
      //       })
      console.log('---------------------------')
      // console.log(this.caseTypeData)
    }
  }
}
</script>

<style scoped lang="scss">
.case-type-wrapper {
  height: 100%;
  .content {
    height: calc(100% - 34px);
    background-color: #03183F;
    opacity: 0.7;
    #pie {
      width: 100%;
      height: 100%;
      padding: 5px;
      min-height: 255px;
    }
  }
}
</style>
