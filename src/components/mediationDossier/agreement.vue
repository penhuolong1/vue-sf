<template>
  <div style="padding:20px">
    <div class="about">
      <p class="about-title">纠纷主要事实、争议事项：</p>
      <div v-show="!editFlag" class="situation" :style="{color:formData.briefSituation?'':'#2475FE'}">{{ formData.briefSituation?formData.briefSituation:"请输入纠纷主要事实、争议事项..." }}</div>
      <el-input
        v-show="editFlag"
        v-model="formData.briefSituation"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </div>
    <div class="about">
      <p class="about-title">经调解，各方当事人自愿达成以下协议：</p>
      <div v-show="!editFlag" class="situation" :style="{color:formData.method?'':'#2475FE'}">{{ formData.method?formData.method:"请输入相关协议内容..." }}</div>
      <el-input
        v-show="editFlag"
        v-model="formData.method"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </div>
    <!-- <div class="about">
      <p class="about-title">履行方式、时限：</p>
      <div v-show="!editFlag" class="situation" :style="{color:formData.method?'':'#2475FE'}">{{ formData.method?formData.method:"履行方式、时限..." }}</div>
      <el-input
        v-show="editFlag"
        v-model="formData.method"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </div> -->
    <div class="about">
      <p class="about-title">协议:</p>
      <div class="situation">
        本协议一式
        <span v-show="!editFlag" :style="{color:formData.asideStrNum?'':'#2475FE'}">{{ formData.asideStrNum ? formData.asideStrNum : 'XXX' }}</span>
        <el-input v-show="editFlag" v-model="formData.asideStrNum" style="width:100px;height:30px" placeholder="份数" size="small" clearable />
        份，当事人、人民调解委员会各持一份。
      </div>
    </div>
    <litigant ref="litigant" v-model="partIds" :booktype="10" />
  </div>
</template>

<script>
import { returnFileParams } from '@/api/dossier/dossier.js'
import appliationForm from '@/components/mediationDossier/appliationForm'// 申请人
import litigant from './litigant'

export default {
  name: 'Agreement',
  components: {
    appliationForm,
    litigant
  },
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      formData: {
        briefSituation: '', // 争议事项
        method: '', // 方式
        agreement: '', // 协议结果
        asideStrNum: '', // 份数
        partIds: []
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.formData = {
        briefSituation: '', // 争议事项
        method: '', // 方式
        agreement: '', // 协议结果
        asideStrNum: '' // 份数
      }
      this.partIds = []
      this.$refs.litigant && this.$refs.litigant.getLitigantList()
      return new Promise((resolve, reject) => {
        if (this.coverData.id) {
          returnFileParams({
            mediateTableId: this.coverData.id,
            dirTypeId: this.showAction.type }
          ).then(res => {
            if (res.state == 100) {
              this.formData.briefSituation = res.reason
              this.formData.method = res.method
            }
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    },
    saveForm() {

    },
    setForm(type, aryType, index, inx) {
      const temp = { lawyer: [], name: '', nation: '', sex: '', years: '', card: '', phone: '', address: '', job: '', type: 0 }
      const temp2 = {
        litigant: { lawyer: [], litigantName: '', nation: '', sex: '', years: '', identityCard: '', phone: '', address: '', employer: '', type: 0 },
        briefSituation: '', // 争议事项
        method: '', // 方式
        agreement: '', // 协议结果
        asideStrNum: '', // 份数
        asideStrCourt: ''// 法院
      }
      if (type === 'add') {
        if (aryType === 'litigant') { // 新增一整个页面
          this.litigantList.push(temp2)
        } else { // 添加代理人
          if (this.litigantList[index].litigant.lawyer.length < 2) {
            this.litigantList[index].litigant.lawyer.push(temp)
          } else {
            this.$message({
              message: '最多添加2位代理人',
              type: 'warning'
            })
          }
        }
      } else {
        if (aryType === 'litigant') { // 删除一整个页面
          if (this.litigantList.length > 1) {
            this.litigantList.splice(index, 1)
          } else {
            this.$message({
              message: '至少保留一位当事人',
              type: 'warning'
            })
          }
        } else { // 删除代理人
          this.litigantList[index].litigant.lawyer.splice(inx, 1)
        }
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
            background:rgba(250,250,250,1);
            border:1px solid rgba(240,241,242,1);
            padding: 20px 40px;
            line-height: 45px;
        }
        ::v-deep .situation .el-textarea__inner {
            background: rgba(250,250,250,1);
        }
    }
    .page{
        padding: 30px 0;
        border-bottom:1px dashed #808080;
    }
</style>
