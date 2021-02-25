<template>
  <div class="home-wrapper">
    <!-- 头部 -->
    <myMenu :active-index="0" />
    <!-- 轮播 -->
    <div style="height:420px;" class="wrapper">
      <el-carousel indicator-position="outside" height="420px" style="width: 100%;">
        <el-carousel-item v-for="item in imgList" :key="item.id" class="branner_item">
          <img :src="item.idView" class="banner_img">
        </el-carousel-item>
      </el-carousel>
      <!-- 浮动在表面的 -->
      <div class="floatFront">
        <div class="floatCont">
          <div class="floatImg">
            <img src="../../assets/images/zhineng.png" alt="">
          </div>
          <p class="fp"><b>智能评估</b></p>
          <p class="fp2">提供多维度解纷解读报告</p>
        </div>
        <div class="floatCont">
          <div class="floatImg">
            <img src="../../assets/images/wangge.png" alt="">
          </div>
          <p class="fp"><b>网格化解</b></p>
          <p class="fp2">社区网格员参与化解</p>
        </div>
        <div class="floatCont">
          <div class="floatImg">
            <img src="../../assets/images/xianshang.png" alt="">
          </div>
          <p class="fp"><b>线上调解</b></p>
          <p class="fp2">打破时空限制，打造异步解纷新模式</p>
        </div>
        <div class="floatCont">
          <div class="floatImg">
            <img src="../../assets/images/shifa.png" alt="">
          </div>
          <p class="fp"><b>司法保障</b></p>
          <p class="fp2">及时赋予调解协议法律效力</p>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="contBox">
      <div class="cont">
        <div class="imgBox">
          <div class="imgOne">
            <img src="../../assets/images/img14.png" alt="">
          </div>
          <p class="label">
            解纷组织<span>178</span>个
          </p>
        </div>
        <div class="imgBox">
          <div class="imgOne">
            <img src="../../assets/images/img13.png" alt="">
          </div>
          <p class="label">
            解纷人员<span>1063</span>人
          </p>
        </div>
        <div class="imgBox">
          <div class="imgOne">
            <img src="../../assets/images/img12.png" alt="">
          </div>
          <p class="label">
            解纷案件<span>13419</span>件
          </p>
        </div>

      </div>
    </div>
    <!-- 底部 -->
    <!-- <div>
      <div class="foot">
        <p>地址：厦门市湖里区</p>
        <p>联系电话：0592123456</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import myMenu from './components/menu'
export default {
  name: 'Suit',
  components: {
    myMenu
  },
  data() {
    return {
      // 导航
      activeIndex: '1',
      activeIndex2: '1',
      // 图片需要引入, 否则无法显示
      imgList: [
        { id: 0,
          idView: require('../../assets/images/banner.png')
        },
        {
          id: 1,
          name: '详情',
          idView: require('../../assets/images/banner2.png')
        },
        {
          id: 2,
          name: '推荐',
          idView: require('../../assets/images/banner3.png')
        }
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped lang = "scss">
.home-wrapper {
  background-color: #fff;
  height: 100%;
}
/* 头部 */
.el-carousel__container {
    height: 420px;
}
.wrapper {
    position: relative;
}
.wrapper .floatFront {
    position: absolute;
    background-color: #fff;
    bottom: -103px;
    z-index: 1000;
    left: 13%;
    right: 13%;
    box-shadow:0px 0px 20px 0px rgba(6,0,1,0.2);
}
.el-row {
    height: 60px;
  }
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
.suitTitle{
    font-size: 16px;
    line-height: 60px;
    text-align: center;
    display: flex;
    align-items: center;
}
.suitTitle img{
    width: 30px;
    height: 30px;
}
.logRegBtn{
    margin: 15px 0 auto;
}

/* 轮播 */
.el-carousel__item h3 {
    font-size: 18px;
    height: 420px;
    margin: 0;
}
.banner_img{
    width: 100%;
    height: 100%;
}

/* 浮动 */
.floatCont{
    width: 25%;
    height: 162px;
    float: left;
}
.floatImg{
      width: 35px;
      height: 35px;
      margin: 25px auto;
}
.fp{
    text-align: center;
    height: 20px;
    margin: 10px auto;
    font-size: 16px;
    color: #000000;
    font-family:Microsoft YaHei;
    font-weight: bolder;
    color:rgba(0,0,0,1);
}
.fp2{
    text-align: center;
    height: 20px;
    margin: 10px auto;
    font-size: 12px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(0,0,0,2);
    opacity:0.3;
}
.label {
  color: #000000;
  margin-top: 10px;
}
.label span{
  color: #009CFF;
  font-size: 24px;
  font-weight: bold;
  display: inline-block;
  margin-left: 3px;
  margin-right: 3px;
}

/* 内容 */
.contBox {
    height: 260px;
    margin: 0 auto;
    margin-top: 40px;
}
.cont {
    width:906px;
    margin: 0 auto;
    display: flex;
}
.imgBox {
    width: 300px;
    height: 260px;
}
.imgOne {
    width: 80px;
    height: 80px;
    margin: 120px auto;
}
.imgBox p {
    width: 300px;
    height: 30px;
    margin: -110px auto;
    text-align: center;
}

/* 底部 */
.foot {
    float: left;
    margin-top: 30px;
    width: 100%;
    height: 36px;
    background:linear-gradient(180deg,rgba(19,6,69,1),rgba(14,15,23,1));
}
.foot  p {
    float: left;
    line-height: 36px;
    margin-left: 20px;
    font-size: 16px;
    color: #fff;
}
</style>
