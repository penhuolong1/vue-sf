<template>
  <div class="main-box">
    <div class="apply">
      <el-button type="primary" class="enter" @click="addCase">进入</el-button>
    </div>
    <div class="myCase">
      <router-link :to="{ path:'/myCase/index' }">
        <el-button type="primary" class="enter">进入</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
// import { addCase } from '@/api/litigant/litigant'
export default {
  components: {

  },
  props: {
  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 跳转页面
    jumpPage(index) {
      if (index === 1) { // 1为添加案件
        this.$router.push('/litigant/acceptUnit')
      }
    },
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

<style scoped lang="scss">
  .main-box {
    width: 80%;
    height: 90%;
    position: absolute;
    margin: auto;
    top: 0; left: 0; bottom: 0; right: 0;
  }
  .index-wrapper {
    background-color: #F2F5FA!important;
    .wrapper {
      text-align: center;
      margin-top: 200px;
      .wrapper-item {
        display: inline-flex;
        width: 300px;
        height: 300px;
        background-color: #F3F3F3;
        color: #007AFF;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 6px rgba(0,0,0,.16);
        border-radius: 10px;
        font-size: 20px;
        cursor: pointer;
        &:nth-child(1) {
          margin-right: 150px;
        }
      }
    }
  }
.apply {
  width: 45%;
  height: 100%;
  background-image: url('../../assets/images/apply.png');
  position: absolute;
  left: 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}
.myCase {
  width: 45%;
  height: 100%;
  position: absolute;
  right: 0;
  background-image: url('../../assets/images/myCase.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}
.enter {
  position: absolute;
  bottom: 26%;
  left: 43%;
  width: 95px;
}
</style>
