<template>
  <div style="width: 100%;">
    <el-row :gutter="20">
      <el-col :span="8">
        <litigantItem
          :litigation-status.sync="form.litigationStatus"
          :applicant="applicant"
          :respondent="respondent"
          @add="Change"
          @edit="edit"
          @done="getLitigant"
        />
      </el-col>
      <el-col :span="16">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="150px">
          <el-row>
            <el-form-item :label="form.litigationStatus === 5 ? '被申请人类型' : '申请人类型'" style="width: 100%;">
              <el-select v-model="litigantType" style="width: 100%;" placeholder="请选择" @change="clear">
                <el-option
                  v-for="item in typeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="姓名或单位名称">
                <el-input v-model="form.name" placeholder="请输入姓名或单位名称" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="litigantType === 0" label="手机号码" :prop="form.litigationStatus != 5 ? 'litigantPhone':''">
                <encryptInfo :id="form.litigantId" ref="encryptInfo1" v-model="form.litigantPhone" type="litigantPhone" :litigant-type="1" :placeholder="'请输入手机号码'" />
                <!-- <el-input v-model="form.litigantPhone" placeholder="请输入号码" style="width: 100%;" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="litigantType !== 0" label="联系方式">
                <!-- <el-input v-model="form.litigantPhone" placeholder="请输入号码" style="width: 100%;" /> -->
                <encryptInfo :id="form.litigantId" ref="encryptInfo3" v-model="form.litigantPhone" type="litigantPhone" :litigant-type="1" :placeholder="'请输入联系方式'" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-if="litigantType !== 0"
            prop="identityCard"
            label="统一信用码"
            style="width: 100%;"
            :rules="identityRules"
          >
            <el-input v-model="form.identityCard" placeholder="请输入统一信用码" style="width: 100%;" />
          </el-form-item>
          <!-- :prop="changeAddType ? 'identityCard2' : 'identityCard'" -->
          <el-form-item v-if="litigantType === 0" label="证件类型" style="width: 100%;" :prop="form.litigationStatus != 5 ? 'identityType':''">
            <el-select v-model="form.identityType" style="width: 100%;" placeholder="请选择">
              <el-option
                v-for="item in identityArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="litigantType === 0 && form.identityType > 0"
            prop="identityCard"
            label="证件号码"
            style="width: 100%;"
            :rules="identityRules"
          >
            <encryptInfo :id="form.litigantId" ref="encryptInfo2" v-model="form.identityCard" type="identityCard" :litigant-type="1" :placeholder="'请输入证件号码'" @input="getIdCard" />
            <!-- <el-input v-model="form.identityCard" placeholder="请输入证件号码" style="width: 100%;" @input="getIdCard" /> -->
          </el-form-item>
          <el-form-item
            v-if="!changeLitigantType"
            label="法人证件号"
            style="width: 100%;"
            prop="legalManId2"
          >
            <encryptInfo :id="form.litigantId" ref="encryptInfo5" v-model="form.legalManId" type="legalManId" :litigant-type="1" :placeholder="'请输入证件号码'" />
            <!-- <el-input v-model="form.legalManId" placeholder="请输入证件号码" style="width: 100%;" /> -->
          </el-form-item>
          <el-row v-show="changeLitigantType">
            <el-col :span="8">
              <el-form-item prop="sex" label="性别">
                <el-select v-model="form.sex" style="width: 100%;" placeholder="请选择">
                  <el-option
                    v-for="item in sexArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="age" label="年龄" label-width="100px">
                <el-input v-model="form.age" placeholder="请输入年龄" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="nation" label="民族" label-width="100px">
                <el-input v-model="form.nation" placeholder="请输入民族" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="litigantType === 0" prop="birthday" label="出生日期" style="width: 100%;">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              style="width: 100%;"
              placeholder="选择出生日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item prop="address" :label="changeAdLabel" style="width: 100%;">
            <el-input v-model="form.address" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item prop="email" label="邮箱" style="width: 100%;" :rules="[{ validator: validdateEmail, trigger: ['change', 'blur'] }]">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item v-if="litigantType === 0" prop="employer" label="工作单位或职务" style="width: 100%;">
            <el-input v-model="form.employer" placeholder="请输入工作或职务" />
          </el-form-item>
          <el-row v-if="!changeLitigantType">
            <el-col :span="9">
              <el-form-item :prop="form.litigationStatus != 5 ? 'legalManName':''" label="法定代表人姓名" style="width: 100%;">
                <el-input v-model="form.legalManName" placeholder="法定代表人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item
                label="法定代表人手机号码"
                style="width: 100%;"
              >
                <encryptInfo :id="form.litigantId" ref="encryptInfo4" v-model="form.legalManPhone" type="legalManPhone" :litigant-type="1" :placeholder="'请输入手机号码'" />
                <!-- <el-input v-model="form.legalManPhone" placeholder="请输入法定代表人手机号码" /> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="changeLitigantType">
            <el-form-item label="证件照片上传" prop="frontImage">
              <upload
                ref="upload"
                v-model="files1"
                accept=".jpg,.png"
                :limit="2"
                action="/api/court/wxRegister/uploadFrontImage.jhtml"
                tip="(照片最多上传2张)"
              />
            </el-form-item>
          </el-row>
          <el-row v-show="!changeLitigantType">
            <el-col :span="12">
              <el-form-item label="营业执照上传" prop="companyImage">
                <uploadFile
                  ref="companyImage"
                  img-type="companyImage"
                  :is-upload="form.companyImage"
                  accept=".jpg,.png"
                  @getUrl="getUrl"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align: right;">
            <el-button v-show="!isChange" type="success" :loading="isLoading" @click="submit">保存</el-button>
            <el-button v-show="isChange" type="warning" :loading="isLoading" @click="handleChange">修改</el-button>
            <el-button type="primary" @click="next('before')">上一步</el-button>
            <el-button type="primary" @click="next('next')">下一步</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import litigantItem from '@/components/addCase/litigantItem'
