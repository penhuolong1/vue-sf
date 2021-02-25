// 申请书
<template>
  <div style="padding:20px">
    <!-- 申请人 -->
    <!-- <div v-for="(item1,index1) in applicantInfo" :key="index1">
            <appliationForm
                    :formData="item1"
                    :index='index1'
                    :type="'applicantInfo'"
                    :editFlag="editFlag"
                    @save='saveForm'
                    @setForm="setForm">
            </appliationForm>
            <div v-for="(lawyer,inx) in item1.lawyer" :key="inx">
                <appliationForm
                        :formData="lawyer"
                        :index='index1'
                        :inx='inx'
                        :editFlag="editFlag"
                        :type="'applicantInfoLawyer'"
                        @save='saveForm'
                        @setForm="setForm">
                </appliationForm>
            </div>
        </div> -->
    <!-- 被申请人 -->
    <!-- <div v-for="(item2,index2) in respondentInfo">
            <appliationForm
                    :formData="item2"
                    :index='index2'
                    :type="'respondentInfo'"
                    :editFlag="editFlag"
                    @save='saveForm'
                    @setForm="setForm">
            </appliationForm>
            <div v-for="(lawyer,inx) in item2.lawyer" :key="inx">
                <appliationForm
                        :formData="lawyer"
                        :index='index2'
                        :inx='inx'
                        :type="'respondentInfoLawyer'"
                        :editFlag="editFlag"
                        @save='saveForm'
                        @setForm="setForm">
                </appliationForm>
            </div>
        </div> -->
    <div class="about">
      <p class="about-title">纠纷简要情况：</p>
      <div v-show="!editFlag" class="situation">{{ briefSituation }}</div>
      <el-input
        v-show="editFlag"
        v-model="briefSituation"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </div>
    <div class="about">
      <p class="about-title">当事人申请项：</p>
      <div v-show="!editFlag" class="situation">{{ applicationItem }}</div>
      <el-input
        v-show="editFlag"
        v-model="applicationItem"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </div>
    <litigant v-model="partIds" />
  </div>
</template>

