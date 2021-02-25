<template>
  <div class="modular">
    <div class="contentBox">
      <div class="minBox">
        <div class="title"><i class="el-icon-unlock" style="color:#007AFF;font-size:45px" /></div>
        <div class="content">
          <p class="content-title">修改密码</p>
          <div v-if="form2.pwdSet" class="content-content">
            <span class="tip">若您忘记密码，可通过绑定的手机号码及动态验证码修改密码。</span>
            <span>
              <span class="setColor"><Icon type="md-checkmark" size="20" class="kongge" />已设置</span>
              <el-divider direction="vertical" style="padding:0 10px 0 10px" />
              <span class="textColor" @click="showPasswordVisible"><Icon type="md-create" class="kongge" />修改</span>
            </span>
          </div>
          <div v-if="!form2.pwdSet" class="content-content">
            <span class="tip">您的密码为初始密码，请尽快修改。</span>
            <span>
              <span class="notSetColor"><Icon type="ios-information-circle-outline" size="20" class="kongge" />未设置</span>
              <el-divider direction="vertical" style="padding:0 10px 0 10px" />
              <span class="textColor" @click="showPasswordVisible"><Icon type="md-create" class="kongge" />设置</span>
            </span>
          </div>
        </div>
      </div>
      <div class="minBox">
        <div class="title"><i class="el-icon-mobile-phone" style="color:#007AFF;font-size:45px" /></div>
        <div class="content">
          <p class="content-title">绑定手机</p>
          <div v-if="form2.phoneSet" class="content-content">
            <span class="tip">您的手机∶{{ form1.telephone }}，验证绑定后可用于找回密码。</span>
            <span>
              <span class="setColor"><Icon type="md-checkmark" size="20" class="kongge" />已绑定</span>
              <el-divider direction="vertical" />
              <span class="textColor" @click="showPhoneVisible"><Icon type="md-create" class="kongge" />修改</span>
            </span>
          </div>
          <div v-if="!form2.phoneSet" class="content-content">
            <span class="tip">您还未绑定手机，验证绑定后可用于接收系统消息，请尽快绑定。</span>
            <span>
              <span class="notSetColor"><Icon type="ios-information-circle-outline" size="20" class="kongge" />未绑定</span>
              <el-divider direction="vertical" />
              <span class="textColor" @click="showPhoneVisible"><Icon type="md-create" class="kongge" />绑定</span>
            </span>
          </div>
        </div>
      </div>
      <div class="minBox">
        <div class="title"><i class="el-icon-message" style="color:#007AFF;font-size:45px" /></div>
        <div class="content">
          <p class="content-title">绑定邮箱</p>
          <div v-if="form2.emailSet" class="content-content">
            <span class="tip">您的邮箱∶{{ form1.emial }}，验证绑定后可用于接收系统消息。</span>
            <span>
              <span class="setColor"><Icon type="md-checkmark" size="20" class="kongge" />已绑定</span>
              <el-divider direction="vertical" />
              <span class="textColor" @click="showEmailVisible"><Icon type="md-create" class="kongge" />修改</span>
            </span>
          </div>
          <div v-if="!form2.emailSet" class="content-content">
            <span class="tip">您还未绑定邮箱，验证绑定后可用于接收系统消息，请尽快绑定。</span>
            <span>
              <span class="notSetColor"><Icon type="ios-information-circle-outline" size="20" class="kongge" />未绑定</span>
              <el-divider direction="vertical" />
              <span class="textColor" @click="showEmailVisible"><Icon type="md-create" class="kongge" />绑定</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="bindingPasswordVisible"
      width="560px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div v-if="PasswordBox" class="mpdalBox">
        <div class="PasswordBoxDiv">
          <i class="el-icon-unlock" style="fontSize:22px;color:#DBDBDB;position: relative;top:5px;" />
          <input v-model="oldPassword" placeholder="输入旧密码" type="passWord" class="editInput">
          <a href="#" @click="PasswordBox = !PasswordBox">通过手机号码修改</a>
        </div>
        <div class="PasswordBoxDiv PasswordBoxDivMargin">
          <i class="el-icon-unlock" style="fontSize:22px;color:#DBDBDB;position: relative;top:5px;" />
          <input v-model="newPassword1" placeholder="输入新密码" type="passWord" class="editInput">
        </div>
        <div class="PasswordBoxDiv PasswordBoxDivMargin">
          <i class="el-icon-unlock" style="fontSize:22px;color:#DBDBDB;position: relative;top:5px;" />
          <input v-model="newPassword2" placeholder="确认密码" type="passWord" class="editInput">
        </div>
      </div>
      <div v-if="!PasswordBox" class="mpdalBox">
        <div class="PasswordBoxDiv">
          <Icon type="md-phone-portrait" size="22" color="#DBDBDB" style="position: relative;" />
          <input v-model="phone" placeholder="输入手机号码" type="text" class="editInput">
          <a href="#" @click="PasswordBox = !PasswordBox">通过旧密码修改</a>
        </div>
        <div class="PasswordBoxDiv PasswordBoxDivMargin">
          <img src="../../../assets/icon/AK-MN盾牌_fill.png" alt="" class="editImg">
          <input v-model="code" placeholder="输入验证码" type="text" class="editInput">
          <a href="#" @click="getCode">{{ codeTxt }}</a>
        </div>
        <div class="PasswordBoxDiv PasswordBoxDivMargin">
          <i class="el-icon-unlock" style="fontSize:22px;color:#DBDBDB;position: relative;top:5px;" />
          <input v-model="pwd1" placeholder="输入新密码" type="passWord" class="editInput">
        </div>
        <div class="PasswordBoxDiv PasswordBoxDivMargin">
          <i class="el-icon-unlock" style="fontSize:22px;color:#DBDBDB;position: relative;top:5px;" />
          <input v-model="pwd2" placeholder="确认密码" type="passWord" class="editInput">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindingPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPassword">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 绑定手机号码 -->
    <el-dialog
      title="绑定手机"
      :visible.sync="bindingPhoneVisible"
      width="560px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="mpdalBox">
        <div class="PasswordBoxDiv">
          <Icon type="md-phone-portrait" size="22" color="#DBDBDB" style="position: relative;" />
          <input v-model="editPhone" placeholder="输入手机号码" type="text" class="editInput">
        </div>
        <div class="PasswordBoxDiv PasswordBoxDivMargin">
          <img src="../../../assets/icon/AK-MN盾牌_fill.png" alt="" class="editImg">
          <input v-model="editCode" placeholder="输入验证码" type="text" class="editInput">
          <a href="#" @click="getCode2">{{ codeTxt2 }}</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindingPhoneVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPhone">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 绑定邮箱 -->
    <el-dialog
      title="绑定邮箱"
      :visible.sync="bindingEmailVisible"
      width="560px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="mpdalBox">
        <div class="PasswordBoxDiv">
          <i class="el-icon-message" style="fontSize:20px;color:#DBDBDB;position:relative;top:5px;" />
          <input v-model="editEmail" placeholder="输入邮箱" type="text" class="editInput" style="margin-left: 10px;">
        </div>
        <div class="PasswordBoxDiv PasswordBoxDivMargin">
          <img src="../../../assets/icon/AK-MN盾牌_fill.png" alt="" class="editImg">
          <input v-model="editEmailCode" placeholder="输入验证码" type="text" class="editInput">
          <a href="#" @click="getCode3">{{ codeTxt3 }}</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindingEmailVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEmail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'md5'
