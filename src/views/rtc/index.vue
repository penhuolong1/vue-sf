<template>
  <div class="mediation-room-wrapper">
    <div class="content">
      <div class="content-left">
        <file v-if="fileShow" @backFile="backFile1" />
        <div>
          <caseDescribe
            :law-case-data="lawCaseData"
            :group-user-data="groupUserData"
            @back="back"
            @turnRecord="turnRecord"
          />
          <chat
            v-show="!isVideo"
            :case-id="caseId"
            :img-array="imgArrayData"
            :upload-file-url="uploadFileUrl"
            @uploadImg="uploadImg"
            @showVideo="showVideo"
            @getRoomToken="getRoomToken"
            @showFile="showFile"
            @groupUser="groupUser"
            @kickout="hideVideo(1)"
            @mute="mute"
          />
          <videoMediation
            v-if="isVideo"
            ref="videoMediation"
            :room-token="roomToken"
            :case-id="caseId"
            @hideVideo="hideVideo"
          />
        </div>
        <uploadFile
          v-if="isUploadFile"
          @backFile="backFile"
          @submitFile="submitFile"
        />
        <transition
          v-if="isUploadEvi"
          name="fade"
        >
          <uploadEvidence
            @back="backEvi"
            @submitImg="submitImg"
          />
        </transition>
        <transition
          v-if="isRecordView"
          name="fade"
        >
          <recordView
            :href="href"
            :case-id="caseId"
            @hideRecordView="hideRecordView"
          />
        </transition>
        <uploadVideoEvie
          v-if="isShowVideoEvi"
          :evi-id="eviId"
          @backVideoEvi="backVideoEvi"
        />
      </div>
      <div class="content-right"><right @showFile="showFile1" /></div>
    </div>
    <modal
      :title="'解纷室>解纷结果'"
      :modal-visible="modalVisible"
      @submitModal="submitModal"
      @changeModalVisible="changeModalVisible"
    >
      <div class="btn-wrapper">
        <el-button
          class="normal"
          :class="{'active': mediateResult == 1}"
          @click="selectMediateResult(1)"
        >解纷成功</el-button>
        <el-button
          class="normal"
          :class="{'active': mediateResult == 2}"
          @click="selectMediateResult(2)"
        >待继续解纷</el-button>
        <el-button
          class="normal"
          :class="{'active': mediateResult == 3}"
          @click="selectMediateResult(3)"
        >解纷失败</el-button>
      </div>
      <div
        v-if="mediateResult == 3"
        class="textarea-wrapper"
      >
        <el-select v-model="refuseCode" placeholder="请选择">
          <el-option
            v-for="item in refuseCodeData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <label>备注:</label> -->
        <el-input
          v-if="refuseCode == '其他(请备注说明)'"
          v-model="mediateResultReason"
          style="margin-top: 10px;"
          type="textarea"
          placeholder="请输入相关内容..."
        />
      </div>
    </modal>
  </div>
</template>

