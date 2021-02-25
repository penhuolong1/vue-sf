<template>
  <div class="contactCenter-wrapper">
    <div class="wrapperContent">
      <launch v-if="showIndex == 0" ref="launch" />
      <launchVideo v-if="showIndex == 1" />
      <chatRoom v-if="showIndex == 2" :go-launch="goLaunch" />
    </div>
  </div>
</template>

<script>
import launch from './launch.vue' // 发起选择联络页面
import launchVideo from './launchVideo.vue' // 联络视频页面
import chatRoom from './chatRoom.vue' // 聊天室聊天页面
import { exitGroup } from '@/utils/socket.js'
export default {
  components: {
    launch,
    launchVideo,
    chatRoom
  },
  props: {

  },
  data() {
    return {
      showIndex: this.$store.state.contract.showIndex,
      beginTime: 0,
      differTime: 0,
      loginId: this.$store.state.user.loginId
    }
  },

  // 利用计算属性
  computed: {
    getShowIndex() {
      return this.$store.state.contract.showIndex
    }
  },
  // 监听执行
  watch: {
    getShowIndex(curVal, oldVal) {
      this.showIndex = curVal
    }
  },

  created() {

  },
  mounted() {
    console.log('index', this.showIndex)
    this.beginTime = 0
    this.differTime = 0
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
  },
  destroyed() {
    this.$store.commit('SET_SHOWINDEX', 0)
    window.localStorage.removeItem('mygroupId')
    window.localStorage.removeItem('roomToken')
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.unloadHandler(e))
    window.localStorage.setItem('xiaohu2', '11111')
  },
  methods: {
    // 跳转到发起联络的配置页面
    goLaunch() {
      this.$refs.launch.launch()
    },
    beforeunloadHandler() {
      this.beginTime = new Date().getTime()
    },
    unloadHandler(e) {
      this.differTime = new Date().getTime() - this.beginTime
      // 判断是窗口关闭还是刷新
      if (this.differTime <= 5) { // 为真是关闭
        // 关闭窗口前，移除本地存储
        this.$store.commit('SET_SHOWINDEX', 0)
        window.localStorage.removeItem('mygroupId')
        window.localStorage.removeItem('roomToken')
        const params = {
          userid: this.loginId
        }
        exitGroup(params)
        window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
        window.removeEventListener('unload', e => this.unloadHandler(e))
      }
    }
  }
}
</script>
<style scoped lang="scss">
.contactCenter-wrapper{
    width: 100%;
    height: 100%;
    .wrapperContent{
        width: 100%;
        height: 100%;
    }
}
</style>