<script>
import {
//   getLitigantInfo,
  addLitigant,
  addCompanyLit,
  editLitigant,
  editCompanyLit,
  deleteLitigant,
  addOrUpdateLawyer,
  delLawyer,
  returnFileParams
} from '@/api/dossier/dossier.js'
import appliationForm from '@/components/mediationDossier/appliationForm'// 申请人
import litigant from './litigant'
export default {
  name: 'Application',
  components: {
    appliationForm,
    litigant
  },
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      briefSituation: '', // 纠纷简要情况
      applicationItem: '', // 当事人申请项
      applicantInfo: [], // 申请人
      respondentInfo: [], // 被申请人
      partIds: [] // 当事人列表
    }
  },
  methods: {
    // 初始化
    init() {
      this.briefSituation = ''
      this.applicationItem = ''
      return new Promise((resolve, reject) => {
        if (this.coverData.id) {
          returnFileParams({
            mediateTableId: this.coverData.id,
            dirTypeId: this.showAction.type }
          ).then(res => {
            if (res.state == 100) {
              this.applicationItem = res.mediateRequest
              this.briefSituation = res.reason
            }
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
      // return new Promise((resolve, reject) => {
      //     if(this.coverData.caseId){
      //         getLitigantInfo({caseId:this.coverData.caseId}).then(res => {
      //             if(res.applicantInfo.length){
      //                 res.applicantInfo = this.recombination([...res.applicantInfo]);
      //                 this.applicantInfo = [...res.applicantInfo];
      //             }else{
      //                 this.applicantInfo = [{lawyer:[],litigantName:'',nation:'',sex:'', years:'',identityCard:'',phone:'',address:'',employer:'',type:0}];
      //             }
      //             if(res.respondentInfo.length){
      //                 res.respondentInfo = this.recombination([...res.respondentInfo]);
      //                 this.respondentInfo = [...res.respondentInfo];
      //             }else{
      //                 this.respondentInfo = [{lawyer:[],litigantName:'',nation:'',sex:'', years:'',identityCard:'',phone:'',address:'',employer:'',type:0}];
      //             }
      //             resolve(true)
      //         }).catch(res => {
      //             reject(true)
      //         })
      //     }else{
      //         this.applicantInfo = [{lawyer:[],litigantName:'',nation:'',sex:'', years:'',identityCard:'',phone:'',address:'',employer:'',type:0}];
      //         this.respondentInfo = [{lawyer:[],litigantName:'',nation:'',sex:'', years:'',identityCard:'',phone:'',address:'',employer:'',type:0}];
      //         this.briefSituation = '';
      //         this.applicationItem = '';
      //         resolve(true)
      //     }
      // })
    },
    // 重构数组
    recombination(ary) {
      for (const i in ary) {
        for (const j in ary[i].lawyer) {
          ary[i].lawyer[j].litigantName = ary[i].lawyer[j].agentName
          ary[i].lawyer[j].identityCard = ary[i].lawyer[j].agentIdentiCard
          ary[i].lawyer[j].phone = ary[i].lawyer[j].agentMobile
          ary[i].lawyer[j].employer = ary[i].lawyer[j].unitInfo
        }
      }
      return ary
    },
    // 保存
    saveForm(aryType, index, inx) {
      let data = {}
      if (aryType == 'applicantInfo' || aryType == 'respondentInfo') { // 当事人
        data = this[aryType][index]
        console.log(data, '***')
        if (data.type == 0) { // 自然人
          const params = {
            litigantId: data.litigantId,
            lawCaseId: this.coverData.caseId,
            name: data.litigantName,
            identityType: 1,
            identityCard: data.identityCard,
            sex: data.sex,
            nation: data.nation,
            litigantPhone: data.phone,
            address: data.address,
            employer: data.employer,
            yearsStr: data.years,
            litigationStatus: aryType == 'applicantInfo' ? 4 : 5
          }
          if (data.litigantId) { // 修改
            editLitigant(params).then(res => {
              if (res.state == 100) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.init()
              }
            })
          } else { // 添加
            addLitigant(params).then(res => {
              if (res.state == 100) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.init()
              }
            })
          }
        } else { // 法人
          const params = {
            litigantId: data.litigantId,
            lawCaseId: this.coverData.caseId,
            name: data.litigantName,
            identityType: 2,
            identityCard: data.identityCard,
            // legalManId: data.identityCard,
            legalManPhone: data.legalManPhone,
            legalManName: data.legalManName,
            litigationStatus: aryType == 'applicantInfo' ? 4 : 5,
            address: data.address,
            legalManId: data.legalManId
          }
          if (data.litigantId) { // 修改
            editCompanyLit(params).then(res => {
              if (res.state == 100) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.init()
              }
            })
          } else {
            addCompanyLit(params).then(res => {
              if (res.state == 100) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.init()
              }
            })
          }
        }
      } else {
        let temp = ''
        if (aryType == 'applicantInfoLawyer') {
          data = this.applicantInfo[index].lawyer[inx]
          temp = 'applicantInfo'
        } else {
          data = this.respondentInfo[index].lawyer[inx]
          temp = 'respondentInfo'
        }
        const params = {
          lawyerId: data.id,
          name: data.litigantName,
          litigantId: this[temp][index].litigantId,
          agentType: 1,
          sex: data.sex,
          years: data.years * 1,
          nation: data.nation,
          lawyerNum: data.lawyerNum,
          agentIdentiCard: data.identityCard,
          agentMobile: data.phone,
          address: data.address,
          unitInfo: data.employer
        }
        console.log(params, '**')
        addOrUpdateLawyer(params).then(res => {
          if (res.state == 100) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.init()
          }
        })
      }
    },

    // 增删表格
    setForm(type, aryType, index, inx) {
      if (type === 'add') {
        // 添加
        const temp = {
          lawyer: [],
          name: '',
          nation: '',
          sex: '',
          years: '',
          card: '',
          phone: '',
          address: '',
          job: '',
          type: 0
        }
        if (aryType == 'applicantInfo' || aryType == 'respondentInfo') {
          this[aryType].push(temp)
          return
        }
        if (aryType == 'applicantInfoLawyer' && this.applicantInfo[index].lawyer.length < 2) {
          this.applicantInfo[index].lawyer.push(temp)
          return
        }
        if (aryType == 'respondentInfoLawyer' && this.respondentInfo[index].lawyer.length < 2) {
          this.respondentInfo[index].lawyer.push(temp)
          return
        }
        this.$message({
          message: '最多添加2位代理人',
          type: 'warning'
        })
      } else {
        // 删除
        if ((aryType == 'applicantInfo' && this.applicantInfo.length > 1) || (aryType == 'respondentInfo' && this.respondentInfo.length > 1)) {
          if (this[aryType][index].litigantId) {
            deleteLitigant({ litigantId: this[aryType][index].litigantId }).then(res => {
              if (res.state == 100) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.init()
              }
            })
          } else {
            this.applicantInfo.splice(index, 1)
          }
          return
        }
        if (aryType == 'applicantInfoLawyer') {
          if (this.applicantInfo[index].lawyer[inx].id) {
            delLawyer({ lawyerId: this.applicantInfo[index].lawyer[inx].id }).then(res => {
              if (res.state == 100) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.init()
              }
            })
          } else {
            this.applicantInfo[index].lawyer.splice(inx, 1)
          }
          return
        }
        if (aryType == 'respondentInfoLawyer') {
          if (this.respondentInfo[index].lawyer[inx].id) {
            delLawyer({ lawyerId: this.respondentInfo[index].lawyer[inx].id }).then(res => {
              if (res.state == 100) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.init()
              }
            })
          } else {
            this.respondentInfo[index].lawyer.splice(inx, 1)
          }
          return
        }
        this.$message({
          message: '最少保留1位' + (aryType == 'applicantInfo' ? '申请人' : '被申请人'),
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .about {
        margin-top: 31px;
        .about-title {
            margin-bottom: 25px;
        }
        .situation {
            padding: 20px 40px;
            line-height: 45px;
            background:rgba(250,250,250,1);
            border:1px solid rgba(240,241,242,1);
        }
        ::v-deep .situation .el-textarea__inner {
            background: rgba(250,250,250,1);
        }
    }

</style>
