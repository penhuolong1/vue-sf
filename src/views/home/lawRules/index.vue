<template>
  <div class="disputeResocurce">
    <myMenu :active-index="3" />
    <div class="header">
      <div class="search-box">
        <el-input v-model="word" placeholder="请输入关键词" />
        <el-button type="primary" :loading="isLoading" @click="search">检索</el-button>
      </div>
    </div>
    <keep-alive>
      <router-view
        ref="item"
        :is-loaing.sync="isLoading"
        @search="search"
      />
    </keep-alive>
  </div>
</template>

<script>
import myMenu from '../components/menu'
export default {
  name: 'LawRules',
  components: {
    myMenu
  },
  data() {
    return {
      word: '',
      word1: '纠纷',
      isLoading: false
    }
  },
  methods: {
    search() {
      // if (!this.word) return this.$message.warning('请输入搜索关键词！')
      this.word1 = this.word
      this.isLoading = true
      this.$refs.item.searchList(this.word1)
    }
  }
}
</script>

<style scoped lang = "scss">
  .header {
    width:100%;
    height:124px;
    line-height: 124px;
    background-image: url('../../../assets/images/header1.png');;
  }
.search-box {
  width: 880px;
  height: 50px;
  margin: 0 auto;
  text-align: center;
  .el-input{
    width: 75%;
  }
}
 .disputeResocurce {
  overflow: auto;
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: auto;
  /* background-image: url('../../assets/images/bc1.png'); */
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
    }
  }
}
</style>
