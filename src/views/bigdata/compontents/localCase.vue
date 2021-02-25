<template>
  <div class="local-case-wrapper">
    <el-row>
      <el-col :span="16">
        <div class="title">市生态环境局</div>
        <div class="label">案件数</div>
        <ul>
          <li v-for="(item, index) in caseNum" :key="index" class="case-num">{{ item }}</li>
          <li>件</li>
        </ul>
      </el-col>
      <el-col :span="8">
        <el-progress type="dashboard" :percentage="85" :width="80" :color="'#01D6E6'" />
        <label class="dashboard-label">解纷成功率</label>
      </el-col>
    </el-row>
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
      caseNum: '1456'
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
.local-case-wrapper {
  margin-bottom: 20px;
  .title {
    display: inline-block;
    color: #00EAFF;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    padding: 0 50px 0 10px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../../assets/bigData/xm/label.png');
  }
  .label {
    font-size: 12px;
    color: #fff;
    margin-top: 5px;
  }
  ul {
    display: flex;
    margin-top: 5px;
    li {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 40px;
      color: #00EAFF;
      margin-right: 10px;
      font-size: 25px;
      &.case-num {
        background-color: #052851;
      }
    }
  }
  .dashboard-label {
    display: block;
    width: 80px;
    text-align: center;
    color: #00EAFF;
  }
  ::v-deep .el-progress__text{
    font-size: 23px!important;
    color: #fff;
  }
}
</style>
