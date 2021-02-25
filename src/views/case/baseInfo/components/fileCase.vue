<template>
  <div class="base-wrapper">
    <header1 :title="'立案信息'" :is-edit.sync="isEdit" :no-btn="true" />
    <div class="form-wrapper">
      <div class="label">案号</div>
      <div class="text" style="position: relative;">
        <span>{{ getCaseInfo.inCaseNo }}</span>
      </div>
      <div class="label">立案日期</div>
      <div class="text">
        {{ getCaseInfo.filingDate | time }}
      </div>
      <div class="label">法官</div>
      <div class="text">
        <span>
          {{ getCaseInfo.cbJudge }}
        </span>
      </div>
      <div class="label">法官助理</div>
      <div class="text">
        <span>
          {{ getCaseInfo.assistant }}
        </span>
      </div>
      <div class="label">书记员</div>
      <div class="text">
        <span>
          {{ getCaseInfo.clerk }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import header1 from './header'
import { mapGetters } from 'vuex'
export default {
  components: {
    header1
  },
  props: {

  },
  data() {
    return {
      isEdit: false,
      caseInfo: {}
    }
  },
  computed: {
    ...mapGetters(['getTeamData', 'getCaseInfo'])
  },
  watch: {
  },
  created() {
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.form-wrapper {
  display: flex;
  flex-wrap: wrap;
  grid-template-columns: repeat(2, 200px 1fr);
  border: 1px solid #EDEDED;
  border-bottom: none;
  border-right: none;
  margin-top: 10px;
  &>div {
    min-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #EDEDED;
    border-right: 1px solid #EDEDED;
  }
  .label {
    background-color: #FAFBFB;
    width: 200px;
  }
  .text {
    width: calc(50% - 200px);
    &.text1 {
      padding: 0 10px;
      width: calc(100% - 200px);
    }
  }
  ::v-deep .el-input{
    width: 200px;
  }
}
.se-brief {
  ::v-deep.select-wrapper {
    width: 200px;
    .tip {
      font-size: 14px;
    }
    .text {
      font-size: 14px;
    }
  }
}
</style>
