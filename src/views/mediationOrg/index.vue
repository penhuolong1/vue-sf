<template>
  <div>
    <div
      v-show="!isMediationRoom"
      class="main-wrapper no-padding"
    >
      <list
        ref="list"
        @toMediationRoom="toMediationRoom"
      />
    </div>
    <mediationRoom
      v-if="isMediationRoom"
      ref="mediationRoom"
      refs="mediationRoom"
      :case-id="caseId"
      @back="back"
    />
    <!-- <div
      v-if="isMediationRoom"
      class="menu-mask"
      @click="showModal"
    /> -->
  </div>
</template>

<script>
import list from './components/list'
export default {
  components: {
    list
  },
  props: {},
  data() {
    return {
      caseId: null, // 案件id
      isMediationRoom: false, // 是否在解纷室
      isMediationResult: false // 解纷结果
    }
  },
  created() {},
  mounted() {},
  methods: {
    toMediationRoom(id) {
      this.isMediationRoom = true
      this.caseId = id
      console.log(this.$refs)
    },
    // 返回列表页
    back() {
      this.isMediationRoom = false
      this.$refs.list.search()
    },
    // 显示模态框
    showModal() {
      this.$refs.mediationRoom.back()
    }
  },
  // 离开页面触发
  beforeRouteLeave(to, form, next) {
    if (this.$refs.mediationRoom) {
      if (this.isMediationResult) {
        next()
      } else {
        this.$refs.mediationRoom.showModal()
        next(this.$route.path)
      }
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="scss">
.menu-mask {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 240px;
  z-index: 10000;
}
</style>
