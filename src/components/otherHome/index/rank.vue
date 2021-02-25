<template>
  <el-col :span="12">
    <div class="card">
      <div class="title">
        <div class="titleLeft">
          <span v-if="role==0||role==2||role==6||role==3" :class="{titleActive:nowSelectLeft===1}">单位排名（前10名）</span>
          <span v-if="role==4||role==5" :class="{titleActive:nowSelectLeft===1}">解纷员排名（前10名）</span>
          <!-- <span v-if="role==2||role==3">|</span> -->
          <span v-if="role==1" :class="{titleActive:nowSelectLeft===2}">组织排名（前10名）</span>
        </div>
        <div class="titleRight">
          <span :class="{rightActive:nowSelectRight==='收案'}" @click="acceptCase">收案</span>
          <span :class="{rightActive:nowSelectRight==='结案'}" @click="endCase">结案</span>
        </div>
      </div>

      <rankContent v-if="rankValue.length>0" :value="rankValue" />
      <div v-else style="text-align:center">暂无数据</div>
    </div>
  </el-col>
</template>

<script>
import rankContent from './rankContent'
import { top } from '@/api/otherHome/otherHome'
export default {
  name: 'Rank',
  components: {
    rankContent
  },
  props: {
    role: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      nowSelectLeft: 1,
      nowSelectRight: '收案',
      rankValue: [], // 展示的排名
      acceptCaseArr: [], // 收案数
      endCaseArr: []// 结案
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      if (this.role == 1) {
        this.nowSelectLeft = 2
      }
      top().then(res => {
        if (res.state == 100) {
          this.rankValue = res.data.acceptCase
          this.acceptCaseArr = res.data.acceptCase
          this.endCaseArr = res.data.endCase
        }
      })
    },
    acceptCase() {
      const acc = this.acceptCaseArr
      this.rankValue = acc
      this.nowSelectRight = '收案'
    },
    endCase() {
      const end = this.endCaseArr
      this.rankValue = end
      this.nowSelectRight = '结案'
    }
  }
}
</script>

<style scoped lang = "scss">
  .card {
    padding: 15px;
    width: 100%;
    height: 535px;
    background: #ffffff;
    border-radius: 10px;
    /* box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16); */
    box-shadow: 0px 0px 13px 0px rgba(54, 184, 163, 0.15);
    .title{
      width: 100%;
      font-family: Segoe UI, Segoe UI-Bold;
      height: 50px;
      line-height: 26px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: inline-block;
      color: #d1d1d9;
      span{
        margin-left:10px;
      }
      .titleActive{
        color: #000000;
        font-size: 20px;
      }
      .titleLeft{
        display: inline-block;
      }
      .titleRight{
        float: right;
        .rightActive{
          color: #1e87f0;
          border-bottom: 2px solid #1e87f0;
        }
      }
    }
  }
</style>
