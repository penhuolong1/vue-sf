<template>
  <div class="add-case-wrapper">
    <label class="label">请求事项</label>
    <el-input v-model="input1" class="textarea" rows="4" type="textarea" />
    <label class="label">事实与理由</label>
    <el-input v-model="input1" class="textarea" rows="4" type="textarea" />
    <div class="btn-wrapper">
      <el-button @click="next(0)">上一步</el-button>
      <el-button type="primary" @click="next(2)">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      input1: ''
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    next(index) {
      this.$emit('next', index)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.label {
  display: block;
  font-size: 16px;
  color: $themeColor;
  font-weight: bold;
  margin-bottom: 5px;
}
.textarea {
  margin-bottom: 30px;
}
</style>
