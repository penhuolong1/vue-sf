<template>
  <!-- 添加联动单位 -->
  <div>
    <!-- 区级和市级的才有权限新增联动单位 -->
    <div v-if="getUserInfo.courtLevel && getUserInfo.courtLevel < 3" v-hasPermi="['team:unit:add']" class="addBox" @click="dialogVisible = true">新增联动单位</div>
    <el-dialog title="添加联动单位" :visible.sync="dialogVisible" append-to-body width="78%">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-form"
      >
        <el-row :gutter="20">
          <el-col :span="18">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="courtLevel" label="所属级别">
                  <el-select
                    v-model="ruleForm.courtLevel"
                    placeholder="请选择所属级别"
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
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="parentCourtId" label="上级单位">
                  <el-select
                    v-model="ruleForm.parentCourtId"
                    placeholder="请选择所属级别"
                    filterable
                    style="width: 100%;"
                    @change="changeParentCourtId"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.courtUid"
                      :label="item.courtName"
                      :value="item.courtUid"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="ruleForm.courtLevel == 2" :gutter="20">
              <el-col :span="12">
                <el-form-item prop="flowCourtIds" label="分流中心">
                  <el-select
                    v-model="ruleForm.flowCourtIds"
                    placeholder="请选择所属级别"
                    multiple
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in flowCourtData"
                      :key="item.courtUid"
                      :label="item.courtName"
                      :value="item.courtUid"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="mediateType" label="解纷类型">
                  <el-select v-model="ruleForm.mediateType" style="width: 100%;" multiple placeholder="请选择解纷类型">
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
                <el-form-item prop="orgType" label="组织类型">
                  <el-select v-model="ruleForm.orgType" style="width: 100%;" multiple placeholder="请选择组织类型">
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
                <el-form-item prop="courtName" label="单位名称">
                  <el-input v-model="ruleForm.courtName" placeholder="请输入单位名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="partTime" label="接入时间">
                  <el-date-picker
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
                  <el-input v-model="ruleForm.address" placeholder="请输入办公地址" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-for="(item, index) in ruleForm.caseManagers"
              :key="index+'caseManagers'"
              class="btn-wrapper"
              :gutter="20"
            >
              <el-col :span="12">
                <el-form-item
                  label="案管人员"
                >
                  <el-input v-model="item.name" placeholder="请输入案管人员姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="联系方式"
                  :prop="'caseManagers.' + index + '.phone'"
                >
                  <el-input v-model="item.phone" placeholder="请输入联系方式" />
                </el-form-item>
              </el-col>
              <div class="btn">
                <el-button icon="el-icon-minus" circle size="small" @click="delCaseManagers(index)" />
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
                  <el-input v-model="item.name" placeholder="请输入管理员姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="联系方式"
                >
                  <el-input v-model="item.phone" placeholder="请输入联系方式" />
                </el-form-item>
              </el-col>
              <div class="btn">
                <el-button icon="el-icon-minus" circle size="small" @click="delManagers(index)" />
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
            <el-row v-for="(item, index) in ruleForm.linkMen" :key="index" :gutter="20" class="btn-wrapper">
              <el-col :span="12">
                <el-form-item
                  label="联络人"
                  :prop="'linkMen.' + index + '.name'"
                >
                  <el-input v-model="item.name" placeholder="请输入联络人" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="联系方式"
                  :prop="'linkMen.' + index + '.phone'"
                >
                  <el-input v-model="item.phone" placeholder="请输入联系方式" />
                </el-form-item>
              </el-col>
              <div class="btn">
                <el-button icon="el-icon-minus" circle size="small" @click="delLink(index)" />
                <el-button v-show="index == ruleForm.linkMen.length-1" type="primary" icon="el-icon-plus" circle size="small" @click="addLink" />
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
              <el-input v-model="ruleForm.duty" type="textarea" :rows="3" placeholder="请输入主要职责" />
            </el-form-item>
            <el-form-item label="文件依据">
              <el-upload
                v-model="ruleForm.fileUrl"
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
            <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <preview ref="preview" :file-list="fileList1" :file-url="fileUrl1" />
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
  uploadFileBasic
} from '@/api/team/team'
import { validPhone } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { SERVICEURL, BASEIMGURL, CASETYPE, ORGANIZATYPEMAP } from '@/utils/constVal.js'
import tip from '@/components/tip/index'
import { limitFileSize } from '@/utils/tools.js'
import preview from '@/components/preview/index'
export default {
  name: 'AddUnit',
  components: {
    tip,
    preview
  },
  data() {
    return {
      fileBasisAry: [],
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
      // 上级单位
      options: [],
      // 添加对话框
      dialogVisible: false,
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
      // 表单验证规则
      rules: {
        courtLevel: [{ required: true, message: '请选择级别', trigger: 'blur' }],
        parentCourtId: [{ required: true, message: '请选择上级单位', trigger: 'blur' }],
        flowCourtIds: [{ required: true, message: '请选择分流中心', trigger: 'blur' }],
        mediateType: [{ required: true, message: '请选择解纷类型', trigger: 'blur' }],
        orgType: [{ required: true, message: '请选择组织类型', trigger: 'blur' }],
        courtName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        partTime: [{ required: true, message: '请输入接入时间', trigger: 'blur' }]
      },
      // 懒加载上级机构数据
      props: {
        value: 'courtUid',
        label: 'courtName',
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          console.log(node)
          const id = node.data.courtId
          const params = {
            type: 2,
            courtId: id,
            dept: 1
          }
          const { level } = node
          listCourtByCourId(params).then((res) => {
            if (res.state === 100) {
              const nodes = res.content.map((item) => ({
                courtId: item.dId,
                courtName: item.name,
                courtUid: item.id,
                leaf: level >= 2
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            }
          })
        }
      },
      fileList: [
      ],
      fileList1: [],
      avator: '',
      flowCourtData: [],
      fileUrl1: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    this.getCenterData()
    this.getDisputeArr()
    if (this.getUserInfo.courtLevel && this.getUserInfo.courtLevel == 2) {
      this.courtLevelArr = [
        { name: '区级', index: 2, disabled: true },
        { name: '街道', index: 3 }
      ]
    }
  },
  mounted() {},
  methods: {
    changeParentCourtId() {
      this.$forceUpdate()
    },
    // 获取解纷类型和组织类型
    getDisputeArr() {
      this.disputeArr = []
      for (const key in CASETYPE) {
        this.disputeArr.push({ name: CASETYPE[key], index: key })
      }
      this.organizationArr = []
      for (const key in ORGANIZATYPEMAP) {
        this.organizationArr.push({ name: ORGANIZATYPEMAP[key], index: key })
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
    // 重置数据
    reset() {
      this.avator = ''
      this.fileList = []
      this.ruleForm = {
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
        parentCourtIds: null
      }
      this.imgUrl = ''
      this.options = []
    },
    // 选择所属级别
    selectLevel(e) {
      const params1 = {
        level: e - 1,
        pageSize: 1000,
        courtId: this.getUserInfo.courtUid,
        courtType: 1
      }
      this.ruleForm.parentCourtId = ''
      getCourtByLevel(params1).then((res) => {
        if (res.state === 100) {
          this.ruleForm.parentCourtIds = null
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
            type: 1,
            linkMen: this.ruleForm.linkMen,
            mediateType: this.ruleForm.mediateType.toString(), // 解纷类型
            orgType: this.ruleForm.orgType.toString(), // 组织类型
            parentCourtIds: [this.ruleForm.parentCourtId], // 上级机构ID
            courtName: this.ruleForm.courtName,
            courtLevel: this.ruleForm.courtLevel, // 所属级别
            partTime: this.ruleForm.partTime, // 时间
            address: this.ruleForm.address, // 地址
            duty: this.ruleForm.duty,
            caseManagers: this.ruleForm.caseManagers,
            managers: this.ruleForm.managers,
            imgPath: this.imgUrl, // 机构照片N
            fileUrl: this.fileList ? this.fileList.map(item => item.url).join(',') : '', // 文件路径N
            fileBasis: this.fileBasisAry && this.fileBasisAry.length > 0 ? this.fileBasisAry.join(',') : ''
          }
          if (params.courtLevel == 2) {
            params.flowCourtIds = this.ruleForm.flowCourtIds
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
              this.reset()
              this.dialogVisible = false
              this.$emit('success')
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
          this.fileList1 = this.fileList.map(item => {
            return item.url
          })
          this.fileBasisAry.push(res.name)
        }
      })
    },
    // 移除
    handleRemove(e) {
      const index = this.fileList.findIndex((item) => item.uid == e.uid)
      this.fileList.splice(index, 1)
      this.fileList1 = this.fileList.map(item => {
        return item.url
      })
      console.log(this.fileList)
    },
    // 预览
    handlePreview(e) {
      this.lookUrl = `${SERVICEURL}${e.url}`
      this.fileUrl1 = e.url
      this.$refs.preview.show(e.url, this.fileList1)
      // window.open(this.lookUrl)
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
      uploadImg(param).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.imgUrl = res.data.imgPath
          this.avator = `${BASEIMGURL}/${res.data.imgPath}`
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
  .btn{
    width: 80px;
    text-align: left;
    position: absolute;
    top: 3px;
    right: -80px;
  }
}
</style>
