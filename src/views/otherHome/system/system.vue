<template>
  <div class="">
    <div class="header">
      <span
        v-for="item in itemArr"
        :key="item.index"
        :class="{isChoice:nowChoice === item.index}"
        @click="getNotice(item.index)"
      >{{ item.name }}</span>
    </div>
    <div class="body">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  name: 'System',
  data() {
    return {
      itemArr: [
        { name: '人员管理', index: 0 },
        { name: '角色权限管理', index: 1 },
        { name: '菜单限管理', index: 2 }
      ],
      nowChoice: 0
    }
  },
  computed: {

  },
  created() {
    this.$router.push({ path: '/otherHome/system/userManage' })
  },
  mounted() {
    this.$emit('update:nowChoice', '系统管理')
  },
  methods: {
    getNotice(index) {
      this.nowChoice = index
      if(index === 0) {
        this.$router.push({ path: '/otherHome/system/userManage' }) 
      } else if (index === 1) {
        this.$router.push({ path: '/otherHome/system/roleManage' })
      } else if (index === 2) {
        this.$router.push({ path: '/otherHome/system/menuManage' })
      }
      this.$nextTick(() => {

      })
    }
  }
}
</script>

<style scoped lang = "scss">
.header {
    height: 60px;
    border-bottom: 5px solid #f2f5fa;
    span{
      width: 100px;
      height: 60px;
      line-height: 60px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
  }
  .isChoice {
    border-bottom: 5px solid #007AFF;
  }
  .body{
    width: 100%;
  }
</style>
