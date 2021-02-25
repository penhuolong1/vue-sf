<template>
  <div class="main1">
    <el-row>
      <el-card class="box-card">
        <div class="title-box">
          <!-- <router-link :to="{ path:'/litigantCase/step1' }"> -->
          <span class="item-class" style="color: #000;" @click="addCase">我要申请</span>
          <!-- </router-link> -->
          <span class="item-class">我的案件</span>
        </div>
      </el-card>
    </el-row>
    <el-row style="height: 85%;">
      <el-card class="box-card" style="height: 100%;padding: 20px 8%;overflow: auto;">
        <caseList ref="caseList" />
      </el-card>
    </el-row>
  </div>
</template>

<script>
import caseList from './caseList/caseList'
// import { addCase } from '@/api/litigant/litigant'
export default {
  name: 'MyCase',
  components: {
    caseList
  },
  data() {
    return {
      msg: 'Welcome to your vueName'
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    // 添加案件
    addCase() {
      // addCase().then(({ lawCaseId, state }) => {
      //   if (state === 100) {
      //     this.$store.commit('SET_CASEID', lawCaseId)
      //     window.localStorage.setItem('lawCaseId', lawCaseId)
      //     this.$store.commit('SET_COURT', this.registerCourt)
      //     this.$router.push({ name: 'step1' })
      //   }
      // })
      this.$store.commit('SET_FROMSCAN', '')
      this.$store.commit('SET_CASEID', '')
      window.localStorage.setItem('lawCaseId', '')
      this.$router.push({ name: 'step1' })
    }
  }
}
</script>

<style scoped lang = "scss">
  .main1 {
    width: 95%;
    height: 88%;
    position: absolute;
    /* top: 10%; */
    left: 2.5%;
  }
  .box-card {
    width: 100%;
  }
  .el-row {
    margin-bottom: 5px;
  }
  .title-box {
    text-align: center;
    .item-class {
      display: inline-block;
      color: #4495FF;
      font-weight: bold;
      margin-left: 15px;
      width: 100px;
      cursor: pointer;
    }
  }
</style>
