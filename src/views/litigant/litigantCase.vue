<template>
  <div class="main1-wrapper">
    <div v-permission="[1,2,4,6]" class="menu-left">
      <menuLeft :menu-data="menuData" />
    </div>
    <div class="main">
      <el-row v-permission="[3]">
        <el-card class="box-card">
          <div class="title-box">
            <span class="item-class">我要申请</span>
            <router-link :to="{ path:'/myCase/index' }">
              <span class="item-class" style="color: #000;">我的案件</span>
            </router-link>
          </div>
        </el-card>
      </el-row>
      <el-row>
        <el-card class="box-card">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="纠纷概况" />
            <el-step title="当事人信息" />
            <el-step title="证据信息" />
            <!-- 如果是扫码添加的案件不需要智能推荐 -->
            <el-step v-if="role === 3 && !getFromScan" title="智能推荐" />
          </el-steps>
        </el-card>
      </el-row>
      <el-row style="height: auto;overflow: auto;">
        <el-card class="box-card" style="height: 100%;padding: 20px 8%;">
          <router-view :step.sync="active" />
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script>
import menuLeft from '@/components/menu/menuLeft.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'LitigantCase',
  components: {
    menuLeft
  },
  data() {
    return {
      active: 0,
      role: null,
      menuData: [
        { name: '全部案件' },
        { name: '待分流' },
        { name: '待审查' },
        { name: '待办理' },
        { name: '已办理' }
      ]
    }
  },
  computed: {
    styleWid() {
      let str = ''
      if (this.role == 3) {
        str = 'left: 8%'
      }
      return str
    },
    ...mapGetters(['getFromScan'])
  },
  mounted() {

  },
  created() {
    this.role = this.$store.state.user.userRole
    console.log(window.localStorage.getItem('fromScan'))
    console.log(this.getFromScan)
  },
  methods: {

  }
}
</script>

<style scoped lang = "scss">
  .main1-wrapper {
    display: flex;
    &>.menu-left {
      width: 100px;
    }
  }
  .main {
    width: 95%;
    height: 88%;
    position: absolute;
    /* top: 10%; */
    /* left: 8%; */
    background-color: #fff;
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
  ::v-deep .el-step__head.is-process {
    color: #0097FE;
    border-color: #0097FE;
  }
  ::v-deep .el-step__title.is-process {
    color: #0097FE;
  }
</style>
