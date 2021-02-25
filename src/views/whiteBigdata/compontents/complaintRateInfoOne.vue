<template>
  <div class="infoLeft-wrapper">
    <span class="title">{{ title }}</span>
    <div class="content">
      <div class="topContent">
        <div class="topOne">
          <div class="contentText">人口基数</div>
          <div class="contentNum" style="color:#F3AD1C">{{ renkou }}万</div>
        </div>
        <div class="topOne">
          <div class="contentText">民事+刑事</div>
          <div class="contentNum" style="color:#2289FD">{{ anjianshu }}件</div>
        </div>
      </div>
      <div class="bottomContent">
        <div class="topThree">
          <div class="contentText">万人成诉率</div>
          <div class="contentNum" style="color:#10E3FE">{{ cengshu }}</div>
        </div>
        <div class="topThree">
          <div class="contentText">同比去年</div>
          <div class="contentNum" style="color:#fff">
            <!-- 下降是用绿色的 -->
            <img v-if="state == 0" style="height: 22px;position: relative;top: 1px;" src="../../../assets/bigData/xm/green.png" alt="">
            <!-- 上升是预警用红色的 -->
            <img v-if="state == 1" style="height: 26px;position: relative;top: 6px;" src="../../../assets/bigData/xm/red.png" alt="">
            {{ tongbi }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: ['state', 'title', 'renkou', 'anjianshu', 'cengshu', 'tongbi'],

  data() {
    return {

    }
  },
  created() {
    // this.getData1()
  },
  mounted() {
    this.initBar()
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

    }
  }
}
</script>

<style scoped lang="scss">
.infoLeft-wrapper {
  height: 100%;
  background-image: url("../../../assets/bigData/xm/complaint.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  .title{
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    color:white;
    display: flex;
    justify-content: center;
    height: 50px;
    line-height: 50px;
  }
  .content{
      height: calc(100% - 50px);
      width: 100%;
      .topContent{
          height: 40%;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding: 18px;
          .topOne{
            width: 50%;
            height: 100%;
          }
      }
      .bottomContent{
          height: 40%;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding: 18px;
          .topThree{
            width: 50%;
            height: 100%;
          }
      }

     .contentText{
        font-size: 18px;
        color:#00B7FB;
        font-weight: 700;
        text-align: center;
        width: 100%;
        height: 50%;
        line-height: 53px;
    }
    .contentNum{
        font-size: 24px;
        font-weight: 700;
        text-align: center;
        width: 100%;
        height: 50%;
        line-height: 40px;
    }

  }
}
</style>
