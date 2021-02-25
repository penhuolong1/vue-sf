<template>
  <div style="padding:20px">
    <!-- <div class="page" v-for="(item,index) in litigantList" :key="index"> -->
    <!-- 当事人 -->
    <!-- <appliationForm
                    :formData="formData.litigant"
                    :index="index"
                    :type="'litigant'"
                    :editFlag="editFlag"
                    @save='saveForm'
                    @setForm="setForm">
            </appliationForm> -->
    <!-- 代理人 -->
    <!-- <div v-for='(it,inx) in formData.litigant.lawyer' :key="inx">
                <appliationForm
                        :formData="it"
                        :index="inx"
                        :type="'applicantInfoLawyer'"
                        :editFlag="editFlag"
                        :noSave='true'
                        @save='saveForm'
                        @setForm="setForm">
                </appliationForm>
            </div> -->
    <!-- <div class="about">
                <p class="about-title">纠纷主要事实、争议事项：</p>
                <div class="situation" :style="{color:formData.briefSituation?'':'#2475FE'}" v-show="!editFlag">{{formData.briefSituation?formData.briefSituation:"请输入纠纷主要事实、争议事项..."}}</div>
                <el-input
                    class="situation"
                    v-show="editFlag"
                    type="textarea"
                    autosize
                    placeholder="请输入纠纷主要事实、争议事项..."
                    v-model="formData.briefSituation">
                </el-input>
            </div> -->
    <div class="about">
      <p class="about-title">经调解，各方当事人自愿达成以下协议：</p>
      <div v-show="!editFlag" class="situation" :style="{color:formData.agreement?'':'#2475FE'}">{{ formData.agreement?formData.agreement:"请输入相关协议内容..." }}</div>
      <el-input
        v-show="editFlag"
        v-model="formData.agreement"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入相关协议内容..."
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
        placeholder="履行方式、时限"
      />
    </div> -->
    <div class="about">
      <p class="about-title">协议:</p>
      <div class="situation">
        本协议一式
        <span v-show="!editFlag" :style="{color:formData.asideStrNum?'':'#2475FE'}">{{ formData.asideStrNum ? formData.asideStrNum : 'XXX' }}</span>
        <el-input v-show="editFlag" v-model="formData.asideStrNum" style="width:100px;height:30px" placeholder="份数" size="small" clearable />
        份，当事人、人民调解委员会各持一份。 <br>现请求
        <span v-show="!editFlag" :style="{color:formData.asideStrCourt?'':'#2475FE'}">{{ formData.asideStrCourt ? formData.asideStrCourt : 'XXXXX' }}</span>
        <!-- <el-input v-show="editFlag" style="width:150px;height:30px" placeholder="名称" size="small" v-model="formData.asideStrCourt" clearable></el-input> -->
        <el-select v-show="editFlag" v-model="formData.asideStrCourt" placeholder="请选择" style="width:200px;height:34px">
          <el-option
            v-for="item in courtList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <!-- 厦门市中级人民法院 -->
        对上述协议予以确认
      </div>
    </div>
    <div class="about">
      <p class="about-title">
        申请人出于解决纠纷的目的自愿达成协议，没有恶意串通、规避法律行为；<br>
        如果因为该协议内容而给他人造成损害的，愿意承担相应的民事责任和其他法律责任
      </p>
      <p class="about-title">附:</p>
      <el-input
        v-show="editFlag"
        v-model="formData.appendix"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </div>
    <litigant ref="litigant" v-model="partIds" :booktype="12" />
    <!-- </div> -->
  </div>
</template>

<script>
import { returnFileParams } from '@/api/dossier/dossier.js'
import { listCourtToFile } from '@/api/dossier/dossier.js'
import litigant from './litigant'

// import appliationForm from '@/components/mediationDossier/appliationForm'// 申请人
export default {
  name: 'JudicialBook',
  components: {
    // appliationForm
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
        asideStrCourt: '', // 法院
        appendix: '',
        courtList: []
      },
      partIds: []
    }
  },
  computed: {
  },
  created() {
    this.getListCourtToFile()
  },
  methods: {
    // 初始化
    init() {
      this.formData = {
        briefSituation: '', // 争议事项
        method: '', // 方式
        agreement: '', // 协议结果
        asideStrNum: '', // 份数
        asideStrCourt: '', // 法院
        appendix: ''
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
              // this.formData.method = res.method
              this.formData.agreement = res.method
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
    },
    getListCourtToFile() {
      listCourtToFile({ pageSize: 1000 }).then(res => {
        if (res.state === 100) {
          this.courtList = res.content
        }
      })
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
        ::v-deep .situation {
            background:rgba(250,250,250,1);
            border:1px solid rgba(240,241,242,1);
            padding: 20px 40px;
            line-height: 45px;
            .el-textarea__inner {
                background: rgba(250,250,250,1);
            }
            .el-input__inner {
                height: 34px;
                line-height: 34px;
            }
            .el-input__icon {
                height: 40px;
            }
        }
    }
    .page{
        padding: 30px 0;
        border-bottom:1px dashed #808080;
    }
</style>
