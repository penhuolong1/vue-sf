<template>
  <div class="solution-number">
    <ul>
      <li v-for="(item, index) in reverseNum" :key="index">{{ item }}</li>
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
.solution-number {
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
      margin-left: 15px;
      font-size: 18px;
      background-image: linear-gradient(#136CDA, #14B5F1)
    }
  }
}
</style>