import { modifyPassword, updatePwdByCode, forgetPwdCode, updatePhone, updateEmail, getEmailCode } from '@/api/otherHome/account'
import { validPassword, validPhone, validEmail } from '@/utils/validate.js'
export default {
  props: {
    form2: {
      type: Object,
      default: function() {
        return {
          default: {
            emailSet: '',
            phoneSet: '',
            pwdSet: ''
          }
        }
      }
    },
    form1: {
      name: '',
      telephone: '',
      role: '',
      emial: '',
      courtInfoList: [],
      url: ''
    },
    fatherMoth: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      // setUp:true,
      // bindingPhone:false,
      // bindingeMail:false,
      PasswordBox: true, // 修改密码方式切换
      bindingPasswordVisible: false, // 修改密码的模态框
      bindingPhoneVisible: false, // 绑定电话的模态框
      bindingEmailVisible: false, // 绑定邮箱的模态框
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      code: '',
      phone: '',
      pwd1: '',
      pwd2: '',
      interval: '',
      getCodeTime: 60,
      codeTxt: '点击获取验证码',
      interval2: '',
      codeTxt2: '点击获取验证码',
      getCodeTime2: 60,
      editPhone: '',
      editCode: '',
      interval3: '',
      codeTxt3: '点击获取验证码',
      getCodeTime3: 60,
      editEmailCode: '',
      editEmail: ''

    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {

    // 修改密码获取验证码
    getCode() {
      if (this.codeTxt != '点击获取验证码') {
        return
      }
      this.interval = setInterval(() => {
        this.codeTxt = `${this.getCodeTime--}秒后可以重新发送`
        if (this.getCodeTime < 0) {
          clearInterval(this.interval)
          this.codeTxt = '点击获取验证码'
          this.getCodeTime = 60
        }
      }, 1000)
      const params = {
        phone: this.phone,
        smsType: 2
      }
      forgetPwdCode(params).then(res => {
        if (res.state == 100) {

        } else {
          clearInterval(this.interval)
        }
      })
    },
    // 绑定手机号获取验证码
    getCode2() {
      if (this.codeTxt2 != '点击获取验证码') {
        return
      }
      this.interval2 = setInterval(() => {
        this.codeTxt2 = `${this.getCodeTime2--}秒后可以重新发送`
        if (this.getCodeTime2 < 0) {
          clearInterval(this.interval2)
          this.codeTxt2 = '点击获取验证码'
          this.getCodeTime2 = 60
        }
      }, 1000)
      const params = {
        phone: this.editPhone,
        smsType: 5
      }
      forgetPwdCode(params).then(res => {
        if (res.state == 100) {

        } else {
          clearInterval(this.interval2)
        }
      })
    },
    // 绑定邮箱获取验证码
    getCode3() {
      if (this.editEmail == '' || this.editEmail == null) {
        this.$message.error('请输入您的邮箱地址!')
        return
      }
      if (this.codeTxt3 != '点击获取验证码') {
        return
      }
      this.interval3 = setInterval(() => {
        this.codeTxt3 = `${this.getCodeTime3--}秒后可以重新发送`
        if (this.getCodeTime3 < 0) {
          clearInterval(this.interval3)
          this.codeTxt3 = '点击获取验证码'
          this.getCodeTime3 = 60
        }
      }, 1000)
      const params = {
        email: this.editEmail,
        smsType: 6
      }
      getEmailCode(params).then(res => {
        if (res.state == 100) {

        } else {
          clearInterval(this.interval3)
        }
      })
    },
    // 修改密码
    submitPassword() {
      if (this.PasswordBox == true) { // 通过旧密码修改
        if (this.oldPassword == '' || this.oldPassword == null || this.newPassword1 == '' || this.newPassword1 == null || this.newPassword2 == '' || this.newPassword2 == null) {
          this.$message.error('请输入新旧密码!')
          return
        }
        if (this.newPassword1 != this.newPassword2) {
          this.$message.error('新密码输入不一致!')
          return
        }
        console.log('!validPassword(this.newPassword1)', this.newPassword1, !validPassword(this.newPassword1))
        if (!validPassword(this.newPassword1)) {
          this.$message.error('密码只包含字母和数字（6位数以上）!')
          return
        }
        const params = {
          oldPassword: md5(this.oldPassword),
          newPassword1: md5(this.newPassword1),
          newPassword2: md5(this.newPassword2)
        }
        modifyPassword(params).then(res => {
          if (res.state == 100) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.bindingPasswordVisible = false
            this.oldPassword = ''
            this.newPassword1 = ''
            this.newPassword2 = ''
            this.fatherMoth()
          }
        })
      } else { // 通过手机号码修改
        if (this.code == '' || this.code == null || this.phone == '' || this.phone == null || this.pwd1 == '' || this.pwd1 == null || this.pwd2 == '' || this.pwd2 == null) {
          this.$message.error('请全部填写输入内容!')
          return
        }
        if (this.pwd1 != this.pwd2) {
          this.$message.error('新密码输入不一致!')
          return
        }
        if (!validPassword(this.pwd1)) {
          this.$message.error('密码只包含字母和数字（6位数以上）!')
          return
        }
        if (!validPhone(this.phone)) {
          this.$message.error('请正确输入手机号码并获取填写验证码!')
          return
        }
        const params = {
          code: this.code,
          phone: this.phone,
          pwd1: md5(this.pwd1),
          pwd2: md5(this.pwd2)
        }
        updatePwdByCode(params).then(res => {
          if (res.state == 100) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.bindingPasswordVisible = false
            this.code = ''
            this.phone = ''
            this.pwd1 = ''
            this.pwd2 = ''
            this.fatherMoth()
          }
        })
      }
    },
    // 绑定手机号
    submitPhone() {
      if (this.editCode == '' || this.editCode == null || this.editPhone == '' || this.editPhone == null) {
        this.$message('请填写手机号码与验证码!')
        return
      }
      if (!validPhone(this.editPhone)) {
        this.$message.error('请正确输入手机号码并获取填写验证码!')
        return
      }
      const params = {
        code: this.editCode,
        phone: this.editPhone
      }
      updatePhone(params).then(res => {
        if (res.state == 100) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.bindingPhoneVisible = false
          this.editCode = ''
          this.editPhone = ''
          this.fatherMoth()
        }
      })
    },
    // 绑定邮箱
    submitEmail() {
      if (!validEmail(this.editEmail)) {
        this.$message.error('请正确输入邮箱!')
        return
      }
      if (this.editEmailCode == '' || this.editEmailCode == null) {
        this.$message.error('请输入验证码!')
        return
      }
      const params = {
        code: this.editEmailCode,
        email: this.editEmail
      }
      updateEmail(params).then(res => {
        if (res.state == 100) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.bindingEmailVisible = false
          this.editEmailCode = ''
          this.editEmail = ''
          this.fatherMoth()
        }
      })
    },
    showPasswordVisible() {
      this.oldPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
      this.code = ''
      this.phone = ''
      this.pwd1 = ''
      this.pwd2 = ''
      this.bindingPasswordVisible = true
    },
    showPhoneVisible() {
      this.editCode = ''
      this.editPhone = ''
      this.bindingPhoneVisible = true
    },
    showEmailVisible() {
      this.editEmailCode = ''
      this.editEmail = ''
      this.bindingEmailVisible = true
    }
  }
}
</script>

