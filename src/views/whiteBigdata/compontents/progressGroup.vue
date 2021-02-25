<template>
  <div class="progress-group">
    <el-col :span="8">
      <el-progress
        type="circle"
        color="#0DD4DB"
        :width="width"
        :percentage="86"
      />
      <h6>诉前解纷率</h6>
    </el-col>
    <el-col :span="8">
      <el-progress
        type="circle"
        color="#EABF07"
        :width="width"
        :percentage="11"
      />
      <h6>委派委托解纷成功率</h6>
    </el-col>
    <el-col :span="8">
      <el-progress
        type="circle"
        color="#0F6BFF"
        :width="width"
        :percentage="94"
      />
      <h6>万人成诉率</h6>
    </el-col>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      width: 80
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.progress-group {
  margin-top: 10px;
  .el-col {
    text-align: center;
    &:nth-child(1) {
      ::v-deep .el-progress__text {
        color: #0DD4DB;
      }
    }
    &:nth-child(2) {
      ::v-deep .el-progress__text {
        color: #EABF07;
      }
    }
    &:nth-child(3) {
      ::v-deep .el-progress__text {
        color: #0F6BFF;
      }
    }
    h6 {
      color: #fff;
      width: 80px;
      margin: 5px auto;
    }
  }
  ::v-deep .el-progress-circle__track {
    stroke: #143C91;
    opacity: 0.7;
  }
  ::v-deep .el-progress__text {
    font-size: 24px!important;
  }
}
</style>
