<!-- 申请协同  -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="发起协同"
    append-to-body
    :visible.sync="modalVisible"
  >
    <el-form ref="form" :model="form">
      <el-form-item class="my-item" label="协同对象">
        <div class="item-wrapper">
          <div v-for="(item, index) in getselectUnitList" :key="index" class="item">
            <div class="left">
              <div class="name">{{ item.name }}<span v-if="item.parent">({{ item.parent.name }})</span></div>
              <div class="label">{{ item.type == 1 ? '主要办案员' : '案件协助员' }}</div>
            </div>
            <div class="del">
              <i class="el-icon-error" @click="delUnit(item.id)" />
            </div>
          </div>
          <a @click="selectUnit">请选择</a>
        </div>
      </el-form-item>
      <el-form-item label="协同事由">
        <el-input v-model="reason" style="width: 400px;" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { initiateTeam } from '@/api/collaboration/index'
export default {
  components: {
  },
  props: {

  },
  data() {
    return {
      modalVisible: false,
      form: {},
      reason: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getselectUnitList', 'getCaseInfo'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 删除协同对象
    delUnit(id) {
      const ary = [...this.getselectUnitList]
      const index = ary.findIndex(item => item.id === id)
      ary.splice(index, 1)
      this.$store.commit('SET_SELECTUNITLIST', ary)
    },
    // 显示模态框
    show(isNew) {
      if (isNew) {
        this.$store.commit('SET_SELECTUNITLIST', [])
        this.reason = ''
      }
      this.modalVisible = true
    },
    // 取消
    cancel() {
      this.modalVisible = false
    },
    // 提交
    submit() {
      if (!this.getselectUnitList || this.getselectUnitList.length == 0) {
        this.$message.error('请先选择协同单位')
        return
      }
      const params = {
        caseId: this.getCaseInfo.id,
        reason: this.reason,
        teamWorkers: [...this.getselectUnitList].map(item => {
          const obj = {
            type: item.type
          }
          if (item.court) {
            obj.courtId = item.id
          } else {
            obj.mediaterId = item.id
            obj.courtId = item.parent.id
          }
          return obj
        })
      }
      initiateTeam(params).then(res => {
        if (res.state === 100) {
          this.$message.success(res.message)
          this.$emit('initiateTeamSuccess')
          const params = {
            caseId: this.getCaseInfo.id
          }
          this.$store.dispatch('getListTeamByCase', params)
          this.cancel()
        }
      })
    },
    // 选择 协同单位
    selectUnit() {
      this.$emit('selectUnit')
    }
  }
}
</script>

<style scoped lang="scss">
.my-item {
  ::v-deep.el-form-item__content {
    line-height: initial;
  }
}
.item-wrapper {
  width: 400px;
  display: inline-block;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 10px 20px;
  .item {
    line-height: 1.2;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .left {
      display: flex;
      align-items: center;
    }
    .name {
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #707070;
    }
    .label {
      font-size: 12px;
      font-weight: 400;
      color: #0097fe;
      background-color:rgba(0,151,254,0.1);
      padding: 5px;
      margin-left: 5px;
      border-radius: 5px;
    }
    .del {
      color: #0097fe;
      cursor: pointer;
      padding: 5px;
    }
  }
}
</style>
