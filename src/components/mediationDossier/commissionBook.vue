<template>
  <!-- 授权委托书 -->
  <div style="padding:20px">
    <litigant v-model="partIds" :multiple="false" :title="'委托人'" :booktype="5" />
  </div>
</template>

<script>
import litigant from './litigant'

export default {
  name: 'CommissionBook',
  components: {
    litigant
  },
  props: ['showAction', 'editFlag', 'coverData'],
  data() {
    return {
      partIds: []
    }
  },
  computed: {
  },
  methods: {
    // 初始化
    init() {
      this.partIds = []
    }
  }
}
</script>

<style lang="scss" scoped>
    .tip {
        text-align: right;
        color: rgb(32,112,249);
    }
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
        ::v-deep .situation .el-textarea__inner,
        ::v-deep .el-input__inner {
            background: rgba(250,250,250,1);
        }

    }
    .dispute{
        margin-top: 35px;
        span {
            margin-right: 19px;
        }
    }
</style>
