<template>
  <el-col :span="6">
    <div class="card">
      <div class="title1">待办事项</div>
      <Calendar
        :text-top="textTop"
        :sunday-start="true"
      />
      <div class="caseType">
        <span>待分流</span>
        <span>{{ value.fenNum }}件</span>
        <!-- <el-button type="primary" size="mini">查看</el-button> -->
      </div>
      <div class="caseType">
        <span>待审核</span>
        <span>{{ value.CheckNum }}件</span>
        <!-- <el-button type="primary" size="mini">查看</el-button> -->
      </div>
      <div class="caseType">
        <span>待分发</span>
        <span>{{ value.distributeNum }}件</span>
        <!-- <el-button type="primary" size="mini">查看</el-button> -->
      </div>
    </div>
  </el-col>
</template>

<script>
import { searchWait } from '@/api/otherHome/otherHome'
import Calendar from '@/components/calendar'
export default {
  name: 'Things',
  components: {
    Calendar
  },
  data() {
    return {
      value: {},
      textTop: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  computed: {

  },
  mounted() {
    searchWait().then(res => {
      if (res.state === 100) {
        this.value = res.data
      }
    })
  },
  methods: {

  }
}
</script>

<style lang="scss">
  .wh_jiantou1 {
    border-top: 2px solid #ffb767!important;
    border-left: 2px solid #ffb767!important;
  }
  .wh_jiantou2 {
    border-top: 2px solid #ffb767!important;
    border-right: 2px solid #ffb767!important;
  }
  .wh_content_item {
    color: #707070!important;
  }
  .wh_content_li {
    color: #707070!important;
  }
  .wh_content_all {
    background-color:#fff!important;
  }
</style>

<style scoped lang = "scss">
  .card {
    padding: 15px;
    width: 100%;
    height: 535px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16);
    .title1 {
      width: 70%;
      display: inline-block;
      height: 25px;
      font-size: 20px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      color: #000000;
      line-height: 26px;
    }
  }
  .caseType {
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid #DEDEDE;
    text-align: center;
    span:nth-child(1) {
      display: inline-block;
      width: 30%;
      height: 24px;
      font-size: 18px;
      font-family: Segoe UI, Segoe UI-Regular;
      font-weight: 400;
      text-align: left;
      color: #353535;
      line-height: 24px;
      letter-spacing: -1px;
      margin-right: 20px;
    }
    span:nth-child(2) {
      display: inline-block;
      width: 30%;
      height: 30px;
      font-size: 22px;
      font-family: Segoe UI, Segoe UI-Regular;
      font-weight: 400;
      text-align: left;
      color: #007aff;
      line-height: 24px;
    }
  }
</style>
