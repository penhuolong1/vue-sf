<template>
  <div class="header-wrapper">
    <div class="title">{{ title }}</div>
    <ul>
      <li :class="{'active': menuIndex == 1}" @click="selectMenu(1)">自主选择</li>
      <li :class="{'active': menuIndex == 2}" @click="selectMenu(2)">智能推荐</li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      menuIndex: 2
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    selectMenu(index) {
      this.menuIndex = index
      this.$emit('selectMenu', index)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.header-wrapper {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  .title {
    font-size: 25px;
    font-weight: bold;
    color: #212121;
  }
  ul {
    display: inline-flex;
    margin-top: 15px;
    li {
      margin-right: 40px;
      font-size: 14px;
      color: #757575;
      cursor: pointer;
      &.active {
        color: $themeColor;
      }
      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>
