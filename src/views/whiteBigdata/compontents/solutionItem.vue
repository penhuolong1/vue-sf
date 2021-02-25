<template>
  <div class="solution-item-wrapper" v-if="info">
    <div class="contentText" style="background-color: #030F34!important;">
      <img style="position: absolute; top: -113px;" src="../../../assets/bigData/xm/7.png" alt="">
      <h1>{{info.courtName}}</h1>
      <section v-html="info.introduceStr">
      </section>
      <p class="lookMore" @click="go(info.uid)"><i class="el-icon-d-arrow-right"></i>查看详情</p>
    </div>
    <div class="contentImg">
      <img style="width: 100%;height:100%;padding:1%;border-radius:35PX 20PX 24PX 20PX;" :src='info.picUrl' alt="">
    </div>
  </div>
</template>

<script>
import solutionTitle from './solutionTitle'
import number from './number'
import percent from './percent'
export default {
  components: {
    solutionTitle,
    number,
    percent
  },
  props:{
    info:{
      courtName:"",
      title:"",
      introduceStr:"",
      uid:"",
      picUrl:"",
    },
  },
  data() {
    return {
      
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    
  },
  methods: {
    go(uid){
      this.$store.commit('SET_MENUINDEX', 13)
      this.$store.commit('SET_UID', uid)
    }
  }
}
</script>

<style scoped lang="scss">
.solution-item-wrapper {
  margin-top:90px;
  padding-top: 20px;
  // padding-bottom: 20px;
  width: 100%;
  color: #eee;
  margin-bottom: 0px;
  height: 75%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  
  .contentText{
    height: 60%;
    width: 100%;
    
    background-image: url('../../../assets/bigData/xm/6.png');
    position: relative;
    
    h1 {
      padding-top:20px;
      width: 100%;
      text-align: center;
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: 600;
      height: 60px;
    }
    section {
      height:calc(100% - 110px);
      line-height: 1.8;
      letter-spacing: 1px;
      font-size: 14px;
      padding-left: 25px;
      padding-right: 25px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 9;
      overflow: hidden;   
    }
  
    .lookMore{
      float: right;
      margin-right: 20px;
      color:#04B5C2;
      font-size: 14px;
      padding-top:10px;
      height: 30px;;
    }
  }
  .contentImg{
    height: 40%;
    width: 100%;
    position:absolute;
    bottom:0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../../assets/bigData/xm/4.png');
    background-color: #0F1C40;
  }
  
}
</style>
