<template>
  <div class="solutionItemInfo-wrapper">
    <span style="position:absolute;top:-20px;left:30px;color:#fff;cursor:pointer;z-index:10" @click="goBack()"><Icon type="ios-undo-outline" size="24" />返回</span>
    <div class="left-wrapper">
      <div class="left-wrapper-top">
        <div class="top-title">中心介绍</div>
        <section v-html="Introduction" />
      </div>
      <div style="height: 2%;width: 100%"></div>
      <div class="left-wrapper-bottm">
        <div class="top-title"> 
          <span @click="changeshow" :class="{'active': show == true}">亮点举措</span>
          <span @click="changeshow" :class="{'active': show == false}"  class="highlightMeasures">典型案例</span>
        </div>
        <div class="contentBox">
          <el-tabs v-model="activeName2" v-if="show"   class="myContent" @tab-click="handleClick2">
            <el-tab-pane v-for="(item,key) in highlightsArr" :key="key" :label="'亮点'+num[key]" :name="'second'+key" style="letter-spacing: 1px;line-height: 2; font-size:14px;" v-html="item">
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="activeName" v-else class="myContent" @tab-click="handleClick">
            <el-tab-pane v-for="(item,key) in caseArr" :key="key" :label="'案例'+num[key]" :name="'first'+key" style="letter-spacing: 1px;line-height: 2; font-size:14px;" v-html="item" />
          </el-tabs>

        </div>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="right-wrapper-top">
        <div class="top-title">亮点展示</div>
        <div class="contentBox" style="display:flex;width:100%;align-items:center;">
          <el-carousel :interval="4000" type="card" :height="'600px'" style="width:100%">
            <el-carousel-item v-for="item in imgArr" :key="item">
              <el-image style="width:100%; height:100%" fit="contain" :src="item" alt="" ></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- <div class="right-wrapper-bottm">
        <div class="top-title" />
        <div class="contentBox" style="padding-top:25px;">
          <el-carousel :interval="4000" type="card" :height="fontSize">
            <el-carousel-item v-for="item in imgArr" :key="item">
              <img :src="item" alt="" style="width:100%">
            </el-carousel-item>
          </el-carousel>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { listCourtData } from '../../../api/common/solution.js'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      show:true,
      activeName: 'first0',
      activeName2: 'second0',
      value1: 0,
      infoArr: [],
      Introduction: '',
      imgArr: [],
      caseArr: [],
      highlightsArr: [],
      num: ['一', '二', '三', '四', '五', '六'],
      fontSize: '30'
    }
  },
  created() {
    this.adaptive()
  },
  mounted() {
    const uid = this.$store.state.bigdata.uid

    console.log(uid)
    const params = {
      courtUid: uid
    }
    listCourtData(params).then(res => {
      console.log(res)
      if (res.state == 100) {
        this.infoArr = res.data
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type == 2) { // 介绍
            this.Introduction = res.data[i].content
          }
          if (res.data[i].type == 5) { // 图片
            this.imgArr.push(res.data[i].content)
          }
          if (res.data[i].type == 4) { // 案例
            this.caseArr.push(res.data[i].content)
          }
          if (res.data[i].type == 3) { // 亮点
            this.highlightsArr.push(res.data[i].content)
          }
        }
        console.log('this.caseArr', this.caseArr)
        console.log('this.highlightsArr', this.highlightsArr)
      }
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleClick2(tab, event) {
      console.log(tab, event)
    },
    goBack() {
      this.$store.commit('SET_MENUINDEX', 2)
    },
    changeshow(){
      this.show = !this.show;
    },
    adaptive() {
      // 大小比例为 1920 ：10
      this.fontSize = this.fontSize * document.body.clientWidth / 1920
      this.fontSize = this.fontSize * 20 + 'px'
    }
  }
}
</script>
<style lang="scss">
    .el-tabs__nav-wrap::after {
        content: '';
        background-color: transparent!important;
    }
    .solutionItemInfo-wrapper .right-wrapper .right-wrapper-top[data-v-e26aeb4c] .el-tabs__item {
        font-size: 16px!important;
    }
    .solutionItemInfo-wrapper .right-wrapper .right-wrapper-top[data-v-e26aeb4c] .el-tabs__item.is-active {
        font-size: 20px!important;
    }
    .is-active .el-tabs__item .is-top  {
        font-size: 20px!important;
    }
    .el-tabs__item.is-active {
        font-size: 20px!important;
    }
</style>
<style scoped lang="scss">
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
.solutionItemInfo-wrapper{
    width:100%;
    height: 100%;
    .left-wrapper{
        width: 50%;
        height: 100%;
        padding: 20px 10px 20px 40px;
        float: left;
        .left-wrapper-top{
            width: 100%;
            height: 39%;
            background-color: #02183F;

            section{
                height: calc(100% - 51px);
                padding: 20px 25px 0px 25px;
                line-height: 1.8;
                letter-spacing: 1px;
                font-size: 14px;
                overflow: hidden;
                text-overflow:ellipsis;
                color:#fff;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 9;
                overflow: auto;
            }
        }
        .left-wrapper-bottm{
            width: 100%;
            height: 59%;
            background-color: #02183F;
            ::v-deep .el-tabs__item{
                color:#fff;
                font-size: 18px;
            }
            ::v-deep .el-tabs__active-bar {
                background-color: #14BFFB;
            }
            .highlightMeasures{
              display:inline-block;
              margin-left:50px;
            }
            .myContent{
              height:calc(100% - 10px);
              color:#fff;
            }
        }
    }
    .right-wrapper{
        width: 50%;
        height: 100%;
        float: right;
        padding: 20px 40px 20px 10px;
        .right-wrapper-top{
            width: 100%;
            height: 100%;
            margin-bottom: 20px;
            background-color: #02183F;
            ::v-deep .el-tabs__item{
                color:#fff;
                font-size: 18px;
            }
            ::v-deep .el-tabs__active-bar {
                background-color: #14BFFB;
            }
            ::v-deep .el-carousel__item:nth-child(2n+1) {
                background-color: transparent;
            }
            ::v-deep .el-carousel__item:nth-child(2n) {
                background-color: transparent;
            }
            ::v-deep .el-carousel__mask {
                background-color: transparent; 

            }
            ::v-deep .el-carousel__item:nth-child(odd) {
              background-color: transparent; 
            }
        }
        // .right-wrapper-bottm{
        //     width: 100%;
        //     height: 39%;
        //     background-color: #02183F;
        // }
    }
    .top-title{
        height: 36px;
        line-height: 36px;
        color: #14B5F1;
        font-size: 20px;
        font-weight: 700;
        padding: 0 20px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/bigData/xm/title.png');
        span{
          color: #2d74a7;
          cursor: pointer;
          &.active {
            color: #14B5F1;
          }
        }
    }
    .contentBox{
        height: calc(100% - 36px);
        padding: 0 20px 20px 20px;
    }
    ::v-deep .el-tabs__content{
        height: calc(100% - 56px);
        overflow-y: auto;
    }

}
</style>
