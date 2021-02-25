<template>
  <div class="footer-wrapper">
    <ul>
      <li v-for="(item, index) in list" :key="index" class="footer-item" :class="{'disable': item.type == 2}" @click="clickMenu(index, item.type)">
        <img :src="item.img">
        <span :class="{'disable': item.type == 2}">{{ item.name }}</span>
      </li>
    </ul>
    <applyCollaboration ref="applyCollaboration" @selectUnit="selectUnit" @initiateTeamSuccess="initiateTeamSuccess" />
    <collaborationLogModal ref="collaborationLogModal" @getNew="getNew" />
    <selectCollaborationUnit ref="selectCollaborationUnit" />
    <resolveResult :dialog-form-visible.sync="resolveResultModal" />
    <transfer :dialog-form-visible.sync="transferModal" />
    <endCase :dialog-form-visible.sync="endCaseModal" />
    <synchronizeApp ref="synchronizeApp" :is-check-med-plat="isCheckMedPlat" :is-check-jud-plat="isCheckJudPlat" />
    <el-dialog
      title="是否确认结案？"
      :visible.sync="dialogVisible"
      width="300PX"
      :append-to-body="true"
    >
      <el-checkbox v-model="isCheckMedPlat">同步人民调解平台</el-checkbox>
      <el-checkbox v-model="isCheckJudPlat">同步司法行政平台</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="endCase">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import resolveResult from './resolveResult'
