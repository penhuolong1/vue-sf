<template>
  <div class="header1-wrapper">
    <span>{{ title }}</span>
    <div v-if="getTeamData.type != 2 && !noBtn" v-permission="[1,2,4,6]" class="btn-wrapper">
      <el-button v-show="!isEdit && !isAdd" type="primary" class="edit" @click="edit">编辑</el-button>
      <el-button v-show="isAdd" type="primary" class="edit" @click="add">添加</el-button>
      <el-button v-show="isEdit && !isAdd" type="primary" class="save" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    title: {
      type: String,
      default: ''
    },
    isEdit: { // 是否是编辑状态
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    noBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      process: null,
      role: this.$store.state.user.userRole
    }
  },
  computed: {
    ...mapGetters(['getTeamData'])
  },
  watch: {
    '$store.state.cases.caseInfo': {
      deep: true,
      handler: function(newValue) {
        this.process = newValue.process
        console.log('监听process')
        console.log(this.process)
      }
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    edit() {
      this.$emit('update:isEdit', true)
    },
    save() {
      this.$emit('save')
    },
    add() {
      this.$emit('add')
    }
  }
}
</script>

<style scoped lang="scss">
.header1-wrapper {
  height: 35px;
  line-height: 35px;
  span {
    color: #007AFF;
    font-weight: bold;
    font-size: 16px;
  }
  .btn-wrapper {
    display: inline-block;
    padding-left: 20px;
  }
  ::v-deep .el-button {
    height: 30px;
    line-height: 30px;
    padding-top: 0px;
    padding-bottom: 0px;
    &.edit {
      background-color: #1890FF;
      border-color: #1890FF;
    }
    &.save {
      background-color: #F4AA5A;
      border-color: #F4AA5A;
    }
  }
}
</style>
