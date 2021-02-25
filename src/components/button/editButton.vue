<template>
  <div class="edit-btn-wrapper">
    <div
      v-if="!isEditData"
      class="edit-wrapper"
    >
      <span @click="edit">
        <img
          class="edit-img"
          src="@/assets/img/edit.png"
        >
      </span>
      <span
        v-if="isNeedBack"
        @click="back"
      >返回</span>
    </div>
    <div
      v-if="isEditData"
      class="save-wrapper"
    >
      <span @click="save">
        <img
          class="save-img"
          src="@/assets/img/submit.png"
        ></span>
    </div>
    <div
      v-if="isNeedAdd"
      class="add-wrapper"
    >
      <span
        v-if="isNeedDel"
        @click="del"
      ><img
        class="del-img"
        src="@/assets/img/del.png"
      ></span>
      <span
        v-if="isShowAdd"
        @click="add"
      ><img
        class="add-img"
        src="@/assets/img/add.png"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      // 是否处于编辑状态
      type: Boolean,
      default: false
    },
    isNeedAdd: {
      // 是否需要添加按钮
      type: Boolean,
      default: false
    },
    isNeedBack: {
      // 是否需要返回按钮
      type: Boolean,
      default: false
    },
    isNeedDel: {
      // 是否需要删除按钮
      type: Boolean,
      default: true
    },
    isAddFile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEditData: false // 是否处于编辑状态
    }
  },
  computed: {
    isShowAdd() {
      let flag = false
      if (this.isAddFile) {
        if (this.isEditData) {
          flag = true
        } else {
          flag = false
        }
      } else {
        flag = true
      }
      return flag
    }
  },
  watch: {
    isEdit() {
      this.isEditData = this.isEdit
    }
  },
  created() {
    this.isEditData = this.isEdit
  },
  mounted() {},
  methods: {
    // 把编辑事件传到父组件
    edit() {
      this.isEditData = true
      this.$emit('edit')
    },
    // 把返回事件传到父组件
    back() {
      this.isEditData = false
      this.$emit('back')
    },
    // 把保存事件传到父组件
    save() {
      this.$emit('save')
    },
    add() {
      this.$emit('add')
    },
    del() {
      this.$emit('del')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.edit-btn-wrapper {
  display: inline;
  .edit-wrapper,
  .save-wrapper,
  .add-wrapper {
    display: inline;
    span {
      cursor: pointer;
      color: $themeColor;
      font-size: 14px;
      display: inline-block;
      margin-left: 20px;
    }
  }
  .edit-img,
  .del-img,
  .save-img {
    width: 30px;
    vertical-align: top;
  }
  .add-img {
    width: 30px;
    vertical-align: top;
  }
}
</style>
