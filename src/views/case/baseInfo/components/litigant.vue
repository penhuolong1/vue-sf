<template>
  <div class="litigant-wrapper">
    <header1 :title="'当事人信息'" :is-add="true" @add="add" />
    <el-table
      :data="tableData"
      border
      class="tab-wrapper"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
      />
      <el-table-column
        prop="caseStatus"
        label="案件地位"
      />
      <el-table-column
        prop="litigantType"
        label="当事人类型"
      />
      <el-table-column
        prop="name"
        label="姓名或单位名称"
      />
      <el-table-column
        v-if="getUserInfo.roleType == 3"
        label="联系电话"
        prop="phone"
      />
      <el-table-column
        v-else
        label="联系电话"
      >
        <template slot-scope="scope">
          <div class="phonetext" @click="call(scope.row.id,scope.row.phone,scope.row)">
            {{ scope.row.phone }}
            <i v-if="scope.row.phone" class="el-icon-view" @click.stop="lookEncryptInfo(scope.row, scope.$index)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
      />
      <el-table-column
        label="人脸识别"
      >
        <template slot-scope="scope">
          <div>
            <el-switch
              v-model="scope.row.faceInfo[0].faceCheck"
              :disabled="getUserInfo.roleType == 3"
              @change="getChangeFace(scope.row.faceInfo[0])"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <div class="opera-btn">
            <img src="@/assets/img/edit.png" @click="edit(scope.row.id, scope.row.type, scope.row.litigantId)">
            <img v-if="getTeamData.type != 2" v-permission="[1,2,4,6]" src="@/assets/img/del.png" @click="del(scope.row.id, scope.row.type)">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加当事人模态框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      :before-close="handleClose"
      @close="dialogClose"
    >
      <el-form v-show="isAdd" ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="案件地位">
              <el-select v-model="caseStatus" placeholder="请选择">
                <el-option
                  v-for="item in caseStatusData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <litigantForm v-if="caseStatus == 1 || caseStatus == 2" ref="litigantForm" :case-status="caseStatus" :litigant-id="litigantId" @saveSuccess="saveSuccess" />
      <agentForm v-if="caseStatus == 3" ref="agentForm" :lawyer-id="litigantId" :law-parent-id="lawParentId" @saveSuccess="saveSuccess" />
      <span v-if="getTeamData.type != 2" slot="footer" v-permission="[1,2,4,6]" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span></el-dialog>
    <!-- 点击电话号码模态框 -->
    <el-dialog
      :title="phoneDialogTitle"
      :visible.sync="phoneVisible"
      width="50%"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      :before-close="handleClose1"
      @close="phoneVisible = false"
    >
      <phone ref="phone" :phone-type="phoneType" :phone-nums="phoneNums" :phone-uid="phoneUid" @onChange="onChildValue" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="phoneVisible = false">关 闭</el-button>
        <el-button type="primary" :loading="subLoad" @click="saveInfo">保 存</el-button>
      </span></el-dialog>
  </div>
</template>

