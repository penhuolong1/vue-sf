<template>
  <div>
    <div class="select-wrapper" @click="showModal" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <span v-if="!label" class="tip">请选择纠纷事由</span>
      <div v-else class="text">{{ label }}</div>
      <span>
        <i v-if="!label" class="el-select__caret el-input__icon el-icon-arrow-up" />
        <i v-if="label" class="el-select__caret el-input__icon el-icon-circle-close" @click.stop="reset" />
      </span>
    </div>
    <el-dialog
      title="纠纷事由"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-input v-model="filterText" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getBrief" />
      </el-input>

      <el-tree
        v-if="isTree"
        ref="tree"
        v-loading="loading"
        class="filter-tree"
        :data="briefData"
        show-checkbox
        node-key="id"
        :check-strictly="true"
        :default-expand-all="defaultExpandAll"
        @check-change="checkChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { briefTree } from '@/api/case/index.js'
export default {
  components: {

  },
  props: {
    value: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      label: '',
      dialogVisible: false,
      filterText: '',
      briefData: null, // 案由数据
      editCheckId: '',
      defaultExpandAll: false,
      isTree: true,
      loading: false,
      isMouseEnter: false
    }
  },
  watch: {
    name() {
      this.label = this.name
    }
  },
  created() {
  },
  mounted() {
    this.getBrief()
    this.label = this.name
  },
  methods: {
    // 鼠标移入
    mouseenter() {
      this.isMouseEnter = true
    },
    // 鼠标移出
    mouseleave() {
      this.isMouseEnter = false
    },
    // 显示模态框
    showModal() {
      this.dialogVisible = true
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys([this.value])
      }, 200)
    },
    // 获取案由
    getBrief() {
      const params = {
        name: this.filterText
      }
      if (this.filterText) {
        this.defaultExpandAll = true
      } else {
        this.defaultExpandAll = false
      }
      this.isTree = false
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.isTree = true
      }, 200)
      briefTree(params).then(res => {
        this.briefData = res.data
      })
    },
    checkChange(item, node, self) {
      if (node == true) {
        this.editCheckId = item.id
        this.$refs.tree.setCheckedKeys([item.id])
        this.label = item.label
        this.$emit('input', this.editCheckId)
      } else {
        if (this.editCheckId == item.id) {
          this.$refs.tree.setCheckedKeys([])
          this.$emit('input', '')
          this.label = ''
        }
      }
    },
    // 重置
    reset() {
      this.$emit('input', '')
      this.label = ''
    }
  }
}
</script>

<style scoped lang="scss">
.select-wrapper {
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
  cursor: pointer;
  .tip {
    color: #C0C4CC;
  }
  .text {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tip {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  position: relative;
  .el-select__caret {
    position: absolute;
    right: 5px;
    top: 2px;
    color: #C0C4CC;
    font-size: 14px;
    transition: transform .3s;
    transform: rotateZ(180deg);
    cursor: pointer;
    &.el-icon-circle-close {
      top: 0px;
    }
  }
}
.filter-tree {
  max-height: 400px;
  overflow: auto;
}
</style>
