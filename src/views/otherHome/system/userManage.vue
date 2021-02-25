<template>
  <div class="main-wrapper">
    <div class="search-box">
      <div class="img-box">
        <img src="@/assets/img/add.png" alt="" @click="add">
        <img src="@/assets/img/del.png" alt="" @click="del()">
        <el-popover
          v-model="visible"
          popper-class="roleManage-popover"
          placement="bottom"
          trigger="click"
        >
          <div class="popover">
            <p @click="getList">刷新</p>
          </div>
          <img slot="reference" src="@/assets/img/more.png" alt="">
        </el-popover>
      </div>
      <span>用户名称：</span>
      <el-input
        v-model="search.name"
        class="dossier-name"
        placeholder="用户名称"
        clearable
      />
      <el-select
        v-model="search.type"
        class="dossier-type"
        filterable
        clearable
        default-first-option
        placeholder="请选择调解机构"
      >
        <el-option
          v-for="(item,index) in mediaterData"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-button class="search-btn search" round @click="searchDossier()">搜索</el-button>
      <el-button class="search-btn clear" round @click="claearData">重置</el-button>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      class="table"
      :data="list"
      tooltip-effect="dark"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        prop="name"
        label="用户名"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="court"
        label="所属调解机构"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="roleName"
        label="角色"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="状态"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div class="select-type">
            <el-switch v-model="scope.row.isEnabled" active-text="启用" inactive-text="禁用" @change="setLoginType(scope.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        class-name="td-over"
        label="操作"
        align="center"
        style="overflow: hidden"
        width="250"
      >
        <template slot-scope="scope">
          <el-button class="btn btn-edit" round @click.stop.native="editData(scope.row)">编辑</el-button>
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
    <el-dialog
      :title="(formData.id?'编辑':'添加')+'用户'"
      align="center"
      :visible.sync="dialogVisible"
      custom-class="dialog-box"
      :modal-append-to-body="false"
    >
      <div class="form-int-1">
        <span class="form-title">用户名：</span>
        <el-input v-model="formData.name" class="form-val-1" placeholder="请输入内容" />
      </div>
      <div class="form-int-1">
        <span class="form-title">手机号：</span>
        <el-input v-model="formData.username" class="form-val-1" placeholder="请输入内容" />
      </div>
      <div class="form-int-1">
        <span class="form-title">邮箱：</span>
        <el-input v-model="formData.email" class="form-val-1" placeholder="请输入内容" />
      </div>
      <div class="form-int-1">
        <span class="form-title">性别：</span>
        <el-select v-model="formData.sex" class="form-val-1" filterable placeholder="请选择">
          <el-option
            v-for="item in sexList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </div>
      <div class="form-int-1">
        <span class="form-title">角色：</span>
        <span v-if="isOrganizationFlag">调解人员</span>
        <el-select v-if="!isOrganizationFlag" v-model="formData.roleId" class="form-val-1" multiple placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="form-int-1">
        <span class="form-title">状态：</span>
        <el-switch v-model="formData.isEnabled" active-text="启用" inactive-text="禁用" />
      </div>
      <div class="sub-box">
        <el-button @click.native="add">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchPageAdmin, editAdmin, addAdmin, deleteAdmin, selectAdmin, searchPageRole, getMediater } from '@/api/otherHome/system'
