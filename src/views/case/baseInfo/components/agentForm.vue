<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="150px">
    <el-row>
      <el-col :span="20">
        <el-form-item label="代理人类型" prop="agentType">
          <el-select v-model="form.agentType" placeholder="请选择">
            <el-option
              v-for="item in agentTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="当事人" prop="litigantId">
          <el-select v-model="form.litigantId" placeholder="请选择">
            <el-option
              v-for="item in litigantData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" type="text" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="民族">
          <el-input v-model="form.nation" type="text" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="证件号码" prop="agentIdentiCard">
          <!-- <el-input v-model="form.agentIdentiCard" type="text" @input="getCardId" /> -->
          <encryptInfo :id="form.lawyerId" ref="encryptInfo1" v-model="form.agentIdentiCard" type="agentIdentiCard" :litigant-type="2" :placeholder="'请输入证件号码'" @input="getCardId" />
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
          <el-input v-model="form.years" type="number" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="手机号码" prop="agentMobile">
          <!-- <el-input v-model="form.agentMobile" type="text" /> -->
          <encryptInfo :id="form.lawyerId" ref="encryptInfo2" v-model="form.agentMobile" type="agentMobile" :litigant-type="2" :placeholder="'请输入手机号码'" @input="getCardId" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="text" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="邮箱" prop="agentEmail">
          <el-input v-model="form.agentEmail" type="text" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-form-item label="工作单位或职务">
          <el-input v-model="form.unitInfo" type="text" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="form.agentType == 1" :span="20">
        <el-form-item label="律师证件号" prop="lawyerNum">
          <el-input v-model="form.lawyerNum" type="text" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="form.agentType == 4" :span="20">
        <el-form-item label="亲属关系" prop="partyRelationString">
          <el-input v-model="form.partyRelationString" type="text" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="相关资料上传">
      <el-upload
        class="upload-demo"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        action=""
        accept=".jpg,.png"
        :limit="2"
        :before-upload="beforeAvatarUpload"
        :on-exceed="handleExceed"
        :http-request="uploadSectionFile"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，不能超过2份</div>
      </el-upload>
    </el-form-item>
    <el-row>
      <el-col class="check-group-wrapper">
        <p>是否授权代理人代理相关事项：（是请勾选）</p>
        <div class="check-group">
          <el-checkbox-group v-model="checkList">
            <div class="check-wrapper">
              <el-checkbox label="1">
                <span>代为申请解纷或者要求终止解纷</span>
              </el-checkbox>
            </div>
            <div class="check-wrapper">
              <el-checkbox label="2">
                <span>代为收集、提供证据</span>
              </el-checkbox>
            </div>
            <div class="check-wrapper">
              <el-checkbox label="3">
                <span>代为选择或者接受人民解纷员</span>
              </el-checkbox>
            </div>
            <div class="check-wrapper">
              <el-checkbox label="4">
                <span>代为承认、变更和放弃解纷请求</span>
              </el-checkbox>
            </div>
            <div class="check-wrapper">
              <el-checkbox label="5">
                <span>代为参加解纷，签署调查记录、解纷记录、权利义务告知书、人民解纷协议书等法律文书</span>
              </el-checkbox>
            </div>
            <div class="check-wrapper">
              <el-checkbox label="6">
                <span>代为领取相关法律文书等</span>
              </el-checkbox>
            </div>
            <div class="check-wrapper">
              <el-checkbox label="7">
                <span>其他委托事项：</span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="isShowTextarea" :span="20">
        <el-form-item label="其他委托事项" prop="otherAuthority">
          <el-input v-model="form.otherAuthority" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <preview ref="preview" />
  </el-form>
</template>

