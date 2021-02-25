<template>
  <div class="wrapper">
    <!-- <div class=></div> -->
    <h1>考评基本信息</h1>
    <div class="content">
      <div class="item">
        <div class="label">考评成绩</div>
        <div class="text">
          <div class="score-1">系统成绩:{{getTitleInfo.sysScores}}</div>
          <div class="score-2">自评成绩:{{getTitleInfo.selfScores}}</div>
          <div class="score-3">复评成绩:{{getTitleInfo.reviewScores}}</div>
        </div>
      </div>
      <div class="item">
        <div class="label">考评成员</div>
        <div class="text">{{getEviInfo.courtName || getUserInfo.courtName}}</div>
      </div>
      <div class="item">
        <div class="label">测评时间段</div>
        <div class="text">{{getOpInfo.review ? getOpInfo.reviewDate:getOpInfo.selfDate}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {

    };
  },
  props: {

  },
  computed: {
    ...mapGetters(['getUserInfo', 'getOpInfo', 'getTitleInfo', 'getEviInfo'])
  },
  components: {
  },
  created () {
    let type =''
    if (this.getUserInfo.courtLevel == 1) {
      type = '市'
    }
    if (this.getUserInfo.courtLevel == 2) {
      type = '区'
    }
    const params = {
      type: type,
      courtId: this.getEviInfo.courtId
    }
    this.$store.dispatch('GetTitle', params)
  },
  mounted () {

  },
  methods: {

  }
};
</script>

<style scoped lang="scss">
.wrapper {
  box-shadow: 2px 3px 10px 0px rgba(119,119,119,0.1); 
  padding-bottom: 15px;
  h1 {
    margin-bottom: 15px;
  }
  .content {
    display: flex;
    margin-bottom: 20px;
    .item {
      flex: 1;
      .label {
        font-size: 14px;
        color: #464a53;
      }
      .text {
        display: flex;
        margin-top: 10px;
        .score-1 {
          color: #8CCDF0;
        }
        .score-2 {
          color: #F7860B;
        }
        .score-3 {
          color: #71D875;
        }
      }
    }
  }
}
</style>
