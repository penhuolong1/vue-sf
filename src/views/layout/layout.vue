<template>
  <div
    class="app-wrapper"
    :style="{'--fz': fontSize+'px','background-image':'url('+bcimg+')'}"
  >
    <!-- <sidebar class="sidebar-container"></sidebar> -->
    <div
      class="main-container"
    >
      <my-header />
      <!-- 菜单选项卡 -->
      <!-- 视图容器 -->
      <div class="main-content" :style="{top: fontSize1}">
        <keep-alive include="CaseList">
          <router-view class="viewStyle" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from './header/'
import { mapGetters } from 'vuex'
export default {
  components: { MyHeader },
  data() {
    return {
      fontSize: '10',
      fontSize1: '',
      bcimg: require('../../assets/bc/bc.png'),
      jlCourtList: [
        '嘉莲街道警民联合人民调解委员会',
        '嘉莲派出所',
        '嘉莲司法所'
      ] // 嘉联的相关机构
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted() {
    this.adaptive()
    this.getBcImg()
  },
  methods: {
    getBcImg() {
      if (this.jlCourtList.indexOf(this.getUserInfo.courtName) != -1) {
        this.bcimg = require('../../assets/bc/jlbc.png')
      } else {
        this.bcimg = require('../../assets/bc/bc.png')
      }
    },
    adaptive() {
      // 大小比例为 1920 ：10
      this.fontSize = this.fontSize * document.body.clientWidth / 1920
      this.fontSize1 = this.fontSize * 10 + 'px'
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';
.app-wrapper {
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  overflow-y: hidden;;
  // overflow: hidden;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: #FFF;
  background-image: url('../../assets/bc/bc.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .main-container {
    width: 100%;
  }
  .main-content {
    width: 100%;
    min-height: calc(100vh - 80px);
    padding: 20px;
    position: fixed;
    top: calc(var(--fz) * 8);
    bottom: 0px;
    overflow: auto;
  }
  .viewStyle {
    /* width: 100%; */
    /* box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); */
  }
  .btnColor {
    background-color: #5585c9;
  }
}
</style>
