<template>
  <!-- 电子送达 -->
  <div style="padding:20px">
    <div class="about">
      <p class="about-title">送达文书名称</p>
      <el-input
        v-model="fileName"
        class="situation"
        autosize
        placeholder="请输入内容"
      />
    </div>
    <div class="about">
      <p class="about-title">收件人</p>
      <el-select v-model="litigantIds" multiple class="situation" multiple-limit="4" style="width: 100%;" placeholder="请选择收件人（最多4人）">
        <el-option
          v-for="item in litigantList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import appliationForm from '@/components/mediationDossier/appliationForm'// 申请人
import { mapGetters } from 'vuex'
export default {
  name: 'Application',
  components: {
    appliationForm
  },
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      fileName: '',
      litigantIds: [],
      litigantList: [] // 当事人信息
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo']),
    form() {
      const params = {
      }
      params.fileName = this.fileName
      params.litigantIds = this.litigantIds
      return params
    }
  },
  watch: {
    getCaseInfo() {
      this.getLitightList()
    }
  },
  created() {
    this.getLitightList()
  },
  methods: {
    // 获取当事人信息
    getLitightList() {
      this.litigantList = []
      if (!this.getCaseInfo.litigants || this.getCaseInfo.litigants.length == 0) {
        return
      }
      this.getCaseInfo.litigants.forEach(item => {
        this.litigantList.push({
          name: item.litigantName,
          id: item.id
        })
        if (item.lawyer && item.lawyer.length > 0) {
          item.lawyer.forEach(item1 => {
            this.litigantList.push({
              name: item1.agentName,
              id: item1.id
            })
          })
        }
      })
    },
    change(e) {

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
    .form-item {
      .form-item-left {
        flex: 1;
      }
      .form-item-right {
        width: 100px;
        padding-left: 10px;
      }
    }

</style>
