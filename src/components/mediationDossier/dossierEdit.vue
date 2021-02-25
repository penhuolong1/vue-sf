<template>
  <div v-loading="loading">
    <div v-if="getUserInfo.roleType != 3" class="img-box">
      <el-tooltip v-if="isupload" effect="dark" content="删除文书" placement="top" :hide-after="1500">
        <img v-show="(getTeamData.caseFlag || getTeamData.type == 1) && !editFlag && [1,13,16].indexOf(showAction) == -1 && myResultTypeFlag" src="@/assets/icon/del.png" alt="" @click="del">
      </el-tooltip>
      <el-tooltip effect="dark" content="下载文书" placement="top" :hide-after="1500">
        <img v-show="onceDataFlag && !editFlag && [13,16].indexOf(showAction) == -1 && myResultTypeFlag" class="file-img" src="@/assets/icon/down.png" alt="" @click="downBook">
      </el-tooltip>
      <el-tooltip effect="dark" content="生成文书" placement="top" :hide-after="1500">
        <img v-show="(getTeamData.caseFlag || getTeamData.type == 1) && isShowAdd && !editFlag && myResultTypeFlag" class="file-img" src="@/assets/icon/save.png" alt="" @click="editData">
      </el-tooltip>
      <el-tooltip v-if="(getTeamData.caseFlag || getTeamData.type == 1)" effect="dark" :content="showAction==13 ? '上传文书(仅支持PDF文件)':'生成文书'" placement="top" :hide-after="1500">
        <img v-show="(isShowAdd && editFlag) || (showAction == 13 && $store.state.user.userInfo.roleType == 4)" class="file-img" src="@/assets/icon/sure.png" alt="" @click="createBook">
        <img v-show="(isShowAdd && editFlag) || (showAction != 13 && showAction != 20 && showAction != 21 && $store.state.user.userInfo.roleType == 4)" class="file-img" src="@/assets/icon/sure.png" alt="" @click="createBook">
      </el-tooltip>
      <el-tooltip effect="dark" content="返回" placement="top" :hide-after="1500">
        <img v-show="editFlag" class="file-img" src="@/assets/icon/back.png" alt="" @click="backEdit">
      </el-tooltip>
      <el-tooltip v-if="isupload && showAction!=18" effect="dark" :content="'上传文件'" placement="top" :hide-after="1500">
        <img v-show="showAction != 17 && showAction != 8 && showAction != 16 && showAction != 1" class="file-img" src="@/assets/icon/upload.png" alt="" @click="uploadFile2">
      </el-tooltip>
      <el-tooltip v-if="(getTeamData.caseFlag || getTeamData.type == 1)" effect="dark" :content="'上传文书'" placement="top" :hide-after="1500">
        <img v-show="showAction == 17" class="file-img" src="@/assets/icon/save.png" alt="" @click="uploadFile">
      </el-tooltip>
      <el-tooltip v-if="showAction != 18 && showAction != 1" effect="dark" :content="'电子送达'" placement="top" :hide-after="1500">
        <div class="file-img send-msg" @click="serviceSubmit">
          <i class="el-icon-chat-line-round" />
        </div>
      </el-tooltip>
      <input ref="file1" type="file" style="display:none;" @change="getFile1($event)">
      <input ref="file2" type="file" style="display:none;" accept=".pdf,.doc,.docx" @change="getFile2($event)">
    </div>
    <div class="view-action-btn" />
    <input v-if="getUserInfo.roleType != 3" ref="file" type="file" style="display:none;" @change="getFile($event)">
    <bookTable v-show="!editFlag && showAction != 1" ref="bookTable" :show-action="showAction" :cover-data="coverData" :edit-flag="editFlag" @isOnce="isOnce" />
    <dossierCover v-show="showAction == 1" ref="dossierCover" @done="getTableByCaseId" />
    <!-- && showAction != 13 -->
    <div v-show="editFlag">
      <application v-show="showAction == 3" ref="application1" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" />  <!-- 调解申请书  -->
      <revokeBook v-show="showAction == 24" ref="revokeBook" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 撤诉申请书  -->
      <registerForm v-show="showAction == 4" ref="registerForm" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 调解受理登记表  -->
      <commissionBook v-show="showAction == 5" ref="commissionBook" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 授权委托书 -->
      <informBook v-show="showAction == 6" ref="informBook" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 调解当事人权利义务告知书 -->
      <mediationRecord v-show="showAction == 7" ref="mediationRecord1" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 调解调查记录 -->
      <mediationRecord v-show="showAction == 9" ref="mediationRecord2" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 调解记录 -->
      <agreement v-show="showAction == 10" ref="agreement" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 调解协议书 -->
      <returnVisit v-show="showAction == 11" ref="returnVisit" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 调解回访记录 -->
      <judicialBook v-show="showAction == 12" ref="judicialBook" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> <!-- 司法确认申请书 -->
      <!-- <situationDescription v-show="showAction == 14" ref="situationDescription" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" /> -->
      <mediationStatusTable v-show="showAction == 25" ref="mediationStatusTable" :show-action="actionData" :cover-data="coverData" :edit-flag="editFlag" />
    </div>
    <el-dialog
      title="自定义签名"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true"
    >
      <div class="content">
        <el-checkbox v-model="isCustomSign">是否需要自定义签名</el-checkbox>
        <el-select v-if="isCustomSign" v-model="litigants" multiple style="width: 100%;marginTop: 15px;" placeholder="请选择需要签署该份文书的参与人">
          <el-option
            v-for="item in litigantList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="customSignUpload">确 定</el-button>
      </span>
    </el-dialog>
    <serviceModal ref="serviceModal" />
  </div>
