<template>
  <el-form ref="form" :model="form" :rules="stpe2rules">
    <el-form-item style="width: 100%;">
      <div class="label">申请类型</div>
      <ul class="dispute-type">
        <li v-for="(item, index) in typeImg" :key="index" @click="selectApplyType(item.id)">
          <img :src="form.applyType == item.id ? item.activeUrl:item.url">
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="纠纷事由" prop="briefId" style="width: 49%;">
      <el-select v-model="form.briefId" style="width: 350px;">
        <el-option
          v-for="item in brief"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="纠纷金额（元）" prop="applyStandard" style="width: 49%;">
      <el-input v-model="form.applyStandard" style="width: 350px;" />
    </el-form-item>
    <el-form-item prop="mediateRequest" style="width: 100%;">
      <div class="label">请求事项</div>
      <el-input
        v-model="form.mediateRequest"
        placeholder="请输入请求事项"
        style="width: 100%;"
      />
    </el-form-item>
    <el-form-item prop="reason" style="width: 100%;">
      <div class="label">事实与理由</div>
      <el-input
        v-model="form.reason"
        type="textarea"
        :rows="7"
        placeholder="请输入事实与理由"
        style="width: 100%;"
      />
    </el-form-item>
    <div style="text-align: right;">
      <el-button type="primary" @click="before">上一步</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </el-form>
</template>

<script>
import rules from '@/utils/rules'
import { applyCase, detailsCase } from '@/api/litigant/litigant'
export default {
  name: 'Step2',
  mixins: [rules],
  data() {
    return {
      form: {
        lawCaseId: '',
        applyType: '解纷',
        mediateRequest: '',
        reason: '',
        briefId: ''
      },
      typeImg: [{
        id: '解纷',
        url: require('@/assets/img/mediation.png'),
        activeUrl: require('@/assets/img/mediation-active.png')
      }, {
        id: '仲裁',
        url: require('@/assets/img/arbitration.png'),
        activeUrl: require('@/assets/img/arbitration-active.png')
      }, {
        id: '行政复议',
        url: require('@/assets/img/reconsideration.png'),
        activeUrl: require('@/assets/img/reconsideration-active.png')
      }, {
        id: '行政裁决',
        url: require('@/assets/img/ruling.png'),
        activeUrl: require('@/assets/img/ruling-active.png')
      }, {
        id: '公证',
        url: require('@/assets/img/notarization.png'),
        activeUrl: require('@/assets/img/notarization-active.png')
      }, {
        id: '其他',
        url: require('@/assets/img/other.png'),
        activeUrl: require('@/assets/img/other-active.png')
      }]
    }
  },
  computed: {

  },
  mounted() {
    this.form.lawCaseId = this.$store.getters.getLawCaseId || window.localStorage.getItem('lawCaseId')
    const data = {
      lawCaseId: this.form.lawCaseId
    }
    detailsCase(data).then(({ state, lawCase: { mediateRequest, reason }}) => {
      state === 100 && (this.form.mediateRequest = mediateRequest) && (this.form.reason = reason)
    })
    this.$emit('update:step', 1)
  },
  methods: {
    next() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        }
        applyCase(this.form).then(({ state, message }) => {
          if (state === 100) {
            this.$message.success(message)
            this.$router.push({ name: 'step3' })
            return
          }
        })
      })
    },
    before() {
      if (this.$store.state.user.userRole == 3) {
        this.$router.push({ name: 'step1' })
      } else {
        this.$router.push({ name: 'step' })
      }
    },
    // 选择申请类型
    selectApplyType(id) {
      this.form.applyType = id
    }
  }
}
</script>

<style scoped lang = "scss">
  .label {
    color: #579DFC;
    font-weight: bold;
    font-size: 16px;
  }
  .dispute-type {
    display: inline-flex;
    img {
      width: 100px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
