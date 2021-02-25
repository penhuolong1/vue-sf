<template>
  <el-dialog
    :close-on-click-modal="false"
    width="500px"
    title="忘记密码"
    append-to-body
    :visible.sync="forGetVisible"
  >
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="loginRules"
      status-icon
      class="demo-ruleForm"
    >
      <el-form-item prop="phone">
        <el-input
          v-model="registerForm.phone"
          type="text"
          auto-complete="off"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item prop="code" style="position: relative;">
        <el-input
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="请输入验证码"
        />
        <div class="smalltxt">
          <el-button type="primary" size="mini" :disabled="isLoading" @click="getCode">{{ codeText }}</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          v-model="registerForm.password2"
          type="password"
          auto-complete="off"
          show-password
          placeholder="确认密码"
        />
      </el-form-item>
      <el-form-item class="btn-wrapper">
        <el-button type="primary" class="log-btn" @click="submitForm()">修改</el-button>
        <!-- <el-button class="reg-btn">注册</el-button> -->
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { forgetPwd2, phoneCode } from '@/api/user/user'
export default {
  components: {

  },
  props: {
    forGetVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      registerForm: {
        phone: '',
        code: '',
        password: '',
        password2: ''
      },
      loginRules: {
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        password2: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
      },
      codeText: '获取验证码',
      isLoading: false
    }
  },
  watch: {
    forGetVisible() {
      this.$emit('update:forGetVisible', this.forGetVisible)
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    submitForm() {
      this.$refs['registerForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.registerForm.password !== this.registerForm.password2) {
          return this.$message.warning('两次输入的密码不一致！')
        }
        forgetPwd2(this.registerForm).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.$router.push({ path: '/login' })
            this.$emit('update:forGetVisible', false)
          }
        })
      })
    },
    goLogin() {
      this.$router.push({ path: '/login' })
    },
    getCode() {
      const params = {
        phone: this.registerForm.phone
      }
      phoneCode(params).then(res => {
        this.isLoading = true
        if (res.state === 100) {
          let count = 60
          const timer = setInterval(() => {
            count--
            this.codeText = `${count}s`
            if (count < 1) {
              this.codeText = '获取验证码'
              this.isLoading = false
              clearInterval(timer)
            }
          }, 1000)
          this.$message.success(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.smalltxt {
  position: absolute;
  right: 10px;
  top: 0;
  a {
    color: #606266;
  }
}
.log-btn {
  width: 100%;
}
</style>
