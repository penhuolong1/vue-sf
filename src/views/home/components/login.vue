<template>
  <div class="login-wrapper">
    <el-button type="primary" round size="small" @click="showModal">登录</el-button>
    <el-dialog
      :close-on-click-modal="false"
      width="500px"
      title="登陆"
      append-to-body
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="loginForm" class="form-content" :model="loginForm" :rules="loginRules" @keyup.enter.native="submitForm">
        <el-form-item label="账号" prop="username" :label-width="formLabelWidth">
          <el-input v-model="loginForm.username" type="text" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="loginForm.password" type="password" />
        </el-form-item>
        <el-form-item label="验证码" prop="code" :label-width="formLabelWidth" style="margin-bottom: 5px;">
          <el-input v-model="loginForm.code" type="text" style="width:70%" />
          <span class="code-wrapper" style="display:block;width:27%;float:right" @click="changeUserCode">
            <img height="32px" style="vertical-align: middle;" :src="userCodeSrc" alt="验证码">
          </span>
        </el-form-item>
        <el-form-item label="" prop="fit" :label-width="formLabelWidth">
          <el-radio v-model="loginForm.lit" label="1">工作人员</el-radio>
          <el-radio v-model="loginForm.lit" label="2">当事人</el-radio>
        </el-form-item>
        <el-form-item class="check-wrapper">
          <div class="checkBox">
            <el-checkbox v-model="remenberCheck" @change="remenberCheckChange">记住我</el-checkbox>
          </div>
          <div class="smalltxt">
            <a class="a" @click="getpwd">忘记密码?</a>
          </div>
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button class="log-btn" type="primary" :loading="isLoading" @click="submitForm()">登录</el-button>
          <!-- <el-button class="reg-btn">注册</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="500px"
      title="选择登陆信息"
      append-to-body
      :visible.sync="changeRoleModal"
    >
      <el-form class="form-content" @keyup.enter.native="submitForm">
        <!-- 如果市只有一个角色多个机构的则不选择机构 -->
        <el-form-item v-if="!(loginInfo && loginInfo.length === 1 && loginInfo[0].roles.length > 1)" label="登陆机构" prop="name">
          <el-select v-model="loginCourtId" placeholder="请选择">
            <el-option
              v-for="item in loginCourtInfo"
              :key="item.courtUid"
              :label="item.courtName"
              :value="item.courtUid"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="getRoleList" label="登陆角色" prop="name">
          <el-radio v-for="(item, index) in getRoleList" :key="index" v-model="loginRole" :label="item.id">{{ item.name }}</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeRoleModal = false">取 消</el-button>
        <el-button type="primary" :loading="loading1" @click="selectRole">确 定</el-button>
      </span>
    </el-dialog>
    <forget :for-get-visible.sync="forGetVisible" />
    <bindPhone :bind-phone-visible.sync="bindPhoneVisible" />
  </div>
</template>

<script>
import loginMixin from './login.mixin'
import { SYS_NAME } from '@/utils/constVal'
import forget from './forget'
import bindPhone from './bindPhone'
import { code } from '@/api/user/user'
export default {
  components: {
    forget,
    bindPhone
  },
  mixins: [loginMixin],
  props: {

  },
  data() {
    return {
      local_username: `${SYS_NAME}_userName`, // 记住账号密码时localstorage保存的账号键名
      local_userpwd: `${SYS_NAME}_userPwd`, // 记住账号密码时localstorage保存的密码键名
      loginForm: {
        // 登陆用户信息
        username: localStorage.getItem(this.local_username) || '',
        password: localStorage.getItem(this.local_userpwd) || '',
        code: '',
        lit: '1'
      },
      remenberCheck: false,
      dialogFormVisible: false,
      formLabelWidth: '70px',
      forGetVisible: false,
      userCodeSrc: '/api/main/code.jhtml?tm=' + Math.random()
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 显示登陆模态框
    showModal() {
      this.dialogFormVisible = true
    },
    // 忘记密码
    getpwd() {
      this.forGetVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.login-wrapper {
  display: inline-block;
  margin-left: 10px;
}
.check-wrapper {
  margin-top: -15px;
  .checkBox {
    float: left;
    margin-left: 10px;
  }
  .smalltxt {
    float: right;
  }
}
.log-btn {
  width: 100%;
}
::v-deep .el-dialog__body {
  padding: 30px 50px;
}
</style>
