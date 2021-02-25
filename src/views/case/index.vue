<template>
  <div class="case-wrapper">
    <div class="header">
      <div class="case-no">案件:{{ caseInfo.sqCaseNo || caseInfo.dCaseNo }}</div>
      <div class="men-wrapper">
        <ul>
          <li v-for="(item, index) in menuData" :key="index" :class="{'active': menuType == index}" @click="selectType(index, item)">{{ item }}</li>
        </ul>
      </div>
      <div class="back" @click="back">返回</div>
    </div>
    <div class="content-wrapper">
      <baseInfo v-if="menuType == 0" />
      <!-- 案件办理 -->
      <caseHandle v-if="isCaseHandle" />
      <!-- <handInfo v-if="menuType == 1" /> -->
      <electronicFile v-if="isElectronicFile" />
      <log v-if="isLog" />
      <!-- 协同 -->
      <collaboration v-if="isCollaboration" />
      <!-- 录音录像 -->
      <video1 v-if="isVideo" />
    </div>
  </div>
</template>

<script>
import baseInfo from './baseInfo/index'
// import handInfo from './handInfo/index'
import electronicFile from './electronicFile/index'
import caseHandle from './caseHandle/index1'
import log from './log/index'
import collaboration from './collaboration/index'
import video1 from './video/index'
import { teamWorkerByCase } from '@/api/collaboration/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    baseInfo,
    // handInfo,
    electronicFile,
    log,
    caseHandle,
    collaboration,
    video1
  },
  props: {

  },
  data() {
    return {
      caseInfo: {},
      menuType: 0,
      handType: 1, // 1办理信息 2 案件协同
      menuData: ['基本信息', '办理信息', '电子卷宗', '录音录像', '案件日志']
    }
  },
  computed: {
    ...mapGetters(['getCaseId', 'getTeamData', 'getMenuType']),
    isCaseHandle() { // 是否显示案件办理
      let flag = false
      if (this.getTeamData.team) {
        if (this.getTeamData.caseFlag) { // 是否和案件相关
          if (this.menuType == 1) {
            flag = true
          } else {
            flag = false
          }
        } else {
          flag = false
        }
      } else {
        if (this.menuType == 1) {
          flag = true
        } else {
          flag = false
        }
      }
      return flag
    },
    isCollaboration() { // 是否显示协同
      let flag = false
      if (this.getTeamData.team) {
        if (this.getTeamData.caseFlag) { // 是否和案件相关
          if (this.menuType == 2) {
            flag = true
          } else {
            flag = false
          }
        } else {
          if (this.menuType == 1) {
            flag = true
          } else {
            flag = false
          }
        }
      } else {
        if (this.menuType == 1) {
          flag = false
        }
      }
      return flag
    },
    isElectronicFile() { // 是否显示文书
      let flag = false
      if (this.getTeamData.team) {
        if (this.getTeamData.caseFlag) { // 是否和案件相关
          if (this.menuType == 3) {
            flag = true
          } else {
            flag = false
          }
        } else {
          if (this.menuType == 2) {
            flag = true
          } else {
            flag = false
          }
        }
      } else {
        if (this.menuType == 2) {
          flag = true
        } else {
          flag = false
        }
      }
      return flag
    },
    isVideo() { // 是否显示文书
      let flag = false
      if (this.getTeamData.team) {
        if (this.getTeamData.caseFlag) { // 是否和案件相关
          if (this.menuType == 4) {
            flag = true
          } else {
            flag = false
          }
        } else {
          if (this.menuType == 3) {
            flag = true
          } else {
            flag = false
          }
        }
      } else {
        if (this.menuType == 3) {
          flag = true
        } else {
          flag = false
        }
      }
      return flag
    },
    isLog() { // 是否录像
      let flag = false
      if (this.getTeamData.team) {
        if (this.getTeamData.caseFlag) { // 是否和案件相关
          if (this.menuType == 5) {
            flag = true
          } else {
            flag = false
          }
        } else {
          if (this.menuType == 4) {
            flag = true
          } else {
            flag = false
          }
        }
      } else {
        if (this.menuType == 4) {
          flag = true
        } else {
          flag = false
        }
      }
      console.log(flag)
      return flag
    }
  },
  async created() {
    if (this.$store.state.user.userRole == 3) { // 当事人只能查看案件详情
      this.menuData = ['基本信息']
    } else {
      this.getTeamWorkerByCase()
    }
    this.$store.dispatch('GetCaseInfo').then(res => {
      this.caseInfo = res
    })
  },
  mounted() {

  },
  methods: {
    selectType(index, name) {
      this.menuType = index
      // if (index === 1) {
      //   if (name == '案件协同') {
      //     this.handType = 2
      //   } else {
      //     this.handType = 1
      //   }
      // }
    },
    back() {
      this.$router.go(-1)
    },
    dealMenu() {
      console.log(this.getMenuType)
      if (this.getTeamData.team) { // 是协同的化
        if (this.getTeamData.caseFlag) { // 又和案件相关
          this.menuData = ['基本信息', '案件办理', '案件协同', '电子卷宗', '录音录像', '案件日志']
        } else {
          this.menuData = ['基本信息', '案件协同', '电子卷宗', '录音录像', '案件日志']
        }
      } else {
        this.menuData = ['基本信息', '案件办理', '电子卷宗', '录音录像', '案件日志']
      }
    },
    // 判断登陆角色是这个案件的受理角色还是协同角色
    getTeamWorkerByCase() {
      this.$store.dispatch('GetTeamData').then(res => {
        this.dealMenu()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.case-wrapper {
  background-color: #fff;
  box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
  .header {
    height: 70px;
    position: relative;
    padding: 0 200px;
    text-align: center;
    border-bottom: 5px solid #F2F5FA;
    .case-no {
      position: absolute;
      top: 0px;
      left: 30px;
      height: 70px;
      line-height: 70px;
      color: #2C2C2C;
      font-weight: bold;
    }
    .men-wrapper {
      ul {
        display: inline-flex;
        li {
          &.active {
            color: #007AFF;
            border-bottom: 3px solid #007AFF;
            padding-bottom: 20px;
          }
          padding: 27px 0px;
          margin-right: 40px;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }
    .back {
      position: absolute;
      top: 0px;
      right: 30px;
      height: 70px;
      line-height: 70px;
      cursor: pointer;
      font-size: 14px;
    }
  }
  .content-wrapper {
    width: 100%;
    min-height: 400px;
    padding: 20px 30px;
  }
}
</style>
