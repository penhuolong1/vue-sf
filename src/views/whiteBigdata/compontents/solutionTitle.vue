<template>
  <div class="solution-title">
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    title: {
      type: String,
      default: '纠纷数'
    }
  },
  data() {
    return {

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
.solution-title {
  height: 60px;
  width: 100%;
  background-image: url('../../../assets/bigData/xm/left.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  line-height: 43px;
  text-align: right;
  color: #14B4F0;
  font-size: 16px;
  padding-right: 55px;
  margin-left: 33px;
  margin-top: 15px;
}
</style>