<script>
import { AGENTTYPEMAP, SERVICEURL } from '@/utils/constVal.js'
import { mapGetters } from 'vuex'
import { addLawyer, detailById, uploadImg } from '@/api/case/index'
import { getBirAgeSex } from '@/api/litigant/litigant'
import { validEmail } from '@/utils/validate'
import { limitFileSize } from '@/utils/tools.js'
import encryptInfo from '@/components/encryptInfo'
import preview from '@/components/preview/index'
export default {
  components: {
    preview,
    encryptInfo
  },
  props: {
    lawyerId: {
      type: String,
      default: null
    },
    lawParentId: {
      type: String,
      default: null
    }
  },
  data() {
    const validdateEmail = (rule, value, callback) => {
      if (value && !validEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      checkList: [],
      agentTypeData: [],
      form: {},
      fileList: [],
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
      rules: {
        agentType: [
          { required: true, message: '请选择代理人类型', trigger: 'blur' }
        ],
        litigantId: [
          { required: true, message: '请选择当事人类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        agentIdentiCard: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        agentMobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        lawyerNum: [
          { required: true, message: '请输入律师号', trigger: 'blur' }
        ],
        partyRelationString: [
          { required: true, message: '请输入亲属关系', trigger: 'blur' }
        ],
        otherAuthority: [
          { required: true, message: '其他委托事项', trigger: 'blur' }
        ],
        agentEmail: [
          { validator: validdateEmail, trigger: ['change', 'blur'] }
        ]
      },
      litigantData: []
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo']),
    isShowTextarea() {
      return this.checkList.indexOf('7') != -1
    }
  },
  watch: {
  },
  created() {
    this.getAgentTypeData()
    this.getlitigantData()
  },
  mounted() {

  },
  methods: {
    beforeAvatarUpload(file) {
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return false
      }
    },
    getAgentTypeData() {
      for (const key in AGENTTYPEMAP) {
        this.agentTypeData.push({
          value: parseInt(key),
          label: AGENTTYPEMAP[key]
        })
      }
    },
    // 获取当事人信息
    getlitigantData() {
      const data = JSON.parse(JSON.stringify(this.getCaseInfo))
      if (data.litigants && data.litigants.length >= 0) {
        data.litigants.forEach(item => {
          if (item.enable) {
            const obj = {
              name: item.litigantName,
              id: item.id
            }
            this.litigantData.push(obj)
          }
        })
      }
    },
    // 保存
    save() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.$Message.loading({
          content: '正在添加，请稍后...',
          duration: 0
        })
        const params = { ...this.form }
        params.authority = this.checkList.join(',')
        if (this.fileList && this.fileList.length > 0) {
          params.frontImage = this.fileList[0].url
          params.backImage = this.fileList[1] ? this.fileList[1].url : ''
        }
        params.agentIdentiCard = this.$refs.encryptInfo1.isdisabled ? this.$refs.encryptInfo1.input2 : params.agentIdentiCard // 如果没修改用解密后的数据
        params.agentMobile = this.$refs.encryptInfo2.isdisabled ? this.$refs.encryptInfo2.input2 : params.agentMobile
        addLawyer(params).then(res => {
          this.$Message.destroy()
          if (res.state === 100) {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'success'
            })
            this.$emit('saveSuccess')
          }
        })
      })
    },
    // 获取详情
    detailById() {
      if (!this.lawyerId) {
        return
      }
      detailById({ lawyerId: this.lawyerId }).then(res => {
        const data = res.data
        if (res.state === 100) {
          this.form = {
            agentType: data.agentType,
            name: data.agentName,
            nation: data.nation,
            sex: data.sex,
            years: data.years,
            agentIdentiCard: data.agentIdentiCard,
            agentMobile: data.agentMobile,
            address: data.address,
            unitInfo: data.unitInfo,
            lawyerNum: data.lawerNum,
            partyRelationString: data.partyRelationString,
            lawyerId: data.id,
            agentEmail: data.agentEmail,
            litigantId: this.lawParentId,
            otherAuthority: data.otherAuthority
          }
          if (data.delegatedAuthority) {
            this.checkList = data.delegatedAuthority.split(',')
          }
          if (data.frontImage) {
            const url = data.frontImage.split('/')
            const obj = {
              name: url[url.length - 1],
              url: data.frontImage
            }
            this.fileList.push(obj)
          }
          if (data.backImage) {
            const url = data.backImage.split('/')
            const obj = {
              name: url[url.length - 1],
              url: data.backImage
            }
            this.fileList.push(obj)
          }
          this.$nextTick(() => {
            this.$refs.encryptInfo1?.init()
            this.$refs.encryptInfo2?.init()
          })
        }
      })
    },
    // 预览
    handlePreview(e) {
      // this.visible = true
      this.lookUrl = `${SERVICEURL}${e.url}`
      this.$refs.preview.show(e.url, [])
      // window.open(this.lookUrl)
    },
    // 移除文件
    handleRemove(e) {
      const index = this.fileList.findIndex(item => item.uid == e.uid)
      this.fileList.splice(index, 1)
      console.log(this.fileList)
    },
    // 文件超出个数触发
    handleExceed() {
      this.$message({
        showClose: true,
        message: `文件最多不能超过2个`,
        type: 'error'
      })
    },
    // 通过身份证号获取年龄和性别
    getCardId(e) {
      if (!/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(e)) {
        return
      }
      getBirAgeSex({ idCardNo: e }).then(res => {
        if (res.state === 100) {
          this.form.years = Number(res.age)
          this.form.sex = res.sexCode == 'M' ? 0 : 1
          this.$forceUpdate()
        }
      })
    },
    // 自定义上传事件
    uploadSectionFile(e) {
      console.log(e)
      var fileObj = e.file
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      uploadImg(form).then(res => {
        if (res.state === 100) {
          const url = res.url.split('/')
          const obj = {
            name: url[url.length - 1],
            url: res.url
          }
          this.fileList.push(obj)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.check-group-wrapper {
  padding-left: 50px;
  .check-wrapper {
    margin-top: 5px;
    text-align: left;
  }
}
</style>
