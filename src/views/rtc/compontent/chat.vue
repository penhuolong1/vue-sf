<template>
  <div class="chat-wrapper">
    <div class="chat-record-wrapper">
      <div v-for="(item, index) in historyList" :key="'a'+index" class="22">
        <div class="tip">
          <div class="label">{{ item.inTime | timeDate }}</div>
          <div class="line" />
        </div>
        <chatItem
          v-for="(item1, index1) in item.content"
          :id="'chatItem'+item1.message_content.time"
          :key="index1"
          :direction="direction"
          :content="item1.message_content"
          :num="index1"
          :is-history="true"
          :case-id="caseId"
        />
      </div>
      <div id="newMsg" class="tip">
        <div class="label">新消息</div>
        <div class="line" />
      </div>
      <chatItem
        v-for="(item, index) in chatRecordList"
        :id="'chatItem'+item.time"
        :key="index"
        :direction="direction"
        :content="item"
        :num="index"
        :class="'chatItem'+item.withdraw"
        :case-id="caseId"
        @withdraw="withdraw"
      />
    </div>
    <div class="time-division">
      <div class="time">{{ time }}</div>
      <div class="line" />
    </div>
    <div class="chat-send-wrapper">
      <div class="img-group">
        <img
          src="@/assets/img/chat/icon1.png"
          @click="showFile"
        >
        <img
          src="@/assets/img/chat/icon2.png"
          @click="showVideo"
        >
        <img
          src="@/assets/img/chat/icon3.png"
          @click="uploadImg"
        >
      </div>
      <el-input
        v-model="chatContent"
        class="sy-textarea"
        type="textarea"
        :rows="4"
        placeholder="请输入消息内容,回车键快捷发送,换行使用shift+enter"
        @keyup.enter.native="enterSend"
      />
      <div class="button-wrapper">
        <el-button @click="send">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { initWebSocket, sendMessage, groupUser } from '@/utils/socket.js'
