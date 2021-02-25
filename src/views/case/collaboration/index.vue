<template>
  <div class="case-handle-wrapper" :style="{'max-height': wrapperHeight}">
    <el-row :gutter="100">
      <el-col :span="12">
        <h1 class="title">当前协同</h1>
        <div class="wrapper">
          <distribution v-if="getTeamData.self === true" />
          <div v-else class="nan">暂无</div>
        </div>
      </el-col>
      <el-col :span="12">
        <h1 class="title">协同日志</h1>
        <ul v-if="headerList.length > 1" class="header">
          <li v-for="(item, index) in headerList" :key="index" :class="{'active':headIndex === item.id}" @click="getHead(item.id)">{{ item.name }}</li>
        </ul>
        <collaborationLogList :list-index="headIndex" />
      </el-col>
    </el-row>
    <myFooter />
  </div>
</template>

<script>
import myFooter from '../caseHandle/components/footer'
import distribution from './distribution'
import collaborationLogList from '../caseHandle/components/collaborationLogList'
import { mapGetters } from 'vuex'
export default {
  components: {
    myFooter,
    distribution,
    collaborationLogList
  },
  props: {

  },
  data() {
    return {
      wrapperHeight: '', // 容器最大高度
      headIndex: 0,
      headerList: []
    }
  },
  computed: {
    ...mapGetters(['getCaseId', 'getCaseInfo', 'getUserInfo', 'getTeamData'])
  },
  watch: {
    getCaseInfo: {
      handler() {
        this.init()
        this.getLawCaseLine()
      },
      deep: true
    }
  },
  created() {
    this.getLogList()
  },
  mounted() {
    this.wrapperHeight = document.body.clientHeight - 70 - 85 - 120 + 'px' // 获取容器的最大高度 屏幕高度-顶部菜单-案件菜单-底部预留
  },
  methods: {
    getHead(id) {
      this.headIndex = id
    },
    getLogList() {
      const params = {
        caseId: this.getCaseInfo.id,
        courtId: this.getTeamData.courtUid
      }
      this.$store.dispatch('getListTeamByCase', params).then(res => {
        this.headIndex = res.goalList
        this.headerList = res.goalList.map((item, index) => {
          return {
            name: `协同${index + 1}`,
            id: res.infoList[item].uid
          }
        })
        this.headIndex = res.infoList[res.goalList[0]].uid
      })
    }
  }
}
</script>

<style scoped lang="scss">
.case-handle-wrapper {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px 0px;
  .title {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    color: #007aff;
    margin-bottom: 8px;
  }
  .wrapper {
    border: 1px solid #d9d9d9;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    width: 100%;
    min-height: 200px;
    margin-bottom: 20px;
    position: relative;
    .nan {
      width: 50px;
      font-size: 16px;
      color:rgba(0,0,0,0.5);
      position: absolute;
      z-index: 1;
      left: 50%;
      top: 40px;
      margin-left: -25px;
      text-align: center;
    }
    .content {
      position: relative;
      z-index: 2;
      background-color: #fff;
    }
  }
}
.header {
    width: 100%;
    display: inline-flex;
    overflow: auto;
    justify-content: center;
    li {
      line-height: 30px;
      margin-right: 15px;
      color: black;
      text-align: center;
      min-width: 50px;
      cursor: pointer;
      &.active {
        color: rgba(0,122,255,1);
        border-bottom: 3px solid rgba(0,122,255,1);
      }
    }
  }
</style>
