<template>
  <div id="heatMap" />
</template>

<script>
export default {
  components: {

  },
  props: {
    points: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      map: '', // 保存地图实例
      centerLng: '118.14577', // 经度
      centerLat: '24.5118', // 纬度
      heatmapOverlay: {} // 热力图覆盖物
    }
  },
  watch: {
    points: {
      handler() {
        this.initMap()
      },
      deep: true
    }
  },
  created() {
    // this.getPoint()
  },
  mounted() {
    this.initMap()
  },
  methods: {
    // 创建和初始化地图函数
    initMap() {
      this.createMap()// 创建地图
    },
    // 方法 - 创建地图
    createMap() {
      const that = this
      var map = new AMap.Map('heatMap', {
        resizeEnable: true,
        center: [this.centerLng, this.centerLat],
        zoom: 12
      })
      map.setMapStyle('amap://styles/darkblue')
      var heatmap
      map.plugin(['AMap.Heatmap'], function() {
        // 初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
          radius: 25, // 给定半径
          opacity: [0, 0.8],
          gradient: {
            0.5: 'blue',
            0.65: 'rgb(117,211,248)',
            0.7: 'rgb(0, 255, 0)',
            0.9: '#ffea00',
            1.0: 'red'
          }
        })
        // 设置数据集：该数据为北京部分“公园”数据
        heatmap.setDataSet({
          data: that.points,
          max: 100
        })
      })
    }
    // 生成地图假数据
    // getPoint() {
    //   for (let i = 0; i < 50; i++) {
    //     const lng = `118.1${Math.floor(Math.random() * 10000)}`
    //     const lat = `24.${this.getRandom(44000, 54000)}`
    //     const count = Math.floor(Math.random() * 200)
    //     const obj = {
    //       lng,
    //       lat,
    //       count
    //     }
    //     this.points.push(obj)
    //   }
    //   for (let i = 0; i < 10; i++) {
    //     const lng = `118.03${Math.floor(Math.random() * 10000)}`
    //     const lat = `24.4${this.getRandom(44000, 54000)}`
    //     const count = Math.floor(Math.random() * 200)
    //     const obj = {
    //       lng,
    //       lat,
    //       count
    //     }
    //     this.points.push(obj)
    //   }
    //   for (let i = 0; i < 5; i++) {
    //     const lng = `118.01${Math.floor(Math.random() * 10000)}`
    //     const lat = `24.5${this.getRandom(44000, 54000)}`
    //     const count = Math.floor(Math.random() * 200)
    //     const obj = {
    //       lng,
    //       lat,
    //       count
    //     }
    //     this.points.push(obj)
    //   }
    //   for (let i = 0; i < 5; i++) {
    //     const lng = `118.10${Math.floor(Math.random() * 10000)}`
    //     const lat = `24.57${this.getRandom(44000, 54000)}`
    //     const count = Math.floor(Math.random() * 200)
    //     const obj = {
    //       lng,
    //       lat,
    //       count
    //     }
    //     this.points.push(obj)
    //   }
    //   for (let i = 0; i < 5; i++) {
    //     const lng = `118.10${Math.floor(Math.random() * 10000)}`
    //     const lat = `24.58${this.getRandom(44000, 54000)}`
    //     const count = Math.floor(Math.random() * 200)
    //     const obj = {
    //       lng,
    //       lat,
    //       count
    //     }
    //     this.points.push(obj)
    //   }
    //   for (let i = 0; i < 5; i++) {
    //     const lng = `118.20${Math.floor(Math.random() * 10000)}`
    //     const lat = `24.58${this.getRandom(44000, 54000)}`
    //     const count = Math.floor(Math.random() * 200)
    //     const obj = {
    //       lng,
    //       lat,
    //       count
    //     }
    //     this.points.push(obj)
    //   }
    //   for (let i = 0; i < 10; i++) {
    //     const lng = `118.22${Math.floor(Math.random() * 10000)}`
    //     const lat = `24.58${this.getRandom(44000, 54000)}`
    //     const count = Math.floor(Math.random() * 200)
    //     const obj = {
    //       lng,
    //       lat,
    //       count
    //     }
    //     this.points.push(obj)
    //   }
    // },
    // getRandom(min, max) {
    //   return Math.floor(Math.random() * (max - min + 1) + min)
    // },
  }
}
</script>

<style scoped lang="scss">
#heatMap {
  height: 100%;
  width: 100%;
}
</style>
