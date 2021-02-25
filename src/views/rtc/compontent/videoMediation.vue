<template>
  <div
    ref="videoWrapper"
    class="video-wrapper"
  >
    <div
      class="back"
      @click="hideVideo"
    >
      <i class="el-icon-arrow-right" />
    </div>
    <div class="video-wrapper-content" :class="'num'+userLength">
      <div
        id="video-item-1"
        class="video-item"
        :class="{'big-video': bigVideoClassId == 1}"
      >
        <div
          id="videoContent1"
          class="content content1"
        />
        <div class="footer">
          <div class="barcode" />
          <div class="connect" />
          <div class="no-speaking" />
          <!-- <div
            class="full-screen"
            @click="fullScreen(1)"
          ><i class="el-icon-full-screen" /></div> -->
        </div>
      </div>
      <div
        v-for="(item, index) in videoUser"
        :id="'video-item-'+item.id"
        :key="index"
        class="video-item"
        :class="{'big-video': bigVideoClassId == item.id}"
      >
        <div class="header">
          <span>{{ item.roleName }}: {{ item.name }}({{ item.connect===1?'未连接':'已连接' }}){{ item.address }}</span>
        </div>
        <div
          :id="'video'+item.id"
          class="content"
        />
        <div class="footer">
          <div class="barcode" />
          <div class="connect" />
          <div
            v-if="item.connect!==1 && getUserInfo.roleType != 3&& getTeamData.type != 2 && !(item.roleName == '解纷员' || item.roleName == '主要办案员')"
            class="no-speaking"
            @click="kickoutUser(item.userId)"
          >
            <span>踢人</span>
          </div>
          <div
            class="no-speaking"
            @click="forbiddenWords(item.userId)"
          >
            <span v-if="item.connect===2 && getUserInfo.roleType != 3 && getTeamData.type != 2 && !(item.roleName == '解纷员' || item.roleName == '主要办案员')">{{ isForbiddenWords(item.userId) ? '禁言':'解禁' }}</span>
          </div>
          <!-- <div
            class="full-screen"
            @click="fullScreen(item.id)"
          ><i class="el-icon-full-screen" /></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initWebSocket, sendMessage } from '@/utils/socket.js'
