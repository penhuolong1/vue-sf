<template>
  <div style="padding:20px">
    <div class="about">
      <p class="about-title">
        卷宗情况说明：
      </p>
      <div v-show="!editFlag" class="situation" style="color:#2176FE">{{ briefSituation?briefSituation:"请输入卷宗情况说明...." }}</div>
      <el-input
        v-show="editFlag"
        v-model="briefSituation"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入卷宗情况说明...."
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SituationDescription',
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      briefSituation: ''
    }
  },
  methods: {
    // 初始化
    init() {
      this.briefSituation = ''
      return new Promise((resolve, reject) => {
        if (this.coverData.caseId) {
          resolve(true)
        } else {
          resolve(true)
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
