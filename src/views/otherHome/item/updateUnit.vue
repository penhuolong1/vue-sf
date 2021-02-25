<template>
  <!-- 编辑联动单位 -->
  <div>
    <el-button v-hasPermi="['team:unit:edit']" style="float: right; padding: 10px" type="text" class="el-icon-edit" @click="show">编辑</el-button>
    <el-dialog v-if="dialogVisible" :title="form.title" :visible.sync="dialogVisible" append-to-body width="78%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-form">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属级别" prop="courtLevel">
                  <span>{{ detailInfo.courtLevel }}</span>
                  <!-- <span v-if="authorityType === 0 || authorityType === 1">{{ detailInfo.courtLevel }}</span>
                  <el-select
                    v-else
                    v-model="form.courtLevel"
                    :disabled="form.courtLevel == 1"
                    style="width: 100%;"
                    @change="selectLevel"
                  >
                    <el-option
                      v-for="item in courtLevelArr"
                      :key="item.index"
                      :label="item.name"
                      :value="item.index"
                      :disabled="item.disabled"
                    />
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col v-if="form.courtLevel != 1" :span="12">
                <el-form-item label="上级单位" prop="parentCourtId">
                  <span>{{ detailInfo.parentCourtName }}</span>
                  <!-- <span v-if="authorityType === 0 || authorityType === 1">{{ detailInfo.parentCourtName }}</span>
                  <el-select
                    v-else
                    v-model="form.parentCourtId"
                    placeholder="请选择上级单位"
                    filterable
                    style="width: 100%;"
                    @change="selectParentId"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.courtUid"
                      :label="item.courtName"
                      :value="item.courtUid"
                    />
                  </el-select> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.courtLevel == 2" :gutter="20">
              <el-col :span="12">
                <el-form-item prop="flowCourtIds" label="分流中心">
                  <span>{{ detailInfo.flowCourtName }}</span>
                  <!-- <span v-if="authorityType === 0 || authorityType === 1">{{ detailInfo.flowCourtName }}</span>
                  <el-select
                    v-else
                    v-model="form.flowCourtIds"
                    placeholder="请选择所属级别"
                    multiple
                    style="width: 100%;"
                    @change="selectLevel"
                  >
                    <el-option
                      v-for="item in flowCourtData"
                      :key="item.courtUid"
                      :label="item.courtName"
                      :value="item.courtUid"
                    />
                  </el-select> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="调解类型" prop="mediateType">
                  <el-select
                    v-model="form.mediateType"
                    multiple
                    placeholder="请选择调解类型"
                    style="width: 100%;"
                    @change="selectMediateType"
                  >
                    <el-option
                      v-for="item in disputeArr"
                      :key="item.index"
                      :label="item.name"
                      :value="item.index"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织类型" prop="orgType">
                  <el-select
                    v-model="form.orgType"
                    multiple
                    placeholder="请选择组织类型"
                    style="width: 100%;"
                    @change="selectOrgType"
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
                <el-form-item label="单位名称" prop="name">
                  <span v-if="authorityType === 1">{{ detailInfo.name }}</span>
                  <el-input v-else v-model="form.name" placeholder="请输入单位名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="接入时间" prop="name">
                  <el-date-picker
                    v-model="form.partTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择接入时间"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="办公地址">
                  <el-input v-model="form.address" placeholder="请输入办公地址" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-for="(item, index) in form.caseManagers"
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
              <div class="btn">
                <el-button icon="el-icon-minus" circle size="small" @click="delCaseManagers(index, item.id)" />
                <el-button
                  v-show="index == form.caseManagers.length-1"
                  type="primary"
                  icon="el-icon-plus"
                  circle
                  size="small"
                  @click="addCaseManagers"
                />
              </div>
            </el-row>
            <el-row
              v-for="(item, index) in form.managers"
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
              <div class="btn">
                <el-button icon="el-icon-minus" circle size="small" @click="delManagers(index, item.id)" />
                <el-button
                  v-show="index == form.managers.length-1"
                  type="primary"
                  icon="el-icon-plus"
                  circle
                  size="small"
                  @click="addManagers"
                />
              </div>
            </el-row>
            <el-row v-for="(item, index) in form.linkMen" :key="index" class="btn-wrapper" :gutter="20">
              <el-col :span="12">
                <el-form-item label="联络人">
                  <el-input v-if="!item.id" v-model="item.name" placeholder="请输入联络人姓名" />
                  <span v-if="item.id">{{ item.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系方式">
                  <el-input v-if="!item.id" v-model="item.phone" placeholder="请输入联系方式" />
                  <!-- <span v-if="item.id">{{ item.phone }}</span>
                   -->
                  <lookphone1 v-if="item.id" :id="item.id" v-model="item.phone" class="lookphone1" :phone="item.phone" encrypt-type="linkMan" />

                </el-form-item>
              </el-col>
              <div class="btn">
                <el-button icon="el-icon-minus" circle size="small" @click="delLink(index, item.id)" />
                <el-button
                  v-if="index===form.linkMen.length-1"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  circle
                  @click="addLink"
                />
              </div>
            </el-row>
          </el-col>
          <!-- <el-col :span="6" style="text-align:center;">
            <div class="rbImg">
              <img v-if="avator" :src="avator" alt>
              <img v-if="!avator" src="@/assets/images/no.png" alt>
              <el-button @click="upload">上传头像</el-button>
            </div>
            <input ref="file" type="file" style="display: none;" @change="getFile($event)">
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="主要职责">
              <el-input v-model="form.duties" type="textarea" :rows="3" placeholder="请输入主要职责" />
            </el-form-item>
            <el-form-item label="文件依据">
              <el-upload
                v-model="form.fileUrl"
                class="upload-demo"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                multiple
                action
                accept=".jpg, .png, .doc, .docx, .pdf"
                :limit="10"
                :on-exceed="handleExceed"
                :http-request="uploadSectionFile"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="">
              <tip text="创建的案管人员、管理员和联络人员的账号为手机号，初始密码sfld2020,请尽快通知相关人员进行密码修改" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">立即编辑</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <preview v-if="fileList1" ref="preview" :file-list="fileList1" :file-url="fileUrl1" />
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
import {
  BASEIMGURL,
  CASETYPE,
  ORGANIZATYPEMAP
} from '@/utils/constVal.js'
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/format.js'
import { validPhone } from '@/utils/validate'
import tip from '@/components/tip/index'
import { limitFileSize } from '@/utils/tools.js'
import preview from '@/components/preview/index'
import lookphone1 from './lookPhone1'
export default {
  name: 'UpdateUnit',
  components: {
    tip,
    preview,
    lookphone1
  },
  props: {
    // 父组件传入表单
    courtId: {
      type: String,
      default: ''
    },
    parentCourtId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false, // 编辑对话框
      // 所属级别
      courtLevelArr: [
        { name: '市级', index: 1, disabled: true },
        { name: '区级', index: 2 },
        { name: '街道级', index: 3 }
      ],
      // 调解类型
      disputeArr: [
      ],
      disputeMap: {
      },
      // 组织类型
      organizationArr: [
      ],
      //
      organizationMap: {
      },
      // 上级单位delLink
      options: [],
      // 表单验证规则
      rules: {
        courtLevel: [
          { required: true, message: '请选择级别', trigger: 'blur' }
        ],
        parentCourtId: [
          { required: true, message: '请选择上级单位', trigger: 'blur' }
        ],
        flowCourtIds: [
          { required: true, message: '请选择分流中心', trigger: 'blur' }
        ],
        mediateType: [
          { required: true, message: '请选择调解类型', trigger: 'blur' }
        ],
        orgType: [
          { required: true, message: '请选择组织类型', trigger: 'blur' }
        ],
        courtName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        partTime: [
          { required: true, message: '请输入接入时间', trigger: 'blur' }
        ]
      },
      // 文件
      fileList: [],
      avator: '',
      form: {},
      flowCourtData: [],
      authorityType: null, // 1部分可以修改 0不能修改 2 都能修改
      detailInfo: {},
      fileBasisAry: [], // 依据
      fileList1: [],
      fileUrl1: ''
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
    beforeAvatarUpload(file) {
      if (limitFileSize(file)) { // 限制文件大小不能超过20M
        return false
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
    show() {
      editAuthority({ courtId: this.courtId }).then(res => {
        if (res.state === 100) {
          if (res.authorityType === 0) {
            this.$message.error('您没有编辑该机构/组织的权限')
            return
          } else {
            this.authorityType = res.authorityType
            this.dialogVisible = true
            this._getCourtInfoByType()
            this.getCenterData()
          }
        }
      })
    },
    // 选择所属级别
    selectLevel(e) {
      const params1 = {
        level: e - 1,
        pageSize: 1000,
        courtType: 1
      }
      this.form.parentCourtId = ''
      getCourtByLevel(params1).then((res) => {
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
    // 编辑表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            type: 1,
            linkMen: this.form.linkMen,
            courtId: this.form.id,
            mediateType: this.form.mediateType.join(','), // 调解类型
            orgType: this.form.orgType.join(','), // 组织类型
            parentCourtIds: this.form.parentCourtId
              ? [this.form.parentCourtId]
              : '', // 上级机构ID
            courtName: this.form.name,
            courtLevel: this.form.courtLevel, // 所属级别
            partTime: this.form.partTime, // 时间
            address: this.form.address, // 地址
            duty: this.form.duties,
            imgPath: this.form.imgPath, // 机构照片N
            caseManagers: this.form.caseManagers,
            managers: this.form.managers,
            fileUrl:
              this.fileList && this.fileList.length > 0
                ? this.fileList.map((item) => item.url).join(',')
                : '',
            fileBasis: this.fileBasisAry && this.fileBasisAry.length > 0 ? this.fileBasisAry.join(',') : ''
          }
          if (params.courtLevel == 2) {
            params.flowCourtIds = this.form.flowCourtIds
          }
          const linkMenObj = this.getAry(this.form.linkMen, '联络人')
          if (linkMenObj.flag) {
            return
          } else {
            params.linkMen = linkMenObj.newAry
          }
          const managersObj = this.getAry(this.form.managers, '管理员')
          if (managersObj.flag) {
            return
          } else {
            params.managers = managersObj.newAry
          }
          const caseManagersObj = this.getAry(this.form.caseManagers, '案管人员')
          if (caseManagersObj.flag) {
            return
          } else {
            params.caseManagers = caseManagersObj.newAry
          }
          editCourtInfo(params).then((res) => {
            if (res.state == 100) {
              this.$message.success(res.message)
              this.dialogVisible = false
              this.$refs.form.clearValidate()
              this.$emit('updateSuccess')
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
      var fileObj = e.file
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      uploadFileBasic(form).then((res) => {
        if (res.state === 100) {
          const url = res.url.split('/')
          const obj = {
            name: url[url.length - 1],
            url: res.url
          }
          this.fileList.push(obj)
          this.fileList1 = this.fileList.map(item => { return item.url })
          console.log(this.fileBasisAry)
          this.fileBasisAry.push(res.name)
        }
      })
    },
    // 移除
    handleRemove(e) {
      if (e.status != 'success') { // 判断是否是主动删除的主动删除才需要真正删除数据（解决beforeAvatarUpload会触发该事件造成bug）
        return
      }
      const index = this.fileList.findIndex((item) => item.uid == e.uid)
      this.fileList.splice(index, 1)
      this.fileList1 = this.fileList.map(item => {
        return item.url
      })
      this.fileBasisAry.splice(index, 1)
    },
    isPdf(url) {
      // 判断文件是否为pdf
      let flag = false
      if (url.indexOf('pdf') > -1) {
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
    },
    // 预览
    handlePreview(e) {
      this.fileUrl1 = e.url
      this.$refs.preview.show(e.url, this.fileList1)
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
          this.avator = `${BASEIMGURL}/${res.data.imgPath}`
          this.form.imgPath = res.data.imgPath
        }
      })
    },
    // 添加联系人
    addLink() {
      const obj = {
        name: '',
        phone: ''
      }
      this.form.linkMen.push(obj)
    },
    // 删除联系人
    delLink(index) {
      if (this.form.linkMen.length == 1) {
        // this.$message.error('联络人至少保留一位')
        this.form.linkMen = [{
          name: '',
          phone: ''
        }]
        return
      }
      this.form.linkMen.splice(index, 1)
    },
    // 添加案管人员
    addCaseManagers() {
      const obj = {
        name: '',
        phone: ''
      }
      this.form.caseManagers.push(obj)
    },
    // 删除案管人员
    delCaseManagers(index) {
      if (this.form.caseManagers.length == 1) {
        // this.$message.error('案管人员至少保留一位')
        this.form.caseManagers = [{
          name: '',
          phone: ''
        }]
        return
      }
      this.form.caseManagers.splice(index, 1)
    },
    // 添加管理员
    addManagers() {
      const obj = {
        name: '',
        phone: ''
      }
      this.form.managers.push(obj)
    },
    // 删除管理员
    delManagers(index) {
      if (this.form.managers.length == 1) {
        // this.$message.error('管理员至少保留一位')
        this.form.managers = [{
          name: '',
          phone: ''
        }]
        return
      }
      this.form.managers.splice(index, 1)
    },
    // 获取分流中心
    getCenterData() {
      const params1 = {
        pageSize: 1000,
        courtType: 0
      }
      getCourtByLevel(params1).then((res) => {
        if (res.state === 100) {
          this.flowCourtData = res.content
        }
      })
    },
    selectParentId(e) {
      this.$forceUpdate()
    },
    selectOrgType(e) {
      console.log(e)
    },
    selectMediateType(e) {
      console.log(e)
      console.log(this.form.mediateType)
    },

    // 获取机构详情
    _getCourtInfoByType() {
      const params = {
        type: '1',
        courtId: this.courtId,
        parentCourtId: this.parentCourtId
      }
      this.form = {}
      getCourtInfoByType(params).then(async(res) => {
        if (res.state === 100) {
          const data = res.data[0]
          this.detailInfo = res.data[0]
          this.form = {
            id: data.id,
            courtLevel: data.courtLevelInt,
            parentCourtId: data.parentUid,
            flowCourtIds: data.flowCourtIds ? data.flowCourtIds.split(',') : '',
            mediateType: data.mediateType
              ? data.mediateType
                .split('，')
                .map((item) => this.disputeMap[item])
              : '',
            orgType: data.orgType
              ? data.orgType
                .split('，')
                .map((item) => this.organizationMap[item])
              : '',
            name: data.name,
            partTime: data.partTime
              ? formatDate(new Date(data.partTime), 'YYYY-MM-DD')
              : '',
            address: data.address,
            linkMen:
              data.linkInfo && data.linkInfo.length > 0
                ? data.linkInfo
                : [
                  {
                    name: '',
                    phone: ''
                  }
                ],
            caseManagers: data.caseMediators && data.caseMediators.length > 0 ? data.caseMediators.map(item => {
              return {
                id: item.id,
                name: item.name,
                phone: item.phone
              }
            }) : [{
              name: '',
              phone: ''
            }],
            managers: data.adminMediators && data.adminMediators.length > 0 ? data.adminMediators.map(item => {
              return {
                id: item.id,
                name: item.name,
                phone: item.phone
              }
            }) : [{
              name: '',
              phone: ''
            }],
            imgPath: data.orgSign,
            duties: data.duties
          }
          this.avator = data.orgSign ? `${BASEIMGURL}/${data.orgSign}` : ''
          if (data.courtLevelInt) {
            await this.selectLevel(data.courtLevelInt)
            this.form.parentCourtId = data.parentUid
          }
          const fileUrl = data.fileUrl ? data.fileUrl.split(',') : ''
          if (!fileUrl) {
            return
          }
          this.fileBasisAry = data.fileBasis ? data.fileBasis.split(',') : ''
          this.fileList = []
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