import { userInfo, detailCase } from '@/api/case/index.js'
import { formatDate } from '@/utils/format.js'
import { findArrayIndexByKey } from '@/utils/tools.js'
import * as QNRTC from 'pili-rtc-web'
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    roomToken: null,
    caseId: null
  },
  data() {
    return {
      videoDomArray: [],
      myRTC: null,
      videoUser: [], // 参与的用户
      bigVideoClassId: 1,
      forbiddenWordsUsers: [], // 禁言的用户
      forbiddenWordsTitle: '禁言'
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getTeamData']),
    // 判断用户是否被禁言
    isForbiddenWords() {
      return id => {
        const index = this.forbiddenWordsUsers.findIndex(item => item == id)
        console.log('是否禁言')
        console.log(index)
        return index == -1
      }
    },
    userLength() {
      return this.videoUser.length + 1
    }
  },
  watch: {
    roomToken() {
      console.log('---------roomToken---------')
      console.log(this.roomToken)
    }
  },
  created() {
    this.initWebSocket()
    this.myRTC = new QNRTC.StreamModeSession()
    this.rtc()
  },
  mounted() {},
  async beforeDestroy() {
    console.log('销毁触发')
    // 视频组件销毁时关闭视频停止合流
    console.log(this.$store.state.mediater)
    if (this.$store.state.mediater.isOpen && this.$store.state.mediater.isOpen != 'false') { // 开启房间的来处理合流和关闭合流
      await this.myRTC.stopMergeStream()
      console.log('停止合流')
    }
    await this.myRTC.leaveRoom()
  },
  methods: {
    leaveRoom() {
      this.myRTC.leaveRoom()
    },
    hideVideo() {
      this.$emit('hideVideo')
      // closeRoom().then(res => {
      //   console.log(res)
      // })
    },
    async rtc() {
      const caseId = this.caseId
      this.myRTC = new QNRTC.StreamModeSession()
      // 采集
      // 使用内置的 deviceManager 对象采集本地媒体数据
      const stream = await QNRTC.deviceManager.getLocalStream({
        video: { enabled: true },
        audio: { enabled: true }
      })
      // 页面上准备用来播放的元素，就是我们刚刚创建的
      const localVideo1 = document.getElementById('videoContent1')
      // 拿到 stream 对象后，调用 play 就可以播放了
      // sdk 会在指定的元素下创建相应的 video/audio 标签完成播放
      // 这里第二个参数代表用 静音模式 来播放，本地预览的时候一般我们会设置成静音
      stream.play(localVideo1, true)
      await this.myRTC.joinRoomWithToken(this.$store.state.mediater.roomToken)
      const users = this.myRTC.users
      console.log(users)
      // 接收
      // 发布自己本地的流
      try {
        await this.myRTC.publish(stream)
        console.log('publish success!')
      } catch (e) {
        console.log('publish error!', e)
      }
      this.getDetailCase().then(() => {
        for (let i = 0; i < users.length; i += 1) {
          const user = users[i]
          if (user.published && user.userId !== this.myRTC.userId) {
            this.subscribeVideo(user.userId)
          }
        }
      })
      if (this.$store.state.mediater.isOpen) { // 开启房间的来处理合流和关闭合流
        console.log('开始合流')
        this.myRTC.setDefaultMergeStream(1280, 720)
      }
      this.myRTC.on('user-join', async() => {
        console.log('--有人加入房间---')
      })
      this.myRTC.on('user-leave', () => {
        console.log('--有人离开房间---')
      })
      this.myRTC.on('user-publish', e => {
        console.log('有人加房间')
        console.log(this.videoUser)
        userInfo({ adminId: e.userId, caseId: this.caseId }).then(res => {
          if (res.state == 100) {
            const name = res.result.name
            this.$message({
              showClose: true,
              message: `${name}加入了聊天室`,
              type: 'warning'
            })
          }
        })
        this.subscribeVideo(e.userId)
      })
      this.myRTC.on('user-unpublish', async e => {
        console.log('--	有用户取消发布---')
        await userInfo({ adminId: e.userId, caseId }).then(res => {
          if (res.state == 100) {
            const id = res.id || e.userId
            console.log(this.videoUser)
            const index = findArrayIndexByKey(this.videoUser, 'id', id)
            this.videoUser[index].connect = 1
            this.$message({
              showClose: true,
              message: `${this.videoUser[index].name}离开了聊天室`,
              type: 'warning'
            })
            const index1 = this.forbiddenWordsUsers.findIndex(item => item == res.id)
            if (index1 != -1) { // 如果用户取消发布则取消该用户的禁言
              this.forbiddenWordsUsers.splice(index1, 1)
            }
          }
        })
        this.myRTC &&
          this.myRTC
            .unsubscribe(e.userId)
            .then(() => {
              console.log(this.videoUser)
              console.log('unsubscribe success!')
            })
            .catch(e => {
              console.log('unsubscribe Error!', e)
            })
      })
    },
    // 查看详情并订阅视频
    async subscribeVideo(userId) {
      console.log('查看并订阅视频')
      console.log(this.videoUser)
      let id = ''
      await userInfo({ adminId: userId, caseId: this.caseId }).then(res => {
        if (res.state == 100) {
          const index = findArrayIndexByKey(this.videoUser, 'id', res.id || userId)
          // obj = this.videoUser[index]
          // this.videoUser.splice(index, 1)
          id = res.id || userId
          if (index === -1) {
            const obj = {
              id: id,
              name: res.result.name,
              roleName: res.result.roleName,
              connect: 2,
              userId: userId,
              address: res.result.address
            }
            this.videoUser.push(obj)
          } else {
            this.videoUser[index].connect = 2
            this.videoUser[index].userId = userId
            this.videoUser[index].address = res.result.address
          }
        }
      })
      // this.videoUser.unshift(obj)
      const stream = await this.myRTC.subscribe(userId)
      console.log('视频的数据')
      console.log(this.videoUser)
      this.$nextTick(() => {
        console.log('id=' + id)
        const dom = document.getElementById(`video${id}`)
        stream.play(dom)
      })
    },
    // 全屏
    fullScreen(id) {
      this.bigVideoClassId = id
    },
    // 连接websocket
    initWebSocket() {
      initWebSocket(this.$store.state.user.loginId, this.caseId, this.getMessage)
    },
    // 接收消息
    getMessage() {},
    // 禁言
    forbiddenWords(id) {
      const index = this.forbiddenWordsUsers.findIndex(item => item == id)
      if (index == -1) {
        this.forbiddenWordsUsers.push(id)
      } else {
        this.forbiddenWordsUsers.splice(index, 1)
      }
      const time = new Date().getTime()
      const params = {
        from: this.$store.state.user.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          text: id,
          loginId: this.loginId,
          type: 'words',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.$store.state.user.loginId}${time}`
        }
      }
      sendMessage(params)
    },
    // 获取案件详情
    getDetailCase() {
      return new Promise(resolve => {
        detailCase({ lawCaseId: this.caseId }).then(res => {
          if (res.state === 100) {
            this.videoUser = []
            if (res.lawCase.litigants && res.lawCase.litigants.length > 0) {
              res.lawCase.litigants.forEach(item => {
                if (!item.enable) {
                  return
                }
                const name = item.litigantName
                const roleName = item.litigationStatus.name
                if (item.lawyer && item.lawyer.length > 0) {
                  item.lawyer.forEach(item1 => {
                    if (!item1.enable) {
                      return
                    }
                    const obj = {
                      id: item1.id,
                      name: item1.agentName,
                      roleName: `${item.litigantName}的代理人`,
                      connect: 1 // 1为为连接 2为已连接
                    }
                    this.videoUser.push(obj)
                  })
                }
                const obj = {
                  id: item.id,
                  name,
                  roleName,
                  connect: 1 // 1为为连接 2为已连接
                }
                this.videoUser.push(obj)
                console.log('-------llalalalal----')
                console.log(this.videoUser)
                if (this.getUserInfo.roleType == 3) { // 如果是当事人
                  userInfo({ adminId: this.getUserInfo.result.id, caseId: this.caseId }).then(res => {
                    if (res.state == 100) {
                      const id = res.id
                      console.log(this.videoUser)
                      let index = null
                      try {
                        index = findArrayIndexByKey(this.videoUser, 'id', id)
                        if (index >= 0) {
                          this.videoUser.splice(index, 1)
                        }
                      } catch (e) {
                        console.log(e)
                        index = null
                      }
                      console.log(this.videoUser)
                      // this.videoUser.splice(index, 1)
                    }
                  })
                }
                console.log('------123------')
              })
            }
          }
          resolve()
        })
      })
    },
    // 踢人
    kickoutUser(userId) {
      this.myRTC.kickoutUser(userId)
      const time = new Date().getTime()
      const params = {
        from: this.$store.state.user.loginId,
        group_id: this.caseId,
        createTime: time,
        content: {
          text: userId,
          loginId: this.loginId,
          type: 'kickoutUser',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.$store.state.user.loginId}${time}`
        }
      }
      sendMessage(params)
    },
    mute(isMute) {
      this.myRTC.mute(isMute)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.video-wrapper {
  position: relative;
  .address {
    width: 200px;
  }
  .back {
    position: absolute;
    width: 40px;
    line-height: 40px;
    text-align: center;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.12);
    top: 10px;
    left: 10px;
    z-index: 10;
    cursor: pointer;
    i {
      color: $themeColor;
      font-size: 18px;
      font-weight: bold;
      position: relative;
      top: 2px;
    }
  }
  .video-wrapper-content {
    position: fixed;
    top: 150px;
    left: 50px;
    right: 370px;
    bottom: 0px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 100%;
    &.num2 {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 100%;
    }
    &.num3,&.num4 {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 50% 50%;
    }
    &.num5,&.num6 {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 33.333% 33.333% 33.333%;
      .big-video {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
      }
    }
    &.num7,&.num8 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 25% 25% 25% 25%;
      .big-video {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 4;
      }
    }
    &.num9 {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 33.333% 33.333% 33.333%;
    }
  }
  .video-item {
    background-color: #464a53;
    color: #fff;
    &.big-video {
      position: relative;
      // grid-column-start: 1;
      // grid-column-end: 3;
      // grid-row-start: 1;
      // grid-row-end: 3;
    }
    .content1 {
      height: calc(100% - 40px) !important;
    }
    .header {
      height: 25px;
      line-height: 25px;
      padding-left: 10px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.05);
      position: relative;
      span {
        position: absolute;
        left: 0px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        font-size: 10px;
        transform: scale(0.8);
        letter-spacing: 2px;
      }
    }
    .content {
      height: calc(100% - 65px);
    }
    .footer {
      height: 40px;
      line-height: 40px;
      border-top: 2px solid rgba(255, 255, 255, 0.05);
      display: flex;
      .barcode {
        width: 80px;
      }
      .connect {
        flex: 1;
        position: relative;
        span {
          display: block;
          font-size: 10px;
          transform: scale(0.8);
        }
        .label {
          position: absolute;
        }
        .text {
          position: absolute;
          color: #228d49;
          left: 30px;
        }
      }
      .no-speaking {
        width: 30px;
        position: relative;
        cursor: pointer;
        span {
          display: block;
          font-size: 10px;
          transform: scale(0.8);
          position: absolute;
          right: 0px;
        }
      }
      .full-screen {
        width: 50px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
