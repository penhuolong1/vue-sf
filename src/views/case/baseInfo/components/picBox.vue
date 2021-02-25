<template>
  <el-dialog
    title="扫描二维码查看案件详情"
    :visible.sync="centerDialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="30%"
    center
  >
    <el-image :src="picSrc" class="pic" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'PicBox',
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    picSrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    cancel() {
      this.$emit('update:centerDialogVisible', false)
    }
  }
}
</script>

<style scoped lang = "scss">
  .pic {
    display: block;
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
</style>
