<template>
  <div class="add-case-wrapper">
    <div class="litigant-wrapper">
      <el-row>
        <el-col :span="6" />
        <el-col :span="18">
          <litigantForm />
        </el-col>
      </el-row>
    </div>
    <div class="btn-wrapper">
      <el-button @click="next(1)">上一步</el-button>
      <el-button type="primary" @click="next(3)">下一步</el-button>
    </div>
  </div>
</template>

<script>
import litigantForm from './evidence'
export default {
  components: {
    litigantForm
  },
  props: {

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
    next(index) {
      this.$emit('next', index)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
