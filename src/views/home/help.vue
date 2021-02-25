<template>
  <div class="disputeResocurce">
    <myMenu :active-index="4" />
    <div class="content">
      <div class="menu-left">
        <ul>
          <li v-for="(item, index) in menuData" :key="index" :class="{'active':menuIndex == index}" @click="selectMenu(index)">{{ item }}</li>
        </ul>
      </div>
      <el-card class="content-right">
        <div v-if="menuIndex == 0" class="img-wrapper" style="padding: 50px;">
          <img src="@/assets/images/content.png" style="height: 100%;">
        </div>
        <div v-if="menuIndex == 1" class="img-wrapper">
          <img src="@/assets/images/server.png" style="height: 100%;">
        </div>
        <div v-if="menuIndex == 2" class="iframe-wrapper">
          <!-- <a src="https://xmtj.olcourt.cn/ad/operate.pdf">操作手册</a> -->
          <iframe src="https://xmtj.olcourt.cn/ad/operate.pdf" class="iframe" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import myMenu from './components/menu'
export default {
  components: {
    myMenu
  },
  props: {

  },
  data() {
    return {
      menuData: ['解纷流程', '自助服务', '用户手册'],
      menuIndex: 0
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    selectMenu(index) {
      this.menuIndex = index
    }
  }
}
</script>

<style scoped lang="scss">
.disputeResocurce {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 100%;
  background-image: url('../../assets/images/bc1.png');
  background-image: 100% 100%;
  background-repeat: no-repeat;
  .iframe-wrapper {
    width: 100%;
    height: 100%;
    .iframe {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    display: flex;
    height: calc(100% - 100px);
    padding: 15px;
    padding-top: 0px;
    .menu-left {
      ul {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        li {
          background-color: #1B85CF;
          color: #fff;
          width: 70px;
          font-size: 14px;
          padding: 10px 20px;
          text-align: right;
          border-radius: 15px 0px 0px 15px;
          margin-bottom: 20px;
          cursor: pointer;
          &.active {
            background-color: #fff;
            color: #1B85CF;
            padding: 16px 20px;
            width: 100px;
          }
        }
      }
    }
    .content-right {
      flex: 1;
      width: 100%;
      height: 100%;
      ::v-deep .el-card__body {
        width: 100%;
        height: 100%;
      }
      .img-wrapper {
        width: 100%;
        height: 100%;
        .img {
          width: 100%;
          height: 90%;
        }
      }
    }
  }
}
</style>