</template>

<script>
import {
  addMediateFile,
  createPetitionFile,
  //   listDirType,
  //   detailDirType,
  createRegisterFile,
  createEntrustFile,
  createNotifyFile,
  createExamineFile,
  createMediateRecord,
  createReturnVisit,
  createProtocolFile,
  createTableExplain,
  createJudicialFile,
  uploadCivilRuling,
  saveCivilRuling,
  listSqCaseNo,
  getTableByCaseId,
  uploadCaseEnd,
  createRevokeBook,
  uploadMediateFiles,
  stopMediateFile,
  proofOfService
} from '@/api/dossier/dossier.js'
import { saveMediateFile } from '@/api/case/index.js'
import { formatDate } from '@/lib/date'
import application from '@/components/mediationDossier/application'// 调解申请书
import revokeBook from '@/components/mediationDossier/revokeBook'// 撤诉申请书
import registerForm from '@/components/mediationDossier/registerForm'// 登记表
import commissionBook from '@/components/mediationDossier/commissionBook'// 授权委托书
import informBook from '@/components/mediationDossier/informBook'// 调解当事人权利义务告知书
// import cardSub from '@/components/mediationDossier/cardSub'// 身份证明材料复印件
// import preview from '@/components/mediationDossier/preview'// 文书预览
import mediationRecord from '@/components/mediationDossier/mediationRecord'// 人民解纷调查记录
// import billOfMaterials from '@/components/mediationDossier/billOfMaterials'// 证据材料
import returnVisit from '@/components/mediationDossier/returnVisit'// 回访记录
import judicialBook from '@/components/mediationDossier/judicialBook'// 司法确认申请书
// import ruleBook from '@/components/mediationDossier/ruleBook'// 司法裁定书
import bookTable from '@/components/mediationDossier/bookTable'// 文书列表
import agreement from '@/components/mediationDossier/agreement'// 解纷协议书
import dossierCover from '@/components/mediationDossier/dossierCover'// 卷宗封面
import situationDescription from '@/components/mediationDossier/situationDescription'// 卷宗情况说明
import mediationStatusTable from '@/components/mediationDossier/mediationStatusTable'// 诉前案件终止调解情况表
import serviceModal from '@/components/mediationDossier/serviceModal'
import { limitFileSize } from '@/utils/tools.js'