<script>
import header1 from './header'
import { mapGetters } from 'vuex'
import { AGENTTYPEMAP, LITIGANTTYPEMAP } from '@/utils/constVal.js'
import litigantForm from './litigantForm.vue'
import agentForm from './agentForm.vue'
import phone from './phone.vue'
import { deleteLitigant, delLawyer, faceCheck, saveCallWav, getEncryptInfo, getEncryptInfoLawyer } from '@/api/case/index'
export default {
  components: {
    header1,
    litigantForm,
    agentForm,
    phone
  },
  props: {

  },
  data() {
    return {
      tableData: [],
      lawCaseData: {},
      dialogVisible: false, // 添加当事人模态框展示
      phoneVisible: false, // 拨打电话模态框展示
      phoneNums: null, // 需要拨打的电话号码
      phoneUid: null, // 打电话的当事人id
      phoneType: null, // 电话类型，1为当事人2为代理人
      phoneDialogTitle: '拨打电话',
      dialogTitle: '添加当事人',
      subLoad: false, // 加载状态
      form: {},
      caseStatusData: [
        {
          value: '1',
          label: '申请人'
        },
        {
          value: '2',
          label: '被申请人'
        },
        {
          value: '3',
          label: '代理人'
        }
      ],
      caseStatus: null,
      litigantId: null,
      isAdd: true, // 是否是添加
      lawParentId: null,
      process: null,
      role: this.$store.state.user.userRole,
      isAnswer: '', // 是否接通
      noAnswerReason: '', // 未接通原因
      Phoneremark: '' // 电话备注
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getTeamData', 'getCaseInfo1', 'getUserInfo'])
  },
  watch: {
    getCaseInfo() {
      this.init()
    }
  },
  created() {
    console.log(this.$store.state.cases.caseInfo)
  },
  mounted() {

  },
  methods: {
    // 滑动开关
    getChangeFace(info) {
      console.log(info)
      const params = {
        goalId: info.litigantUid || info.agentUid,
        goalType: info.type,
        faceCheck: info.faceCheck
      }
      faceCheck(params).then(res => {
        if (res.state === 100) {
          this.$message.success(res.message)
        }
      })
    },
    // 模态框关闭事件
    dialogClose() {
      this.$refs.litigantForm && this.$refs.litigantForm.clearValidate()
    },
    init() {
      this.tableData = []
      this.lawCaseData = JSON.parse(JSON.stringify(this.getCaseInfo))
      this.process = this.lawCaseData.process
      this.lawCaseData.litigants.forEach((item, index) => {
        if (!item.enable) {
          return
        }
        const obj = {
          caseStatus: item.litigationStatus.name,
          litigantType: LITIGANTTYPEMAP[item.litigantType],
          name: item.litigantName,
          phone: item.litigantPhone,
          address: item.address,
          id: item.id,
          type: 1,
          faceInfo: this.getCaseInfo1.faceChecks && this.getCaseInfo1.faceChecks.filter(item1 => {
            return item1.litigantUid == item.id
          })
        }
        if (item.lawyer && item.lawyer.length >= 0) {
          item.lawyer.forEach(item1 => {
            if (item1.enable) {
              const obj = {
                caseStatus: `${item.litigantName}的代理人`,
                litigantType: AGENTTYPEMAP[item1.agentType],
                name: item1.agentName,
                phone: item1.agentMobile,
                address: item1.address,
                id: item1.id,
                type: 2,
                litigantId: item.id,
                faceInfo: this.getCaseInfo1.faceChecks && this.getCaseInfo1.faceChecks.filter(item2 => {
                  return item2.agentUid == item1.id
                })
              }
              this.tableData.push(obj)
            }
          })
        }
        this.tableData.push(obj)
      })
    },
    // 查看密文
    lookEncryptInfo(e, index) {
      const typeMap = {
        1: 'litigantPhone',
        2: 'agentMobile'
      }
      if (e.type == 1) {
        const params = {
          litigantId: e.id,
          type: typeMap[e.type]
        }
        getEncryptInfo(params).then(({ state, litigantPhone }) => {
          if (state === 100) {
            this.tableData[index].phone = litigantPhone
            console.log(this.tableData)
          }
        })
      }
      if (e.type == 2) {
        const params = {
          lawyerId: e.id,
          type: typeMap[e.type]
        }
        getEncryptInfoLawyer(params).then(({ state, agentMobile }) => {
          if (state === 100) {
            this.tableData[index].phone = agentMobile
          }
        })
      }
      // getEncryptInfoLawyer
    },
    // val 从子组件中获取到的值
    onChildValue(val) {
      this.Phoneremark = val.Phoneremark
      this.isAnswer = val.isAnswer
      this.noAnswerReason = val.noAnswerReason
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
    },
    // 关闭弹窗
    handleClose1() {
      console.log(1)
      // this.$refs.phone.clear()
      this.phoneVisible = false
    },
    // 添加
    add() {
      this.dialogVisible = true
      this.litigantId = null
      this.caseStatus = null
      this.dialogTitle = '添加当事人'
      this.isAdd = true
      this.lawParentId = null
    },
    // 提交事件
    submit() {
      if (this.caseStatus == 3) {
        this.$refs.agentForm.save()
      } else {
        this.$refs.litigantForm.save()
      }
    },
    // 保存成功
    saveSuccess() {
      this.dialogVisible = false
      this.$store.dispatch('GetCaseInfo')
    },
    // 删除当事人
    del(id, type) {
      this.$confirm('是否确认删除')
        .then(_ => {
          if (type === 1) { // 为申请人和被申请人
            this.$Message.loading({
              content: '正在删除，请稍后...',
              duration: 0
            })
            deleteLitigant({ litigantId: id }).then(res => {
              this.$Message.destroy()
              if (res.state === 100) {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'success'
                })
                this.$store.dispatch('GetCaseInfo')
              }
            })
          } else { // 为代理人
            this.$Message.loading({
              content: '正在删除，请稍后...',
              duration: 0
            })
            delLawyer({ lawyerId: id }).then(res => {
              this.$Message.destroy()
              if (res.state === 100) {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'success'
                })
                this.$store.dispatch('GetCaseInfo')
              }
            })
          }
        })
        .catch(_ => {})
    },
    // 编辑当事人
    edit(id, type, lawParentId) {
      if (type == 1) { // 当事人
        this.litigantId = id
        this.caseStatus = '1'
        this.dialogVisible = true
        this.dialogTitle = '修改当事人'
        this.isAdd = false
        this.$nextTick(() => {
          this.$refs.litigantForm.getLitigantDetail()
        })
      } else {
        this.litigantId = id
        this.caseStatus = '3'
        this.dialogVisible = true
        this.dialogTitle = '修改代理人'
        this.isAdd = false
        this.lawParentId = lawParentId
        this.$nextTick(() => {
          this.$refs.agentForm?.detailById()
        })
      }
    },
    // 打电话
    call(id, phoneNums, row) {
      console.log(id, phoneNums, row)
      this.phoneNums = parseInt(phoneNums)
      this.phoneType = row.type
      this.phoneUid = id
      this.phoneVisible = true
    },
    // 打电话保存
    saveInfo() {
      if (this.isAnswer == '') {
        this.$Message.info('请选择电话是否接通')
        this.subLoad = false
        return false
      }
      if (this.isAnswer == '未接通') {
        if (this.noAnswerReason == '') {
          this.$Message.info('请选择未接通原因')
          this.subLoad = false
          return false
        }
      }
      console.log(localStorage.getItem('codes'))
      if (localStorage.getItem('codes') == '' || localStorage.getItem('codes') == null) {
        this.$Message.info('还未拨打该当事人的电话！')
        this.subLoad = false
        return false
      }
      const recorderState = localStorage.getItem('uprecorder')
      if (recorderState == 'ing') {
        this.$Message.info('录音正在上传')
        this.subLoad = false
        return false
      }
      const pramas = {
        litigantId: localStorage.getItem('litigantId'),
        answerPhone: localStorage.getItem('phoneNums'),
        code: localStorage.getItem('codes'),
        answer: this.isAnswer == '接听' ? '1' : '0',
        noAnswerReason: this.noAnswerReason,
        remark: this.Phoneremark,
        startTime: localStorage.getItem('startTime'),
        endTime: localStorage.getItem('endTime')
      }
      this.subLoad = false
      saveCallWav(pramas).then(res => {
        console.log(res)
        if (res.state == 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.subLoad = false
          this.phoneVisible = false
        } else {
          this.subLoad = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.litigant-wrapper {
  margin-top: 10px;
  ::v-deep .el-table td,.el-table th {
    text-align: center;
  }
  ::v-deep .cell {
    text-align: center;
  }
  .tab-wrapper {
    margin-top: 10px;
  }
  .opera-btn {
    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
      &:nth-child(1) {
        margin-right: 10px;
      }
    }
  }
}
::v-deep .el-select {
  width: 100%;
}
.phonetext{
  color: #40a9ff;
  cursor: pointer;
  text-decoration: underline;
  margin:2px
}
</style>
