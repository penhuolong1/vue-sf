<template>
  <div class="xm-bigdata-wrapper" :style="{'background-image': 'url(' + bcImg +')'}">
    <p style="color:#fff;text-align:center;font-size:35px;top:20px;margin-top:35px;margin-left: 40px;">厦门市诉非联动数据可视化中心</p>
    <div style="width:468px;height:50px;position: fixed;top: 35px;left:50%;margin-left:-234px;z-index:1000" @click="setMenu()" />
    <div class="menu-wrapper">
      <ul>
        <li @click="turnMenu(1)">智慧研判</li>
        <li @click="turnMenu(3)">解纷资源</li>
        <li @click="turnMenu(2)">特色解纷</li>
      </ul>
      <div class="back" @click="back">返回</div>
    </div>
    <div class="content-wrapper">
      <el-row class="video-wrapper">
        <el-col :span="12" class="video-item">
          <div class="title">{{ $store.state.user.userInfo.result.name }}</div>
          <div class="video-wrapper">
            <div id="video111" class="video" />
          </div>
          <div class="footer" />
        </el-col>
        <el-col :span="12" class="video-item">
          <div class="title">{{ courtName }}</div>
          <div class="video-wrapper">
            <div id="video222" class="video" />
          </div>
          <div class="footer" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as QNRTC from 'pili-rtc-web'
import { SYS_NAME } from '@/utils/constVal'
import { getAdminInfoById } from '@/api/common/common.js'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      bcImg: require('@/assets/bigData/xm/bc.png'),
      myRTC: null,
      token: '',
      menuIndex: 0,
      tokenName: `${SYS_NAME}_token`,
      courtId: '',
      courtName: '',
      queryPath: ''
    }
  },
  created() {
    this.myRTC = new QNRTC.StreamModeSession()
    console.log(this.$route)
    this.token = this.$route.query.token ? this.$route.query.token[0] : localStorage.getItem(this.tokenName)
    localStorage.setItem(this.tokenName, this.token)
    this.queryPath = this.$route.query.queryPath
    this.rtc()
    this.courtId = this.$store.state.bigdata.courtId
  },
  mounted() {

  },
  beforeDestroy() {
    this.myRTC.leaveRoom()
    localStorage.removeItem(this.tokenName)
  },
  destroyed() {
    this.myRTC.leaveRoom()
    localStorage.removeItem(this.tokenName)
  },
  methods: {
    hideVideo() {
      this.$emit('hideVideo')
      this.myRTC.leaveRoom()
    },
    async rtc() {
      this.myRTC = new QNRTC.StreamModeSession()
      // 采集
      // 使用内置的 deviceManager 对象采集本地媒体数据
      const stream = await QNRTC.deviceManager.getLocalStream({
        video: { enabled: true },
        audio: { enabled: true }
      })
      // 页面上准备用来播放的元素，就是我们刚刚创建的
      const localVideo1 = document.getElementById('video111')
      // 拿到 stream 对象后，调用 play 就可以播放了
      // sdk 会在指定的元素下创建相应的 video/audio 标签完成播放
      // 这里第二个参数代表用 静音模式 来播放，本地预览的时候一般我们会设置成静音
      stream.play(localVideo1, true)
      await this.myRTC.joinRoomWithToken(this.token)
      const users = this.myRTC.users
      console.log('--users--')
      console.log(users)
      // 接收
      // 发布自己本地的流
      try {
        await this.myRTC.publish(stream)
        console.log('publish success!')
      } catch (e) {
        console.log('publish error!', e)
      }
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i]
        if (user.published && user.userId !== this.myRTC.userId) {
          this.subscribeVideo(user.userId)
        }
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
        this.subscribeVideo(e.userId)
      })
      this.myRTC.on('user-unpublish', async e => {
        console.log('--	有用户取消发布---')
      })
    },
    // 查看详情并订阅视频
    async subscribeVideo(userId) {
      console.log('查看并订阅视频')
      // this.videoUser.unshift(obj)
      const stream = await this.myRTC.subscribe(userId)
      this.$nextTick(() => {
        console.log('id=' + userId)
        getAdminInfoById({ adminId: userId }).then(res => {
          if (res.state === 100) {
            this.courtName = res.name
          }
        })
        const dom = document.getElementById(`video222`)
        stream.play(dom)
      })
    },
    // 点击顶部跳转
    setMenu() {
      this.$store.commit('SET_MENUINDEX', 0)
      this.$router.push('/visualization/index')
    },
    // 点击菜单跳转
    turnMenu(index) {
      this.$store.commit('SET_MENUINDEX', index)
      this.$router.push('/visualization/index')
    },
    // 返回
    back() {
      if (this.$store.state.bigdata.path) {
        this.$router.push(this.$store.state.bigdata.path)
      } else {
        this.$store.commit('SET_MENUINDEX', 0)
        this.$router.back(-1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.xm-bigdata-wrapper{
  position: fixed!important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1400px;
  min-height: 700px;
  z-index: 1;
  background-size:100% 100%;
  background-repeat:no-repeat;
  .menu-wrapper {
    position: absolute;
    background-color: transparent;
    color: white;
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    top: 85px;
    z-index: 100;
    ul {
      display: inline-flex;
      justify-content: space-between;
      width: 240px;
      li {
        cursor: pointer;
        &.active {
          color: #11A5DE;
        }
      }
    }
    .back {
      position: absolute;
      right: 20px;
      top: 0px;
      font-weight: 100;
      cursor: pointer;
    }
  }
  .center-wrapper {
    padding: 20px;
    position: relative;
    .center-wrapper-bottom {
      padding: 20px;
      position: absolute;
      bottom: 50px;
      left: 0px;
      width: 100%;
    }
  }
  .content-wrapper {
    position: fixed;
    top: 120px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    min-width: 1440px;
    z-index: 10;
  }
}
.video-wrapper {
  height: 100%;
  &>.el-col {
    height: 100%;
  }
  .video-item {
    background-color: #2d2f38;
    .title {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #999;
      color: #fff;
      margin: 0px;
      text-align: left;
      padding-left: 20px;
      font-size: 18px;
    }
    .video-wrapper {
      height: calc(100% - 120px);
      padding: 20px;
      padding-right: 10px;
      .video {
        width: 100%;
        height: 100%;
        background-color: #e2e2e2;
      }
    }
    .footer {
      height: 60px;
    }
  }
}
</style>