<style scoped lang = "scss">
.modular{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .contentBox{
        width: 80%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction:column;
        .minBox{
            width: 100%;
            height: 155px;
            display: flex;
            flex-direction:row;
            align-items: center;
            &:nth-child(2){
                border-top:2px solid #ECEDF2;
                border-bottom:2px solid #ECEDF2;
            }
            .title{
                width: 70px;
                text-align: center;
            }
            .content{
                width: calc(100% - 70px);
                height: 100%;
                display: flex;
                flex-direction:column;
                justify-content: center;
                .content-title{
                    height: 45px;
                    font-size: 20px;
                    color: #000;
                }
                .content-content{
                    width: 100%;
                    display: flex;
                    flex-direction:row;
                    justify-content:space-between;
                    .textColor{
                        color:#007AFF;
                        margin-left: 10px;
                        cursor: pointer;
                    }
                    .setColor{
                        color:#3EB35E;
                        margin-right: 10px;
                    }
                    .notSetColor{
                        color:#FF2F2F;
                    }
                    .kongge{
                        margin-right: 10px;
                    }
                }
                .tip{
                    color: #888;
                }
            }
        }
    }

}
.mpdalBox{
    padding:30px
}
.editInput{
    width:300px;
    height:40px;
    border:none;
    outline:none;
    margin-left: 8px;
}
.PasswordBoxDiv{
    border-bottom:1px solid #dedede;
}
.PasswordBoxDivMargin{
    margin-top:30px;
}
.editImg{
    height:22px;
    width:22px;
    position: relative;
    top:5px;
}
</style>
