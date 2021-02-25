<template>
  <div class="solution-percent">
    <ul>
      <li>%</li>
      <li v-for="(item, index) in reverseNum" :key="index" class="percent">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    num: {
      type: String,
      required: true
    }
  },
  data() {
    return {

    }
  },
  computed: {
    reverseNum() {
      return this.num.split('').reverse()
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
.solution-percent {
  ul {
    display: flex;
    width: 100%;
    text-align: center;
    flex-direction: row-reverse;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 40px;
      font-size: 18px;
      margin-left: 15px;
      &.percent {
        background-color: #082856;
      }
    }
  }
}
</style>
