<template>
  <div class="menu-wrapper">
    <div class="menu-wrapper-left">
      <div class="suitTitle">
        <img src="@/assets/images/logo1.png" alt="">
        <b>厦门市诉非联动信息平台</b>
      </div>
      <ul class="menu-list">
        <li v-for="(item, index) in list" :key="index" :class="{'active': activeIndex== index}" @click="select(item, index)">{{ item.name }}</li>
      </ul>
    </div>
    <div class="login-wrapper">
      <register />
      <login />
    </div>
  </div>
</template>

<script>
import login from './login.vue'
import register from './register.vue'
export default {
  components: {
    login,
    register
  },
  props: {
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [
        {
          name: '首页',
          path: '/loginHome'
        },
        // {
        //   name: '智能评估',
        //   path: ''
        // },
        {
          name: '解纷资源',
          path: '/disputeResocurce'
        },
        {
          name: '案例查询',
          path: '/caseInquiry'
        },
        {
          name: '法律法规',
          path: '/lawRules'
        },
        {
          name: '帮助中心',
          path: '/help'
        }
      ]
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    select(item, index) {
      this.$router.push(item.path)
    }
  }
}
</script>

<style scoped lang="scss">
.menu-wrapper {
  background-color: #fff;
  display: flex;
  height: 80px;
  box-shadow:0px 1px 17px 1px rgba(90,90,90,0.07);
  padding: 0 30px;
  justify-content: space-between;
  .menu-wrapper-left {
    display: flex;
  }
  .suitTitle{
    font-size: 16px;
    height: 80px;
    text-align: center;
    display: flex;
    align-items: center;
    b {
      font-size: 20px;
      color: #212121;
      font-weight: bolder;
    }
    img {
      width: 50px;
      margin-right: 10px;
    }
  }
  .menu-list {
    display: flex;
    height: 80px;
    line-height: 83px;
    margin-left: 20px;
    li {
      color: #707070;
      font-size: 16px;
      margin-right: 50px;
      font-weight: bolder;
      cursor: pointer;
      position: relative;
      &.active{
        &::before {
          content: '';
          width: 40px;
          height: 5px;
          background-color: #1B85CF;
          left: 50%;
          margin-left: -20px;
          position: absolute;
          bottom: 0px;
        }
        color: #1B85CF;
      }
    }
  }
  .login-wrapper {
    float: right;
    height: 80px;
    line-height: 80px;
  }
}

</style>
