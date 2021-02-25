<template>
  <div class="add-case-wrapper">
    <el-form ref="form" :model="form" label-width="100px" label-position="left">
      <el-row>
        <el-col :span="12">
          <el-form-item label="受理单位">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="申请类型">
        <el-button v-for="(item, index) in applicationType" :key="index" :class="{'active': index == type}" @click="selectType(index)">{{ item }}</el-button>
      </el-form-item>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="纠纷事由">
            <el-select v-model="form.brief" placeholder="请选择">
              <el-option
                v-for="item in briefData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纠纷金额">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-wrapper">
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { APPLICATIONTYPR } from '@/utils/constVal.js'
import { brief } from '@/api/common/common.js'
export default {
  components: {
  },
  props: {

  },
  data() {
    return {
      form: {},
      applicationType: APPLICATIONTYPR,
      type: 0,
      briefData: []
    }
  },
  created() {
    this.getBrief()
  },
  mounted() {

  },
  methods: {
    // 选择受理类型
    selectType(index) {
      this.type = index
    },
    // 获取案由
    getBrief() {
      brief({ pageSize: 1000 }).then(res => {
        if (res.state === 100) {
          this.briefData = res.briefPage.content
        }
      })
    },
    // 下一步
    next() {
      this.$emit('next', 1)
    }
  }
}
</script>

<style scoped lang="scss">
.add-case-wrapper {
 ::v-deep .el-button {
    &.active {
      background-color: #0097FE;
      color: #fff;
    }
  }
}
</style>