<script>
import { exitGroup } from '@/utils/socket.js'
import { detailCase } from '@/api/case/index.js'
import { closeRoom, leaveGroup } from '@/api/rtcRoom/rtcRoom.js'
import { mapGetters } from 'vuex'
import {
  downloadMessage,
  updateCaseResult,
  outRecord
} from '@/api/mediater/mediater.js'
import chat from './compontent/chat'
import caseDescribe from './compontent/caseDescribe'
import uploadEvidence from './compontent/uploadEvidence'
import recordView from './compontent/recordView.vue'
import videoMediation from './compontent/videoMediation'
import uploadFile from './compontent/uploadFile'
import modal from '@/components/modal/modal.vue'
import uploadVideoEvie from './compontent/uploadVideoEvie'
import right from './compontent/right'
import file from './compontent/file.vue'
export default {
  components: {
    caseDescribe,
    chat,
    uploadEvidence,
    recordView,
    videoMediation,
    uploadFile,
    modal,
    uploadVideoEvie,
    right,
    file
  },
  props: {
  },
  data() {
    return {
      fileShow: false,
      caseId: '',
      lawCaseData: null, // 案件数据
      isUploadEvi: false, // 是否是上传证据的状态
      isRecordView: false, // 是否预览笔录
      imgArrayData: null, // 接收组件传过来的上传的图片
      isVideo: false, // 是否在线聊天还是在线视频
      href: null, // 文件预览地址
      roomToken: null,
      isUploadFile: false,
      uploadFileUrl: [], // 上传附件的地址
      groupUserData: null,
      mediateResult: 1,
      mediateResultReason: '',
      modalVisible: false,
      eviId: '', // 证据ID
      isShowVideoEvi: false,
      refuseCode: '',
      refuseCodeData: [
        {
          value: '联系不到当事人',
          label: '联系不到当事人'
        },
        {
          value: '当事人撤回解纷请求',
          label: '当事人撤回解纷请求'
        },
        {
          value: '当事人明确表示不接受解纷',
          label: '当事人明确表示不接受解纷'
        },
        {
          value: '双方分歧较大且难以达成解纷协议',
          label: '双方分歧较大且难以达成解纷协议'
        },
        {
          value: '其他(请备注说明)',
          label: '其他(请备注说明)'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo'])
  },
  watch: {
  },
  created() {
    console.log(this.$route.query)
    const id = this.$route.query.id
    if (id) {
      this.$store.commit('SET_CASEID', id)
      this.caseId = id
      this.$store.dispatch('GetCaseInfo')
      this.$store.dispatch('GetTeamData')
    }
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
    // ...
    if (this.$store.state.user.userInfo.roleType == 3) { // 角色为当时人 退出的时候不掉接口
      next()
      return
    }
    const params = {
      caseId: this.caseId
    }
    params.process = 4 // 继续解纷
    if (this.getCaseInfo.endType) { // 假如生成了调解结果就不重新改变案件状态为为等待调解
      const params1 = {
        userid: this.$store.state.user.loginId
      }
      // intoTalkRoom({ caseId: this.caseId, type: 1 })
      exitGroup(params1)
      next()
    } else {
      if (this.$store.state.mediater.isOpen) { // 是案件的开启者离开才需要调改变案件状态的接口
        closeRoom()
        updateCaseResult(params).then(res => {
          if (res.state == 100) {
            const params1 = {
              userid: this.$store.state.user.loginId
            }
            // intoTalkRoom({ caseId: this.caseId, type: 1 })
            exitGroup(params1)
            next()
          }
        })
      } else {
        const params1 = {
          userid: this.$store.state.user.loginId
        }
        exitGroup(params1)
        next()
      }
    }
  },
  methods: {
    // 返回列表页
    back() {
      this.modalVisible = true
    },
    // 显示模态框
    showModal() {
      this.modalVisible = true
    },
    // 关闭模态框
    changeModalVisible() {
      this.modalVisible = false
    },
    // 上传证据的返回
    backEvi() {
      this.isUploadEvi = false
    },
    // 点击下载笔录弹出预览界面
    turnRecord() {
      downloadMessage({ roomId: this.caseId }).then(res => {
        this.href = res.url
        this.isRecordView = true
      })
    },
    // 隐藏笔录预览部分
    hideRecordView() {
      this.isRecordView = false
    },
    // 点击弹出图片上传组件
    uploadImg() {
      this.isUploadEvi = true
    },
    // 接收上传图片组件上传的图片地址
    submitImg(imgArray) {
      this.imgArrayData = []
      this.imgArrayData = imgArray
      this.isUploadEvi = false
    },
    // 隐藏在线视频
    hideVideo(index) {
      if (index == 1) { // index==1为踢人强制离开聊天室 需要调7牛退出得接口
        this.$refs.videoMediation.leaveRoom()
      }
      this.isVideo = false
    },
    // 显示在线视频
    showVideo() {
      this.isVideo = true
    },
    // 获取roomToken
    getRoomToken(token) {
      this.roomToken = token
    },
    // 隐藏添加附件
    backFile() {
      this.isUploadFile = false
    },
    submitFile(url) {
      this.isUploadFile = false
      this.uploadFileUrl = url
    },
    showFile() {
      this.isUploadFile = true
    },
    // 显示组群信息
    groupUser(data) {
      this.groupUserData = data
      console.log('---获取数据---')
      console.log(data)
    },
    // 选择解纷结果
    selectMediateResult(index) {
      this.mediateResult = index
    },
    // 提交解纷结果
    submitModal() {
      const params = {
        caseId: this.caseId
      }
      let recordResult = 1 // 解纷结果 1 待定 2 结束
      if (this.mediateResult == 1) {
        params.process = 6 // 解纷成功
        recordResult = 2
        params.endType = 1
      } else if (this.mediateResult == 2) {
        params.process = 4 // 继续解纷
        recordResult = 1
      } else if (this.mediateResult == 3) {
        params.process = 6
        params.refuseCode = this.refuseCode
        params.endType = 2
        if (params.refuseCode == '其他(请备注说明)') {
          params.result = this.mediateResultReason
          if (!params.result) {
            this.$message({
              showClose: true,
              message: '备注不能为空',
              type: 'error'
            })
            return
          }
        }
        recordResult = 3
      }
      outRecord({
        id: this.$store.state.mediater.mediaterId,
        recordResult
      }).then(res => {
        console.log(res)
      })
      closeRoom()
      updateCaseResult(params).then(res => {
        if (res.state == 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          const params1 = {
            userid: this.$store.state.user.loginId
          }
          // intoTalkRoom({ caseId: this.caseId, type: 1 })
          exitGroup(params1)
          this.$emit('back')
        }
      })
    },
    // 点击弹出上传视频证据部分
    addVideoEvi(eviId) {
      this.eviId = eviId
      this.isShowVideoEvi = true
    },
    // 隐藏视频编辑部分
    backVideoEvi() {
      this.isShowVideoEvi = false
      this.$refs.baseInfo.getEvid('')
    },
    // 隐藏文书
    backFile1() {
      this.fileShow = false
    },
    showFile1() {
      this.fileShow = true
    },
    // 选择证据获取证据Id的值
    geteVidencesId(eviId) {
      if (this.eviId == eviId) {
        this.eviId = ''
        this.isShowVideoEvi = false
      } else {
        this.eviId = eviId
        this.isShowVideoEvi = true
      }
    },
    /**
     * 禁言
     * @params {boolean} isMute true为禁言 false为解除禁言
     */
    mute(isMute) {
      this.$refs.videoMediation.mute(isMute)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.mediation-room-wrapper {
  height: 100vh;
  .header {
    .text {
      color: #fff;
      font-weight: bold;
    }
    padding-bottom: 30px;
  }
  .content {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    display: flex;
    .content-left {
      flex: 1;
      padding: 0px 50px;
      position: relative;
      .bg-blur {
        filter: blur(5px);
      }
    }
    .content-right {
      width: 320px;
      background-color: #FAFBFB;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.my-modal {
  .btn-wrapper {
    margin: 0px;
    .normal {
      border-color: #fafafa;
      background-color: #f0f1f2;
      padding: 10px 15px;
      width: auto;
      color: #131026;
      &.active {
        color: #fff;
        background-color: $themeColor;
      }
    }
  }
  .textarea-wrapper {
    margin-top: 15px;
    label {
      display: block;
      font-size: 14px;
      color: #464a53;
      margin-bottom: 15px;
    }
    :v-deep .el-textarea__inner {
      background-color: #fafafa;
      border-color: #f0f1f2;
      resize: none;
      &::-webkit-input-placeholder {
        color: $themeColor;
      }
    }
  }
}
</style>
