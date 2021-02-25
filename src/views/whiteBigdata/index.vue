<template>
  <div class="xm-bigdata-wrapper" :style="{'background-image': 'url(' + bcImg +')'}">
    <p style="color:#fff;text-align:center;font-size:35px;top:20px;margin-top:35px;margin-left: 40px;">厦门市诉非联动数据可视化中心</p>
    <div style="width:468px;height:50px;position: fixed;top: 35px;left:50%;margin-left:-234px;z-index:1000" @click="setMenu()" />
    <div class="menu-wrapper">
      <ul>
        <li :class="{'active': menuIndex == 1}" @click="selectMenu(1)">智慧研判</li>
        <li :class="{'active': menuIndex == 3}" @click="selectMenu(3)">解纷资源</li>
        <li :class="{'active': menuIndex == 2}" @click="selectMenu(2)">特色解纷</li>
      </ul>
    </div>
    <div class="content-wrapper">
      <commandCenter v-if="menuIndex == 0" />
      <wisdomJudgment v-if="menuIndex == 1" />
      <featureSolution v-if="menuIndex == 2" />
      <hotcaseInfo v-if="menuIndex == 10" />
      <complaintRateInfo v-if="menuIndex == 11" />
      <connect v-if="menuIndex == 12" />
      <resolvingDisputes v-if="menuIndex == 3" />
      <solutionItemInfo v-if="menuIndex == 13" />
    </div>
  </div>
</template>

<script>
import commandCenter from './commandCenter.vue'
import wisdomJudgment from './wisdomJudgment.vue' // 智慧研判
import featureSolution from './featureSolution.vue'
import hotcaseInfo from './compontents/hotcaseInfo'// 频发纠纷预警进入页面
import complaintRateInfo from './compontents/complaintRateInfo'
import connect from './connect'
import resolvingDisputes from './resolvingDisputes' // 解纷资源
import solutionItemInfo from './compontents/solutionItemInfo' // 特色解纷数据得详情页面
export default {
  components: {
    commandCenter,
    wisdomJudgment,
    featureSolution,
    hotcaseInfo,
    complaintRateInfo,
    connect,
    resolvingDisputes, // 解纷资源
    solutionItemInfo
  },
  props: {

  },
  data() {
    return {
      bcImg: require('@/assets/bigData/xm/bc.png'),
      rm: '10px', // 在1920分辨率下面为10px
      menuIndex: 0,
      value: ''
    }
  },
  computed: {
    getIndex() {
      return this.$store.state.bigdata.menuIndex
    }
  },
  watch: {
    getIndex(curVal, oldVal) {
      this.menuIndex = curVal
    }
  },
  created() {
    this.menuIndex = this.$store.state.bigdata.menuIndex || 0
  },
  mounted() {
    this.adaptive()
  },
  methods: {
    // 计算自适应
    adaptive() {
      this.rm = 10 * document.body.clientWidth / 1920
      this.rm = this.rm + 'px'
    },
    selectMenu(index) {
      if (this.menuIndex == index) {
        this.menuIndex = 0
      } else {
        this.menuIndex = index
      }
      this.$store.commit('SET_MENUINDEX', this.menuIndex)
    },
    setMenu() {
      this.$store.commit('SET_MENUINDEX', 0)
    }
  }
}
</script>

<style scoped lang="scss">
.xm-bigdata-wrapper{
  position: fixed!important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1400px;
  min-height: 700px;
  z-index: 1;
  background-size:100% 100%;
  background-repeat:no-repeat;
  .menu-wrapper {
    position: absolute;
    background-color: transparent;
    color: white;
    width: 50%;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    top: 85px;
    z-index: 100;
    left: 25%;
    ul {
      display: inline-flex;
      justify-content: space-between;
      width: 300px;
      li {
        cursor: pointer;
        &.active {
          color: #11A5DE;
        }
      }
    }
  }
  .center-wrapper {
    padding: 20px;
    position: relative;
    .center-wrapper-bottom {
      padding: 20px;
      position: absolute;
      bottom: 50px;
      left: 0px;
      width: 100%;
    }
  }
  .content-wrapper {
    position: fixed;
    top: 120px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    min-width: 1440px;
    z-index: 10;
  }
}
</style>
