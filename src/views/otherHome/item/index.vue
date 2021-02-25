<template>
  <div class="main">
    <el-row :gutter="20">
      <resourse v-if="role===0||role===1||role===2||role===3||role===5||role===6" :role="role" />
      <examination v-if="role===3||role===1||role===2" />
      <!-- <card v-for="item in cardArr" :key="item.name" :data="item" /> -->
    </el-row>
    <el-row :gutter="20" :class="{rowBox:role===5}">
      <totalCount />
      <!-- <things /> -->
      <caseNum v-if="role===0||role===1||role===2||role===3||role===6" :role="role"/>
      <!-- <notice /> -->
      <mediate :role="role" :class="{rowBox1:role===5}" />
    </el-row>
    <el-row :gutter="20">
      <!-- <caseType /> -->
      <hotCase />
      <rank :role="role" />
    </el-row>
  </div>
</template>

<script>
import resourse from '@/components/otherHome/index/resourse'
import examination from '@/components/otherHome/index/examination'
// import card from '@/components/otherHome/index/card'
import totalCount from '@/components/otherHome/index/totalCount'
// import things from '@/components/otherHome/index/things'
import caseNum from '@/components/otherHome/index/caseNum'
import mediate from '@/components/otherHome/index/mediate'
// import notice from '@/components/otherHome/index/notice'
import caseType from '@/components/otherHome/index/caseType'
import rank from '@/components/otherHome/index/rank'
import hotCase from '@/components/otherHome/index/hotCase'
import { searchUnit } from '@/api/otherHome/otherHome'
export default {
  name: 'OtherHomeIndex',
  components: {
    resourse,
    // card,
    examination,
    totalCount,
    // things,
    // notice,
    caseType,
    hotCase,
    caseNum,
    mediate,
    rank
  },
  data() {
    return {
      role: 0, // 0诉非联动分流中心 1街道级单位 2区级单位 3市直单位 4调解员 5调解组织 6其他分流中心
      cardArr: []
    }
  },
  computed: {

  },
  created() {
    console.log(this.$store.getters.getUserInfo)
    this.init()
  },
  mounted() {
    searchUnit().then(({ state, data: { fen, lian, man, tiao }}) => {
      this.cardArr = [{ name: '分流中心', count: `${fen}家` },
        { name: '联动单位', count: `${lian}家` },
        { name: '解纷组织', count: `${tiao}个` },
        { name: '解纷员', count: `${man}人` }]
    })
    this.$emit('update:nowChoice', '首页')
  },
  methods: {
    init() {
      const userInfor = this.$store.getters.getUserInfo
      console.log('roletype=2为调解员，其他不是，roleType=' + userInfor.roleType)
      if (userInfor.roleType == 2) { // 调解员
        this.role = 4
      } else { // 单位机构
        console.log('courtType=0为分流中心，2为调解组织，3为联动单位，courtType=' + userInfor.courtType)
        if (userInfor.courtType == 0) { // 分流中心
          if (userInfor.result.name == '厦门市诉非联动中心') {
            this.role = 0
          } else {
            this.role = 6
          }
        } else if (userInfor.courtType == 2) { // 调解组织
          this.role = 5
        } else if (userInfor.courtType == 1) { // 联动单位
          if (userInfor.courtLevel == 1) { // 市级
            this.role = 3
          } else if (userInfor.courtLevel == 2) { // 区级
            this.role = 2
          } else if (userInfor.courtLevel == 3) { // 街道
            this.role = 1
          }
        }
      }
      console.log(this.role)
    }
  }
}
</script>

<style lang = "scss">
  .main {
    .el-row {
      margin-bottom: 20px;
    }
  }
</style>

<style scoped lang = "scss">
  .card{
    width: 100%;
    height: 163px;
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 0px 13px 0px rgba(54,184,163,0.15);
    padding: 15px;
    p{
      width: 88px;
      height: 60%;
      opacity: 0.5;
      font-size: 22px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      text-align: left;
      color: #36b8a3;
      line-height: 30px;
    }
    .count {
      display: inline-block;
      width: 80%;
      height: 40%;
      font-size: 40px;
      font-family: Segoe UI, Segoe UI-Regular;
      font-weight: 400;
      color: #00183b;
      line-height: 40px;
    }
    .pic-box {
      width: 20%;
      height: 40%;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      img{
        width: 35px;
        height: 39px;
      }
    }
  }
  .rowBox{
    position: relative;
    .rowBox1{
      position: absolute;
      right: 0;
      top: -175px;
    }
  }
</style>
