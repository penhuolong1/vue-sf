<template>
  <el-form id="form1" ref="form" :model="form" label-width="150px">
    <el-row>
      <el-col :span="20">
        <el-form-item label="申请人类型" prop="litigantype">
          <el-select v-model="litigantype" placeholder="请选择" @change="selectType">
            <el-option
              v-for="item in litigantypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 自然人 -->
    <div v-if="litigantype== 0">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
            <el-input v-model="form.name" type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="民族">
            <el-input v-model="form.nation" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="性别">
            <el-select v-model="form.sex" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="年龄">
            <el-input v-model="form.age" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="证件类型" prop="identityType" :rules="isNeedRules ?[{ required: true, message: '请选择证件类型', trigger: 'blur' }]:[]">
            <el-select v-model="form.identityType" placeholder="请选择">
              <el-option
                v-for="item in identypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 为申请人时身份证号必填 -->
      <el-row v-if="form.identityType > 0">
        <el-col :span="20">
          <el-form-item label="证件号码" prop="identityCard" :rules="isNeedRules ? identityCardRules : ''">
            <!-- <el-input v-model="form.identityCard" type="text" @input="getCardId" /> -->
            <encryptInfo :id="form.litigantId" ref="encryptInfo1" v-model="form.identityCard" type="identityCard" :litigant-type="1" :placeholder="'请输入证件号码'" @input="getCardId" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item
            label="手机号码"
            prop="litigantPhone"
            :rules="isNeedRules ? [{ required: true, message: '请输入手机号码', trigger: 'blur' }]: []"
          >
            <!-- <el-input v-model="form.litigantPhone" type="text" /> -->
            <encryptInfo :id="form.litigantId" ref="encryptInfo2" v-model="form.litigantPhone" type="litigantPhone" :litigant-type="1" :placeholder="'请输入手机号码'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item prop="birthday" label="出生日期" style="width: 100%;">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              style="width: 100%;"
              placeholder="选择出生日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="地址" prop="address" :rules="isNeedRules ? [{ required: true, message: '请输入地址', trigger: 'blur' }]:[]">
            <el-input v-model="form.address" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="邮箱" prop="email" :rules="[{ validator: validdateEmail, trigger: ['change', 'blur'] }]">
            <el-input v-model="form.email" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="工作单位或职务">
            <el-input v-model="form.employer" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <!-- 法人 -->
    <div v-if="litigantype== 1 || litigantype== 2">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="公司名" prop="name" :rules="[{ required: true, message: '请输入公司名', trigger: 'blur' }]">
            <el-input v-model="form.name" type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="统一信用代码" prop="identityCard" :rules="isNeedRules ? [{ required: true, message: '请输入统一信用代码', trigger: 'blur' }]:[]">
            <el-input v-model="form.identityCard" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="联系方式">
            <encryptInfo :id="form.litigantId" ref="encryptInfo3" v-model="form.litigantPhone" type="litigantPhone" :litigant-type="1" :placeholder="'请输入手机号码'" />
            <!-- <el-input v-model="form.litigantPhone" type="text" /> -->
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="法定代表人姓名" prop="legalManName" :rules="isNeedRules ? [{ required: true, message: '请输入法定代表人姓名', trigger: 'blur' }]:[]">
            <el-input v-model="form.legalManName" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="邮箱" prop="email" :rules="[{ validator: validdateEmail, trigger: ['change', 'blur'] }]">
            <el-input v-model="form.email" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="法定代表人手机号" prop="legalManPhone">
            <!-- <el-input v-model="form.legalManPhone" type="text" /> -->
            <encryptInfo :id="form.litigantId" ref="encryptInfo4" v-model="form.legalManPhone" type="legalManPhone" :litigant-type="1" :placeholder="'请输入手机号码'" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="20">
          <el-form-item label="证件类型" prop="identityType">
            <el-select v-model="form.identityType" placeholder="请选择">
              <el-option
                v-for="item in identypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="法定代表人证件号" prop="legalManId">
            <encryptInfo :id="form.litigantId" ref="encryptInfo5" v-model="form.legalManId" type="legalManId" :litigant-type="1" :placeholder="'请输入证件号码'" />
            <!-- <el-input v-model="form.legalManId" type="text" /> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="公司注册地址" prop="address" :rules="isNeedRules ? [{ required: true, message: '请输入公司注册地址', trigger: 'blur' }]: []">
            <el-input v-model="form.address" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-row v-if="litigantype== 0">
      <el-col :span="20">
        <el-form-item label="证件照片上传">
          <upload
            ref="upload"
            v-model="fileList"
            accept=".jpg,.png"
            :limit="2"
            action="/api/court/wxRegister/uploadFrontImage.jhtml"
            tip="(照片最多上传2张)"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="litigantype== 1 || litigantype== 2">
      <el-col :span="20">
        <el-form-item label="公司营业执照">
          <uploadFile
            ref="companyImage"
            img-type="companyImage"
            :is-upload="form.companyImage"
            @getUrl="getUrl"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { IDENTITYMAP, SERVICEURL, LITIGANTTYPEMAP } from '@/utils/constVal.js'
