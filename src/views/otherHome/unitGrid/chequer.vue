<template>
  <div>
    <div ref="trees" :style="{width: '180px', height: '130px'}" />
    <!-- {{ child }} -->
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Chequer',
  props: {
    child: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      treedata: [
        // { // 一定要注意这里有[]
        // name: '思明分局',
        // children: [
        //   {
        //     name: '梧村派出所'
        //   }
        // ]
      // }
      ]
    }
  },
  computed: {

  },
  mounted() {
    console.log(this.child)
    this.init(this.child)
    this.getEchartData()
  },
  methods: {
    init(data) {
      if (Object.prototype.toString.call(data) === '[object Object]') {
        // 设置子节点数组
        const children = data.childs.map((item, index) => {
          const obj = {}
          obj.name = item.name
          return obj
        })
        // 生成树的数组
        this.treedata = [{ name: data.NAME, children: children }]
      } else if (Object.prototype.toString.call(data) === '[object Array]') {
        this.treedata = data
      }
    },
    getEchartData() {
      const myChart = echarts.init(this.$refs.trees)
      myChart.setOption({
        series: [
          {
            type: 'tree',

            data: this.treedata,

            top: '2%',
            left: '43%',
            bottom: '2%',
            right: '50%',

            symbolSize: 6,
            formatter: function(name) {
              return 'Legend ' + name
            },
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 14
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      })
      // 重新设置div的大小
      const nodes = myChart._chartsViews[0]._data._graphicEls
      let allNode = 0
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index]
        if (node === undefined) {
          continue
        }
        allNode++
      }
      console.log(allNode)
      const height = 55
      const width = 300
      const currentHeight = 13 * allNode
      let currentWidth = 180
      if (allNode > 1) {
        currentWidth = 480
      }
      const newHeight = Math.max(currentHeight, height)
      const newWidth = Math.max(currentWidth, width)
      const tree_ele = this.$refs.trees
      tree_ele.style.height = newHeight + 'px'
      tree_ele.style.width = newWidth + 'px'
      myChart.resize()
    }

  }
}
</script>

<style scoped lang = "scss">
</style>
