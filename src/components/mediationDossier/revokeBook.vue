<template>
  <!-- 撤销申请书 -->
  <div style="padding:20px">
    <div class="about">
      <p class="about-title">撤诉原因</p>
      <el-select v-model="causes" class="situation" multiple style="width: 100%;" placeholder="请选择">
        <el-option
          v-for="item in selectData"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-if="causes.indexOf(4) !== -1" class="about">
      <p class="about-title">其他</p>
      <div class="situation">
        <el-input
          v-model="other"
          type="textarea"
          autosize
          placeholder="请输入内容"
          maxlength="50"
          show-word-limit
        />
      </div>
    </div>
    <litigant v-model="partIds" :booktype="24" />
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
      selectData: [
        {
          value: 1,
          label: '双方当事人已达成和解并履行完毕'
        },
        {
          value: 2,
          label: '本人需另行组织证据材料'
        },
        {
          value: 3,
          label: '本人个人原因'
        },
        {
          value: 4,
          label: '其他'
        }
      ], // 被申请人
      causes: [],
      other: '',
      partIds: []
    }
  },
  methods: {
    reset() {
      this.causes = []
      this.other = ''
      this.partIds = []
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
            background:rgba(250,250,250,1);
            border:1px solid rgba(240,241,242,1);
        }
        ::v-deep .situation .el-textarea__inner {
            background: rgba(250,250,250,1);
        }
    }

</style>
