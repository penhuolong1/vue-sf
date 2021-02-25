<template>
  <div id="app" class="app" :style="{'min-width': minWidth}">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
const mobileRoutes = ['/mobile', '/mobile/filesList']
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      minWidth: '1400px',
      isRouterAlive: true
    }
  },
  computed: {
    ...mapGetters(['getAllowBack'])
  },
  created() {
  },
  mounted() {
    if (mobileRoutes.findIndex(item => item == location.pathname) > -1) { // 如果是移动端的路由则去除最小宽度
      this.minWidth = 'auto'
    } else {
      this.minWidth = '1400px'
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  }
}
</script>
<style lang="less">
* {
  margin: 0px;
  padding: 0px;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: auto;
}
#app {
  /* height: auto !important; */
  background-color: #f1f4f7;
}
</style>
