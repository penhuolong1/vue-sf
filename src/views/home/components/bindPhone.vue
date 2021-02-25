<template>
  <el-dialog
    :close-on-click-modal="false"
    width="500px"
    title="绑定手机号"
    append-to-body
    :visible.sync="bindPhoneVisible"
  >
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="loginRules"
      status-icon
      class="demo-ruleForm"
    >
      <el-form-item prop="name">
        <el-input
          v-model="registerForm.name"
          type="text"
          auto-complete="off"
          placeholder="请输入姓名"
        />
      </el-form-item>
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
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          v-model="registerForm.password2"
          type="password"
          auto-complete="off"
          show-password
          placeholder="确认新密码"
        />
      </el-form-item>
      <el-form-item class="btn-wrapper">
        <el-button type="primary" class="log-btn" @click="submitForm()">绑定</el-button>
        <!-- <el-button class="reg-btn">注册</el-button> -->
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { phoneCode, bindPhone } from '@/api/user/user'
import { validPassword } from '@/utils/validate.js'
// 验证密码
const validatePwd = (rule, value, callback) => {
  if (!validPassword(value)) {
    callback(new Error('密码只包含字母和数字（6位数以上）!'))
  } else {
    callback()
  }
}
export default {
  components: {

  },
  props: {
    bindPhoneVisible: {
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
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        password2: [{ validator: validatePwd, trigger: 'blur' }]
      },
      codeText: '获取验证码',
      isLoading: false
    }
  },
  watch: {
    bindPhoneVisible() {
      this.$emit('update:bindPhoneVisible', this.bindPhoneVisible)
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
        bindPhone(this.registerForm).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            this.$emit('update:bindPhoneVisible', false)
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
        } else {
          this.isLoading = false
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