import { mapGetters } from 'vuex'
export default {
  name: 'DossierEdit',
  components: {
    application,
    registerForm,
    informBook,
    // cardSub,
    // agentBook,
    // preview,
    mediationRecord,
    // billOfMaterials,
    returnVisit,
    judicialBook,
    // ruleBook,
    bookTable,
    agreement,
    situationDescription,
    dossierCover,
    revokeBook,
    mediationStatusTable,
    serviceModal,
    commissionBook
  },
  props: ['showAction', 'menuList'],
  data() {
    return {
      isCustomSign: false, // 是否需要自定义签名
      dialogVisible: false,
      archiveNoList: [],
      archiveNoList_type: [],
      onceDataFlag: false,
      bookUrl: '',
      loading: false,
      editCoverFlag: false, // 编辑封面
      editFlag: '', // 编辑内容
      actionData: {
        type: '',
        id: ''
      },
      litigants: [],
      litigantList: [],
      coverData: {
        id: '',
        caseId: '',
        archiveNo: '',
        name: '',
        type: '',
        year: '',
        mediateTerm: '',
        passengerTransportation: '',
        createDate: '',
        creatName: '',
        remain: '',
        mediater: ''
      },
      tempCoverData: {},
      bookid: '' // 文书id
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getCaseInfo', 'getTeamData']),
    // 卷宗类型
    dossierTypeAry() {
      return this.$store.getters.getBriefList
    },
    // 新增文书
    isShowAdd() {
      const temp = [3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 24, 25] // 需要生成的文书的类型
      return temp.indexOf(this.showAction) != -1
    },
    // 登录角色的身份权限
    myResultTypeFlag() {
      return this.$store.state.user.userInfo.roleType != 4
    },
    isupload() {
      let flag = true
      if (this.getTeamData.type == 2) { // 假如为协同角色
        if (this.getTeamData.caseFlag) { // 如果该登陆角色还和案件有关 已与案件相关为准（如果与案件相关可以上传编辑文书）
          flag = true
        } else {
          if (this.showAction == 19) {
            flag = true
          } else {
            flag = false
          }
        }
      }
      // if (this.showAction == 21 || this.showAction == 20 || this.showAction == 13) { // 只有法院角色可以上传不予受理通知书,司法确认受理通知书,民事裁定书
      //   if (this.getUserInfo.roleType == 4) {
      //     flag = true
      //   } else {
      //     flag = false
      //   }
      // }
      return flag
    }
  },
  watch: {
    'tempCoverData.archiveNo': {
      handler(newName, oldName) {
        console.log('**************', newName)
        if (this.archiveNoList.length) {
          console.log(1111)
          for (const i in this.archiveNoList) {
            if (this.archiveNoList[i] == newName) {
              this.tempCoverData.type = this.archiveNoList_type[i]
              console.log(this.tempCoverData)
            }
          }
        }
      },
      deep: true
    }
  },
  created() {
    console.log(this.showAction)
    this.getTableByCaseId()
    this.init()
  },
  methods: {
    // 获取当事人信息
    getLitigantList() {
      this.litigants = []
      if (!this.getCaseInfo) {
        return
      }
      if (!this.getCaseInfo.litigants || this.getCaseInfo.litigants.length == 0) {
        return
      }
      this.litigantList = []
      this.getCaseInfo.litigants.forEach(item => {
        if (item.enable) {
          this.litigantList.push({
            id: item.id,
            name: item.litigantName
          })
          if (item.lawyer && item.lawyer.length > 0) {
            item.lawyer.forEach(item1 => {
              if (item1.enable) {
                this.litigantList.push({
                  id: item1.id,
                  name: item1.agentName
                })
              }
            })
          }
        }
        console.log(this.litigantList)
      })
    },
    // 点击送达按钮
    serviceSubmit() {
      this.$refs.bookTable.serviceSubmit1(this.onceDataFlag)
      // // this.$refs.serviceModal.init(this.bookid)
      // console.log(123333)
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 初始化
    init(coverData) {
      this.setAction({ type: 1, id: 1 })
      if (!coverData || !coverData.id) {
        return
      }
      this.editCoverFlag = false
      this.coverData = coverData
      console.log(this.showAction)
    },
    // 添加卷号输入模糊搜索
    getArchiveNoList(val) {
      this.tempCoverData.archiveNo = val
      console.log(this.tempCoverData.archiveNo)
      listSqCaseNo({
        sqCaseNo: val,
        pageSize: 15,
        pageNum: 1
      }).then(res => {
        this.archiveNoList = res.sqCaseNos
        this.archiveNoList_type = res.briefs
      })
    },
    // 编辑封面
    setEdit() {
      this.editCoverFlag = true
      if (this.editCoverFlag) {
        this.tempCoverData = { ...this.coverData }
      }
    },
    // 单文书Flag
    isOnce(type, id) {
      this.bookid = id
      this.onceDataFlag = type
    },
    // 文书删除
    del() {
      this.$refs.bookTable.delDatal(this.onceDataFlag)
    },
    // 单文书下载
    downBook() {
      this.$refs.bookTable.plaintiffDown()
    },
    // 返回编辑
    backEdit() {
      this.editFlag = false
    },
    // 设置活动内容
    setAction({ type, id }) {
      console.log(type + '---' + id)
      console.log(process)
      console.log(process.env)
      console.log('活动目录', type, this.loading)
      if (this.loading) return
      this.actionData = {
        type: type, // 不变
        id: id
      }
      this.editFlag = false
      this.loading = true
      this.$emit('setAction', type * 1)
      setTimeout(async() => {
        await this.$refs.bookTable.init(id, type)
        if (type == 13) {
          // this.$refs.ruleBook.init(this.actionData.id)
        }
        this.loading = false
      }, 0)
      console.log(this.showAction)
    },
    // 新增文书
    async editData() {
      if (!this.coverData.id) {
        return this.$message.error('请先填写并保存卷宗封面')
      }
      this.loading = true
      switch (this.actionData.type * 1) {
        case 3:
          await this.$refs.application1.init()
          break
        case 4:
          await this.$refs.registerForm.init()
          break
        case 5:
          await this.$refs.commissionBook.init()
          break
        case 6:
          await this.$refs.informBook.init()
          break
        case 7:
          await this.$refs.mediationRecord1.init()
          break
        case 9:
          await this.$refs.mediationRecord2.init()
          break
        case 10:
          await this.$refs.agreement.init()
          break
        case 11:
          await this.$refs.returnVisit.init()
          break
        case 12:
          await this.$refs.judicialBook.init()
          break
        case 14:
          await this.$refs.situationDescription.init()
          break
        default:
          break
      }
      this.loading = false
      this.editFlag = true
    },
    // 上传文件
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const testAry = file.name.split('.')
      if (testAry[testAry.length - 1] != 'pdf') {
        this.$message.error('仅支持上传PDF文件')
        return
      }
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      uploadCivilRuling(param).then(res => {
        if (res.state === 100) {
          this.$refs.file.value = ''
          console.log(this.coverData)
          saveCivilRuling({
            caseId: this.$route.name == 'mediationDossier' ? this.coverData.caseId : this.coverData._id,
            url: res.url
          }).then(rs => {
            if (rs.state === 100) {
              this.$message({
                showClose: true,
                message: '上传成功',
                type: 'success'
              })
              this.$store.dispatch('GetListDirType')
              this.$refs.bookTable.init()
            }
          })
        }
      })
    },
    // 生成文书
    createBook() {
      if (!this.coverData.caseId) return this.$message.error('请先填写并保存卷宗封面')
      if (this.showAction == 13) return this.$refs.file.dispatchEvent(new MouseEvent('click'))
      const crearApi = []
      crearApi[3] = { api: createPetitionFile, refs: 'application1' } // 申请书
      crearApi[4] = { api: createRegisterFile, refs: 'registerForm' } // 登记表
      crearApi[5] = { api: createEntrustFile, refs: 'commissionBook' } // 授权委托书
      crearApi[6] = { api: createNotifyFile, refs: 'informBook' } // 权力义务告知书
      crearApi[7] = { api: createExamineFile, refs: 'mediationRecord1' } // 调查记录
      crearApi[9] = { api: createMediateRecord, refs: 'mediationRecord2' } // 解纷记录
      crearApi[10] = { api: createProtocolFile, refs: 'agreement' } // 协议书
      crearApi[11] = { api: createReturnVisit, refs: 'returnVisit' } // 回访记录
      crearApi[12] = { api: createJudicialFile, refs: 'judicialBook' } // 回访记录
      crearApi[14] = { api: createTableExplain, refs: 'situationDescription' } // 卷宗情况说明
      crearApi[24] = { api: createRevokeBook, refs: 'revokeBook' } // 撤销申请书
      crearApi[25] = { api: stopMediateFile, refs: 'mediationStatusTable' } // 终止调解情况表
      crearApi[26] = { api: proofOfService, refs: 'electronicDelivery' } // 电子送达文书
      let data = {}
      switch (this.showAction * 1) {
        case 3:
          data = {
            face: this.$refs.application1.briefSituation,
            mediateRequest: this.$refs.application1.applicationItem,
            partIds: this.$refs.application1.partIds
          }
          if (!data.face) {
            this.$message.error('请输入纠纷简要情况')
            return
          }
          if (!data.mediateRequest) {
            this.$message.error('请输入当事人申请项')
            return
          }
          if (!data.partIds || data.partIds.length === 0) {
            this.$message.error('请选择当事人')
            return
          }
          break
        case 4:
          data = {
            // timeStr: this.$refs.registerForm.selectTime,
            // asideStr: this.$refs.registerForm.mediator,
            // briefId: this.coverData.id,
            // caseSource: this.$refs.registerForm.source,
            face: this.$refs.registerForm.briefSituation,
            partIds: this.$refs.registerForm.partIds
          }
          if (!data.face) {
            return this.$message.error('请输入纠纷简要情况')
          }
          if (!data.partIds || data.partIds.length === 0) {
            return this.$message.error('请选择当事人')
          }
          break
        case 5:
          data = {
            litigantId: this.$refs.commissionBook.partIds
          }
          if (!data.litigantId) {
            return this.$message.error('请选择当事人')
          }
          break
        case 6:
          data = {
            partIds: this.$refs.informBook.partIds
          }
          if (!data.partIds || data.partIds.length === 0) {
            return this.$message.error('请选择当事人')
          }
          break
        case 7:
          data = {
            examineTime: this.$refs.mediationRecord1.formData.selectTime,
            examinePlace: this.$refs.mediationRecord1.formData.address,
            participant: this.$refs.mediationRecord1.formData.joinMan,
            beExamineNames: this.$refs.mediationRecord1.formData.beMan,
            record: this.$refs.mediationRecord1.formData.briefSituation,
            beExamineIds: this.$refs.mediationRecord1.partIds
          }
          if (!data.examineTime) {
            return this.$message.error('请选择时间')
          }
          if (!data.examinePlace) {
            return this.$message.error('请输入地点')
          }
          if (!data.participant) {
            return this.$message.error('请输入参与人')
          }
          if (!data.record) {
            return this.$message.error('请输入记录')
          }
          if (!data.beExamineIds || data.beExamineIds.length === 0) {
            return this.$message.error('请选择需要签署文书的参与人')
          }
          break
        case 9:
          data = {
            mediateTime: this.$refs.mediationRecord2.formData.selectTime,
            mediateCourt: this.$refs.mediationRecord2.formData.address,
            mediateResult: this.$refs.mediationRecord2.formData.results,
            record: this.$refs.mediationRecord2.formData.briefSituation,
            partIds: this.$refs.mediationRecord2.partIds
          }
          if (!data.mediateTime) {
            return this.$message.error('请选择时间')
          }
          if (!data.mediateCourt) {
            return this.$message.error('请输入地点')
          }
          if (!data.mediateResult) {
            return this.$message.error('请选择化解结果')
          }
          if (!data.record) {
            return this.$message.error('请输入记录')
          }
          if (!data.partIds || data.partIds.length === 0) {
            return this.$message.error('请选择参与人')
          }
          break
        case 10:
          data = {
            fact: this.$refs.agreement.formData.briefSituation,
            agreement: this.$refs.agreement.formData.method,
            countStr: this.$refs.agreement.formData.asideStrNum,
            partIds: this.$refs.agreement.partIds
          }
          if (!data.fact) {
            return this.$message.error('请输入纠纷主要事实、争议事项')
          }
          if (!data.agreement) {
            return this.$message.error('请输入达成协议')
          }
          if (!data.countStr) {
            return this.$message.error('请输入协议份数')
          }
          if (!data.partIds || data.partIds.length === 0) {
            return this.$message.error('请选择需签署此份文书的参与人')
          }
          break
        case 11:
          data = {
            // protocolNo: this.$refs.returnVisit.formData.id,
            returnCause: this.$refs.returnVisit.formData.cause,
            returnTime: this.$refs.returnVisit.formData.selectTime,
            returnInfo: this.$refs.returnVisit.formData.briefSituation,
            partIds: this.$refs.returnVisit.partIds
            // litigantNames: this.$refs.returnVisit.formData.people
          }
          if (!data.returnCause) {
            return this.$message.error('请输入回访事由')
          }
          if (!data.returnTime) {
            return this.$message.error('请选择日期')
          }
          if (!data.returnInfo) {
            return this.$message.error('请输入回访情况')
          }
          if (!data.partIds || data.partIds.length === 0) {
            return this.$message.error('请选择需签署此份文书的参与人')
          }
          break
        case 12:
          data = {
            agreement: this.$refs.judicialBook.formData.agreement,
            courtId: this.$refs.judicialBook.formData.asideStrCourt,
            asideStr: `本协议一式${this.$refs.judicialBook.formData.asideStrNum}份`,
            appendix: this.$refs.judicialBook.formData.appendix,
            partIds: this.$refs.judicialBook.partIds
          }
          console.log(data)
          if (!data.agreement) {
            return this.$message.error('请输入相关协议内容')
          }
          if (!data.courtId) {
            return this.$message.error('请选择法院')
          }
          if (!data.asideStr) {
            return this.$message.error('请输入协议份数')
          }
          if (!data.appendix) {
            return this.$message.error('请输入其他内容')
          }
          if (!data.partIds || data.partIds.length === 0) {
            return this.$message.error('请选择需签署此份文书的参与人')
          }
          break
        case 14:
          data = {
            explain: this.$refs.situationDescription.briefSituation
          }
          break
        case 24:
          console.log(this.$refs.revokeBook.selectData)
          console.log(this.$refs.revokeBook.causes)
          var ary = []
          if (!this.$refs.revokeBook.causes || this.$refs.revokeBook.causes.length == 0) {
            return this.$message.error('请选择撤诉原因')
          }
          if (this.$refs.revokeBook.causes.indexOf(4) !== -1 && !this.$refs.revokeBook.other) {
            return this.$message.error('请输入其他原因')
          }
          if (!this.$refs.revokeBook.partIds || this.$refs.revokeBook.partIds.length === 0) {
            return this.$message.error('请选择需签署此份文书的参与人')
          }
          this.$refs.revokeBook.causes.sort((a, b) => { return a - b }).forEach(item => {
            const label = this.$refs.revokeBook.selectData.find(item1 => { return item1.value == item }).label
            if (item == 4) {
              ary.push(`其他(${this.$refs.revokeBook.other})`)
            } else {
              ary.push(label)
            }
          })
          data = {
            causes: ary,
            partIds: this.$refs.revokeBook.partIds
          }
          break
        case 25:
          data = this.$refs.mediationStatusTable.form
          var stopReason = this.$refs.mediationStatusTable.stopReason
          var other = this.$refs.mediationStatusTable.other
          if (data.processInfo.length == 1 && !data.processInfo[0]) {
            this.$message.error('请输入案件过程')
            return
          }
          if (!data.stopReason || data.stopReason.length == 0) {
            this.$message.error('请选择终止的原因')
            return
          }
          if (stopReason.indexOf(7) !== -1) {
            if (!other) {
              this.$message.error('请输入其他终止的原因')
              return
            }
          }
          if (data.simple === null) {
            this.$message.error('请选择繁简分流建议')
            return
          }
          if (!data.focus) {
            this.$message.error('请输入争议焦点')
            return
          }
          if (!data.startTime) {
            this.$message.error('请选择接受调解时间')
            return
          }
          if (!data.endTime) {
            this.$message.error('请选择调解终止时间')
            return
          }
          console.log(data)
          break
        default:
          break
      }
      data.caseId = this.coverData.caseId
      // for (const i in data) {
      //   if (data[i] == '' && data[i] !== false) {
      //     console.error(data, i)
      //     return this.$message.error('请检查信息完整性')
      //   }
      // }
      const item = crearApi[this.showAction]
      this.$Message.loading({
        content: '正在生成，请稍后...',
        duration: 0
      })
      item.api(data).then(res => {
        this.$Message.destroy()
        if (res.state == 100) {
          this.$message({
            message: '文书生成成功',
            type: 'success'
          })
          this.$Message.destroy()
          this.$store.dispatch('GetListDirType', data.id)
          // this.$refs[item.refs].init(this.actionData.id, this.actionData.type)
          this.backEdit()
          this.$refs.bookTable.init()
          this.$store.dispatch('GetListDirType')
          // 重置
          this.$refs.revokeBook && this.$refs.revokeBook.reset()
        }
      })
    },
    getTableByCaseId() {
      getTableByCaseId({ caseId: this.$store.state.cases.caseId }).then(res => {
        if (res.state === 100) {
          const data = res.table
          const obj = {
            archiveNo: data.archiveNo,
            createDate: data.createDate ? formatDate(new Date(data.createDate), 'yyyy-MM-dd') : '', // 立卷时间
            caseId: this.$store.state.cases.caseId,
            mediateTerm: res.mediaterTime ? formatDate(new Date(res.mediaterTime), 'yyyy-MM-dd') : '', // 解纷时间
            creatName: data.admin ? data.admin.name : '', // 立卷人
            mediater: res.mediater ? res.mediater.name : '',
            passengerTransportation: data.court ? data.court.name : '',
            type: data.type,
            name: data.name,
            depositTerm: data.depositTerm,
            remain: data.remain,
            id: data.id,
            year: data.year
          }
          this.$store.commit('SET_TABLEID', data.id)
          this.$refs.dossierCover.init(obj)
          this.init(obj)
        }
        this.$store.dispatch('GetListDirType')
      })
    },
    // 上传文件
    uploadFile2() {
      if (this.showAction == 22) {
        this.dialogVisible = true
        this.getLitigantList()
      } else {
        this.$refs.file2.value = ''
        this.$refs.file2.dispatchEvent(new MouseEvent('click'))
      }
    },
    customSignUpload() {
      this.$refs.file2.value = ''
      this.$refs.file2.dispatchEvent(new MouseEvent('click'))
      this.dialogVisible = false
    },
    getFile2(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('caseId', this.getCaseInfo.id)
      param.append('file', file) // 通过append向form对象添加数据
      if (this.showAction == 22) {
        if (this.isCustomSign) {
          param.append('type', 1)
          param.append('partIds', this.litigants)
        } else {
          param.append('type', 0)
        }
      }
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return
      }
      this.$Message.loading({
        content: '正在上传，请稍后...',
        duration: 0
      })
      uploadMediateFiles(param).then(res => {
        if (res.state === 100) {
          let upload = true
          if (this.showAction == 22) {
            if (this.isCustomSign) {
              upload = false
            } else {
              upload = true
            }
          }
          saveMediateFile({
            caseId: this.getCaseInfo.id,
            url: res.url,
            dirTypeId: this.actionData.id,
            upload: upload
          }).then(rs => {
            this.$Message.destroy()
            if (rs.state === 100) {
              this.$message({
                showClose: true,
                message: '上传成功',
                type: 'success'
              })
              this.$refs.bookTable.init()
              this.$store.dispatch('GetListDirType')
            }
          })
        } else {
          this.$Message.destroy()
        }
      }).catch(e => {
        console.log(e)
        this.$Message.destroy()
      })
    },
    // 上传结案通知书
    uploadFile() {
      this.$refs.file1.value = ''
      this.$refs.file1.dispatchEvent(new MouseEvent('click'))
    },
    // 上传结案通知书
    getFile1(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      // const testAry = file.name.split('.')
      // // if (testAry[testAry.length - 1] != 'pdf') {
      // //   this.$message.error('仅支持上传PDF文件')
      // //   return
      // // }
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      uploadCaseEnd(param).then(res => {
        if (res.state === 100) {
          saveMediateFile({
            caseId: this.coverData.caseId,
            url: res.url,
            dirTypeId: 17
          }).then(rs => {
            if (rs.state === 100) {
              this.$message({
                showClose: true,
                message: '上传成功',
                type: 'success'
              })
              this.$refs.bookTable.init()
              this.$store.dispatch('GetListDirType')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .send-msg {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    background-color: rgb(122, 194, 70);
    border-radius: 5px;
    color: #fff;
    vertical-align: bottom;
    cursor: pointer;
    margin-left: 20px;
  }
    .file-img {
      width: 40px;
      height: 40px;
    }
    .title {
        display: flex;
        font-size: 16px;
        color: #007AFF;
        font-weight: bold;
        ::v-deep .el-button {
        height: 30px;
        line-height: 30px;
        padding-top: 0px;
        padding-bottom: 0px;
        margin-left: 10px;
        &.edit {
          background-color: #1890FF;
        }
        &.save {
          background-color: #F4AA5A;
          border-color: #F4AA5A;
        }
      }
        span {
            line-height: 30px;
            color: #007AFF;
            font-weight: bold;
            img {
                margin-left: 15px;
                cursor: pointer;
            }
        }
    }
    .icon-edit {
        margin-left: 25px;
        color: #FF8A48;
        cursor: pointer;
    }
    .icon-claim {
        margin-left: 17px;
        color: rgb(36,117,254);
        cursor: pointer;
    }
    .form {
        margin-top: 33px;
        border: 1px solid #E7E8E8;
        border-bottom: none;
    }
    ::v-deep .cover .el-input__inner{
        border: none;
        height: 38px;
    }
    .item-title {
        width: 100%;
        min-height: 60px;
        height: 100%;
        border-bottom: 1px solid #E7E8E8;
        border-right: 1px solid #E7E8E8;
        line-height: 60px;
        font-weight: bold;
        text-align: center;
    }
    .item-textarea {
        width: 100%;
        // height:80px;
        word-wrap:break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    ::v-deep .cover .el-textarea__inner {
        min-height: 40px !important;
        border: none;
    }
    .item-data {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #E7E8E8;
        line-height: 60px;
        text-align: center;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #707070;
    }
    .remark {
        text-align: center;
        background-color: #f3f3f3;
    }
    .menu {
        padding: 44px 0;
        background: #FAFBFB;
        box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
             -15px 0 15px -15px rgba(0, 0, 0, 0.16);
    }
    .menu-item {
        cursor: pointer;
    }
    .menu-title {
        padding: 10px 0;
    }
    .menu-val {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .menu-val div {
        width: 20px;
        height: 20px;
        color: #fff;
        background: #23EAA4;
        text-align: center;
    }
    .action {
        background: rgb(200,230,254);
    }
    .view-action {
        // padding: 30px 0;
        background: #fff;
        box-shadow:15px 0 15px -15px rgba(0, 0, 0, 0.16),
             -15px 0 15px -15px rgba(0, 0, 0, 0.16);
    }
    .operation {
        position: relative;
        padding-top: 30px;
    }
    .operation p {
        margin-bottom: 25px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 5px;
        cursor: pointer;
    }
    .operation-bule {
        border: 1px solid #0093FF;
        color: #0093FF;
    }
    .operation-yellow {
        border: 1px solid #FEC500;
        color: #FEC500;
    }
    .view-action-btn {
        padding: 10px;
    }
    .img-box {
      margin-top: 20px;
    }
    .img-box img{
        margin-left: 20px;
        cursor: pointer;
    }
    .send-msg {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      background-color: rgb(122, 194, 70);
      border-radius: 5px;
      color: #fff;
      vertical-align: bottom;
      cursor: pointer;
      margin-left: 20px;
    }
</style>
