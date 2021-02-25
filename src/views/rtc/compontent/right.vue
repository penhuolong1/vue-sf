<template>
  <div class="caseInfo-wrapper right">
    <div class="header">
      <div class="btn-item" :class="menuIndex == 1 ? 'active':''" @click="getMenu(1)">案件信息</div>
      <div class="btn-item" :class="menuIndex == 2 ? 'active':''" @click="getMenu(2)">工作区域</div>
    </div>
    <keep-alive>
      <baseInfo v-if="menuIndex == 1" />
      <workArea v-if="menuIndex == 2" @showFile="showFile" />
    </keep-alive>
  </div>
</template>

<script>
import baseInfo from './caseInfo'
import workArea from './workArea'
export default {
  components: {
    baseInfo,
    workArea
  },
  props: {

  },
  data() {
    return {
      menuIndex: 1
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    getMenu(index) {
      this.menuIndex = index
      this.$store.dispatch('GetCaseInfo')
    },
    showFile() {
      this.$emit('showFile')
    }
  }
}
</script>

<style scoped lang="scss">
.caseInfo-wrapper {
  padding: 10px 15px;
  width: 100%;
  height: 100%;
  .header {
    display: flex;
    .btn-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 45px;
      border-radius: 5px;
      cursor: pointer;
      color: #9597A6;
      &.active {
        background-color: #1B85CF;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
  .right {
    .title {
      color: #000;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
    }
    ul {
      padding-top: 15px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(218,219,230, 0.5);
      li {
        font-size: 14px;
        color: #000;
        line-height: 25px;
        position: relative;
        padding-left: 10px;
        cursor: pointer;
        &.active {
          &::before {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #4AC43A;
            position: absolute;
            left: 0px;
            top: 8.5px;
          }
        }
      }
    }
  }
</style>
