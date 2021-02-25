<template>
  <!-- 右边内容详情，与对话框代码一样 -->
  <div class="dv" style="padding:20px">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      disabled
    >
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
              <el-form-item label="解纷类型">
                <span class="item">{{ ruleForm.mediateType }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织类型">
                <span class="item">{{ ruleForm.orgType }}</span>
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
          <el-row v-for="(item, index) in ruleForm.caseMediators" :key="index+'caseMediators'" :gutter="20">
            <el-col :span="12">
              <el-form-item label="案管人员">
                <span class="item">{{ item.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <lookphone :id="item.id" :phone="item.phone" encrypt-type="mediater" :type="1" :court-id="ruleForm.id" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in ruleForm.adminMediators" :key="index+'adminMediators'" :gutter="20">
            <el-col :span="12">
              <el-form-item label="管理员">
                <span class="item">{{ item.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式">
                <!-- <span class="item">{{ item.phone }}</span> -->
                <lookphone :id="item.id" :phone="item.phone" encrypt-type="mediater" :type="1" :court-id="ruleForm.id" />
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
                <!-- <span class="item">{{ item.phone }}</span> -->
                <lookphone :id="item.id" :phone="item.phone" encrypt-type="linkMan" :type="1" :court-id="ruleForm.id" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <!-- <el-col :span="6">
          <div class="rbImg">
            <img v-if="ruleForm.orgSign" :src="ruleForm.orgSign" alt>
            <img v-if="!ruleForm.orgSign" src="@/assets/images/no.png" alt>
          </div>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="主要职责">
            <span class="item">{{ ruleForm.duties }}</span>
          </el-form-item>
          <el-form-item label="文件依据">
            <ul class="look-wrapper">
              <li v-for="(item, index) in fileList" :key="index" @click="look(item.url)">{{ item.name }}</li>
            </ul>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <preview v-if="fileList1" ref="preview" :file-url="fileUrl1" :file-list="fileList1" />
  </div>
</template>

<script>
import { BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID } from '@/utils/constVal.js'
import { formatDate } from '@/utils/format.js'
import lookphone from './lookPhone'
import preview from '@/components/preview/index'
export default {
  name: 'DetailUnit',
  components: {
    lookphone,
    preview
  },
  props: {
    // 父组件传入表单
    ruleForm: {
      type: Object,
      default: () => ({})
    },
    rules: {
      name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
    }
  },
  data() {
    return {
      // 所属级别
      courtLevelArr: [
        { name: '市级', index: 1 },
        { name: '区级', index: 2 },
        { name: '街道', index: 3 }
      ],
      // 解纷类型
      disputeArr: [
        { name: '解纷', index: 1 },
        { name: '仲裁', index: 2 },
        { name: '公证', index: 3 },
        { name: '行政复议', index: 4 },
        { name: '行政裁决', index: 5 }
      ],
      // 组织类型
      organizationArr: [
        { name: '法院特邀解纷', index: 1 },
        { name: '人民解纷', index: 2 },
        { name: '行业解纷', index: 3 },
        { name: '商事解纷', index: 4 },
        { name: '行政解纷', index: 5 }
      ],
      fileList: [],
      fileUrl: '',
      fileList1: [],
      fileUrl1: null
    }
  },
  computed: {},
  watch: {
    ruleForm() {
      console.log(this.ruleForm)
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    // 初始化一些东西
    init() {
      if (!this.ruleForm) {
        return
      }
      this.fileList = []
      const fileUrl = this.ruleForm.fileUrl ? this.ruleForm.fileUrl.split(',') : ''
      if (this.ruleForm.orgSign) {
        this.ruleForm.orgSign = this.ruleForm.orgSign ? `${SERVICEURL}/${this.ruleForm.orgSign}` : ''
      }
      this.ruleForm.partTime = this.ruleForm.partTime ? formatDate(new Date(this.ruleForm.partTime), 'YYYY-MM-DD') : ''
      if (!fileUrl) {
        return
      }
      fileUrl.forEach((item, index) => {
        const name = item.split('/').pop()
        const obj = {
          name,
          url: item
        }
        this.fileList.push(obj)
      })
      this.fileList1 = this.fileList.map(item => {
        return item.url
      })
    },
    look(url) {
      this.fileUrl1 = url
      this.$refs.preview.show(url, this.fileList1)
    },
    isPdf(url) { // 判断文件是否为pdf
      let flag = false
      if (
        url.indexOf('pdf') > -1
      ) {
        flag = true
      } else {
        flag = false
      }
      return flag
    },
    // 判断是否为图片
    isImg1(url) {
      let flag = false
      if (
        url.indexOf('doc') > -1 ||
        url.indexOf('docx') > -1 ||
        url.indexOf('pdf') > -1
      ) {
        flag = false
      } else {
        flag = true
      }
      return flag
    }
  }
}
</script>

<style>
.dv .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    border-color: #fff;
    color: #C0C4CC;
    cursor: not-allowed;
}
</style>
<style scoped lang = "scss">
.rbImg {
  width: 170px;
  height: 219px;
  float: right;
  img {
    width: 180px;
    height: 220px;
  }
}
.look-wrapper {
  color: #007AFF;
  cursor: pointer;
}
.item {
  color: #606266;
}
</style>