import transfer from './transfer'
import endCase from './endCase'
import applyCollaboration from './applyCollaboration'
import selectCollaborationUnit from './selectCollaborationUnit'
import collaborationLogModal from './collaborationLogModal'
import synchronizeApp from './synchronizeApp'
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/format.js'
import { getTableByCaseId } from '@/api/dossier/dossier.js'
import {
  updateCaseClose
} from '@/api/case/index.js'
export default {
  components: {
    resolveResult, // 化解结果
    transfer, // 移送法院
    endCase, // 结案
    applyCollaboration, // 申请协同
    selectCollaborationUnit, // 选择协同单位
    collaborationLogModal, // 模态框的协同日志
    synchronizeApp // 同步人民调解平台
  },
  props: {

  },
  data() {
    return {
      dialogVisible: false,
      isCheckMedPlat: false, // 是否同步人民调解平台
      isCheckJudPlat: false, // 是否同步司法行政平台
      resolveResultModal: false,
      transferModal: false,
      endCaseModal: false,
      list: [
        {
          name: '申请协同',
          img: require('@/assets/icon/icon1.png')
        },
        {
          name: '化解结果',
          img: require('@/assets/icon/icon2.png'),
          type: 1 // 为1为可点击 2为不可点击
        },
        {
          name: '移送法院',
          img: require('@/assets/icon/icon3.png'),
          type: 1 // 为1为可点击 2为不可点击
        },
        {
          name: '结案',
          img: require('@/assets/icon/icon4.png'),
          type: 1 // 为1为可点击 2为不可点击
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo', 'getTeamData'])
  },
  watch: {
    getCaseInfo: {
      handler() {
        this.initData()
      },
      deep: true
    },
    getTeamData: {
      handler() {
        this.initData()
      },
      deep: true
    }
  },
  created() {
    this.resolveResultModal = false
    this.transferModal = false
    this.endCaseModal = false
    this.initData()
    console.log(this.getUserInfo)
  },
  mounted() {

  },
  methods: {
    // 邀请单位成功
    initiateTeamSuccess() {
      this.$refs.collaborationLogModal.show()
    },
    // 添加新的协同
    getNew() {
      this.$refs.applyCollaboration.show(true)
    },
    // 打开选择协同单位的模态框
    selectUnit() {
      this.$refs.selectCollaborationUnit.show()
    },
    clickMenu(index, type) {
      if (type == 2) { // 假如为2则不能点击
        return
      }
      if (index === 0) { // 申请协同
        const params = {
          caseId: this.getCaseInfo.id
        }
        this.$store.dispatch('getListTeamByCase', params).then(() => { // 有协同日志则打开协同日志的窗口
          this.$refs.collaborationLogModal.show()
        }).catch(() => { // 没有协同日志打开新增窗口
          this.$refs.applyCollaboration.show()
        })
      }
      if (index === 1) { // 化解结果
        this.resolveResultModal = true
      } else if (index === 2) { // 移送法院
        getTableByCaseId({ caseId: this.getCaseInfo.id }).then(res => {
          if (res.state === 100) {
            this.$store.commit('SET_TABLEID', res.table.id)
            this.$store.dispatch('GetListDirType', res.table.id)
          }
        })
        this.transferModal = true
      } else if (index === 3) { // 结案
        this.dialogVisible = true
      }
    },
    // 结案提交
    endCase() {
      if (this.isCheckMedPlat || this.isCheckJudPlat) { // 假如需要同步人民调解平台
        getTableByCaseId({ caseId: this.getCaseInfo.id }).then(res => {
          if (res.state === 100) {
            this.$store.commit('SET_TABLEID', res.table.id)
            this.$store.dispatch('GetListDirType', res.table.id)
          }
        })
        this.$refs.synchronizeApp.show()
        this.dialogVisible = false
      } else {
        const params = {
          caseId: this.getCaseInfo.id,
          closeTime: formatDate(new Date())
        }
        updateCaseClose(params).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.dialogVisible = false
            this.$store.dispatch('GetCaseInfo')
          }
        })
      }
    },
    // 数据处理
    initData() {
      if (this.getCaseInfo) {
        const process = this.getCaseInfo.process
        if (this.getCaseInfo.caseClose) { // 假如改案件已结案这都不能操作
          this.list[0].img = require('@/assets/icon/icon8.png')
          this.list[0].type = 2
          this.list[1].img = require('@/assets/icon/icon5.png')
          this.list[1].type = 2
          this.list[2].img = require('@/assets/icon/icon6.png')
          this.list[2].type = 2
          this.list[3].img = require('@/assets/icon/icon7.png')
          this.list[3].type = 2
          return
        }
        if (this.getUserInfo.roleType != 2) { // 假如不为调解员 则都不能点击
          this.list[1].img = require('@/assets/icon/icon5.png')
          this.list[1].type = 2
          this.list[2].img = require('@/assets/icon/icon6.png')
          this.list[2].type = 2
          if (process >= 4) { // 登陆角色不是调解员 进入调解状态下后就不能操作结案操作
            this.list[3].img = require('@/assets/icon/icon7.png')
            this.list[3].type = 2
          } else {
            this.list[3].img = require('@/assets/icon/icon4.png')
            this.list[3].type = 1
          }
          if (this.getTeamData.team) { // 如果为协同的案件
            this.list[0].img = require('@/assets/icon/icon8.png')
            this.list[0].type = 2
            if (this.getTeamData.type == 2) { // 案件协同员没有结案权限
              this.list[3].img = require('@/assets/icon/icon7.png')
              this.list[3].type = 2
            } else {
              this.list[3].img = require('@/assets/icon/icon4.png')
              this.list[3].type = 1
            }
          }
          if (this.getCaseInfo.process < 2) { // 分流状态下不能发起协同
            this.list[0].img = require('@/assets/icon/icon8.png')
            this.list[0].type = 2
          } else {
            this.list[0].img = require('@/assets/icon/icon1.png')
            this.list[0].type = 1
          }
        } else {
          if (process >= 4) {
            if (this.getCaseInfo.accept) { // 假如调解员没接收案件则不能操作化解结果 和结案
              this.list[0].img = require('@/assets/icon/icon1.png')
              this.list[0].type = 1
              this.list[1].img = require('@/assets/icon/icon2.png')
              this.list[1].type = 1
              this.list[3].img = require('@/assets/icon/icon7.png')
              this.list[3].type = 2
              if (this.getCaseInfo.endType) { // 如果有化解结果则开启移送法院和结案按钮
                this.list[3].img = require('@/assets/icon/icon4.png')
                this.list[3].type = 1
                this.list[1].img = require('@/assets/icon/icon5.png')
                this.list[1].type = 2
                this.list[2].img = require('@/assets/icon/icon3.png')
                this.list[2].type = 1
              } else {
                this.list[3].img = require('@/assets/icon/icon7.png')
                this.list[3].type = 2
                this.list[2].img = require('@/assets/icon/icon6.png')
                this.list[2].type = 2
              }
            } else {
              this.list[0].img = require('@/assets/icon/icon8.png')
              this.list[0].type = 2
              this.list[1].img = require('@/assets/icon/icon5.png')
              this.list[1].type = 2
              this.list[2].img = require('@/assets/icon/icon5.png')
              this.list[2].type = 2
              this.list[3].img = require('@/assets/icon/icon7.png')
              this.list[3].type = 2
            }
            if (this.getCaseInfo.closeCourt && this.getCaseInfo.closeCourt.id && this.getCaseInfo.process != 7) { // 假如移送了法院
              this.list[2].img = require('@/assets/icon/icon6.png')
              this.list[2].type = 2
            }
            if (this.getCaseInfo.process == 7) {
              this.list[2].img = require('@/assets/icon/icon2.png')
              this.list[2].type = 1
            }
          } else { // 假如没有进入调解阶段除了结案化解结果和移送法院都不能点
            this.list[1].img = require('@/assets/icon/icon5.png')
            this.list[1].type = 2
            this.list[2].img = require('@/assets/icon/icon6.png')
            this.list[2].type = 2
          }
          if (this.getTeamData.team) { // 当为协同单位的时候不能再次发起新的协同
            this.list[0].img = require('@/assets/icon/icon8.png')
            this.list[0].type = 2
            if (this.getTeamData.type == 2) { // 如果为案件协同员没有操作其他功能的权限
              this.list[1].img = require('@/assets/icon/icon5.png')
              this.list[1].type = 2
              this.list[2].img = require('@/assets/icon/icon6.png')
              this.list[2].type = 2
              this.list[3].img = require('@/assets/icon/icon7.png')
              this.list[3].type = 2
            } else if (this.getTeamData.type == 1) {
              if (this.getTeamData.accept) { // 假如调解员没接收案件则不能操作化解结果 和结案
                this.list[0].img = require('@/assets/icon/icon1.png')
                this.list[0].type = 1
                this.list[1].img = require('@/assets/icon/icon2.png')
                this.list[1].type = 1
                this.list[3].img = require('@/assets/icon/icon7.png')
                this.list[3].type = 2
                if (this.getCaseInfo.endType) { // 如果有化解结果则开启移送法院和结案按钮
                  this.list[3].img = require('@/assets/icon/icon4.png')
                  this.list[3].type = 1
                  this.list[1].img = require('@/assets/icon/icon5.png')
                  this.list[1].type = 2
                  this.list[2].img = require('@/assets/icon/icon3.png')
                  this.list[2].type = 1
                } else {
                  this.list[3].img = require('@/assets/icon/icon7.png')
                  this.list[3].type = 2
                  this.list[2].img = require('@/assets/icon/icon6.png')
                  this.list[2].type = 2
                }
                if (this.getCaseInfo.closeCourt && this.getCaseInfo.closeCourt.id && this.getCaseInfo.process != 7) { // 假如移送了法院
                  this.list[2].img = require('@/assets/icon/icon6.png')
                  this.list[2].type = 2
                }
                if (this.getCaseInfo.process == 7) {
                  this.list[2].img = require('@/assets/icon/icon2.png')
                  this.list[2].type = 1
                }
              } else {
                this.list[0].img = require('@/assets/icon/icon8.png')
                this.list[0].type = 2
                this.list[1].img = require('@/assets/icon/icon5.png')
                this.list[1].type = 2
              }
            }
          }
        }
        if (this.getTeamData.team) {
          this.list[0].img = require('@/assets/icon/icon8.png')
          this.list[0].type = 2
        }
        if (this.getUserInfo.roleType == 4) { // 法院不能发起协同和结案
          this.list[0].img = require('@/assets/icon/icon8.png')
          this.list[0].type = 2
          this.list[3].img = require('@/assets/icon/icon7.png')
          this.list[3].type = 2
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.footer-wrapper {
  position: fixed;
  bottom: 15px;
  left: 50%;
  width: 1000px;
  margin-left: -500px;
  height: 50px;
  line-height: 50px;
  box-shadow: 0px 3px 6px 0px rgba(112,112,112,0.46);
  z-index: 10;
  border-radius: 20px;
  background-color: #fff;
  ul {
    display: flex;
    .footer-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-align: center;
      font-size: 16px;
      color: #007AFF;
      position: relative;
      &.disable {
        &::after {
          content: '';
          background-color: #707070;
        }
      }
      &::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 10px;
        right: 0px;
        top: 50%;
        margin-top: -6px;
        background-color: #007AFF;
      }
      img {
        margin-right: 10px;
        width: 21px;
        height: 22px;
      }
      .disable {
        color: #707070;
      }
      &:last-child {
        &::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 10px;
        right: 0px;
        top: 50%;
        margin-top: -5px;
        background-color: #fff;
      }
      }
    }
  }
}
</style>
