<template>
  <div class="wrapper">
    <div ref="videoWrapper" class="video-wrapper">
      <div class="namebox">
        <span>{{ group.groupName }}</span>
        <img :src="imgUrl" class="imgbox" alt="退出" @click="goBack">
      </div>
      <div class="video-wrapper-content" :class="'num'+userLength" @mouseleave="leave()" @mouseenter="enters(myRoom.userId)">
        <div id="video-item-1" class="video-item" :class="{'big-video': bigVideoClassId == 1}">
          <div class="header">
            <span>{{ this.$store.state.user.userInfo.result.name }}(已连接)</span>
          </div>
          <div id="videoContent1" class="content content1" />
          <div v-show="(group.mans.length >0 && loginId == group.mans[0].loginId) && showOperation == myUserId" class="operation">
            <div v-show="userLength >= 5" class="operationItem" @click="fullScreen(1)">
              <img :src="imgUrl2" alt="">
              <span>放大</span>
            </div>
          </div>
        </div>
        <div v-for="(item, index) in videoUser" :id="'video-item-'+item.id" :key="index" class="video-item" :class="{'big-video': bigVideoClassId == item.id}" @mouseleave="leave()" @mouseenter="enters(item.userId)">
          <div class="header">
            <span>{{ item.name }}({{ item.connect===1?'未连接':'已连接' }})</span>
          </div>
          <div :id="'video'+item.id" class="content" />
          <div v-show="(group.mans.length >0 && loginId == group.mans[0].loginId) && showOperation == item.userId" class="operation">
            <div v-show="userLength >= 5" class="operationItem" @click="fullScreen(item.id)">
              <img :src="imgUrl2" alt="">
              <span>放大</span>
            </div>
            <!-- <div class="operationItem" @click="forbiddenWords(item.userId)">
              <img :src="imgUrl3" alt="">
              <span v-if="item.connect===2">{{ isForbiddenWords(item.userId) ? '禁言':'解禁' }}</span>
            </div> -->
            <div v-if="item.connect!==1" class="operationItem" @click="kickoutUser(item.userId)">
              <img :src="imgUrl4" alt="">
              <span>踢人</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <roomDetails class="roomDetails" :group-f="group" :login-id="loginId" :group-id="groupId" :user-length="userLength" :user1="videoUser" />
  </div>
</template>

