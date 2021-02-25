<template>
  <!-- 联动单位 -->
  <div class="dv">
    <el-row :gutter="10" class="row-bg">
      <!-- 左侧 -->
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <!-- 搜索 -->
            <div slot="header" class="wrapper-input">
              <input v-model="secVal" type="text" class="secInput" placeholder="请输入">
              <button class="secBtn" @click="secListFn">搜索</button>
            </div>
            <!-- 单位 -->
            <div class="leftBox">
              <el-tree v-if="elTree" ref="tree" :data="treeData" :props="props" @node-click="getNode" />
            </div>
            <!-- 引入添加联动单位组件 -->
            <addUnit @success="success" />
          </el-card>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <!-- 右边头部 -->
            <div slot="header" class="clearfix">
              <span class="rightTitle">{{ title }}</span>
              <el-button
                v-if="getUserInfo.courtId == 1"
                v-hasPermi="['team:unit:liaison']"
                style="float: right; padding: 10px"
                type="text"
                class="el-icon-s-custom"
                @click="content"
              >联络</el-button>
              <!-- <el-button
                v-hasPermi="['team:unit:del']"
                :model="ruleForm"
                style="float: right;
              padding: 10px"
                type="text"
                class="el-icon-link"
                @click="jiechu()"
              >解除</el-button> -->
              <!-- 引入编辑组件 -->
              <updateUnit v-if="elTree" :court-id="detailIds.id" :parent-court-id="detailIds.selfCourtId" :title="title" @updateSuccess="updateSuccess" />
            </div>
            <!-- 引入组件，右边内容详情，与对话框代码一样 -->
            <detailUnit v-if="elTree" :rule-form="ruleForm" />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getCourtInfoByType,
  getCourtsByCourtId,
  listCourtByCourId,
  editCourtInfo,
  treeForTeam,
  delCourt
} from '@/api/team/team'
import addUnit from './addUnit'
import updateUnit from './updateUnit'
import detailUnit from './detailUnit'
import { mapGetters } from 'vuex'
export default {
  name: 'Unit',
  components: {
    addUnit, updateUnit, detailUnit
  },
  data() {
    return {
      // 所属级别
      courtLevelArr: [
        { name: '市级', index: 1 },
        { name: '区级', index: 2 },
        { name: '街道', index: 3 }
      ],
      // 解纷类型
      disputeArr: [
        { name: '调解', index: 1 },
        { name: '仲裁', index: 2 },
        { name: '公证', index: 3 },
        { name: '行政复议', index: 4 },
        { name: '行政裁决', index: 5 }
      ],
      // 组织类型
      organizationArr: [
        { name: '法院特邀调解', index: 1 },
        { name: '人民调解', index: 2 },
        { name: '行业调解', index: 3 },
        { name: '商事调解', index: 4 },
        { name: '律师调解', index: 5 },
        { name: '行政调解', index: 6 }
      ],
      activeNames: ['1'], // 默认展开卡片
      fenliuList: '', // 分流单位
      secVal: '', // 分流单位搜索值
      ruleForm: {
        cId: '',
        id: '',
        name: '', // 名字
        courtLevel: '', // 级别
        linkMen: [
          {
            manId: '', // 联络人id
            name: '', // 联络人姓名
            phone: '' // 号码
          }
        ],
        mediators: '', // 解纷员数量
        address: '', // 地址
        fileUrl: '', // 文件路径
        mediateType: '', // 解纷类型
        orgType: '', // 组织类型
        imgPath: '', // 机构照片
        partTime: '' // 接入时间
      },
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      // 懒加载数据
      props: {
        label: 'name',
        children: 'child'
      },
      title: '',
      elTree: true,
      detailIds: {},
      courtName: '',
      isEdit: false,
      treeData: []
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    // 开始默认数据
    this.getTreeForTeam()
  },
  mounted() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 搜索列表
    secListFn() {
      this.getTreeForTeam()
    },
    // 获取联动单位数据
    getTreeForTeam() {
      treeForTeam({ courtName: this.secVal }).then(({ state, infoList }) => {
        if (state === 100) {
          const obj = {
            name: infoList[0].flowCourtName || infoList[0].courtName,
            id: infoList[0].flowCourtUid || infoList[0].courtUid
          }
          this.getNode(obj)
          let list = []
          list = infoList && infoList.length > 0 && this.getList(infoList)
          this.treeData = list
        }
      })
    },
    getList(list) {
      if (!list || list.length === 0) {
        return
      }
      return list.map(item => {
        return {
          name: item.courtName || item.flowCourtName,
          id: item.courtUid || item.flowCourtUid,
          child: this.getList(item.child)
        }
      })
    },
    // 懒加载树节点事件查询详情
    getNode({ name, id, selfCourtId }) {
      this.title = name // 绑定显示右侧标题
      this.detailIds = {
        id,
        selfCourtId
      }
      this.clickMenu(id, selfCourtId)
    },
    // 点击了右侧菜单查看详情
    clickMenu(id, parentId) {
      const params = {
        type: '1',
        courtId: id,
        parentCourtId: parentId
      }
      getCourtInfoByType(params).then((res) => {
        this.ruleForm = res.data[0]
        this.ruleForm.linkMen = res.data[0].linkInfo.length === 0 ? [{
          name: '', // 联络人姓名
          phone: '' // 号码
        }] : res.data[0].linkInfo // 字段替换
      })
    },
    // 解除机构
    jiechu() {
      this.$confirm('是否解除该联动单位?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          courtId: this.ruleForm.id
        }
        delCourt(params).then((res) => {
          if (res.state === 100) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.success()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    success() {
      this.elTree = false
      setTimeout(() => {
        this.elTree = true
      }, 500)
    },
    // 更新成功刷新数据
    updateSuccess() {
      this.isEdit = true
      const params = {
        type: '1',
        courtId: this.detailIds.id,
        parentCourtId: this.detailIds.selfCourtId
      }
      getCourtInfoByType(params).then((res) => {
        this.ruleForm = res.data[0]
        this.ruleForm.linkMen = res.data[0].linkInfo.length === 0 ? [{
          name: '', // 联络人姓名
          phone: '' // 号码
        }] : res.data[0].linkInfo // 字段替换
        this.title = res.data[0].name
      })
      this.success()
    },
    // 连接
    content() {
      this.$store.commit('SET_MENUINDEX', 12)
      this.$store.commit('SET_COURTID', this.detailIds.id)
      this.$store.commit('SET_PATH', this.$route.fullPath)
      this.$router.push({ path: '/visualization/index', query: { path: this.$route.fullPath }})
    }
  }
}
</script>

<style>
/* 修改框架部分样式 */
.dv .el-card__header {
  height: 63px;
  padding: 13px 20px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
}
.dv .el-card__body {
  padding: 0px;
  height: 550px;
}
/* 树节点 */
.dv .el-input.is-disabled .el-input__inner {
  height: 30px;
  background-color: #fff;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  border: 0;
}
.dv .el-tree-node__content {
  word-wrap: break-word;
  word-break: break-all;
  padding: 28px 0;
  display: flex;
  align-items: center;
  height: 26px;
  cursor: pointer;
  border-bottom: 1px solid #e3e9f0;
}
.dv .el-tree-node__label {
  font-size: 16px;
  font-family: Segoe UI, Segoe UI-Regular;
  font-weight: 400;
  text-align: left;
  color: #000000;
  font-weight: 700;
}
</style>
<style scoped lang = "scss">
/* 布局样式 */
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  margin: 20px 0;
}
/* 卡片样式 */
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
/* 搜索框 */
.wrapper-input {
  display: flex;
}
.secInput {
  height: 36px;
  flex: 1;
  outline: 0;
  border: none;
}
.secBtn {
  width: 55px;
  height: 36px;
  border: 0;
  color: #fff;
  outline: none;
  background: #62a1ff;
  border-radius: 4px;
  font-size: 16px;
}
/* 左边内容标题 */
.leftTitle {
  width: 144px;
  height: 22px;
  font-size: 16px;
  font-family: Segoe UI, Segoe UI-Regular;
  font-weight: 400;
  text-align: left;
  color: #007aff;
  text-align: center;
}
.leftBox {
  overflow: auto;
  width: 100%;
  height: 500px;
}
.leftBox ul li {
  list-style: none;
  padding: 15px;
}
/* 右边内容标题 */
.rightTitle {
  height: 22px;
  font-size: 16px;
  float: left;
  font-family: Segoe UI, Segoe UI-Regular;
  font-weight: 400;
  text-align: left;
  line-height: 36px;
  text-align: center;
}
/* 右边内容盒子 */
.rightBox {
  padding: 20px;
}
.rb p {
  margin: 20px 0;
}
.grid-content p {
  font-size: 16px;
  font-family: Segoe UI, Segoe UI-Regular;
  font-weight: 400;
  text-align: right;
  color: #000000;
  line-height: 16px;
}
.rbImg {
  width: 170px;
  height: 219px;
  float: right;
  border: 1px solid black;
}
</style>
