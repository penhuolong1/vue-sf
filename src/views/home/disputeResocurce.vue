<template>
  <div class="disputeResocurce">
    <myMenu :active-index="1" />
    <div class="content">
      <div class="menu-left">
        <ul>
          <li v-for="(item, index) in menuData" :key="index" :class="{'active':menuIndex == index}" @click="selectMenu(index)">{{ item }}</li>
        </ul>
      </div>
      <el-card class="content-right">
        <unit v-show="menuIndex == 0" />
        <court v-show="menuIndex == 1" />
        <mediator v-show="menuIndex == 2" />
      </el-card>
    </div>
  </div>
</template>

<script>
import myMenu from './components/menu'
import unit from './components/unit'
import court from './components/court'
import mediator from './components/mediator'
export default {
  components: {
    unit,
    court,
    mediator,
    myMenu
  },
  props: {

  },
  data() {
    return {
      menuData: ['联动单位', '解纷组织', '调解人员'],
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
      height: calc(100% - 50px);
      overflow: auto;
    }
  }
}
</style>
