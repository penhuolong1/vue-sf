<template>
  <div class="ECharts roll">
    <div v-for="(item, index) in value" :key="index" class="progress-box">
      <span>{{ item.name }}</span>
      <div class="progress">
        <el-progress v-if="index%2==0" :percentage="item.percent" :color="'#3485e7'" :stroke-width="stroke" :show-text="false" />
        <el-progress v-else :percentage="item.percent" :color="'#02D0FC'" :stroke-width="stroke" :show-text="false" />
      </div>
      <span style="width:50px;float:right">{{ item.value }}件</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      stroke: 13,
      rankValue: []
    }
  },
  watch: {
    value() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      console.log(this.value)
      // const max = this.value.reduce((pr, cu) => Math.max(pr, cu.value), 0) + 30
      // this.rankValue = this.value.map(item => {
      //   item.percent = item.value / max * 100
      //   return item
      // })
    }
  }
}

</script>

<style scoped lang = "scss">
 .ECharts{
        height: 82%;
        overflow: hidden;
    }
    .progress-box{
        padding: 0 0 0 1%;
        display: flex;
        align-items: center;
        height: 10%;
        span{
            display: inline-block;
            flex-shrink: 0;
            margin-right: 2%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            width: 28%;
        }
        .progress{
            width: 100%;
        }
        ::v-deep .el-progress__text{
            // color:rgb(126,250,252);
            color: #4cb1ff;
            font-size: var(--fz)!important;
        }
        ::v-deep .el-progress-bar {
            width: calc(100% - 1em);
        }
        /* ::v-deep .el-progress-bar__inner{
            background: -webkit-linear-gradient(to right,#2770ED,#02D0FC);
            background: -o-linear-gradient(to right,#2770ED,#02D0FC);
            background: -moz-linear-gradient(to right,#2770ED,#02D0FC);
            background: -mos-linear-gradient(to right,#2770ED,#02D0FC);
            background: linear-gradient(to right,#2770ED,#02D0FC);
        } */
    }
</style>
