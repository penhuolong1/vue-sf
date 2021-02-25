<template>
  <div class="title-wrapper">
    <ul>
      <li v-for="(item, index) in title" :key="index" :class="{'active': index == selectIndex}">{{ item }}</li>
      <li style="">{{ title2 }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    title: {
      type: Array,
      require: true
    },
    title2:""
  },
  data() {
    return {
      selectIndex: 0
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.wisdom-judgment-wrapper {
  .title-wrapper {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../../assets/bigData/xm/title.png');
    height: 36px;
    ul {
      display: flex;
      justify-content:space-between;
      li {
        &.active {
          color: #14B5F1;
        }
        line-height: 36px;
        color: #9C9FA8;
        padding: 0 20px;
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
}
</style>
