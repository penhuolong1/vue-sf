<template>
  <!-- 添加联动单位 -->
  <div>
    <el-dialog
      v-if="dialogVisible"
      :title="courtId?'解纷组织':'解纷组织'"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      append-to-body
      width="78%"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="18">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="courtName" label="单位名称">
                  <span v-if="authorityType == 1 || authorityType === 0">{{ ruleForm.courtName || '' }}</span>
                  <el-input v-else v-model="ruleForm.courtName" placeholder="请输入单位名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="parentCourtIds" label="隶属单位">
                  <!-- 只有诉非才能编辑隶属单位 -->
                  <span v-if="courtId && getUserInfo.courtId != 1">{{ detailInfo.parentCourtName || '' }}</span>
                  <el-select
                    v-else
                    v-model="ruleForm.parentCourtIds"
                    multiple
                    style="width: 100%;"
                    placeholder="请选择所属级别"
                    filterable
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="mediateType" label="解纷类型">
                  <span v-if="authorityType === 0">{{ detailInfo.mediateType }}</span>
                  <el-select
                    v-else
                    v-model="ruleForm.mediateType"
                    style="width: 100%;"
                    multiple
                    placeholder="请选择解纷类型"
                  >
                    <el-option
                      v-for="(item, index) in disputeArr"
                      :key="index"
                      :label="item.name"
                      :value="item.index"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="orgType" label="组织类型">
                  <span v-if="authorityType === 0">{{ detailInfo.orgType }}</span>
                  <el-select
                    v-else
                    v-model="ruleForm.orgType"
                    style="width: 100%;"
                    multiple
                    placeholder="请选择组织类型"
                  >
                    <el-option
                      v-for="item in organizationArr"
                      :key="item.index"
                      :label="item.name"
                      :value="item.index"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="partTime" label="接入时间">
                  <span v-if="authorityType === 0">{{ detailInfo.partTime | timeDate }}</span>
                  <el-date-picker
                    v-else
                    v-model="ruleForm.partTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择接入时间"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="办公地址">
                  <span v-if="authorityType === 0">{{ detailInfo.address }}</span>
                  <el-input v-else v-model="ruleForm.address" placeholder="请输入办公地址" />
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="!(authorityType === 0 && !ruleForm.caseManagers[0].name && !ruleForm.caseManagers[0].phone)">
              <el-row
                v-for="(item, index) in ruleForm.caseManagers"
                :key="index+'caseManagers'"
                class="btn-wrapper"
                :gutter="20"
              >
                <el-col :span="12">
                  <el-form-item
                    label="案管人员"
                    :prop="'caseManagers.' + index + '.name'"
                  >
                    <el-input v-if="!item.id" v-model="item.name" placeholder="请输入案管人员姓名" />
                    <span v-if="item.id">{{ item.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="联系方式"
                    :prop="'caseManagers.' + index + '.phone'"
                  >
                    <el-input v-if="!item.id" v-model="item.phone" placeholder="请输入联系方式" />
                    <!-- <span v-if="item.id">{{ item.phone }}</span> -->
                    <lookphone1 v-if="item.id" :id="item.id" v-model="item.phone" class="lookphone1" :phone="item.phone" encrypt-type="mediater" />
                  </el-form-item>
                </el-col>
                <div v-if="authorityType !== 0" class="btn">
                  <el-button icon="el-icon-minus" circle size="small" @click="delCaseManagers(index, item.id)" />
                  <el-button
                    v-show="index == ruleForm.caseManagers.length-1"
                    type="primary"
                    icon="el-icon-plus"
                    circle
                    size="small"
                    @click="addCaseManagers"
                  />
                </div>
              </el-row>
            </div>
            <div v-if="!(authorityType === 0 && !ruleForm.managers[0].name && !ruleForm.managers[0].phone)">
              <el-row
                v-for="(item, index) in ruleForm.managers"
                :key="index+'managers'"
                class="btn-wrapper"
                :gutter="20"
              >
                <el-col :span="12">
                  <el-form-item
                    label="管理员"
                  >
                    <el-input v-if="!item.id" v-model="item.name" placeholder="请输入管理员姓名" />
                    <span v-if="item.id">{{ item.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="联系方式"
                  >
                    <el-input v-if="!item.id" v-model="item.phone" placeholder="请输入联系方式" />
                    <!-- <span v-if="item.id">{{ item.phone }}</span> -->
                    <lookphone1 v-if="item.id" :id="item.id" v-model="item.phone" class="lookphone1" :phone="item.phone" encrypt-type="mediater" />
                  </el-form-item>
                </el-col>
                <div v-if="authorityType !== 0" class="btn">
                  <el-button icon="el-icon-minus" circle size="small" @click="delManagers(index, item.id)" />
                  <el-button
                    v-show="index == ruleForm.managers.length-1"
                    type="primary"
                    icon="el-icon-plus"
                    circle
                    size="small"
                    @click="addManagers"
                  />
                </div>
              </el-row>
            </div>
            <div v-if="!(authorityType === 0 && !ruleForm.linkMen[0].name && !ruleForm.linkMen[0].phone)">
              <el-row v-for="(item, index) in ruleForm.linkMen" :key="index" class="btn-wrapper" :gutter="20">
                <el-col :span="12">
                  <el-form-item label="联络人">
                    <el-input v-if="!item.id" v-model="item.name" placeholder="请输入联络人姓名" />
                    <span v-if="item.id">{{ item.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式">
                    <el-input v-if="!item.id" v-model="item.phone" placeholder="请输入联系方式" />
                    <!-- <span v-if="item.id">{{ item.phone }}</span> -->
                    <lookphone1 v-if="item.id" :id="item.id" v-model="item.phone" class="lookphone1" :phone="item.phone" encrypt-type="linkMan" />

                  </el-form-item>
                </el-col>
                <div v-if="authorityType !== 0" class="btn">
                  <el-button icon="el-icon-minus" circle size="small" @click="delLink(index, item.id)" />
                  <el-button
                    v-if="index===ruleForm.linkMen.length-1"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    circle
                    @click="addLink"
                  />
                </div>
              </el-row>
            </div>
            <el-row>
              <el-col :span="24">
                <el-form-item label="主要职责">
                  <span v-if="authorityType === 0">{{ detailInfo.duty }}</span>
                  <el-input v-else v-model="ruleForm.duty" type="textarea" :rows="3" placeholder="请输入主要职责" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="专业领域">
                  <span v-if="authorityType === 0">{{ detailInfo.scope }}</span>
                  <el-input v-else v-model="ruleForm.scope" type="textarea" :rows="3" placeholder="请输入专业领域" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="">
                  <tip text="创建的案管人员、管理员和联络人员的账号为手机号，初始密码sfld2020,请尽快通知相关人员进行密码修改" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6" style="text-align:center;">
            <div class="rbImg">
              <img v-if="avator" :src="avator" alt>
              <img v-if="!avator" src="@/assets/images/no.png" alt>
              <el-button v-if="authorityType !== 0" @click="upload">上传头像</el-button>
            </div>
            <input ref="file" type="file" style="display: none;" @change="getFile($event)">
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button
              v-if="authorityType !== 0"
              v-hasPermi="['team:organize:edit']"
              type="primary"
              @click="submitForm('ruleForm')"
            >{{ courtId?'编辑':'添加' }}</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCourtInfoByType,
  getCourtsByCourtId,
  listCourtByCourId,
  editCourtInfo,
  addCourt,
  getCourtByLevel,
  uploadImg,
  uploadFileBasic,
  editAuthority
} from '@/api/team/team'
import lookphone from './lookPhone'
import { validPhone } from '@/utils/validate'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
import lookphone1 from './lookPhone1'
import tip from '@/components/tip/index'
import {
  BASEIMGURL,
  SERVICEURL,
  OFFICE365RUL,
  OFFICE365ID,
  CASETYPE,
  ORGANIZATYPEMAP,
  HWYURL
} from '@/utils/constVal.js'
export default {
  name: 'AddOrganize',
  components: {
    tip,
    lookphone,
    lookphone1
  },
  data() {
    return {
      // 所属级别
      courtLevelArr: [
        { name: '区级', index: 2 },
        { name: '街道', index: 3 }
      ],
      // 解纷类型
      disputeArr: [
      ],
      // 组织类型
      organizationArr: [
      ],
      organizationMap: {
      },
      disputeMap: {
      },
      // 上级单位
      options: [],
      // 添加对话框
      dialogVisible: false,
      courtId: '',
      // 添加绑定的表单数据
      ruleForm: {
        cId: '',
        id: '',
        name: '', // 名字
        courtLevel: '', // 级别
        linkMen: [
          {
            name: '', // 联络人姓名
            phone: '' // 号码
          }
        ],
        caseManagers: [
          {
            name: '', // 联络人姓名
            phone: '' // 号码
          }
        ],
        managers: [
          {
            name: '', // 联络人姓名
            phone: '' // 号码
          }
        ],
        address: '', // 地址
        fileUrl: '', // 文件路径
        mediateType: '', // 解纷类型
        orgType: '', // 组织类型
        imgPath: '', // 机构照片
        partTime: '', // 接入时间
        parentCourtId: '' // 上级单位ID
      },
      detailInfo: {
        parentCourtName: null
      }, // 机构详情
      // 表单验证规则
      rules: {
        courtLevel: [
          { required: true, message: '请选择级别', trigger: 'blur,change' }
        ],
        parentCourtIds: [
          { required: true, message: '请选择隶属单位', trigger: 'blur,change' }
        ],
        parentCourtId: [
          { required: true, message: '请选择上级单位', trigger: 'blur,change' }
        ],
        mediateType: [
          { required: true, message: '请选择解纷类型', trigger: 'blur,change' }
        ],
        orgType: [
          { required: true, message: '请选择组织类型', trigger: 'blur,change' }
        ],
        courtName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        partTime: [
          { required: true, message: '请输入接入时间', trigger: 'blur' }
        ]
      },
      fileList: [],
      avator: '',
      courtLevelName: '',
      parentName: '',
      authorityType: null, // 1部分可以修改 0不能修改 2 都能修改
      parentCourtName: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    this.getDisputeArr()
  },
  mounted() {},
  methods: {
    // 获取解纷类型和组织类型
    getDisputeArr() {
      this.disputeArr = []
      this.disputeMap = {}
      for (const key in CASETYPE) {
        this.disputeArr.push({ name: CASETYPE[key], index: key })
        this.disputeMap[CASETYPE[key]] = key
      }
      this.organizationArr = []
      for (const key in ORGANIZATYPEMAP) {
        this.organizationArr.push({ name: ORGANIZATYPEMAP[key], index: key })
        this.organizationMap[ORGANIZATYPEMAP[key]] = key
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
    // 查联动单位
    listCourtFn(e) {
      const params = {
        pageSize: 1000,
        courtType: 1,
        type: 2,
        courtId: this.getUserInfo.courtId
      }
      listCourtByCourId(params).then((res) => {
        if (res.state === 100) {
          this.options = res.content
        }
      })
    },
    // 处理数组
    getAry(ary1, str) {
      const ary = [...ary1]
      let flag = false
      if (ary && ary.length > 0) {
        for (let i = 0; i < ary.length; i++) {
          const item = ary[i]
          if (!item.name && !item.phone) {
            ary.splice(i, 1)
          }
          if (item.name && !item.phone) {
            this.$message.error(`请输入${str}的手机号`)
            flag = true
            break
          }
          if (!item.name && item.phone) {
            this.$message.error(`请输入${str}的姓名`)
            flag = true
            break
          }
        }
      }
      console.log(ary)
      return { newAry: ary, flag }
    },
    // 添加表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          const params = {
            type: 2,
            linkMen: this.ruleForm.linkMen,
            managers: this.ruleForm.managers,
            caseManagers: this.ruleForm.caseManagers,
            mediateType: this.ruleForm.mediateType.toString(), // 解纷类型
            orgType: this.ruleForm.orgType.toString(), // 组织类型
            parentCourtIds: this.ruleForm.parentCourtIds, // 上级机构ID
            courtName: this.ruleForm.courtName,
            partTime: this.ruleForm.partTime, // 时间
            address: this.ruleForm.address, // 地址
            duty: this.ruleForm.duty,
            scope: this.ruleForm.scope,
            imgPath: this.imgUrl, // 机构照片N
            fileUrl: this.fileList
              ? this.fileList.map((item) => item.url).join(',')
              : '' // 文件路径N
          }
          if (this.courtId) {
            params.courtId = this.courtId
          }
          const linkMenObj = this.getAry(this.ruleForm.linkMen, '联络人')
          if (linkMenObj.flag) {
            return
          } else {
            params.linkMen = linkMenObj.newAry
          }
          const managersObj = this.getAry(this.ruleForm.managers, '管理员')
          if (managersObj.flag) {
            return
          } else {
            params.managers = managersObj.newAry
          }
          const caseManagersObj = this.getAry(this.ruleForm.caseManagers, '案管人员')
          if (caseManagersObj.flag) {
            return
          } else {
            params.caseManagers = caseManagersObj.newAry
          }
          console.log(params)
          editCourtInfo(params).then((res) => {
            console.log(res)
            if (res.state == 100) {
              this.$message.success(res.message)
              this.dialogVisible = false
              this.resetForm('ruleForm')
              this.$emit('done')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 上传依据
    uploadSectionFile(e) {
      console.log(e)
      var fileObj = e.file
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      this.$Message.loading({
        content: '正在上传，请稍后...',
        duration: 0
      })
      uploadFileBasic(form).then((res) => {
        this.$Message.destroy()
        if (res.state === 100) {
          const url = res.url.split('/')
          const obj = {
            name: url[url.length - 1],
            url: res.url
          }
          this.fileList.push(obj)
          console.log(this.fileList[0].url)
        }
      })
    },
    // 移除
    handleRemove(e) {
      const index = this.fileList.findIndex((item) => item.uid == e.uid)
      this.fileList.splice(index, 1)
      console.log(this.fileList)
    },
    // 提示
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传头像
    upload() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    // 上传头像
    getFile(e) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      this.isEditData = true
      param.append('file', file) // 通过append向form对象添加数据
      uploadImg(param).then((res) => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.imgUrl = res.data.imgPath
          this.avator = `${res.data.imgPath}`
        }
      })
    },
    // 添加联系人
    addLink() {
      const obj = {
        name: '',
        phone: ''
      }
      this.ruleForm.linkMen.push(obj)
    },
    // 删除联系人
    delLink(index) {
      if (this.ruleForm.linkMen.length == 1) {
        // this.$message.error('联络人至少保留一位')
        this.ruleForm.linkMen = [{
          name: '',
          phone: ''
        }]
        return
      }
      this.ruleForm.linkMen.splice(index, 1)
    },
    // 添加案管人员
    addCaseManagers() {
      const obj = {
        name: '',
        phone: ''
      }
      this.ruleForm.caseManagers.push(obj)
    },
    // 删除案管人员
    delCaseManagers(index) {
      if (this.ruleForm.caseManagers.length == 1) {
        // this.$message.error('案管人员至少保留一位')
        this.ruleForm.caseManagers = [{
          name: '',
          phone: ''
        }]
        return
      }
      this.ruleForm.caseManagers.splice(index, 1)
    },
    // 添加管理员
    addManagers() {
      const obj = {
        name: '',
        phone: ''
      }
      this.ruleForm.managers.push(obj)
    },
    // 删除管理员
    delManagers(index) {
      if (this.ruleForm.managers.length == 1) {
        // this.$message.error('管理员至少保留一位')
        this.ruleForm.managers = [{
          name: '',
          phone: ''
        }]
        return
      }
      this.ruleForm.managers.splice(index, 1)
    },
    // 显示模态框
    show() {
      this.dialogVisible = true
      this.listCourtFn()
    },
    _getCourtInfoByType(courtId, parentCourtId) {
      editAuthority({ courtId: courtId }).then(res => {
        if (res.state === 100) {
          this.authorityType = res.authorityType
        }
      })
      this.courtId = courtId
      const params = {
        type: 2,
        courtId,
        parentCourtId: parentCourtId ? parentCourtId.split(',')[0] : ''
      }
      getCourtInfoByType(params).then((res) => {
        console.log(res)
        this.dialogVisible = true
        if (res.state === 100) {
          this.detailInfo = res.data[0]
          this.ruleForm = {
            id: res.data[0].id,
            courtName: res.data[0].name, // 名字
            courtLevel: res.data[0].courtLevel, // 级别
            linkMen:
              res.data[0].linkInfo && res.data[0].linkInfo.length > 0
                ? res.data[0].linkInfo
                : [
                  {
                    name: '',
                    phone: ''
                  }
                ],
            caseManagers: res.data[0].caseMediators && res.data[0].caseMediators.length > 0 ? res.data[0].caseMediators.map(item => {
              return {
                id: item.id,
                name: item.name,
                phone: item.phone
              }
            }) : [{
              name: '',
              phone: ''
            }],
            managers: res.data[0].adminMediators && res.data[0].adminMediators.length > 0 ? res.data[0].adminMediators.map(item => {
              return {
                id: item.id,
                name: item.name,
                phone: item.phone
              }
            }) : [{
              name: '',
              phone: ''
            }],
            address: res.data[0].address, // 地址
            fileUrl: res.data[0].fileUrl, // 文件路径
            mediateType: res.data[0].mediateType, // 解纷类型
            orgType: res.data[0].orgType, // 组织类型
            imgPath: res.data[0].orgSign, // 机构照片
            partTime: res.data[0].partTime
              ? formatDate(new Date(res.data[0].partTime), 'YYYY-MM-DD')
              : '', // 接入时间
            parentCourtIds: res.data[0].parentUid
              ? res.data[0].parentUid.split(',')
              : [], // 上级单位ID
            duty: res.data[0].duties,
            scope: res.data[0].scope
          }
          this.parentCourtName = res.data[0].parentCourtName
          this.imgUrl = res.data[0].orgSign
          console.log(this.ruleForm)
          this.ruleForm.mediateType = this.ruleForm.mediateType
            ? this.ruleForm.mediateType.split('，')
            : ''
          this.ruleForm.mediateType = this.ruleForm.mediateType.map((item) => {
            return this.disputeMap[item]
          })
          this.ruleForm.orgType = this.ruleForm.orgType
            ? this.ruleForm.orgType.split('，')
            : ''
          console.log(this.ruleForm)
          this.ruleForm.orgType = this.ruleForm.orgType.map((item) => {
            return this.organizationMap[item]
          })
          this.avator = res.data[0].orgSign || ''
          if (res.data[0]?.orgSign.indexOf(HWYURL) == -1) {
            this.avator = SERVICEURL + res.data[0].orgSign
          }
          this.courtLevelName = res.data[0].courtLevel
          this.parentName = res.data[0].parentCourtName
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.addBox {
  width: 100%;
  height: 50px;
  background: #e5f1fc;
  color: #007aff;
  line-height: 50px;
  text-align: center;
}
.rbImg {
  width: 170px;
  height: 219px;
  img {
    width: 100%;
    height: 100%;
  }
  float: right;
}
.btn-wrapper {
  position: relative;
  .btn {
    width: 80px;
    text-align: left;
    position: absolute;
    top: 3px;
    right: -80px;
  }
}
</style>
