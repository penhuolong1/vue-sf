import md5 from 'md5'
import { SYS_NAME, ROLEMAP } from '@/utils/constVal'
import { login, forgetPwdCode, forgetPwd, resetRoleType, login2, userInfo, getUserRouters, setCourt, setRoleType } from '@/api/user/user'
import modal from '@/components/modal/modal'
export default {
  components: {
    modal
  },
  data() {
    return {
      smdl: true,
      remenberCheck: false,
      loginRules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      loginLoading: false,
      selectRoleShow: false,
      roleList: [],
      isSubmit: true,
      modalVisible: false,
      pwdParam: {
        phone: '',
        code: '',
        pwd1: '',
        pwd2: ''
      },
      codeTxt: '获取手机验证码',
      interval: null,
      getCodeTime: 60,
      isLoading: false,
      bindPhoneVisible: false,
      changeRoleModal: false,
      rolesList: [], // 角色列表
      roleType: '', // 选择的角色
      loginCourtId: '',
      loginRole: '', // 登陆角色
      loginCourtInfo: null, // d登陆角色的信息
      otherRoles: null,
      loginInfo: null, // 调取登陆接口后返还的信息
      loading1: false
    }
  },
  computed: {
    getRoleList() {
      if (!this.loginCourtInfo || this.loginCourtInfo.length == 0) {
        return
      }
      if (!this.loginCourtId) {
        return
      }
      const obj = this.loginCourtInfo.find(item => item.courtUid == this.loginCourtId)
      const ary = obj.roles.map(item => {
        return {
          name: ROLEMAP[item],
          id: item
        }
      })
      this.loginRole = ary[0].id
      return ary
    }
  },
  mounted() {
    // 判断是否有记住密码
    const username = localStorage.getItem(this.local_username)
    const password = localStorage.getItem(this.local_userpwd)
    if (username) {
      this.loginForm.username = username // 获取记住的密码填入
      this.loginForm.password = password
      this.remenberCheck = true
    }
  },
  methods: {
    // 获取图片验证码
    changeUserCode() {
      this.userCodeSrc = '/api/main/code.jhtml?tm=' + Math.random()
    },
    // 提交登录
    submitForm() {
      this.loginCourtId = ''
      this.loginRole = ''
      this.$refs.loginForm.validate(valid => {
        // 格式规范校验成功
        if (valid) {
          // 判断记住用户名是否被勾选
          this.isLoading = true
          if (this.remenberCheck) {
            window.localStorage.setItem(this.local_username, this.loginForm.username)
            window.localStorage.setItem(this.local_userpwd, this.loginForm.password)
          }
          // 处理提交内容
          const sendData = JSON.parse(JSON.stringify(this.loginForm))
          sendData.password = md5(sendData.password)
          this.loginLoading = true
          this.$Message.loading({
            content: '正在登陆，请稍后...',
            duration: 0
          })
          sendData.lit = sendData.lit != 1
          login2(sendData).then(res => {
            if (res.state === 100) {
              this.loginInfo = res.courtInfo
              this.$Message.destroy()
              if ((!res.courtInfo || res.courtInfo.length === 0) || (res.courtInfo.length === 1 && res.courtInfo[0].roles.length <= 1)) { // 不是多机构多角色的情况下
                this.$store.dispatch('GetLoginId')
                this.$store.dispatch('GetUserInfo')
                this.getRole(res.roleType)
                if (res.roleType === 3) { // 区分当事人和机构
                  this.$router.push('/litigant')
                } else {
                  userInfo().then(res => {
                    if (res.state == 100) {
                      const data = res
                      this.$store.commit('SET_USERINFO', data)
                      const params = {
                        username: this.$store.state.user.userInfo.result.id
                      }
                      getUserRouters(params).then(res => {
                        if (res.state == 100) {
                          for (let index = 0; index < res.data.vueRouter.length; index++) {
                            const element = res.data.vueRouter[index]
                            element.icon = require('../../../assets/bc/' + element.icon)
                          }
                          this.$store.commit('SET_PERMISSION', res)
                          console.log(this.$store.state.user.menuData, '77777777777777777777', this.$store.state.user.menuData[0].path)
                          if (this.$store.state.user.menuData[0].children.length > 0) {
                            this.$router.push(this.$store.state.user.menuData[0].children[0].path)
                          } else {
                            this.$router.push(this.$store.state.user.menuData[0].path)
                          }
                          // this.$router.push(this.$store.state.user.menuData[0].path)
                        } else {
                          this.$store.commit('SET_PERMISSIONCLEAR')
                        }
                      })
                    }
                  })
                }
              } else {
                if (res.courtInfo.length === 1 && res.courtInfo[0].roles.length > 1) {
                  this.loginCourtId = res.courtInfo[0].courtUid
                }
                this.loginCourtInfo = res.courtInfo
                this.rolesList = res.roles
                this.otherRoles = res.otherRoles
                this.changeRoleModal = true
              }
            } else {
              if (res.state === 103) {
                this.bindPhoneVisible = true
              }
              if (res.message == '验证码错误！') {
                this.changeUserCode()
              }
              this.$Message.destroy()
            }
          })
            .finally(() => { this.isLoading = false })
        } else {
          this.$message.error('请完善登录信息后登录！') // 登录失败提示错误
          return false
        }
      })
    },
    remenberCheckChange(val) {
      if (!val) {
        window.localStorage.removeItem(this.local_username)
        window.localStorage.removeItem(this.local_userpwd)
      }
    },
    getRole(role) {
      const app = SYS_NAME
      const user_roles = app + '-userRole'
      // localStorage.setItem(user_Info, JSON.stringify(roles), 60); //60为 1分钟
      localStorage.setItem(user_roles, JSON.stringify(role))
      this.$store.commit('SET_USERROLE', role)
    },
    changeModalVisible() {
      this.modalVisible = false
    },
    // 获取验证码
    getCode() {
      if (!this.pwdParam.phone) {
        this.$message({
          showClose: true,
          message: '请输入手机号',
          type: 'error'
        })
        return
      }
      const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (phoneReg.test(this.pwdParam.phone) === false) {
        this.$message({
          showClose: true,
          message: '手机号码格式不正确',
          type: 'error'
        })
        return
      }
      if (this.codeTxt != '获取手机验证码') {
        return
      }
      forgetPwdCode({ phone: this.pwdParam.phone }).then(res => {
        if (res.state == 100) {
          this.interval = setInterval(() => {
            this.codeTxt = `${this.getCodeTime--}秒后可以重新发送`
            if (this.getCodeTime < 0) {
              clearInterval(this.interval)
              this.codeTxt = '获取手机验证码'
              this.getCodeTime = 60
            }
          }, 1000)
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    // 选择角色
    selectRole() {
      if (!this.loginCourtId) {
        this.$message.error('请选择机构')
        return
      }
      if (!this.loginRole) {
        this.$message.error('请选择角色')
        return
      }
      const params = {
        courtId: this.loginCourtId
      }
      const params1 = {
        roleType: this.loginRole
      }
      this.loading1 = true
      setCourt(params).then(res => {
        if (res.state === 100) {
          setRoleType(params1).then(res1 => {
            if (res.state === 100) {
              this.$store.dispatch('GetLoginId')
              this.getRole(this.loginRole)
              if (this.loginRole === 3) { // 区分当事人和机构
                this.loading1 = false
                this.$router.push('/litigant')
              } else {
                userInfo().then(res => {
                  if (res.state == 100) {
                    const data = res
                    this.$store.commit('SET_USERINFO', data)
                    const params = {
                      username: this.$store.state.user.userInfo.result.id
                    }
                    getUserRouters(params).then(res => {
                      this.loading1 = false
                      if (res.state == 100) {
                        for (let index = 0; index < res.data.vueRouter.length; index++) {
                          const element = res.data.vueRouter[index]
                          element.icon = require('../../../assets/bc/' + element.icon)
                        }
                        this.$store.commit('SET_PERMISSION', res)
                        console.log(this.$store.state.user.menuData, '77777777777777777777', this.$store.state.user.menuData[0].path)
                        // this.$router.push(this.$store.state.user.menuData[0].path)
                        if (this.$store.state.user.menuData[0].children.length > 0) {
                          this.$router.push(this.$store.state.user.menuData[0].children[0].path)
                        } else {
                          this.$router.push(this.$store.state.user.menuData[0].path)
                        }
                      } else {
                        this.$store.commit('SET_PERMISSIONCLEAR')
                      }
                    })
                  } else {
                    this.loading1 = false
                  }
                })
              }
            } else {
              this.loading1 = false
            }
          })
        } else {
          this.loading1 = false
        }
      })
    },
    // 提交忘记密码
    submitPwd() {
      if (!this.pwdParam.phone) {
        this.$message({
          showClose: true,
          message: '请输入手机号',
          type: 'error'
        })
        return
      }
      if (!this.pwdParam.code) {
        this.$message({
          showClose: true,
          message: '请输入验证码',
          type: 'error'
        })
        return
      }
      if (!this.pwdParam.pwd1) {
        this.$message({
          showClose: true,
          message: '请输入新密码',
          type: 'error'
        })
        return
      }
      if (!this.pwdParam.pwd1) {
        this.$message({
          showClose: true,
          message: '请输入确认密码',
          type: 'error'
        })
        return
      }
      const params = {
        phone: this.pwdParam.phone,
        code: this.pwdParam.code,
        pwd1: md5(this.pwdParam.pwd1),
        pwd2: md5(this.pwdParam.pwd2)
      }
      forgetPwd(params).then(res => {
        if (res.state == 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.modalVisible = false
        }
      })
    }
  }
}
