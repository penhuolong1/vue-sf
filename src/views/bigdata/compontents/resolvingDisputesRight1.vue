<template>
  <div class="wisdom-judgment-wrapper">
    <mtitle :title="title" />
    <div class="content">
      <div id="mybar2" style="height: 100%;" />
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
    court: {
      type: Object,
      default() {
        return {
          indicator: {},
          data: []
        }
      }
    }
  },
  data() {
    return {
      title: ['组织类型']
    }
  },
  watch: {
    court: {
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
      const myChart = echarts.init(document.getElementById('mybar2'))
      // 绘制图表
      const option = {
        'normal': {
          'top': 200,
          'left': 300,
          'width': 500,
          'height': 400,
          'zIndex': 6,
          'backgroundColor': ''
        },
        'color': ['rgba(245, 166, 35, 1)', 'rgba(19, 173, 255, 1)'],
        'title': {
          'show': true,
          'text': '',
          'left': '40%',
          'top': '1%',
          'textStyle': {
            'fontSize': 18,
            'color': '#fff',
            'fontStyle': 'normal',
            'fontWeight': 'normal'
          }
        },
        'tooltip': {
          'show': true,
          'trigger': 'item'
        },
        'legend': {
          'show': false,
          'icon': 'circle',
          'left': '85%',
          'top': '75%',
          'orient': 'horizontal',
          'textStyle': {
            'fontSize': 14,
            'color': '#fff'
          },
          'data': ['法院']
        },
        'radar': {
          'center': ['50%', '50%'],
          'radius': '70%',
          'startAngle': 90,
          'splitNumber': 4,
          'shape': 'circle',
          'splitArea': {
            'areaStyle': {
              'color': ['transparent']
            }
          },
          'axisLabel': {
            'show': false,
            'fontSize': 18,
            'color': '#fff',
            'fontStyle': 'normal',
            'fontWeight': 'normal'
          },
          'axisLine': {
            'show': true,
            'lineStyle': {
              'color': 'white'//
            }
          },
          'splitLine': {
            'show': true,
            'lineStyle': {
              'color': 'white'//
            }
          },
          'indicator': this.court.indicator
        },
        'series': [{
          'name': '法院',
          'type': 'radar',
          'symbol': 'circle',
          'symbolSize': 10,
          'itemStyle': {
            'normal': {
              color: 'rgba(19, 173, 255, 1)',
              'borderColor': 'rgba(19, 173, 255, 0.4)',
              'borderWidth': 10
            }
          },
          'areaStyle': {
            'normal': {
              'color': 'rgba(19, 173, 255, 0.5)'
            }
          },
          'lineStyle': {
            'normal': {
              'color': 'rgba(19, 173, 255, 1)',
              'width': 2,
              'type': 'dashed'
            }
          },
          'data': [this.court.data]
        }]

      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
.wisdom-judgment-wrapper {
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