export default {
  name: 'UserManage',
  data() {
    return {
      isOrganizationFlag: false, // 登录角色是否调解机构
      organManId: '', // 调解人员id
      visible: false,
      loading: false,
      temp: '',
      totalPages: 1,
      pageNum: 1, // 当前页码
      search: {
        name: '',
        type: ''
      },
      mediaterData: [], // 调解机构数据
      roleList: [], // 角色数据
      multipleSelection: [], // 选中数据
      list: [],
      dialogVisible: false,
      formData: {
        username: '',
        name: '',
        email: '',
        sex: '男',
        roleId: [],
        isEnabled: true
      },
      sexList: [
        { name: '男' },
        { name: '女' }
      ]
    }
  },
  mounted() {
    this.getMediater()
    console.log(this.$store.state.user.userInfo.roleName)
    this.isOrganizationFlag = this.$store.state.user.userInfo.roleName == '调纷机构'
    this.getList()
    this.getRole()
  },
  methods: {
    // 获取用户
    getList() {
      if (this.loading) return
      this.visible = false
      this.loading = true
      const pageNum = this.pageNum
      searchPageAdmin({
        courtName: this.search.type,
        name: this.search.name,
        pageNum: pageNum,
        pageSize: 5
      }).then(res => {
        this.loading = false
        for (const i in res.content) {
          if (res.content[i].roleId) {
            res.content[i].roleId = res.content[i].roleId.split(',')
          } else {
            res.content[i].roleId = []
          }
        }
        this.pageNum = pageNum
        this.list = res.content
        this.totalPages = res.totalPages
      })
    },
    // 获取角色表
    getRole() {
      searchPageRole({
        pageNum: 1,
        pageSize: 999
      }).then(res => {
        this.roleList = [...res.content]
        console.log(this.roleList)
        for (const i in res.content) {
          if (res.content[i].name == '调解人员') this.organManId = res.content[i].id
        }
        console.log(this.organManId, 'organManId')
      })
    },
    //
    getArchiveNoList(val) {
      console.log(val)
    },
    // 获取调解机构
    getMediater() {
      getMediater({ pageSize: 1000 }).then(res => {
        this.mediaterData = res.content
        console.log(res, '---------')
      })
    },
    // 查询员工信息
    rowClick(item) {
      console.log(item)
      selectAdmin({ id: item.id }).then(res => {

      })
    },
    // 新增
    add() {
      this.formData = {
        username: '',
        name: '',
        email: '',
        sex: '男',
        roleId: [],
        isEnabled: true
      }
      this.dialogVisible = !this.dialogVisible
    },
    // 保存
    save() {
      const formData = { ...this.formData }
      const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!phoneReg.test(formData.username)) {
        this.$message({
          showClose: true,
          message: '手机号码格式不正确',
          type: 'error'
        })
        return
      }
      if (this.isOrganizationFlag) {
        formData.roleId = this.organManId
      } else {
        formData.roleId = this.formData.roleId.join(',')
      }
      console.log(this.isOrganizationFlag, formData.roleId, this.organManId)
      if (this.formData.id) {
        // 修改
        editAdmin(formData).then(res => {
          if (res.state == 100) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      } else {
        // 新增
        addAdmin(formData).then(res => {
          if (res.state == 100) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.getList()
            this.dialogVisible = false
          }
        })
      }
    },
    // 修改
    editData(data) {
      this.formData = data
      this.dialogVisible = !this.dialogVisible
      console.log(data)
    },
    // 改变禁用状态
    setLoginType(data) {
      const item = { ...data }
      this.formData = data.roleId.join(',')
      editAdmin(item).then(res => {
        if (res.state == 100) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.dialogVisible = false
        } else {
          this.getList()
        }
      })
    },
    // 删除
    del(item) {
      let ids = ''
      console.log(item)
      if (item) {
        ids = item.id
      } else {
        if (this.multipleSelection.length) {
          const ary = []
          for (const i in this.multipleSelection) {
            ary.push(this.multipleSelection[i].id)
          }
          ids = ary.join(',')
        } else {
          return this.$message.error('请勾选要删除的工作人员')
        }
      }
      console.log(this.multipleSelection)
      this.$confirm('此操作将删除该工作人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(res => {
        deleteAdmin({
          ids
        }).then(res => {
          if (res.state == 100) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.pageNum = 1
            this.getList()
          }
        })
      })
    },
    // 搜索
    searchDossier() {
      this.pageNum = 1
      this.getList()
    },
    // 重置
    claearData() {
      this.search = {
        name: '',
        type: ''
      }
    },
    // 选中表格数据
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 选择页码
    currentPage(res) {
      console.log(res, '选择页码')
      this.pageNum = res
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '~@/styles/variables.scss';
    .search-box {
        position: relative;
        padding: 30px 0;
    }
    .img-box {
        position: absolute;
        right: 0;
        img {
            margin-right: 20px;
            width: 40px;
            height: 40px;
            cursor: pointer;
        }
    }
    .dossier-name {
        width: 170px;
        height: 40px;
        font-size: 14px;
    }
    .dossier-name-search {
        padding: 0 12px;
        line-height: 40px;
        color: $themeColor;
        font-size: 14px;
        cursor: pointer;
    }
    .dossier-type {
        margin-left: 25px;
        width: 170px;
        height: 40px;
    }
    ::v-deep .dossier-type .el-input__inner{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .search-btn {
        padding: 0px;
        height: 35px;
        line-height: 35px;
        width: 90px;
        margin-left: 20px;
    }
    .add {
        background-color: #81F0FF;
        border-color: #81F0FF;
        color: #fff;
    }
    .clear {
        background-color: #00c3ff;
        border-color: #00c3ff;
        color: #fff;
    }
    .search {
        background-color: $themeColor;
        border-color: $themeColor;
        color: #fff;
    }
    .page-wrapper{
        margin-top: 30px;
        text-align: right;
    }
    .sub-box{
        margin-top: 50px;;
        display: flex;
        justify-content: space-around;
    }
    .td-over {
        overflow: hidden;
    }
    ::v-deep .td-over .el-input__inner {
        vertical-align: baseline;
    }
</style>
<style  lang="scss">
    @import '~@/styles/variables.scss';
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
    .form-int-1{
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        .form-title{
            display: inline-block;
            flex-shrink: 0;
            width: 90px;
        }
        .form-val-1 {
            width: 100%;
        }
        .form-val-2 {
            width: 40%;
        }
        .tip {
            margin-left: 38px;
        }
        ::v-deep .el-switch__label {
            color: #DCDFE6;
        }
        ::v-deep .is-active{
            color: #409EFF;
        }
    }
    .select-type{
        ::v-deep .el-switch__label {
            color: #DCDFE6;
        }
        ::v-deep .is-active{
            color: #409EFF;
        }
    }
    .btn {
        padding: 7px 18px!important;
    }
    .btn-edit {
        background-color: $themeColor;
        border-color: $themeColor;
        color: #fff;
    }
</style>
