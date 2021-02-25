<template>
  <div class="app-container">
    <!-- <el-button icon="el-icon-plus" type="primary" plain @click="handleAddRole">新增角色</el-button> -->

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrapper">
      <el-pagination
        background
        :current-page.sync="pageNum"
        layout="prev, pager, next"
        :page-count="totalPages"
        @current-change="currentPage"
      />
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改角色':'新增角色'" append-to-body>
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          {{ role.name }}
        </el-form-item>
        <el-form-item label="角色描述">
          {{ role.description }}
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            ref="treeList"
            :data="treeList"
            show-checkbox
            node-key="id"
            :check-strictly="true"
            :default-checked-keys="checkedKeys"
            :highlight-current="true"
            :filter-node-method="filterNode"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveMenu">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchPageRole, getMenuTree, selectRole, editRole } from '@/api/otherHome/system'
export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      role: {
        name: '',
        description: ''
      },
      routes: [],
      dialogType: 'new',
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedKeys: [], // 权限菜单选中
      editItem: {}, // 当前修改的item
      totalPages: 1,
      pageNum: 1 // 当前页码
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {

  },
  mounted() {
    this.searchPageRole()
    this.getTree()
  },
  methods: {
    // 选择页码
    currentPage(res) {
      console.log(res, '选择页码')
      this.pageNum = res
      this.searchPageRole()
    },
    // 获取角色
    async searchPageRole() {
      const params = {
        pageNum: this.pageNum,
        pageSize: 5
      }
      const res = await searchPageRole(params)
      this.rolesList = res.content
      this.pageNum = res.pageNumber
      this.totalPages = res.totalPages
    },
    // 新增角色
    handleAddRole() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 树图接口
    getTree() {
      getMenuTree().then(res => {
        this.treeList = res.data
      })
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 修改角色权限
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role.name = scope.row.name
      this.role.description = scope.row.description
      selectRole({ id: scope.row.id }).then(res => {
        this.editItem = res.data
        if (res.menuId) {
          this.checkedKeys = res.menuId.split(',')
        } else {
          this.checkedKeys = []
        }
        this.treeList = [...this.treeList]
      })
    },
    // 提交角色修改权限
    saveMenu() {
      const checkAry = this.$refs.treeList.getCheckedNodes(false, true)// 包含半选节点
      console.log(checkAry)
      const checkAryTemp = []
      for (const i in checkAry) {
        checkAryTemp.push(checkAry[i].id)
      }
      const data = {
        name: this.editItem.name,
        description: this.editItem.description,
        id: this.editItem.id,
        type: this.editItem.type,
        create_date: this.editItem.create_date,
        menuIds: checkAryTemp.join(',')
      }
      editRole(data).then(res => {
        if (res.state == 100) {
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding:30px 30px;
  .permission-tree {
    margin-bottom: 30px;
  }
  .page-wrapper{
        margin-top: 30px;
        text-align: right;
    }
}
</style>
