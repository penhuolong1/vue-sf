<template>
  <el-col :span="span">
    <div class="title">解纷资源</div>
    <el-col v-if="role==0||role==6" :span="6">
      <div class="card">
        <p>分流中心<i class="el-icon-caret-right" /></p>
        <span class="count" style="line-height: 90px;">{{ fen }}家</span>
        <span class="pic-box"><img src="../../../assets/icon/card1.png" alt=""></span>
      </div>
    </el-col>
    <el-col v-if="role==0||role==6||role==3" :span="unitSpan">
      <div :class="{setCard:role===3}" class="card" style="background:#2a96d6;color:#fff">
        <p style="color:#fff">联动单位<i class="el-icon-caret-right" /></p>
        <div class="title2">
          <span v-if="role==0">市{{ city }}个</span>
          <span>区{{ qu }}个</span>
          <span>街道{{ jie }}个</span>
          <div class="title3">
            <span>本日</span>
            <div v-if="lianAdd>0" class="imgBox"><img src="../../../assets/icon/up.png"></div>
            <div v-else class="imgBox"><img src="../../../assets/icon/down(2).png"></div>
            <span>{{ lianAdd }}个</span>
          </div>
        </div>

        <span class="pic-box"><img src="../../../assets/icon/card2.png" alt=""></span>
      </div>
    </el-col>
    <el-col v-if="role==2" :span="unitSpan">
      <div class="card setCard">
        <p>街道级单位<i class="el-icon-caret-right" /></p>

        <span class="count">{{ jie }}个</span>
        <div class="title3">
          <span>本日</span>
          <div v-if="lianAdd>0" class="imgBox"><img src="../../../assets/icon/up.png"></div>
          <div v-else class="imgBox"><img src="../../../assets/icon/down(2).png"></div>
          <span>{{ lianAdd }}个</span>
        </div>

        <span style="height:100px" class="pic-box"><img src="../../../assets/icon/card5.png" alt=""></span>
      </div>
    </el-col>
    <el-col v-if="role==0||role==1||role==2||role==3||role==4||role==6" :span="span3">
      <div :class="{setCard:role===1}" class="card">
        <p>解纷组织<i class="el-icon-caret-right" /></p>
        <span class="count">{{ tiao }}个</span>
        <div class="title3">
          <span>本日</span>
          <div v-if="tiaoAdd>0" class="imgBox"><img src="../../../assets/icon/up.png"></div>
          <div v-else class="imgBox"><img src="../../../assets/icon/down(2).png"></div>
          <span>{{ tiaoAdd }}个</span>
        </div>
        <span class="pic-box"><img src="../../../assets/icon/card3.png" alt=""></span>
      </div>
    </el-col>
    <el-col :span="span3">
      <div :class="{setCard:role===1}" class="card">
        <p>解纷员<i class="el-icon-caret-right" /></p>
        <span class="count count1">{{ man }}人</span>
        <div class="title3">
          <span>本日</span>
          <div v-if="manAdd>0" class="imgBox"><img src="../../../assets/icon/up.png"></div>
          <div v-else class="imgBox"><img src="../../../assets/icon/down(2).png"></div>
          <span>{{ manAdd }}个</span>
        </div>
        <span class="pic-box"><img src="../../../assets/icon/card4.png" alt=""></span>
      </div>
    </el-col>
  </el-col>

</template>

<script>
import { searchUnitByRole } from '@/api/otherHome/otherHome'
export default {
  name: 'VueName',
  props: {
    data: {
      type: Object,
      default: () => ({
        name: '',
        count: ''
      })
    },
    role: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      lianAdd: 0, // 联动单位本日增加
      tiaoAdd: 0, // 调解组织本日增加
      city: 0, // 市
      qu: 0, // 区
      jie: 0, // 街道
      tiao: 0, // 调解组织
      man: 0, // 调解人员
      manAdd: 0, // 调解人员本日增加
      fen: 1, // 分流中心
      span: 12,
      unitSpan: 24,
      span3: 12,
      isflow: false,
      msg: 'Welcome to your vueName'
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {
    searchUnitByRole().then(res => {
      console.log(res)
      if (res.state == 100) {
        this.lianAdd = res.data.lianAdd ? res.data.lianAdd : 0
        this.tiaoAdd = res.data.tiaoAdd ? res.data.tiaoAdd : 0
        this.city = res.data.city ? res.data.city : 0
        this.qu = res.data.qu ? res.data.qu : 0
        this.jie = res.data.jie ? res.data.jie : 0
        this.tiao = res.data.tiao ? res.data.tiao : 0
        this.man = res.data.man ? res.data.man : 0
        this.manAdd = res.data.manAdd ? res.data.manAdd : 0
        this.fen = res.data.fen ? res.data.fen : 0
      }
    }
    )
  },
  methods: {
    init() {
      console.log(this.role)
      if (this.role == 1) { // 街道单位
        this.span3 = 24
      } else if (this.role == 3) { // 市直单位
        this.span = 12
      } else if (this.role == 0 || this.role == 6) { // 分流中心
        this.span = 24
        this.unitSpan = 6
        this.span3 = 6
      } else if (this.role == 5) {
        this.span3 = 24
      }
    }
  }
}
</script>

<style scoped lang = "scss">
.title{
    padding: 0 15px 15px;
    font-size: 18px;
    font-weight: 700;
    color:#000;
    font-family: Segoe UI, Segoe UI-Bold;
}
.title2{
  color:#ddd;
  line-height:38px;
  height:40%;
  span{
    margin-right: 10px;
  }
}
.title3{
  display: inline-block;
  width: 220px;
  height: 20px;
  line-height: 20px;
  span{
    margin: 0;
  }
  .imgBox{
    display: inline-block;
    height:20px;
    /* vertical-align: middle; */
    margin: 0 10px;
    img{
      vertical-align: middle;
      height: 15px;
    }
  }
}
.card{
    position: relative;
    width: 100%;
    height: 135px;
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 0px 13px 0px rgba(54,184,163,0.15);
    padding: 15px;
    margin-bottom: 20px;
    p{
      width: 140px;
      height: 37%;
      font-size: 22px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      text-align: left;
      color: #2a96d6;
      line-height: 30px;
    }
    .count {
      display: inline-block;
      width: 150px;
      height: 45%;
      font-size: 40px;
      font-family: Segoe UI, Segoe UI-Regular;
      font-weight: 400;
      color: #00183b;
      line-height: 35px;
    }
    .pic-box {
      position: absolute;
      height: 45%;
      bottom: 10px;
      right: 10px;
      /* display: inline-block;
      vertical-align: middle;
      text-align: center; */
      img{
        height: 100%;
      }
    }
  }
  .setCard{
    .title2{
      height:60%;
      line-height: 60px;
      span{
        font-size:30px
      }
      .title3 span{
        font-size:20px
      }
    }
    .count{
      height:60%;
      line-height: 60px;
    }
  }
</style>
