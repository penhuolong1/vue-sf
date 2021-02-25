<template>
  <!-- 分流中心@tonglainhui -->
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
              <p
                class="leftTitle el-icon-caret-bottom"
                style="font-weight:700;cursor: pointer;width: 100%;text-align: left;"
                @click="getListFn"
              >{{ sfName }}</p>
              <div v-if="showList">
                <ul v-for="(item,index) in fenliuList" :key="index">
                  <li
                    :class="{active:index===isActive}"
                    @click="flFn(item.name,index)"
                  >{{ item.name }}</li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <!-- 右边头部 -->
            <div slot="header" class="clearfix">
              <span class="rightTitle" :model="ruleForm">{{ ruleForm.name }}</span>
              <el-button v-if="getUserInfo.courtId == 1" v-hasPermi="['team:center:liaison']" style="float: right; padding: 10px" type="text" class="el-icon-s-custom" @click="content()">联络</el-button>
              <!-- <el-button style="float: right; padding: 10px" type="text" class="el-icon-link">解除</el-button> -->
              <!-- 引入分流中心修改组件 -->
              <updateCenter v-if="getUserInfo.courtId == 1" :id="ruleForm.id" @success="success" />
            </div>
            <!-- 右边内容详情，与对话框代码一样 -->
            <detailCenter :rule-form="detailForm" />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listCourtByCourId,
  getCourtInfoByType,
  editCourtInfo
} from '@/api/team/team'
import { mapGetters } from 'vuex'
import updateCenter from './updateCenter'
import detailCenter from './detailCenter'
export default {
  name: 'Center',
  components: {
    updateCenter, detailCenter
  },
  data() {
    return {
      sfName: '',
      activeNames: ['1'], // 默认展开卡片
      fenliuList: '', // 分流列表
      secVal: '', // 分流单位搜索值
      ruleForm: {
        id: '', // 机构ID
        name: '', // 名字
        courtLevel: '', // 级别
        linkMen: [
          {
            manId: '', // 联络人id
            name: '', // 联络人姓名
            phone: '' // 号码
          }
        ],
        managers: [
          {
            name: '',
            phone: ''
          }
        ],
        caseManagers: [
          {
            name: '',
            phone: ''
          }
        ],
        address: '', // 地址
        fileUrl: '', // 文件路径
        mediateType: '', // 解纷类型
        orgType: '', // 组织类型
        imgPath: '', // 机构照片
        partTime: '' // 接入时间
      },
      rules: {
        name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      detailForm: null,
      isActive: '-1', // 左侧点击样式显示判断
      isActive2: '0', // 添加联系人按钮样式显示判断
      showList: false,
      courtName: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    // 获取左侧诉非中心列表
    this.getListFn()
    // 开始默认显示厦门诉讼联动中心
    // this.flFn2()
  },
  mounted() {},
  methods: {
    // 获取初始信息
    getListFn() {
      this.isActive = -1
      this.showList = !this.showList
      const params = {
        type: 0
      }
      getCourtInfoByType(params).then((res) => {
        this.fenliuList = res.data
        this.sfName = res.data[0].name
        this.ruleForm = res.data[0]// 显示厦门诉非联动中心
        this.ruleForm.linkMen = res.data[0].linkInfo && res.data[0].linkInfo.length > 0
          ? res.data[0].linkInfo
          : [
            {
              name: '',
              phone: ''
            }
          ]
        this.ruleForm.caseManagers = res.data[0].caseMediators && res.data[0].caseMediators.length > 0 ? res.data[0].caseMediators.map(item => {
          return {
            id: item.id,
            name: item.name,
            phone: item.phone
          }
        }) : [{
          name: '',
          phone: ''
        }]
        this.ruleForm.managers = res.data[0].adminMediators && res.data[0].adminMediators.length > 0 ? res.data[0].adminMediators.map(item => {
          return {
            id: item.id,
            name: item.name,
            phone: item.phone
          }
        }) : [{
          name: '',
          phone: ''
        }]
        this.detailForm = { ...this.ruleForm }
      })
    },
    // 搜索左侧诉非中心列表
    secListFn() {
      const params = {
        type: 0,
        courtName: this.secVal
      }
      getCourtInfoByType(params).then((res) => {
        this.fenliuList = res.data
      })
    },
    // 获取左侧分流单位详情数据
    flFn(name, index) {
      this.isActive = index
      this.courtName = name
      const params = {
        type: '0',
        courtName: name
      }
      getCourtInfoByType(params).then((res) => {
        this.ruleForm = res.data[0]
        this.courtId = res.data[0].id
        this.ruleForm.linkMen = res.data[0].linkInfo && res.data[0].linkInfo.length > 0
          ? res.data[0].linkInfo
          : [
            {
              name: '',
              phone: ''
            }
          ]
        this.ruleForm.caseManagers = res.data[0].caseMediators && res.data[0].caseMediators.length > 0 ? res.data[0].caseMediators.map(item => {
          return {
            id: item.id,
            name: item.name,
            phone: item.phone
          }
        }) : [{
          name: '',
          phone: ''
        }]
        this.ruleForm.managers = res.data[0].adminMediators && res.data[0].adminMediators.length > 0 ? res.data[0].adminMediators.map(item => {
          return {
            id: item.id,
            name: item.name,
            phone: item.phone
          }
        }) : [{
          name: '',
          phone: ''
        }]
      })
    },
    // 开始默认显示厦门诉讼联动中心
    // flFn2(courtName, index) {
    //   this.isActive = -1
    //   const params = {
    //     type: 0
    //   }
    //   this.showList = !this.showList
    //   getCourtInfoByType(params).then((res) => {
    //     this.ruleForm = res.data[0]
    //     this.ruleForm.linkMen = res.data[0].linkInfo || [] // 字段替换
    //   })
    // },
    // 修改成功触发
    success() {
      this.flFn(this.courtName, this.isActive)
    },
    // 联络
    content(id) {
      this.$store.commit('SET_MENUINDEX', 12)
      this.$store.commit('SET_COURTID', this.ruleForm.id)
      this.$store.commit('SET_PATH', this.$route.fullPath)
      this.$router.push({ path: '/visualization/index', query: { path: this.$route.fullPath }})
    }
  }
}
</script>

<style>
/* 修改框架卡片样式 */
.dv .el-card__header {
  height: 63px;
  padding: 13px 20px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
}
.dv  .el-card__body {
  padding: 20px;
  height: 500px;
}
.dv .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  height: 40px;
  border: 0;
}
</style>
<style scoped lang = "scss">
/* 布局样式 */
.el-row {
  margin-bottom: 0;
}
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
  background-color: #f9fafc;
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
  font-weight: 700;
  text-align: left;
  text-align: center;
}
.leftBox {
  overflow: auto;
  height: 100%;
  padding: 20px;
}
.leftBox ul li {
  list-style: none;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 16px;
  font-family: Segoe UI, Segoe UI-Regular;
  font-weight: 400;
  text-align: left;
  font-weight: 700;
}
.active {
  color: #007aff;
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
.grid-content p {
  font-size: 16px;
  font-family: Segoe UI, Segoe UI-Regular;
  font-weight: 400;
  text-align: right;
  color: #000000;
  line-height: 16px;
}
.inputTag {
  width: 60%;
  height: 30px;
  background: #ffffff;
  border: 1px solid #dadbe6;
  outline: 0;
}

</style>
