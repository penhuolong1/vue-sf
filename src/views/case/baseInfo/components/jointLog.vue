<template>
  <div v-if="list && list.length > 0" class="base-wrapper">
    <header1 class="header" :title="'协同信息'" :no-btn="true" />
    <div v-for="(item, index) in list" :key="index" class="form-wrapper">
      <div class="label">协同身份</div>
      <div class="text">
        <span>{{ item.typeStr }}</span>
      </div>
      <div class="label">{{ item.nameStr }}</div>
      <div class="text">
        {{ item.mediaterName || item.courtName }}
      </div>
    </div>
  </div>
</template>

<script>
import header1 from './header'
import { listTeamInfoByCase } from '@/api/case/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    header1
  },
  props: {

  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['getCaseId'])
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.getLogList1()
  },
  methods: {
    // 获取
    getLogList1() {
      listTeamInfoByCase({ caseId: this.getCaseId }).then(res => {
        if (res.state === 100) {
          this.list = res.data
        }
        this.$emit('getList', this.list)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  margin-top: 10px;
  margin-bottom: 10px;
}
.form-wrapper:last-child {
  border-bottom: 1px solid #EDEDED;
}
.form-wrapper {
  display: flex;
  flex-wrap: wrap;
  grid-template-columns: repeat(2, 200px 1fr);
  border: 1px solid #EDEDED;
  border-bottom: none;
  border-top: none;
  border-right: none;
  &>div {
    min-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #EDEDED;
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