<script>
import roomDetails from './roomDetails.vue'
import { initWebSocket, sendMessage, groupUser, closeSocket } from '@/utils/socket.js'
import { formatDate } from '@/utils/format.js'
import * as QNRTC from 'pili-rtc-web'
import { mapGetters } from 'vuex'
import { selectGroup, getUserById, killUser, leaveGroupRoom } from '@/api/contract/contract.js'
export default {
  components: {
    roomDetails
  },
  props: {
  },
  data() {
    return {
      showOperation: '',
      myRoom: null,
      myUserId: '',
      group: {
        mans: [], // 已加入人员
        outman: [], // 未加入人员
        reason: '', // 事由
        groupName: '群组名', // 当前聊天室名称
        createDate: '', // 发起时间
        leaveTime: null, // 离开聊天室得时间点
        roomId: '',
        vedioMan: '' // 视频发起者id
      },
      loginId: this.$store.state.user.loginId, // 登陆者ID
      groupId: this.$store.state.contract.id,

      videoDomArray: [],
      myRTC: null,
      videoUser: [], // 参与的用户
      bigVideoClassId: 1,
      forbiddenWordsUsers: [], // 禁言的用户
      forbiddenWordsTitle: '禁言',
      imgUrl: require('@/assets/contactCenter/tuichu.png'),
      imgUrl2: require('@/assets/contactCenter/fangda.png'),
      imgUrl3: require('@/assets/contactCenter/jingyan.png'),
      imgUrl4: require('@/assets/contactCenter/tiren.png')
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
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
    showOperation(newVal, oldVal) {
      console.log('再次移入', newVal)
      this.showOperation = newVal
      this.$forceUpdate()
    }
  },
  created() {
    this.initWebSocket()
    // 获取当前群组信息
    this.selectGroup()
    this.myRTC = new QNRTC.StreamModeSession()
    this.myRoom = new QNRTC.StreamModeSession()
    this.joinRoom()
  },
  mounted() {
    window.addEventListener('beforeunload', e => {
      this.myRoom.leaveRoom()
    })
  },
  destroyed() {
    window.localStorage.removeItem('roomToken')
  },
  methods: {
    async joinRoom() {
      // 在加入房间之前，我们需要实例化一个全局 Session 对象。之后所有和房间相关的操作都会通过调用这个对象的方法来实现。
      const myRoom = this.myRoom
      // 通过传入 RoomToken 来完成加入房间
      console.log('------------------------------------myRoom.userId---------', myRoom.userId)
      await myRoom.joinRoomWithToken(this.$store.state.contract.roomToken)
      this.myUserId = this.myRoom.userId
      console.log('------------------------------------roomToken---------', this.$store.state.contract.roomToken)
      console.log('------------------------------------users---------', myRoom.users)
      console.log('------------------------------------myRoom.userId2---------', myRoom.userId)
      console.log('-------------------*******--------joinRoom success!---------*******---------------------------')
      await this.publish(myRoom) // 采集并发布自己的媒体流
      this.autoSubscribe(myRoom) // 显示他人的视频

      myRoom.on('user-unpublish', user => {
        // 房间里有新的用户取消发布
        console.log(user, 'unpublish----------------------------------有人离开了视频')
        this.videoUser.forEach((item, key) => {
          if (item.id == user.userId) {
            this.videoUser.splice(key, 1)
            this.selectGroup()
            this.$message({
              showClose: true,
              message: `${item.name}离开了视频`,
              type: 'warning'
            })
            const index1 = this.forbiddenWordsUsers.findIndex(item => item == item.id)
            if (index1 != -1) { // 如果用户取消发布则取消该用户的禁言
              this.forbiddenWordsUsers.splice(index1, 1)
            }
          }
        })
        myRoom && myRoom.unsubscribe(user.userId).then(() => {
          console.log(this.videoUser)
          console.log('unsubscribe success!')
        }).catch(e => {
          console.log('unsubscribe Error!', e)
        })
      })
    },

    // 用于采集并发布自己的媒体流
    async publish(myRoom) {
      // 调用采集模块采集本地的音频和视频数据，返回一个包含这些数据的 Stream 对象
      const localStream = await QNRTC.deviceManager.getLocalStream({
        audio: { enabled: true },
        video: { enabled: true }
      })
      await myRoom.publish(localStream)// 将刚刚的 Stream 对象发布到房间中
      console.log('publish success!')
      const localElement = document.getElementById('videoContent1')// 显示自己刚刚采集的媒体流画面，获取页面上的一个元素作为播放画面的父元素
      localStream.play(localElement, true)// 调用 Stream 对象的 play 方法在这个元素下播放媒体流，其中第二个参数代表 静音播放
    },

    // 订阅操作并播放订阅流  --正常订阅
    async subscribe(myRoom, userId) {
      await getUserById({ loginId: userId }).then(res => {
        if (res.state == 100) {
          const obj = {
            id: userId,
            userId: userId,
            name: res.name,
            connect: 2
          }
          this.videoUser.push(obj)
          this.selectGroup()
          this.$message({
            showClose: true,
            message: `${res.name}加入视频`,
            type: 'warning'
          })
        }
      })
      // 调用订阅方法发起订阅，成功会返回一个 Stream 对象，这就是远端的流了
      const remoteStream = await myRoom.subscribe(userId) // userId 是指订阅对象的用户名
      // 选择页面上的一个元素作为父元素，播放远端的流
      const remoteElement = document.getElementById(`video${userId}`)
      remoteStream.play(remoteElement)
    },

    // 订阅操作并播放订阅流  --判断是否禁言
    async subscribeTwo(myRoom, userId, type) {
      await getUserById({ loginId: userId }).then(res => {
        if (res.state == 100) {
          const obj = {
            id: userId,
            userId: userId,
            name: res.name,
            connect: 2
          }
          this.videoUser.push(obj)
          this.selectGroup()
        }
      })
      // 调用订阅方法发起订阅，成功会返回一个 Stream 对象，这就是远端的流了
      const remoteStream = await myRoom.subscribe(userId) // userId 是指订阅对象的用户名
      // 选择页面上的一个元素作为父元素，播放远端的流
      const remoteElement = document.getElementById(`video${userId}`)
      remoteStream.play(remoteElement, type)// 其中第二个参数为true代表 静音播放
    },

    // autoSubscribe 用于判断检测当是否能够发起订阅，如果能发起订阅，就调用 subscribe
    autoSubscribe(myRoom) {
      this.videoUser = []
      const users = myRoom.users
      console.log('房间用户-------------', users)
      // 第一种情况，如果加入房间时，订阅目标已经在房间里并且已经发布了,加入房间成功之后读取一下当前房间内的用户列表，判断其有没有发布即可
      // 遍历房间当前所有用户
      for (const user of users) {
        // 如果存在一个用户，用户名不是自己并且已经发布，发起订阅了
        if (user.userId !== myRoom.userId && user.published) {
          // 判断是否禁言用户，禁言用户静音播放
          const index = this.forbiddenWordsUsers.findIndex(item => item == user.userId)
          // 订阅操作并播放订阅流
          if (index == -1) {
            console.log('订阅操作并播放订阅流 --调用正常订阅')
            // 订阅操作并播放订阅流 --调用正常订阅
            this.subscribeTwo(myRoom, user.userId, false)
              .then(() => console.log('subscribe success!'))
              .catch(e => console.error('subscribe error', e))
          } else {
            console.log('订阅操作并播放订阅流 --调用静音订阅')
            // 订阅操作并播放订阅流 --调用静音订阅
            this.subscribeTwo(myRoom, user.userId, true)
              .then(() => console.log('subscribe success!'))
              .catch(e => console.error('subscribe error', e))
          }
        }
      }
      // 第二种情况，监听事件来感知房间内有用户发布了，当房间内有其他用户发布时就会触发 "user-publish" 然后被我们订阅
      myRoom.on('user-publish', (user) => {
        console.log('user', user.userId, 'is published!')
        this.subscribe(myRoom, user.userId)
          .then(() => console.log('subscribe success!'))
          .catch(e => console.error('subscribe error', e))
      })
    },

    // 获取当前群组信息
    selectGroup() {
      const params = {
        groupId: this.groupId
      }
      selectGroup(params).then(res => {
        if (res.state == 100) {
          const manaArr = JSON.parse(res.group.mans) || []// 已加入人员
          manaArr.map(item => {
            item.flag = false
            return item
          })
          this.group.mans = manaArr// 已加入人员
          this.group.outman = JSON.parse(res.group.outman) || []// 未加入人员
          this.group.reason = res.group.reason // 事由
          this.group.groupName = res.group.groupName // 聊天室名称
          this.group.createDate = formatDate(res.group.createDate) // 发起时间
          this.group.leaveTime = res.leaveTime // 离开聊天室得时间点
          this.group.roomId = res.group.roomId
          this.group.vedioMan = res.group.vedioMan// 视频发起者id
          console.log(this.group)
          // 获取在线群组用户
          this.getGroupUser()
        }
      })
    },
    // 获取群组在线人数
    getGroupUser() {
      const params = {
        userid: this.loginId
      }
      groupUser(params)
    },

    hideVideo() {
      this.$emit('hideVideo')
      this.myRTC.leaveRoom()
    },
    // 全屏
    fullScreen(id) {
      this.bigVideoClassId = id
    },
    // 连接websocket
    initWebSocket() {
      console.log('*********初始化weosocket********')
      initWebSocket(this.loginId, this.groupId, this.getMessage)
    },
    // 接收消息
    getMessage(e) {
      const data = JSON.parse(e.data)
      console.log(data)
      // if (data.command == 18) {
      //   // 获取在线人数
      //   for (let i = 0; i < data.data.groups.length; i++) {
      //     if (data.data.groups[i].group_id == this.groupId) {
      //       const arr = data.data.groups[i].users
      //       for (let j = 0; j < this.group.mans.length; j++) {
      //         this.group.mans[j].flag = false
      //         for (let k = 0; k < arr.length; k++) {
      //           if (this.group.mans[j].loginId == arr[k].id) {
      //             this.group.mans[j].flag = true
      //             break
      //           }
      //         }
      //       }
      //       break
      //     }
      //   }
      //   console.log('------------this.group.mans---------', this.group.mans)
      // }
      if (data.command === 9) {
        // 有人加入群聊
        // if (this.groupId != '' && data.data.group == this.groupId) {
        //   this.getGroupUser()
        // }
      }
      if (data.command === 10) {
        // 有人退出群聊
        // if (this.groupId != '' && data.data.group == this.groupId) {
        //   this.getGroupUser()
        // }
      }
      if (data.command === 11) {
        // 被剔出视频
        const content = JSON.parse(data.data.content)
        if (content.type == 'kickoutUser') {
          getUserById({ loginId: content.loginId }).then(res => {
            if (res.state == 100) {
              if (this.loginId == content.text) { // 被踢者
                this.$message({
                  showClose: true,
                  message: `您被${res.name}移出视频聊天`,
                  type: 'warning'
                })
                console.log(`您被${res.name}移出视频聊天`)
                closeSocket()
                this.myRoom.leaveRoom()
                this.$store.commit('SET_ID', this.groupId)
                this.$store.commit('SET_SHOWINDEX', 2)
                // setTimeout(function() { window.close() }, 3000)
              }
            }
          })
        }
        if (content.type == 'words') { // 有禁言动态重新订阅他人视频流
          console.log('有禁言动态重新订阅他人视频流')
          this.autoSubscribe(this.myRoom)
        }
      }
    },

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
        group_id: this.groupId,
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
    // 踢人
    kickoutUser(userId) {
      this.myRoom.kickoutUser(userId)
      const time = new Date().getTime()
      const params = {
        from: this.$store.state.user.loginId,
        group_id: this.groupId,
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

    // 退出
    goBack() {
      // 清除本地存储。跳回聊天室页面
      if (this.loginId == this.group.vedioMan) { // 发起者退出，所有人踢出去
        leaveGroupRoom({ groupId: this.groupId })
        this.videoUser.forEach(item => {
          if (this.group.vedioMan != item.id) {
            // 踢人
            this.kickoutUser(item.id)
          }
        })
      }
      closeSocket()
      this.myRoom.leaveRoom()
      this.$store.commit('SET_SHOWINDEX', 2)
    },
    // 鼠标移入显示操作项
    enters(id) {
      this.showOperation = id
      console.log('鼠标移入', id)
    },
    // 鼠标移出隐藏操作项
    leave() {
      this.showOperation = ''
      console.log('鼠标移出')
    }

  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.wrapper{
  .roomDetails{
      position: fixed;
      width: 350px;
      top: 0px;
      right: 0;
      bottom: 0px;
      border: 1px solid #dedede;
    }
  .video-wrapper {
    position: relative;
    width: calc(100vw - 350px);
    .address {
      width: 200px;
    }
    .namebox {
      border: 1px solid #dedede;
      height: 60px;
      padding-left:50px;
      padding-right:20px;
      display: flex;
      direction: row;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    .imgbox{
      width: 49px;
      height: 49px;
    }
    .video-wrapper-content {
      position: fixed;
      top: 60px;
      left: 50px;
      right: 22%;
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
      position: relative;
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
          display: block;
          font-size: 10px;
          transform: scale(0.8);
          letter-spacing: 2px;
        }
      }
      .content {
        height: calc(100% - 40px);
      }
      .operation{
        width: 100%;
        height: 100%;
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .operationItem{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img{
            width: 36px;
            height: 40px;
            margin-bottom:10px;
          }
          span{
            color:#0097FE;
            font-size: 20px;
          }
        }
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
}
</style>
