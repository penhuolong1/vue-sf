<!-- 搜索部分按钮合集的组件 -->
<template>
  <div class="btn-wrapper">
    <el-button
      type="primary"
      round
      class="search"
      @click="search"
    >搜索</el-button>
    <el-button
      v-if="isAdd && isNeedAdd"
      type="primary"
      round
      class="add"
      @click="add"
    >添加</el-button>
    <el-button
      type="primary"
      round
      class="export"
      @click="reset"
    >重置</el-button>
  </div>
</template>
<script>
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    isCaseCenter: null // 判断是否在案件中心使用
  },
  data() {
    return {}
  },
  computed: {
    // 判断是否需要添加按钮
    isNeedAdd() {
      let flag = false
      if (this.isCaseCenter == 1) {
        // 判断是否是在案件中心使用
        if (this.$store.state.user.userRole == 2) {
          // 判断是否为解纷员 如果为解纷员不能添加案件
          flag = false
        } else {
          flag = true
        }
      } else {
        flag = true
      }
      return flag
    }
  },
  created() {},
  mounted() {},
  methods: {
    search() {
      this.$emit('search')
    },
    add() {
      this.$emit('add')
    },
    reset() {
      this.$emit('reset')
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.btn-wrapper {
  margin-left: 50px;
  display: inline;
  .search {
    background-color: $themeColor;
  }
  .add {
    background-color: #00c3ff;
    border-color: #00c3ff;
  }
  .export {
    background-color: #81f0ff;
    border-color: #81f0ff;
  }
  .el-button {
    padding: 0px;
    height: 35px;
    line-height: 35px;
    width: 90px;
    margin: 0px;
    margin-right: 25px;
    margin-top: 20px;
  }
}
</style>
