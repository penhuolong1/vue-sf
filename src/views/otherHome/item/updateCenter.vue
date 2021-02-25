<template>
  <!-- 编辑分流中心 -->
  <div>
    <el-button
      v-hasPermi="['team:center:edit']"
      style="float: right; padding: 10px"
      type="text"
      class="el-icon-edit"
      @click="edit"
    >编辑</el-button>
    <!-- 编辑对话框 -->
    <el-dialog
      v-if="dialogVisible"
      v-model="ruleForm.name"
      :title="ruleForm.name"
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
              <el-col :span="10">
                <el-form-item label="所属级别">
                  <el-input v-model="ruleForm.courtLevel" placeorder="区级" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="接入时间">
                  <el-date-picker
                    v-model="ruleForm.partTime"
                    value-format="yyyy年MM月dd日"
                    type="datetime"
                    :placeholder="ruleForm.partTime"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="办公地址">
                  <el-input v-model="ruleForm.address" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-for="(item, index) in ruleForm.caseManagers"
              :key="index+'caseManagers'"
              class="btn-wrapper"
              :gutter="20"
            >
              <el-col :span="10">
                <el-form-item
                  label="案管人员"
                  :prop="'caseManagers.' + index + '.name'"
                >
                  <el-input v-if="!item.id" v-model="item.name" placeholder="请输入案管人员姓名" @input="change()" />
                  <span v-if="item.id">{{ item.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label="联系方式"
                  :prop="'caseManagers.' + index + '.phone'"
                >
                  <el-input v-if="!item.id" v-model="item.phone" placeholder="请输入联系方式" @input="change()" />
                  <!-- <span v-if="item.id">{{ item.phone }}</span> -->
                  <lookphone1 v-if="item.id" :id="item.id" :ref="'caseManagerslookphone'+index" v-model="item.phone" class="lookphone1" :phone="item.phone" encrypt-type="mediater" />
                </el-form-item>
              </el-col>
              <div class="btn">
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
            <el-row
              v-for="(item, index) in ruleForm.managers"
              :key="index+'managers'"
              class="btn-wrapper"
              :gutter="20"
            >
              <el-col :span="10">
                <el-form-item
                  label="管理员"
                >
                  <el-input v-if="!item.id" v-model="item.name" placeholder="请输入管理员姓名" @input="change()" />
                  <span v-if="item.id">{{ item.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label="联系方式"
                >
                  <el-input v-if="!item.id" v-model="item.phone" placeholder="请输入联系方式" @input="change()" />
                  <!-- <span v-if="item.id">{{ item.phone }}</span> -->
                  <lookphone1 v-if="item.id" :id="item.id" :ref="'managerslookphone'+index" v-model="item.phone" class="lookphone1" :phone="item.phone" encrypt-type="mediater" />
                </el-form-item>
              </el-col>
              <div class="btn">
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
            <el-row v-for="(item, index) in ruleForm.linkMen" :key="index" class="btn-wrapper" :gutter="20">
              <el-col :span="10">
                <el-form-item label="联络人">
                  <el-input v-if="!item.id" v-model="item.name" placeholder="请输入联络人姓名" @input="change()" />
                  <span v-if="item.id">{{ item.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="联系方式">
                  <el-input v-if="!item.id" v-model="item.phone" placeholder="请输入联系方式" @input="change()" />
                  <!-- <span v-if="item.id">{{ item.phone }}</span> -->
                  <lookphone1 v-if="item.id" :id="item.id" :ref="'linkMenlookphone'+index" v-model="item.phone" class="lookphone1" :phone="item.phone" encrypt-type="linkMan" />
                </el-form-item>
              </el-col>
              <div class="btn">
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
            <el-row>
              <el-col :span="24">
                <el-form-item label="">
                  <tip text="创建的案管人员、管理员和联络人员的账号为手机号，初始密码sfld2020,请尽快通知相关人员进行密码修改" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <!-- <el-col :span="6" class="img-wrapper">
            <div class="rbImg">
              <img v-if="ruleForm.orgSign" :src="baseUrl+'/'+ruleForm.orgSign" alt>
              <img v-if="!ruleForm.orgSign" src="@/assets/images/no.png" alt>
            </div>
            <el-button @click="upload()">上传图片</el-button>
            <input ref="file" type="file" style="display: none;" @change="getFile($event)">
          </el-col> -->
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交编辑</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCourtByType,
  getCourtInfoByType,
  editCourtInfo
} from '@/api/team/team'
import { BASEIMGURL } from '@/utils/constVal.js'
import { uploadImg } from '@/api/common/common.js'
import tip from '@/components/tip/index'
import lookphone1 from './lookPhone1'
export default {
  name: 'UpdateCenter',
  components: {
    tip,
    lookphone1
  },
  props: { // 父组件传入表单
    id: { // 机构id
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false, // 对话框
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      baseUrl: BASEIMGURL,
      ruleForm: null
    }
  },
  computed: {},
  created() {
    console.log(this.ruleForm)
  },
  mounted() {},
  methods: {
    edit() {
      this.dialogVisible = true
      this._getCourtInfoByType()
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
    // 获取详情
    _getCourtInfoByType() {
      const params = {
        type: 0,
        courtId: this.id
      }
      this.ruleForm = {}
      getCourtInfoByType(params).then(res => {
        this.ruleForm = res.data[0]
        this.ruleForm.linkMen = res.data[0].linkInfo && res.data[0].linkInfo.length > 0
          ? res.data[0].linkInfo
          : [
            {
              name: '',
              phone: ''
            }
          ]
        this.ruleForm.caseManagers = res.data[0].caseMediators && res.data[0].caseMediators.length > 0 ? res.data[0].caseMediators.map(item => {
          return {
            id: item.id,
            name: item.name,
            phone: item.phone
          }
        }) : [{
          name: '',
          phone: ''
        }]
        this.ruleForm.managers = res.data[0].adminMediators && res.data[0].adminMediators.length > 0 ? res.data[0].adminMediators.map(item => {
          return {
            id: item.id,
            name: item.name,
            phone: item.phone
          }
        }) : [{
          name: '',
          phone: ''
        }]
      })
    },
    // 编辑
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            type: 0,
            courtId: this.ruleForm.id, // 机构ID
            courtLevel: '2', // 级别
            linkMen: this.ruleForm.linkMen && this.ruleForm.linkMen.length > 0 ? this.ruleForm.linkMen.map(item => {
              return {
                id: item.id,
                name: item.name,
                phone: item.phone
              }
            }) : [],
            courtName: this.ruleForm.name, // 机构名字
            address: this.ruleForm.address, // 地址
            partTime: this.ruleForm.partTime, // 接入时间
            mediateType: this.ruleForm.mediateType, // 解纷类型
            orgType: this.ruleForm.orgType, // 组织类型
            imgPath: this.ruleForm.orgSign, // 机构照片N
            fileUrl: this.ruleForm.fileUrl // 文件路径N
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
          editCourtInfo(params).then((res) => {
            if (res.state == 100) {
              this.$message.success('修改成功')
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加案管人员
    addCaseManagers() {
      const obj = {
        name: '',
        phone: ''
      }
      this.ruleForm.caseManagers.push(obj)
      this.$forceUpdate()
    },
    // 删除案管人员
    delCaseManagers(index) {
      if (this.ruleForm.caseManagers.length == 1) {
        // this.$message.error('案管人员至少保留一位')
        this.ruleForm.caseManagers = [{
          name: '',
          phone: ''
        }]
        this.$forceUpdate()
        return
      }
      this.ruleForm.caseManagers.splice(index, 1)
      this.$forceUpdate()
    },
    // 添加管理员
    addManagers() {
      const obj = {
        name: '',
        phone: ''
      }
      this.ruleForm.managers.push(obj)
      this.$forceUpdate()
    },
    // 删除管理员
    delManagers(index) {
      if (this.ruleForm.managers.length == 1) {
        // this.$message.error('管理员至少保留一位')
        this.ruleForm.managers = [
          {
            name: '',
            phone: ''
          }
        ]
        this.$forceUpdate()
        return
      }
      this.ruleForm.managers.splice(index, 1)
      this.$forceUpdate()
    },
    // 添加联系人
    addLink() {
      const ary = this.ruleForm.linkMen
      ary.push({
        name: '',
        phone: ''
      })
      this.$set(this.ruleForm, 'linkMen', ary)
      this.$forceUpdate()
    },
    // 删除联系人
    delLink(index) {
      if (this.ruleForm.linkMen.length == 1) {
        // this.$message.error('联络人至少保留一位')
        this.ruleForm.linkMen = [{
          name: '',
          phone: ''
        }]
        this.$forceUpdate()
        return
      }
      this.ruleForm.linkMen.splice(index, 1)
      this.$forceUpdate()
    },
    upload() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    change() { // 解决输入框无法正常输入的问题
      this.$forceUpdate()
    },
    getFile(e) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      uploadImg(param).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.ruleForm.orgSign = res.data.imgPath
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.img-wrapper {
  text-align: center;
}
.rbImg {
  display: inline-block;
  width: 170px;
  height: 220px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
