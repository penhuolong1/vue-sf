<template>
  <!-- 分流中心详情-->
  <!-- 右边内容详情，与对话框代码一样 -->
  <div style="padding:20px">
    <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm center-form" disabled>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属级别">
                <span class="item">{{ ruleForm.courtLevel }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="接入时间">
                <span class="item">{{ ruleForm.partTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办公地址">
                <span class="item">{{ ruleForm.address }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in ruleForm.managers" :key="index+'managers'" :gutter="20">
            <el-col :span="12">
              <el-form-item label="管理员">
                <span class="item">{{ item.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <lookphone :id="item.id" :phone="item.phone" encrypt-type="mediater" :type="0" :court-id="ruleForm.id" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in ruleForm.caseManagers" :key="index+'caseManagers'" :gutter="20">
            <el-col :span="12">
              <el-form-item label="案管人员">
                <span class="item">{{ item.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <lookphone :id="item.id" :phone="item.phone" encrypt-type="mediater" :type="0" :court-id="ruleForm.id" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in ruleForm.linkMen" :key="index" :gutter="20">
            <el-col :span="12">
              <el-form-item label="联络人">
                <span class="item">{{ item.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <lookphone :id="item.id" :phone="item.phone" encrypt-type="linkMan" :type="0" :court-id="ruleForm.id" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row v-for="(item, index) in ruleForm.caseMediators" :key="'a'+index" :gutter="20">
            <el-col :span="12">
              <el-form-item label="案管人员">
                <span class="item">{{ item.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <span class="item">{{ item.phone }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in ruleForm.adminMediators" :key="'b'+index" :gutter="20">
            <el-col :span="12">
              <el-form-item label="管理员">
                <span class="item">{{ item.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <span class="item">{{ item.phone }}</span>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-col>
        <!-- <el-col :span="6">
          <div class="rbImg">
            <img v-if="ruleForm.orgSign" :src="baseUrl+'/'+ruleForm.orgSign" alt>
            <img v-if="!ruleForm.orgSign" src="@/assets/images/no.png" alt>
          </div>
        </el-col> -->
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { BASEIMGURL } from '@/utils/constVal.js'
import { formatDate } from '@/utils/format.js'
import lookphone from './lookPhone'
export default {
  name: 'DetailCenter',
  components: {
    lookphone
  },
  props: {
    // 父组件传入表单
    ruleForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      baseUrl: BASEIMGURL
    }
  },
  computed: {},
  watch: {
    ruleForm() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      this.ruleForm.partTime = this.ruleForm.partTime ? formatDate(new Date(this.ruleForm.partTime), 'YYYY-MM-DD') : ''
    }
  }
}
</script>

<style lang = "scss">
.center-form .dv .el-input.is-disabled .el-input__inner {
  color: #606266;
}
</style>
<style scoped lang = "scss">
.rbImg {
  width: 170px;
  height: 219px;
  float: right;
  /* border: 1px solid black; */
}
.rbImg img{
  width: 170px;
  height: 219px;
}
.item {
  color: #606266;
}
</style>