import { validPhone, validIDCard, validEmail } from '@/utils/validate'
import { getBirAgeSex } from '@/api/litigant/litigant'
import upload from '@/components/upload'
import { addLitigant, selectLitigant, editLitigant, addCompanyLit, editCompanyLit, uploadImg } from '@/api/case/index.js'
import { mapGetters } from 'vuex'
import encryptInfo from '@/components/encryptInfo'
import uploadFile from '@/components/addCase/uploadFile'
export default {
  components: {
    uploadFile,
    upload,
    encryptInfo
  },
  props: {
    litigantId: {
      type: String,
      default: null
    },
    // 案件地位
    caseStatus: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      identypeData: [],
      litigantypeList: [],
      litigantype: 0,
      form: {
      },
      sexOptions: [
        {
          value: 0,
          label: '男'
        },
        {
          value: 1,
          label: '女'
        }
      ],
      fileList: [],
      litigationStatus: null
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo']),
    identityCardRules() {
      let rules = []
      if (this.form.identityType == 1) {
        rules = [
          {
            required: true,
            message: '请输入证件号码',
            trigger: ['change', 'blur']
          }
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
      return rules
    },
    isNeedRules() {
      let flag = true
      if (this.litigationStatus == 5) {
        flag = false
      } else {
        if (this.caseStatus == 2) {
          flag = false
        }
      }
      return flag
    }
  },
  watch: {
    litigantId() {
    },
    caseStatus() {
    }
  },
  created() {
  },
  mounted() {
    this.getIdentypeData()
  },
  methods: {
    // 清空验证消息
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    // 验证身份证号
    validateIDCard(rule, value, callback) {
      if (!validIDCard(value)) {
        callback(new Error('身份证格式不正确'))
      } else {
        callback()
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
    // 验证手机号
    validatePhone(rule, value, callback) {
      if (!validPhone(value)) {
        callback(new Error('手机号码格式不正确'))
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
    // 获取证件类型和当事人类型
    getIdentypeData() {
      this.identypeData = []
      for (const key in IDENTITYMAP) {
        this.identypeData.push({
          value: parseInt(key),
          label: IDENTITYMAP[key]
        })
      }
      this.litigantypeList = []
      for (const key in LITIGANTTYPEMAP) {
        this.litigantypeList.push({
          value: parseInt(key),
          label: LITIGANTTYPEMAP[key]
        })
      }
    },
    // 保存
    save() {
      const params = JSON.parse(JSON.stringify(this.form))
      console.log(this.form)
      console.log(this.fileList)
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.litigantId) { // 假如没有当事人id为添加事件
            params.lawCaseId = this.getCaseInfo.id
            params.litigationStatus = this.caseStatus == 1 ? 4 : 5
            if (this.litigantype === 0) { // 自然人
              params.backImage = this.fileList.length > 1 ? this.fileList[1].url : ''
              params.frontImage = this.fileList.length > 0 ? this.fileList[0].url : ''
              addLitigant(params).then(res => {
                if (res.state === 100) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success'
                  })
                  this.$emit('saveSuccess')
                }
              })
            } else { // 法人
              if (this.litigantype == 1) {
                params.agentType = 1
              } else {
                params.agentType = 2
              }
              addCompanyLit(params).then(res => {
                if (res.state === 100) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success'
                  })
                  this.$emit('saveSuccess')
                }
              })
            }
          } else {
            if (this.litigantype === 0) { // 自然人
              params.identityCard = this.$refs.encryptInfo1.isdisabled ? this.$refs.encryptInfo1.input2 : params.identityCard // 如果没修改用解密后的数据
              params.litigantPhone = this.$refs.encryptInfo2.isdisabled ? this.$refs.encryptInfo2.input2 : params.litigantPhone
            } else {
              params.litigantPhone = this.$refs.encryptInfo3.isdisabled ? this.$refs.encryptInfo3.input2 : params.litigantPhone
              params.legalManPhone = this.$refs.encryptInfo4.isdisabled ? this.$refs.encryptInfo4.input2 : params.legalManPhone
              params.legalManId = this.$refs.encryptInfo5.isdisabled ? this.$refs.encryptInfo5.input2 : params.legalManId
            }
            if (this.litigantype == 0) { // 自然人
              params.backImage = this.fileList.length > 1 ? this.fileList[1].url : ''
              params.frontImage = this.fileList.length > 0 ? this.fileList[0].url : ''
              editLitigant(params).then(res => {
                if (res.state === 100) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success'
                  })
                  this.$emit('saveSuccess')
                }
              })
            } else {
              if (this.litigantype == 1) {
                params.agentType = 1
              } else {
                params.agentType = 2
              }
              editCompanyLit(params).then(res => {
                if (res.state === 100) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success'
                  })
                  this.$emit('saveSuccess')
                }
              })
            }
          }
        } else {
          this.$message.error('请完善表单信息')
        }
      })
    },
    // 查询当事人详情
    getLitigantDetail() {
      if (!this.litigantId) {
        return
      }
      this.fileList = []
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
        this.$refs.companyImage && this.$refs.companyImage.reset()
      })
      selectLitigant({ litigantId: this.litigantId }).then(res => {
        if (res.state === 100) {
          const data = res.litigant
          this.litigantype = data.litigantType
          this.litigationStatus = data.litigationStatus.id
          if (data.litigantType === 0) {
            this.form = {
              identityType: data.identityType,
              name: data.litigantName,
              nation: data.nation,
              sex: data.litigantSex,
              age: data.age,
              identityCard: data.identityCard,
              litigantPhone: data.litigantPhone,
              address: data.address,
              employer: data.employer,
              birthday: data.birthday,
              litigantId: this.litigantId,
              email: data.email,
              frontImage: data.frontImage,
              backImage: data.backImage
            }
            if (data.frontImage) {
              this.fileList.push(data.frontImage)
            }
            if (data.backImage) {
              this.fileList.push(data.backImage)
            }
          } else {
            this.form = {
              identityType: data.identityType,
              name: data.litigantName,
              identityCard: data.identityCard,
              litigantPhone: data.litigantPhone,
              address: data.address,
              legalManName: data.legalManName,
              legalManPhone: data.legalManPhone,
              legalManId: data.legalManId,
              litigantId: this.litigantId,
              email: data.email,
              companyImage: data.companyImage
            }
          }
          this.$nextTick(() => {
            this.$refs.encryptInfo1 && this.$refs.encryptInfo1.init()
            this.$refs.encryptInfo2 && this.$refs.encryptInfo2.init()
            this.$refs.encryptInfo3 && this.$refs.encryptInfo3.init()
            this.$refs.encryptInfo4 && this.$refs.encryptInfo4.init()
            this.$refs.encryptInfo5 && this.$refs.encryptInfo5.init()
          })
          console.log(this.fileList)
          this.$refs.upload.assign(this.fileList)
        }
      })
    },
    // 选择类型
    selectType(index) {
      const items = document.getElementById('form1').querySelectorAll('.el-form-item')
      this.$nextTick(() => { // 清空留下来的验证的信息
        items.forEach(item => {
          item.classList.remove('is-error')
        })
        const paras = document.getElementsByClassName('el-form-item__error')
        paras.forEach(item => {
          if (item != null) {
            item.parentNode.removeChild(item)
          }
        })
        paras.forEach(item => {
          if (item != null) {
            item.parentNode.removeChild(item)
          }
        })
      })
    },
    // 通过身份证号获取年龄和性别
    getCardId(e) {
      if (this.form.identityType != 1) {
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
          this.$forceUpdate()
        }
      })
    },
    // 自定义上传事件
    uploadSectionFile(e, index) {
      console.log(e)
      console.log(index)
      const action = e.action
      var fileObj = e.file
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      this.$Message.loading({
        content: '正在上传，请稍后...',
        duration: 0
      })
      uploadImg(form).then(res => {
        this.$Message.destroy()
        if (res.state === 100) {
          const url = res.url.split('/')
          const obj = {
            name: url[url.length - 1],
            url: res.url
          }
          if (action == 1) { // 自然人身份证正面照片
            this.frontImage = []
            this.frontImage.push(obj)
          } else if (action == 2) { // 自然人身份证反面照片
            this.backImage = []
            this.backImage.push(obj)
          }
          console.log(this.frontImage)
          console.log(this.backImage)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
