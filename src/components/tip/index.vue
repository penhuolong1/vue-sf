<template>
  <div class="tip"><i>*</i>{{ text }}</div>
</template>

<script>
export default {
  components: {

  },
  props: {
    text: {
      type: String,
      default: null
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
.tip {
  font-size: 13px;
  line-height: 1.5;
  color: #A6AAB8;
  i {
    color: red;
    margin-right: 5px;
  }
}
</style>
