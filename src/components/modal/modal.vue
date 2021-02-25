<template>
  <div>
    <el-dialog
      :visible.sync="modalVisible"
      :modal-append-to-body="true"
      class="my-modal"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <div class="header">
        <span>{{ title }}</span>
        <div class="image-wrapper">
          <img
            v-show="isSubmit"
            src="@/assets/img/submit.png"
            @click="submit"
          >
          <img
            src="@/assets/img/back.png"
            @click="changeModalVisible"
          >
        </div>
      </div>
      <div class="content">
        <slot />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    modalVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    isSubmit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    submit() {
      this.$emit('submitModal')
    },
    changeModalVisible() {
      this.$emit('changeModalVisible')
    },
    handleClose() {
      this.$emit('changeModalVisible')
    }
  }
}
</script>

<style scoped lang="scss">
.my-modal {
 ::v-deep .el-dialog__body {
    padding: 30px 50px;
  }
 ::v-deep .el-dialog__header {
    display: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    span {
      font-size: 20px;
      color: #464a53;
      font-weight: bold;
    }
    .image-wrapper {
      img {
        width: 32px;
        height: 32px;
        cursor: pointer;
        &:first-child {
          margin-right: 15px;
        }
      }
    }
  }
  .content {
    margin-top: 20px;
  }
}
</style>