import uploadFile from '@/components/addCase/uploadFile'
import { validIDCard, validEmail } from '@/utils/validate'
import upload from '@/components/upload'
import { LITIGANTTYPEMAP, IDENTITYMAP } from '@/utils/constVal'
import encryptInfo from '@/components/encryptInfo'

import rules from '@/utils/rules'
import { addLitigant, detailsCase, editLitigant, addCompanyLit, getBirAgeSex, editCompanyLit } from '@/api/litigant/litigant'
export default {
  name: 'Step3',
  components: {
    litigantItem, uploadFile, upload, encryptInfo
  },
  mixins: [rules],
  data() {
    return {
      isLoading: false,
      typeArr: [],
      identityArr: [],
      sexArr: [{ value: 0, label: '男' }, { value: 1, label: '女' }],
      form: {
        lawCaseId: '',
        name: '',
        identityType: '',
        litigantPhone: '', // 自然人电话
        litigantTelPhone: '', // 法人公司电话
        identityCard: '',
        sex: '',
        age: '',
        nation: '',
        address: '',
        employer: '',
        frontImage: '',
        backImage: '',
        email: '',
        litigationStatus: 4,
        legalManName: '', // 法人代表人姓名
        legalManPhone: '', // 法人公司电话
        legalManId: '', // 法定代表人身份证号码
        companyImage: '' // 公司营业执照
      },
      fileList: [],
      applicant: [],
      respondent: [],
      isChange: false,
      litigantType: 0, // 当事人类型
      files1: []
    }
  },
  computed: {
    identityRules() {
      let rules = []
      if (this.form.litigationStatus == 4) { //
        if (this.litigantType === 0) { // 如果是申请人并且为自然人则这个字段需要验证身份证号格式并且必填
          if (this.form.identityType == 1) {
            rules = [
              {
                required: true,
                message: '请输入证件号码',
                trigger: ['change', 'blur']
              }
              // { validator: this.validateIDCard, trigger: ['change', 'blur'] }
            ]
          } else {
            rules = [
              {
                required: true,
                message: '请输入证件号码',
                trigger: ['change', 'blur']
              }
            ]
          }
        } else { // 如果是申请人并且为法人则这个字段只需要必填
          rules = [
            {
              required: true,
              message: '请输入统一信用码',
              trigger: ['change', 'blur']
            }
          ]
        }
      } else { // 如果是被申请人这个字段不需要任何验证
        if (this.litigantType === 0) { // 如果是被申请人且是自然人则不需要填这个字段
          rules = []
        } else { // 如果是申请人并且为法人则这个字段只需要必填
          rules = []
        }
      }
      return rules
    },
    changeLabel() {
      return this.litigantType === 0 ? '身份证号码' : '统一信用码'
    },
    changePla() {
      return this.litigantType === 0 ? '请输入身份证号码' : '请输入统一信用码'
    },
    changeAdLabel() {
      return this.litigantType === 0 ? '地址' : '公司注册地址'
    },
    changeAddType() {
      return this.form.litigationStatus === 5
    },
    changeLitigantType() {
      return this.litigantType === 0
    }
  },
  watch: {
    files1() {
      console.log('--文件--')
      console.log(this.files1)
    }
  },
  mounted() {
    this.form.lawCaseId = this.$store.getters.getLawCaseId || window.localStorage.getItem('lawCaseId')
    this.$emit('update:step', 1)
    this.getLitigant()
    this.init()
  },
  methods: {
    init() { // 初始化数据
      this.typeArr = []
      for (const key in LITIGANTTYPEMAP) {
        this.typeArr.push({
          value: Number(key),
          label: LITIGANTTYPEMAP[key]
        })
      }
      this.identityArr = []
      for (const key in IDENTITYMAP) {
        this.identityArr.push({
          value: key,
          label: IDENTITYMAP[key]
        })
      }
    },
    // 验证邮箱
    validdateEmail(rule, value, callback) {
      if (value && !validEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    },
    // 验证身份证号
    validateIDCard(rule, value, callback) {
      if (!validIDCard(value)) {
        callback(new Error('身份证格式不正确'))
      } else {
        callback()
      }
    },
    getUrl(e, imgType) {
      if (imgType === 'frontImage') {
        this.form.frontImage = e
      } else if (imgType === 'backImage') {
        this.form.backImage = e
      } else if (imgType === 'companyImage') {
        this.form.companyImage = e
      }
    },
    next(word) {
      if (word === 'next') {
        if (this.applicant.length > 0 && this.respondent.length > 0) {
          this.$router.push({ name: 'step4' })
          return true
        }
        this.$message.warning('请添加申请人和被申请人！')
      } else {
        if (this.$store.state.user.userRole == 3) {
          this.$router.push({ name: 'step1' })
        } else {
          this.$router.push({ name: 'step' })
        }
      }
    },
    getLitigant() {
      const data = {
        lawCaseId: this.form.lawCaseId || window.localStorage.getItem('lawCaseId')
      }
      detailsCase(data).then(({ state, lawCase: { litigants }}) => {
        if (state === 100) {
          this.applicant = litigants.filter(item => item.litigationStatus.id === '4' && item.enable)
          this.respondent = litigants.filter(item => item.litigationStatus.id === '5' && item.enable)
        }
      })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.isLoading = true
        this.form.lawCaseId = window.localStorage.getItem('lawCaseId')
        this.form.frontImage = ''
        this.form.backImage = ''
        this.form.frontImage = this.files1.length > 0 ? this.files1[0].url : ''
        this.form.backImage = this.files1.length > 1 ? this.files1[1].url : ''
        if (this.changeLitigantType) {
          addLitigant(this.form).then(({ state, message }) => { // 添加自然人
            if (state === 100) {
              this.$message.success(message)
              this.getLitigant()
              this.clear()
            }
          }).finally(() => {
            this.isLoading = false
          })
        } else {
          if (this.litigantType == 1) {
            this.form.agentType = 1
          }
          if (this.litigantType == 2) {
            this.form.agentType = 2
          }
          addCompanyLit(this.form).then(({ state, message }) => { // 添加法人
            if (state === 100) {
              this.$message.success(message)
              this.getLitigant()
              this.clear()
            }
          }).finally(() => {
            this.isLoading = false
          })
        }
      })
    },
    handleChange() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.isLoading = true
        if (this.changeLitigantType) {
          this.form.frontImage = ''
          this.form.backImage = ''
          this.form.frontImage = this.files1.length > 0 ? this.files1[0].url : ''
          this.form.backImage = this.files1.length > 1 ? this.files1[1].url : ''
          const params = { ...this.form }
          params.identityCard = this.$refs.encryptInfo2.isdisabled ? this.$refs.encryptInfo2.input2 : params.identityCard // 如果没修改用解密后的数据
          params.litigantPhone = this.$refs.encryptInfo1.isdisabled ? this.$refs.encryptInfo1.input2 : params.litigantPhone
          editLitigant(params).then(({ state, message }) => {
            state === 100 && this.$message.success(message) && this.getLitigant()
          }).finally(() => {
            this.isLoading = false
          })
        } else {
          if (this.litigantType == 1) {
            this.form.agentType = 1
          }
          if (this.litigantType == 2) {
            this.form.agentType = 2
          }
          const params = { ...this.form }
          params.litigantPhone = this.$refs.encryptInfo3.isdisabled ? this.$refs.encryptInfo3.input2 : params.litigantPhone
          params.legalManPhone = this.$refs.encryptInfo4.isdisabled ? this.$refs.encryptInfo4.input2 : params.legalManPhone
          params.legalManId = this.$refs.encryptInfo5.isdisabled ? this.$refs.encryptInfo5.input2 : params.legalManId
          editCompanyLit(params).then(({ state, message }) => {
            state === 100 && this.$message.success(message) && this.getLitigant()
          }).finally(() => {
            this.isLoading = false
          })
        }
      })
    },
    Change() {
      this.isChange = false
      this.clear()
    },
    edit(item) {
      this.clear()
      console.log('-------')
      console.log(item)
      this.isChange = true
      this.form = {
        ...item,
        litigantId: item.id,
        name: item.litigantName,
        litigationStatus: Number(item.litigationStatus.id),
        sex: item.litigantSex
      }
      this.litigantType = item.litigantType
      this.form.identityType = this.form.identityType ? `${this.form.identityType}` : ''
      const list = []
      if (item.frontImage) {
        list.push(item.frontImage)
      }
      if (item.backImage) {
        list.push(item.backImage)
      }
      if (item.companyImage) {
        list.push(item.companyImage)
      }
      this.$refs.upload.assign(list)
      this.$nextTick(() => {
        this.$refs.encryptInfo1?.init(item.id)
        this.$refs.encryptInfo2?.init(item.id)
        this.$refs.encryptInfo3?.init(item.id)
        this.$refs.encryptInfo4?.init(item.id)
        this.$refs.encryptInfo5?.init(item.id)
      })
    },
    clear(e) {
      const litigationStatus = this.form.litigationStatus
      this.$refs.upload.clearFiles()
      this.$refs.companyImage.clearFiles()
      this.$refs['form'].resetFields()
      this.form.litigantId = ''
      this.form.name = ''
      this.form.litigantPhone = ''
      this.form.litigantTelPhone = ''
      this.form.identityCard = ''
      this.form.identityType = ''
      this.form.nation = ''
      this.form.sex = ''
      this.form.age = ''
      this.form.address = ''
      this.form.employer = ''
      this.form.legalManName = ''
      this.form.legalManPhone = ''
      this.form.legalManId = ''
      this.form.litigationStatus = litigationStatus
      this.litigantType = Number(e) || 0
    },
    getIdCard(e) {
      if (this.litigantType !== 0 || this.form.identityType != 1) {
        return
      }
      if (!/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(e)) {
        return
      }
      getBirAgeSex({ idCardNo: e }).then(res => {
        if (res.state === 100) {
          this.form.age = res.age
          this.form.sex = res.sexCode == 'M' ? 0 : 1
          this.form.birthday = res.birthday
        }
      })
    }
  }
}
</script>
<style lang = "scss">
  .el-form-item {
    margin-bottom: 18px;
  }
</style>
<style scoped lang = "scss">

</style>
