<template>
  <div
    v-if="url"
    class="iframe-wrapper"
  >
    <iframe
      ref="iframe"
      :src="iframeUrl"
    />
    <div
      v-if="isShowBig"
      class="show-img"
      @click="showUrl()"
    />
  </div>
</template>

<script>
import { OFFICE365RUL, OFFICE365ID, SERVICEURL } from '@/utils/constVal.js'
export default {
  components: {},
  props: {
    url: null, // iframe里面要显示的地址
    width: null,
    height: null,
    isShowBig: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      iframeUrl: `${OFFICE365RUL}?i=${OFFICE365ID}&ssl=1&furl=${SERVICEURL}${this.url}`
    }
  },
  created() {},
  mounted() {
    const ifm = this.$refs.iframe
    ifm.height = document.documentElement.clientHeight
    ifm.width = document.documentElement.clientWidth
    const x = this.width / ifm.width
    const y = this.height / ifm.height
    ifm.style.transformOrigin = `0 0`
    ifm.style.transform = `scale(${x},${y})`
  },
  methods: {
    showUrl() {
      window.open(this.iframeUrl)
    }
  }
}
</script>

<style scoped lang="scss">
.iframe-wrapper {
  position: relative;
  height: 100%;
  .show-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    cursor: pointer;
  }
}
</style>
