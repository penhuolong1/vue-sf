<template>
  <div class="feature-solution-wrapper">
    <span style="position:absolute;top:-20px;left:30px;color:#fff;cursor:pointer;z-index:10" @click="goBack()"><Icon type="ios-undo-outline" size="24" />返回</span>
    <div class="feature-solution-box">
      <div class="singleBox"><solutionItem :info="array[0]" /></div>
      <div class="singleBox"><solutionItem :info="array[1]" /></div>
      <div class="singleBox"><solutionItem :info="array[2]" /></div>
      <div class="singleBox"><solutionItem :info="array[3]" /></div>
      <div class="singleBox"><solutionItem :info="array[4]" /></div>
    </div>
  </div>
</template>

<script>
import solutionItem from './compontents/solutionItem'
import { listCourtInfo } from '../../api/common/solution.js'
export default {
  components: {
    solutionItem
  },
  props: {

  },
  data() {
    return {
      array: []
    }
  },
  created() {

  },
  mounted() {
    // 获取五家信息
    listCourtInfo().then(res => {
      console.log(res)
      if (res.state == 100) {
        this.array = res.data
      }
    })
  },
  methods: {
    goBack() {
      this.$store.commit('SET_MENUINDEX', 0)
    }
  }
}
</script>

<style scoped lang="scss">
.feature-solution-wrapper {
  height: 100%;
  width: 100%;
  // margin-top: -80px;
  display: flex;
  flex-direction:row;
  .feature-solution-box{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction:row;
    padding: 0 40px;
    justify-content:space-between;
    .singleBox{
      width:19%;
      height: 100%;
      margin: 0 0.5%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .light {
      margin-left: -30px;
      width: 150%;
    }
  }

}
</style>
