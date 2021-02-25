<template>
  <div class="main-wrapper">
    <div class="header mb-30">
      <div class="text">菜单权限管理</div>
    </div>
    <div class="img-box">
      <img src="@/assets/img/add.png" alt="" @click="add">
      <img src="@/assets/img/del.png" alt="" @click="del">
      <el-popover
        v-model="visible"
        popper-class="roleManage-popover"
        placement="bottom"
        trigger="click"
      >
        <div>
          <p @click="getTree">刷新</p>
          <p @click="openAll">展开所有</p>
        </div>
        <img slot="reference" src="@/assets/img/more.png" alt="">
      </el-popover>
    </div>
    <el-row class="form" type="flex">
      <el-col :span="8">
        <div v-loading="loading" class="tree-box">
          <div class="tree-title">
            <div style="width:112px;flex-shrink: 0; display: flex;align-items: center;">
              <img src="@/assets/img/info.png" alt="">
              <span>当前选择编辑</span>
            </div>
            <span style="color:#2475FE;width:100%">{{ treePath }}</span>
            <span style="width:30px;flex-shrink: 0;color:#2475FE;cursor: pointer;">取消</span>
          </div>
          <el-input
            v-model="searchTree"
            class="search-input"
            placeholder="请输入搜索内容"
            clearable
          />
          <el-tree
            ref="treeList"
            :data="treeList"
            show-checkbox
            node-key="id"
            :highlight-current="true"
            :filter-node-method="filterNode"
            :default-expand-all="isOpenAll"
            check-strictly
            :default-expanded-keys="expandedKeys"
            :props="defaultProps"
            @node-click="nodeClick"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </div>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="10">
        <menuForm :form-data="formData" :all-label="allLabel" />
      </el-col>
      <el-col :span="5">
        <div style="height:55px" />
        <el-button class="form-btn" style="background:#2475FE" type="primary" @click="editSave">修改并保存</el-button>
        <br>
        <el-button class="form-btn form-clear" plain @click="editClear">重置</el-button>
      </el-col>
    </el-row>
    <el-dialog
      title="添加路径"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <menuForm :form-data="addData" :all-label="allLabel" />
      <div class="sub-box">
        <el-button @click.native="add">取消</el-button>
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree, editMenu, addMenu, deleteMenu, selectMenu } from '@/api/otherHome/menu.js'
import menuForm from '@/components/otherHome/system/menuForm'// 表单
export default {
  name: 'MenuManage',
  components: {
    menuForm
  },
  data() {
    return {
      isOpenAll: false,
      visible: false,
      loading: false,
      expandedKeys: [], // 展开的节点
      editId: '',
      dialogVisible: false,
      isEnable: true,
      treePath: '',
      searchTree: '',
      formData: {
        parentId: '',
        title: '',
        url: '',
        path: '',
        icon: '',
        component: '',
        type: 0,
        menuName: '',
        perms: '',
        orderNum: ''
      },
      addData: {
        parentId: '',
        title: '',
        url: '',
        path: '',
        icon: '',
        component: '',
        type: 0,
        menuName: '',
        perms: '',
        orderNum: ''
      },
      treeList: [],
      allLabel: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    searchTree(val) {
      this.$refs.treeList.filter(val)
    },
    dialogVisible() {
      this.setParent()
    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    // 展开
    nodeExpand(item) {
      this.expandedKeys.push(item.id)
    },
    // 展开全部节点
    openAll() {
      this.isOpenAll = true
      this.treeList = [...this.treeList]
      this.$nextTick(() => {
        this.isOpenAll = false
      })
    },
    // 收起
    nodeCollapse(item) {
      if (this.expandedKeys.indexOf(item.id) != -1) {
        this.expandedKeys.splice(this.expandedKeys.indexOf(item.id), 1)
      }
    },
    // 清空
    editClear() {
      const temp = this.formData.type
      this.formData = {
        parentId: '',
        path: '',
        title: '',
        url: '',
        icon: '',
        component: '',
        type: temp,
        menuName: '',
        perms: '',
        orderNum: ''
      }
    },
    // 新增
    add() {
      this.addData = {
        parentId: '',
        path: '',
        title: '',
        url: '',
        icon: '',
        component: '',
        type: 1,
        menuName: '',
        perms: '',
        orderNum: ''
      }
      this.dialogVisible = !this.dialogVisible
    },
    // 点击树状图
    nodeClick(item, node) {
      console.log(node, '***')
      const ary = this.getTreePath(node, [])
      ary.reverse()
      this.treePath = ary.join('>')
      selectMenu({
        id: item.id
      }).then(res => {
        this.editId = item.id
        this.formData = { ...res.data }
        if (node.data.children && node.data.children.length) {
          this.formData.typeFlag = true
        } else {
          this.formData.typeFlag = false
        }
        this.setParent()
      })
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 递归获取树图节点
    getTreePath(obj, ary) {
      if (obj.parent) {
        ary.push(obj.data.label)
        ary = this.getTreePath(obj.parent, ary)
      }
      return ary
    },
    // 修改
    editSave() {
      if (!this.editId) return this.$message.error('请选择修改的节点')
      const formData = { ...this.formData }
      formData.id = this.editId
      editMenu(formData).then(res => {
        if (res.state == 100) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getTree()
        }
      })
    },
    // 新增tree
    save() {
      addMenu(this.addData).then(res => {
        if (res.state == 100) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getTree()
          this.add()
        }
      })
    },
    del() {
      const ary = this.$refs.treeList.getCheckedNodes()
      const delAry = []
      for (const i in ary) {
        delAry.push(ary[i].id)
      }
      if (delAry.length == 0) {
        this.$message.error('请勾选删除的节点')
      } else {
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteMenu({
            ids: delAry.join(',')
          }).then(res => {
            if (res.state == 100) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTree()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 树图接口
    getTree() {
      this.loading = true
      this.visible = false
      getMenuTree().then(res => {
        this.loading = false
        this.treePath = ''
        this.treeList = res.data
        this.setParent()
      })
    },
    // 设置父级选项
    setParent() {
      const ary = [{
        id: '',
        label: '无'
      }]
      this.allLabel = this.getLabel(this.treeList, ary, [])
    },
    // 递归获取全部label名称
    getLabel(data, ary, pathTitle) {
      const treePath = this.treePath.split('>')
      const title = !this.dialogVisible && treePath && treePath.length ? treePath[treePath.length - 1] : ''// 当前选择的标题
      for (const i in data) {
        if ((!this.dialogVisible && data[i].id == this.formData.id) || data[i].type != 1 || treePath.indexOf(treePath) != -1) {
          // 修改节点去除相同且不为页面的label
        } else {
          ary.push({
            label: data[i].label,
            id: data[i].id
          })
        }
        // 如果当前选中的标题存在子集，不递归子集
        if (data[i].children && data[i].children.length && title != data[i].label) {
          ary = this.getLabel(data[i].children, ary)
        }
      }
      return ary
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '~@/styles/variables.scss';
    .header {
        padding-bottom: 30px;
        border-bottom: 1px solid #DDDFE1;
    }
    .img-box {
        margin-top: 30px;
        img {
            margin-right: 20px;
            width: 40px;
            height: 40px;
            cursor: pointer;
        }
    }
    .form {
        margin-top: 30px;
        justify-content: space-between;
    }
    .tree-box {
        position: relative;
        min-height: 500px;
        max-height: 800px;
        overflow-y: auto;
        background: #FCF9FC;
        box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
             -15px 0 15px -15px rgba(0, 0, 0, 0.16);
        .el-tree {
            padding: 10px;
            background: #FCF9FC;
        }
    }
    .tree-title {
        padding: 10px 20px;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        background: #F0F4F7;
        span {
            display: inline-block;
            margin-left: 10px;
            font-size: 13px;
        }
    }
    .form-btn {
        width: 100%;
        margin-bottom: 25px;
        box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
             -15px 0 15px -15px rgba(0, 0, 0, 0.16);
    }
    .form-clear {
        color: #2475FE;
        border: 1px solid #2475FE;
    }
    .sub-box {
        margin-top: 50px;;
        display: flex;
        justify-content: space-around;
    }
    ::v-deep .search-input .el-input__inner {
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #DCDFE6;
        background: #FCF9FC;
    }
</style>
<style  lang="scss">
    .roleManage-popover {
        text-align: center;
        line-height: 30px;
        background: #F0F1F2;
        cursor: pointer;
    }
    .roleManage-popover p:hover {
        background: #ccc;
    }
    .roleManage-popover .popper__arrow::after {
        border-bottom-color: #F0F1F2 !important;
    }
</style>