import { formatDate } from '@/utils/format.js'
import { getChatGroup } from '@/api/rtcRoom/rtcRoom.js'
import chatItem from './chatItem'
import { findArrayIndexByKey } from '@/utils/tools.js'
import { getHistory } from '@/api/case/index.js'
import { mapGetters } from 'vuex'
import { validNull } from '@/utils/validate.js'
export default {
  components: {
    chatItem
  },
  props: {
    caseId: null,
    imgArray: null, // 父组件传来的聊天图片地址
    uploadFileUrl: null // 父组件传来的附件地址
  },
  data() {
    return {
      chatContent: '',
      direction: 'directionLeft',
      loginId: null, // 登陆ID
      chatRecordList: [], // 聊天记录
      chatRecordListUserId: [], // 聊天记录人的ID
      imgArrayData: null, // 接收组件传来的聊天的图片
      loginUserInfo: null, // 登陆人信息
      uploadFileUrlData: null,
      time: formatDate(new Date().getTime()),
      historyList: [], // 聊天记录
      isMute: false // 是否被禁言
    }
  },
  computed: {
    ...mapGetters(['getTeamData'])
  },
  watch: {
    imgArray: {
      handler() {
        this.imgArrayData = []
        this.imgArrayData = this.imgArray
        this.imgArrayData.forEach(item => {
          const time = new Date().getTime()
          const params = {
            from: this.loginId,
            group_id: this.caseId,
            createTime: time,
            content: {
              userName: this.loginUserInfo.result.name,
              role: this.loginUserInfo.roleType,
              text: item,
              loginId: this.loginId,
              type: 'img',
              createTime: formatDate(time),
              time,
              messageid: `${this.loginId}${time}`
            }
          }
          sendMessage(params)
        })
      },
      deep: true
    },
    uploadFileUrl() {
      // 附件地址
      this.uploadFileUrlData = []
      this.uploadFileUrlData = this.uploadFileUrl
      this.uploadFileUrlData.forEach(item => {
        const time = new Date().getTime()
        const params = {
          from: this.loginId,
          group_id: this.caseId,
          createTime: time,
          content: {
            userName: this.loginUserInfo.result.name,
            role: this.loginUserInfo.roleType,
            fileName: item.split('/').pop(),
            text: item,
            loginId: this.loginId,
            type: 'file',
            time,
            createTime: formatDate(time),
            messageid: `${this.loginId}${time}`
          }
        }
        sendMessage(params)
      })
    }
  },
  created() {
    this.getLoginId()
    this.initSocket()
    this.loginUserInfo = this.$store.state.user.userInfo
    this._getHistory()
  },
  mounted() {
  },
  methods: {
    // 接收聊天记录
    getMessage(e) {
      const data = JSON.parse(e.data)
      console.log('-socket的信息--')
      console.log(data)
      if (data.command == 18) {
        // 获取在线人数
        const users = data.data.groups.find(item => item.group_id === this.caseId).users
        console.log('----获取在线人数----')
        console.log(users)
        this.$emit('groupUser', users)
      }
      if (data.command === 9) {
        // 有人加入群聊
        this.getGroupUser()
      }
      if (data.command === 10) {
        // 有人退出群聊
        this.getGroupUser()
      }
      if (data.command === 11) {
        const content = JSON.parse(data.data.content)
        const time = new Date().getTime()
        content.time = time
        if (content.type == 'rollback') {
          // 发出测回信息
          const chatRecordListnum = findArrayIndexByKey(
            this.chatRecordList,
            'messageid',
            content.text
          )
          if (chatRecordListnum >= 0) {
            this.$set(
              this.chatRecordList[chatRecordListnum],
              'isWithdraw',
              true
            )
          }
        } else if (content.type == 'kickoutUser') { // 发出替人的消息
          if (content.text === this.loginUserInfo.result.id) { // 判断给踢的是不是自己
            this.$message.error('您被移出视频聊天')
            this.$emit('kickout')
          }
        } else if (content.type == 'words') {
          // 发出禁言消息
          if (content.text === this.loginUserInfo.result.id) { // 判断给踢的是不是自己
            const str = this.isMute ? '解禁' : '禁言'
            this.$message.error(`您已被管理员${str}`)
            this.isMute = !this.isMute
            this.$emit('mute', this.isMute)
          }
        } else {
          this.chatRecordList.push(content)
        }
        this.$nextTick(() => {
          document.getElementById(`chatItem${time}`).scrollIntoView()
        })
      }
    },
    // 回车发送消息
    enterSend(event) {
      if (event.shiftKey && event.keyCode == 13) {
        // 不需要执行任何代码。会自动换行
      } else if (event.keyCode == 13) {
        this.send() // 提交的发送消息函数
      }
    },
    send() {
      if (validNull(this.chatContent)) {
        this.$message.error('请先输入发送内容')
        this.chatContent = ''
        return
      }
      const time = new Date().getTime()
      const params = {
        from: this.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          userName: this.loginUserInfo.result.name,
          role: this.loginUserInfo.roleType,
          text: this.chatContent,
          loginId: this.loginId,
          type: 'text',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.loginId}${time}`
        }
      }
      sendMessage(params)
      this.chatContent = ''
    },
    // 获取群组在线人数
    getGroupUser() {
      const params = {
        userid: this.loginId
      }
      groupUser(params)
    },
    initSocket() {
      initWebSocket(this.loginId, this.caseId, this.getMessage)
    },
    getLoginId() {
      this.loginId = this.$store.state.user.loginId
    },
    uploadImg() {
      this.$emit('uploadImg')
    },
    // 显示在线视频
    showVideo() {
      const time = new Date().getTime()
      const params = {
        from: this.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          userName: this.loginUserInfo.result.name,
          role: this.loginUserInfo.roleType,
          text: '解纷员已开启视频解纷，点击下方视频按钮进入视频解纷',
          loginId: this.loginId,
          type: 'text',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.loginId}${time}`
        }
      }
      if (this.$store.state.user.userInfo.roleType != 3 && this.getTeamData != 2) { // 当事人打开视频不要发通知
        sendMessage(params)
      }
      this.$emit('showVideo')
    },
    // 显示附件上传
    showFile() {
      this.$emit('showFile')
    },
    // 撤回
    withdraw(id) {
      const time = new Date().getTime()
      const params = {
        from: this.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          userName: this.loginUserInfo.result.name,
          role: this.loginUserInfo.roleType,
          text: id,
          content: '',
          loginId: this.loginId,
          type: 'rollback',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.loginId}${time}`
        }
      }
      sendMessage(params)
    },
    // 获取聊天记录
    _getHistory() {
      const params = {
        caseId: this.caseId
      }
      getChatGroup(params).then(res => {
        if (res.state === 100) {
          this.historyList = res.data.content.map(item => {
            item.content = item.content.map(item1 => {
              item1.message_content = JSON.parse(item1.message_content)
              return item1
            })
            return item
          })
          setTimeout(() => {
            document.getElementById('newMsg').scrollIntoView()
          }, 200)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.chat-wrapper {
  height: 100%;
  .chat-record-wrapper {
    width: 100%;
    height: calc(100vh - 450px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 30px 0 70px;
  }
  .time-division {
    position: relative;
    height: 16px;
    .time {
      position: absolute;
      z-index: 2;
      background-color: #fff;
      left: 20px;
      color: #414d55;
      padding: 0 5px;
      font-size: 12px;
    }
    .line {
      position: relative;
      top: 10px;
      border-bottom: 1px dashed #dddfe1;
    }
  }
  .chat-send-wrapper {
    width: 100%;
    padding: 20px;
    .img-group {
      & > img {
        cursor: pointer;
        height: 20px;
        margin-right: 15px;
      }
    }
    .el-textarea {
      margin-top: 10px;
      margin-bottom: 10px;
      .el-textarea__inner {
        border: none;
        padding: 0px;
        resize: none;
      }
    }
    .button-wrapper {
      overflow: hidden;
      .el-button {
        float: right;
        background-color: $themeColor;
        color: #fff;
        padding: 12px 30px;
      }
    }
  }
}
.tip {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  color: rgba(0,122,255,1);
  font-size: 14px;
  .label {
    position: relative;
    z-index: 2;
    background-color: white;
    display: inline-block;
    padding: 0px 20px;
  }
  .line {
    position: relative;
    top: -8px;
    border-bottom: 1px dashed #dddfe1;
    z-index: 1;
  }
}
.sy-textarea {
  height: 130px;
}
</style>
