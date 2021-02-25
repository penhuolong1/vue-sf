<template>
  <div class="content">
    <div>
      <img clsss="centerImg" :src="imgUrl" alt="">
    </div>
    <div>
      <el-button class="btn" type="primary" @click="goBack">返回聊天室</el-button>
      <el-button class="btn" type="primary" @click="launch">发起联络</el-button>
    </div>

    <el-dialog
      title="发起"
      :visible.sync="dialogVisible"
      width="1050px"
      :close-on-click-modal="false"
    >
      <div style="width:100%">
        <el-row :gutter="10">
          <el-form ref="form" :model="ruleForm" :rules="rules" label-width="110px">
            <el-row>
              <el-col :span="11">
                <el-form-item label="联络类型:" prop="type">
                  <el-select v-model="ruleForm.type" style="width: 100%;" placeholder="请选择联络类型">
                    <el-option label="聊天室(可视频)" value="聊天室(可视频)" />
                    <el-option label="视频" value="视频" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" />
              <el-col :span="11" />
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="名称:" prop="groupName">
                  <el-input v-model="ruleForm.groupName" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="2" />
              <el-col :span="11">
                <el-form-item label="事由:" prop="reason">
                  <el-input v-model="ruleForm.reason" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="人员:">
                <el-col :span="10" class="myBox" prop="mans">
                  <el-input
                    v-model="filterText"
                    prefix-icon="el-icon-search"
                    placeholder="输入关键字进行搜索"
                  />
                  <el-tabs v-model="activeName" class="myTabs" @tab-click="handleClick">
                    <el-tab-pane label="分流中心" name="0">
                      <el-tree
                        v-if="activeName == '0'"
                        ref="tree"
                        :data="center"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="centerCheck"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        :check-strictly="true"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="联动单位" name="1">
                      <el-tree
                        v-if="activeName == '1'"
                        ref="tree"
                        :data="move"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="moveCheck"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        :check-strictly="true"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="解纷组织" name="2">
                      <el-tree
                        v-if="activeName == '2'"
                        ref="tree"
                        :data="org"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="orgCheck"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        :check-strictly="true"
                      />
                    </el-tab-pane>
                    <el-tab-pane label="解纷员" name="3">
                      <el-tree
                        v-if="activeName == '3'"
                        ref="tree"
                        :data="man"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="manCheck"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        :check-strictly="true"
                      />
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
                <el-col :span="2" class="centerBtn">
                  <p class="activeBtn" @click="add"><i class="el-icon-arrow-right" /></p>
                  <p class="activeBtn" @click="del"><i class="el-icon-arrow-left" /></p>
                </el-col>
                <el-col :span="9" class="myBox">
                  <el-tree
                    ref="endTree"
                    :data="checkedArr"
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="[]"
                    :props="defaultProps"
                  />
                </el-col>
              </el-form-item>
            </el-row>

          </el-form>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroup">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addGroup, getDeptTree, addGroupRoom } from '@/api/contract/contract.js'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      imgUrl: require('@/assets/contactCenter/launch.png'),
      dialogVisible: false,
      form: {},
      ruleForm: {
        type: '',
        groupName: '',
        reason: '',
        mans: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择联络类型', trigger: 'blur' }
        ],
        groupName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
        // reason: [
        //   { required: true, message: '请输入事由', trigger: 'blur' }
        // ]
      },
      filterText: '',
      center: [], // 分流中心
      centerCheck: [],
      move: [], // 联动单位
      moveCheck: [],
      org: [], // 调解组织
      orgCheck: [],
      man: [], // 调解员
      manCheck: [],

      activeName: '0',

      checkedArr: [], // 选中数据数组

      defaultProps: {
        children: 'children',
        label: 'label'
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {

  },
  mounted() {
    console.log('launch')
  },
  methods: {
    launch() {
      this.dialogVisible = true
      getDeptTree().then(res => {
        if (res.state == 100) {
          this.center = res.center// 分流中心
          this.move = res.move // 联动单位
          this.org = res.org // 调解组织
          this.man = res.man// 调解员
          this.centerCheck = []// 分流中心
          this.moveCheck = [] // 联动单位
          this.orgCheck = [] // 调解组织
          this.manCheck = []// 调解员
        }
      })
    },
    goBack() {
      this.$store.commit('SET_SHOWINDEX', 2)
    },
    // 发起联络
    addGroup() {
      if (this.ruleForm.type == '' || this.ruleForm.type == null) {
        this.$message.error('请选择联络类型')
        return
      }
      if (this.checkedArr && this.checkedArr.length == 0) {
        this.$message.error('请选择人员')
        return
      }
      if (this.ruleForm.type == '视频' && this.checkedArr.length > 8) {
        this.$message.error('发起视频最多可选择8人')
        return
      }
      const params = {
        type: this.ruleForm.type,
        groupName: this.ruleForm.groupName,
        reason: this.ruleForm.reason,
        mans: JSON.stringify(this.checkedArr)
      }
      addGroup(params).then(res => {
        if (res.state == 100) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.centerCheck = []// 分流中心
          this.moveCheck = [] // 联动单位
          this.orgCheck = [] // 调解组织
          this.manCheck = []// 调解员
          if (this.ruleForm.type == '聊天室(可视频)') {
            this.$store.commit('SET_ID', res.data.id)
            this.$store.commit('SET_SHOWINDEX', 2)
          } else {
            addGroupRoom({ groupId: res.data.id }).then(res => {
              console.log('存储发起者')
            })
            this.$store.commit('SET_ID', res.data.id)
            this.$store.commit('SET_TOKEN', res.token.result)
            this.$store.commit('SET_RoomId', res.data.roomId)
            this.$store.commit('SET_SHOWINDEX', 1)
          }
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 搜索
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 添加
    add() {
      const CheckedNodes = this.$refs.tree.getCheckedNodes()
      // 先删除此类得选中的元素
      this.checkedArr.forEach((item, index) => {
        if (item.activeNameType == this.activeName) {
          delete this.checkedArr[index]
        }
      })
      this.checkedArr = this.checkedArr.filter(function(val) {
        return val
      })
      // 现在此类选中的元素加入数组
      for (let k = 0; k < CheckedNodes.length; k++) {
        const obj = {
          id: CheckedNodes[k].id,
          label: CheckedNodes[k].label,
          type: CheckedNodes[k].type,
          activeNameType: this.activeName
        }
        this.checkedArr.push(obj)
      }
      this.setCheck()// 设置树默认勾选项
    },
    // 删除
    del() {
      const CheckedNodes = this.$refs.endTree.getCheckedNodes()
      // 删除选中的元素
      CheckedNodes.forEach(item => {
        this.checkedArr.forEach((item1, index) => {
          if (item.id == item1.id) {
            delete this.checkedArr[index]
          }
        })
      })
      this.checkedArr = this.checkedArr.filter(function(val) {
        return val
      })
      this.setCheck()// 设置树默认勾选项
    },
    // 设置树默认勾选项
    setCheck() {
      this.centerCheck = []// 分流中心
      this.moveCheck = [] // 联动单位
      this.orgCheck = [] // 调解组织
      this.manCheck = []// 调解员
      this.checkedArr.forEach((item, index) => {
        if (item.activeNameType == '0') { // 分流中心
          this.centerCheck.push(item.id)
        } else if (item.activeNameType == '1') { // 联动单位
          this.moveCheck.push(item.id)
        } else if (item.activeNameType == '2') { // 调解组织
          this.orgCheck.push(item.id)
        } else if (item.activeNameType == '3') { // 调解员
          this.manCheck.push(item.id)
        }
      })
      switch (this.activeName) {
        case '0':
          this.$refs.tree.setCheckedKeys(this.centerCheck)
          break
        case '1':
          this.$refs.tree.setCheckedKeys(this.moveCheck)
          break
        case '2':
          this.$refs.tree.setCheckedKeys(this.orgCheck)
          break
        case '3':
          this.$refs.tree.setCheckedKeys(this.manCheck)
          break
      }
    }

  }

}
</script>

<style scoped lang="scss">
.content{
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    .centerImg{
        width: 405px;
        height: 335px;
    }
    .btn{
        width: 234px;
        height: 100px;
        border-radius: 20px;
        margin-top: 150px;
        font-size: 28px;
    }
    .el-row{
      .el-col{
        .myTabs{
          height:390px;
          overflow-y: auto;
        }
      }
      .myBox{
          border: 1px solid #dedede;
          height: 430px;
          overflow-x: auto;
          overflow-y: hidden;
        }
      .centerBtn{
          height: 430px;
          display: flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          .activeBtn{
            width: 38px;
            height: 38px;
            background-color: #0097FE;
            margin-bottom: 10px;
            cursor: pointer;
            display: flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            font-size: 22px;
            color: white;
          }
        }

    }

}
</style>
