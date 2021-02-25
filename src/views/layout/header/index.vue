<template>
  <div>
    <div id="header" :style="{'height': adaptiveObj.height}">
      <ul v-if="userInfo.roleType != 3" class="menu-wrapper" :style="{'height': adaptiveObj.height, 'line-height': adaptiveObj.height}">
        <!-- <li>
          <img src="@/assets/bc/home.png">
          <span>首页</span>
        </li> -->
        <li v-for="(item, index) in menuData" :key="index" :class="{'active': menuLabel == menuActive(item.path)}" :style="{'font-size': adaptiveObj.fontSize, 'padding-left': adaptiveObj.padding, 'padding-right': adaptiveObj.padding}" @click="selectMenu1(index, item.path)">
          <img :src="item.icon" :style="{'width': adaptiveObj.imgWidth}">
          <span :style="{'margin-right': adaptiveObj.margin}">{{ item.name }}</span>
        </li>
      </ul>
      <div class="header-inner" :style="{'--fz': adaptiveObj.adaptiveSize}">
        <div class="info-wrapper">
          <el-dropdown :style="{top: adaptiveSize*1.5+'px'}">
            <span class="el-dropdown-link">
              <div class="info-inner">
                <div class="avator">
                <!-- <img
                    src="@/assets/logo.png"
                    alt=""
                  > -->
                </div>
                <div class="info" :style="{height: adaptiveSize*5+'px', 'margin-right': adaptiveSize*2+'px'}">
                  <div class="name" :style="{'font-size': adaptiveSize*1.5+'px','line-height':adaptiveSize*3.7+'px','height': adaptiveSize*3+'px'}">{{ getUserInfo.result.name }}</div>
                  <div v-if="getUserInfo.roleType != 3" class="role" :style="{'font-size': adaptiveSize*1.2+'px','line-height':adaptiveSize*1.2+'px','height': adaptiveSize*1.2+'px'}" style="margin-bottom:5px;">{{ getUserInfo.courtName }}</div>
                  <div class="role" :style="{'font-size': adaptiveSize*1.2+'px','line-height':adaptiveSize*1.2+'px','height': adaptiveSize*1.2+'px'}">{{ getUserInfo.roleName }}</div>
                </div>
                <div class="icon" :style="{'line-height': adaptiveSize*5+'px'}">
                  <i class="el-icon-caret-bottom info-icon" />
                </div>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="resetPwd">重置密码</el-dropdown-item>
              <el-dropdown-item v-if="getUserInfo.roleType != 3" @click.native="switchRole">切换角色</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 系统公告 -->
    <news ref="news" :notice-list="noticeList" :notice-max-num="noticeMaxNum" @getNoticeList="listByType" />
    <modal
      :title="'重置密码'"
      :modal-visible="modalVisible"
      @changeModalVisible="changeModalVisible"
      @submitModal="submitResetPwd"
    >
      <div class="form-item">
        <div class="label">旧密码</div>
        <div class="input">
          <el-input v-model="pwdParam.oldPassword" type="password" placeholder="请输入内容" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">新密码</div>
        <div class="input">
          <el-input v-model="pwdParam.newPassword1" type="password" placeholder="请输入内容" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">确认密码</div>
        <div class="input">
          <el-input v-model="pwdParam.newPassword2" type="password" placeholder="请输入内容" />
        </div>
      </div>
    </modal>
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="25%"
      center
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
    >
      <span>{{ messageTip }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resultBtn(2)">拒 绝</el-button>
        <el-button type="primary" @click="resultBtn(1)">接 收</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      width="500px"
      title="切换角色"
      append-to-body
      :visible.sync="changeRoleModal"
    >
      <el-form class="form-content" @keyup.enter.native="submitForm">
        <el-form-item label="机构" prop="name">
          <el-select v-model="loginCourtId" placeholder="请选择">
            <el-option
              v-for="item in loginCourtInfo"
              :key="item.courtUid"
              :label="item.courtName"
              :value="item.courtUid"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="getRoleList" label="角色" prop="name">
          <el-radio v-for="(item, index) in getRoleList" :key="index" v-model="loginRole" :label="item.id">{{ item.name }}</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeRoleModal = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="selectRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import md5 from 'md5'
import modal from '@/components/modal/modal'
import news from '@/components/news/news'
import { mapGetters } from 'vuex'
import { ROLEMAP } from '@/utils/constVal'
const menuMap = {
  'otherHome': 0,
  'index': 0,
  'news': 0,
  'team': 0,
  'account': 0,
  'homeIndex': 2,
  'caseIndex': 2,
  'addCase': 2,
  'step': 2,
  'step1': 2,
  'step2': 2,
  'step3': 2,
  'step4': 2,
  'rtcIndex': 3,
  'VisualizationIndex': 1
}
export default {
  components: {
    modal,
    news // 系统公告
  },
  data() {
    return {
      loginId: this.$store.state.user.loginId, // 登录者ID
      groupId: '', // 聊天室id
      roomId: '',
      centerDialogVisible: false, // 聊天室通知加入框
      messageTip: '', // 聊天室通知加入框提示内容
      jumpType: '', // 聊天室 1 视频2
      userInfo: null,
      userRole: null,
      modalVisible: false,
      socket: '',
      pwdParam: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      changeRoleModal: false,
      menuData: this.$store.state.user.menuData,
      // menuData: [
      //   {
      //     url: require('@/assets/bc/home.png'),
      //     text: '首页',
      //     path: '/otherHome/index',
      //     permission: [1, 2, 4, 6]
      //   },
      //   {
      //     url: require('@/assets/bc/visualization.png'),
      //     text: '可视化',
      //     path: '/visualization/index',
      //     permission: [1, 2, 4, 6]
      //   },
      //   {
      //     url: require('@/assets/bc/caseMana.png'),
      //     text: '案件管理',
      //     path: '/home/index',
      //     permission: [1, 2, 4, 6]
      //   },
      //   {
      //     url: require('@/assets/bc/solve.png'),
      //     text: '在线解纷',
      //     path: '/rtc/index',
      //     permission: [1, 2, 4, 6]
      //   }
      // ],
      adaptiveSize: '10',
      selectMenu: 0,
      adaptiveObj: {
        height: '85px',
        fontSize: '16px',
        imgWidth: '18px',
        padding: '30px',
        margin: '15px',
        adaptiveSize: '10px'
      },
      screenHeight: document,
      roleType: '', // 选择的角色
      loginCourtId: '',
      loginRole: null, // 登陆角色
      loginCourtInfo: null, // d登陆角色的信息
      isLoading: false,
      otherRoles: null,
      menuLabel: '',
      noticeList: [], // 系统公告数组
      noticeMaxNum: 0 // 系统公告总未读数

    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getLoginCourtInfo']),
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.loginRole = ary[0].id
      return ary
    },
    menuActive() { // 确定首页菜单的选中效果
      return function(path) {
        const menu = path.split('/')[1]
        return menu
      }
    }
  },
  inject: ['reload'],
  watch: {
    $route(to, from) {
      this.menuLabel = this.$route.meta ? this.$route.meta.menuActive || '' : ''
    }
  },
  mounted() {
    // this.selectMenu = 0
    this.adaptive()
  },
  created() {
    this.menuLabel = this.$route.meta ? this.$route.meta.menuActive || '' : ''
    this.getInfo()
    this.getselectMenu()
    this.socket1()
    if (this.getUserInfo.roleType != 3) {
      this.listByType()
    }
  },
  methods: {
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
      this.loading = true
      const setCourt = require('@/api/user/user').setCourt
      const setRoleType = require('@/api/user/user').setRoleType
      const userInfo = require('@/api/user/user').userInfo
      const getUserRouters = require('@/api/user/user').getUserRouters
      setCourt(params).then(res => {
        if (res.state === 100) {
          setRoleType(params1).then(res1 => {
            if (res1.state === 100) {
              this.loginCourtId = null
              this.loginRole = null
              this.changeRoleModal = false
              this.$store.commit('SET_CLEAR') // 清除系统公告/消息得缓存,设置显示默认情况
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
                      this.menuData = this.$store.state.user.menuData
                      if (this.$store.state.user.menuData[0].children.length > 0) {
                        this.$router.push(this.$store.state.user.menuData[0].children[0].path)
                      } else {
                        this.$router.push(this.$store.state.user.menuData[0].path)
                      }
                      this.$router.push(this.$store.state.user.menuData[0].path)
                      this.reload()
                    } else {
                      this.$store.commit('SET_PERMISSIONCLEAR')
                    }
                  })
                }
              })
            } else {
              this.loading = false
            }
          })
        } else {
          this.loading = false
        }
      })
    },
    // 切换角色
    switchRole() {
      const listCourtAndRoleByAdmin = require('@/api/user/user').listCourtAndRoleByAdmin
      listCourtAndRoleByAdmin().then(res => {
        if (res.state === 100) {
          if ((!res.courtInfo || res.courtInfo.length === 0) || (res.courtInfo && res.courtInfo.length === 1 && res.courtInfo[0].roles.length <= 1)) {
            this.$message.error('您没有可切换的角色')
            return
          }
          this.loginCourtInfo = res.courtInfo.filter(item => {
            return item.roles.length > 0
          })
          console.log(this.loginCourtInfo)
          this.otherRoles = res.otherRoles
          this.changeRoleModal = true
        }
      })
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('LogOut')
      location.reload()
    },
    // 自适应大小
    adaptive() {
      console.log(5555555)
      // 大小比例为 1920 ：10
      this.adaptiveSize = this.adaptiveSize * document.body.clientWidth / 1920
      this.adaptiveObj.height = this.adaptiveSize * 8.5 + 'px'
      this.adaptiveObj.fontSize = this.adaptiveSize * 1.6 + 'px'
      this.adaptiveObj.imgWidth = this.adaptiveSize * 1.8 + 'px'
      this.adaptiveObj.padding = this.adaptiveSize * 3 + 'px'
      this.adaptiveObj.margin = this.adaptiveSize * 1.5 + 'px'
      this.adaptiveObj.adaptiveSize = this.adaptiveSize + 'px'
    },
    clickdropdown() {},
    // 获取用户信息
    getInfo() {
      this.userInfo = this.getUserInfo
      const roleType = this.userInfo.roleType
      this.userRole = ROLEMAP[roleType]
    },
    // 选择菜单
    selectMenu1(index, url) {
      this.selectMenu = index
      if (!url) {
        return
      }
      if (this.$route.path === url) {
        return false
      }
      this.$router.push(url)
    },
    resetPwd() {
      this.modalVisible = true
    },
    changeModalVisible() {
      this.modalVisible = false
    },
    // 聊天室通知结果返回后端
    resultBtn(opinion) {
      const params = {
        groupId: this.groupId, // 群组groupId
        loginId: this.loginId, // 登录者ID
        opinion: opinion// 是否同意加入群组 “1” 同意 ”2“ 拒绝
      }
      const agreeAdd = require('@/api/contract/contract.js').agreeAdd
      agreeAdd(params).then(res => {
        console.log(res)
        if (res.state == 100) {
          this.centerDialogVisible = false
          if (this.jumpType == 1) {
            if (opinion == 1) { // 同意加入跳转聊天页面
              this.$store.commit('SET_ID', this.groupId)
              this.$store.commit('SET_SHOWINDEX', 2)
              console.log('this.$store.state.contract.showIndex', this.$store.state.contract.showIndex)
              console.log('this.$store.state.contract.id', this.$store.state.contract.id)
              // 跳转联络中心
              const routeData = this.$router.resolve({ path: '/contactCenter' })
              window.open(routeData.href, '_blank')
            }
          } else {
            if (opinion == 1) { // 同意加入跳转视频页面
              const getToken = require('@/api/contract/contract.js').getToken
              const params = {
                groupId: this.groupId,
                permission: 'user',
                roomId: this.roomId
              }
              getToken(params).then(res => {
                if (res.state == 100) {
                  this.$store.commit('SET_TOKEN', res.data.result)
                  this.$store.commit('SET_ID', this.groupId)
                  this.$store.commit('SET_SHOWINDEX', 1)
                  // 跳转联络中心
                  const routeData = this.$router.resolve({ path: '/contactCenter' })
                  window.open(routeData.href, '_blank')
                }
              })
            }
          }
        }
      })
    },
    // 判断当前地址为哪个菜单
    getselectMenu() {
      console.log('路由地址')
      console.log(this.$route)
      this.selectMenu = menuMap[this.$route.name]
      console.log('-------selectMenu-----')
      console.log(this.selectMenu)
    },
    // 重置密码提交
    submitResetPwd() {
      if (!this.pwdParam.oldPassword) {
        this.$message({
          showClose: true,
          message: '请输入旧密码',
          type: 'error'
        })
        return
      }
      if (!this.pwdParam.newPassword1) {
        this.$message({
          showClose: true,
          message: '请输入新密码',
          type: 'error'
        })
        return
      }
      if (!this.pwdParam.newPassword2) {
        this.$message({
          showClose: true,
          message: '请输入确认密码',
          type: 'error'
        })
        return
      }
      if (this.pwdParam.newPassword1.length < 6 || this.pwdParam.newPassword1.length > 12) {
        this.$message({
          showClose: true,
          message: '新密码位数为6-12位',
          type: 'error'
        })
        return
      }
      if (this.pwdParam.newPassword2.length < 6 || this.pwdParam.newPassword2.length > 12) {
        this.$message({
          showClose: true,
          message: '新密码位数为6-12位',
          type: 'error'
        })
        return
      }
      const modifyPassword = require('@/api/user/user.js').modifyPassword
      const params = {
        oldPassword: md5(this.pwdParam.oldPassword),
        newPassword1: md5(this.pwdParam.newPassword1),
        newPassword2: md5(this.pwdParam.newPassword2)
      }
      modifyPassword(params).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.modalVisible = false
        }
      })
    },
    // 获取系统公告1系统消息2
    listByType() {
      const listByType = require('@/api/news/news.js').listByType
      const params = {
        pageNum: 1,
        pageSize: 4,
        afficheType: '' // 不传查公告、消息
      }
      listByType(params).then(res => {
        if (res.state == '100') {
          this.noticeList = res.content
          this.noticeMaxNum = res.total
          if (this.noticeMaxNum > 0) {
            this.$refs.news.changeShowNewsBox(true)// 弹窗系统公告
          }
        }
      })
    },
    socket1() {
      const host = location.host
      let socketUrl = ''
      if (host.indexOf('localhost') === 0) { // 判断是否本第还是线上
        socketUrl = `ws://${host}`
      } else {
        socketUrl = `wss://${host}`
      }
      this.socket = new WebSocket(`${socketUrl}/api/web/webSocket.jhtml`)
      // this.socket = new WebSocket('ws://localhost:8083/api/web/webSocket.jhtml')
      this.socket.onopen = function() {
        console.log('websocket连接成功')
      }
      this.socket.onmessage = (e) => {
        console.log(JSON.parse(e.data))
        const data = JSON.parse(e.data)
        if (data.beInviteId) { // 判断是否有邀请的机构
          this.$confirm(`${data.message}`)
            .then(_ => {
              this.$store.commit('SET_COURTID', data.inviteId)
              this.$router.replace({ path: '/redirect/videoCom', query: { token: [data.roomToken] }})
            })
            .catch(_ => {
              const params = {
                inviteId: data.inviteId,
                beInviteId: data.beInviteId,
                inviteType: false
              }
              const beInviteIntoRoom = require('@/api/bigdata/index').beInviteIntoRoom
              beInviteIntoRoom(params)
            })
        } else if (data.type == '聊天室(可视频)') { // 判断是否聊天室(可视频)
          this.jumpType = 1
          this.centerDialogVisible = true
          this.messageTip = data.message
          this.groupId = data.groupId
        } else if (data.type == '视频') { // 判断是否联络中心视频
          this.jumpType = 2
          this.centerDialogVisible = true
          this.messageTip = data.message
          this.groupId = data.groupId
          this.roomId = data.roomId
        } else if (data.type == '1' || data.type == '2') { // 1系统公告、2系统消息
          this.listByType()// 查询系统消息
          this.$refs.news.changeShowNewsBox(true)// 弹窗系统公告
        } else {
          this.$message.error(data.message)
        }
      }
      this.socket.onerror = function() {
        console.log('WebSocket连接发生错误')
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';
$top: top;
$bottom: bottom;
$left: left;
$right: right;
$leftright: ($left, $right);
%w100 {
  width: 100%;
}

%h100 {
  height: 100%;
}

%cursor {
  cursor: pointer;
}

html,
body,
#app,
.el-container,
#asideNav,
ul.el-menu {
  @extend %h100;
}

@mixin set-value($side, $value) {
  @each $prop in $leftright {
    #{$side}-#{$prop}: $value;
  }
}
#header {
  /* max-height: 80px;
  line-height: 80px; */
  position: fixed;
  top: 0;
  height: 80px;
  width: 100%;
  font-size: 0px;
  .header-inner {
    float: right;
    > div {
      display: inline-block;
    }
    .icon-wrapper {
      position: relative;
      i {
        font-size: 25px;
        color: #131026;
        text-align: center;
        margin-right: 30px;
        position: relative;
        top: 5px;
      }
      .number {
        position: absolute;
        display: inline-block;
        width: 18px;
        height: 18px;
        background-color: #ec4c4d;
        color: #fff;
        line-height: 18px;
        text-align: center;
        border-radius: 50%;
        right: 25px;
        top: 23px;
      }
    }
    .el-dropdown {
      top: calc(var(--fz) * 1.5);
    }
    .info-inner {
      display: flex;
      height: 50%;
      line-height: 50%;
      color: #fff;
      .avator {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 12px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        height: calc(var(--fz) * 5);
        text-align: left;
        margin-right: calc(var(--fz) * 2);
        .name {
          font-size: calc(var(--fz) * 1.5);
          line-height: calc(var(--fz) * 3.7);
          height: calc(var(--fz) * 3);
        }
        .role {
          font-size: calc(var(--fz) * 1.2);
          line-height: calc(var(--fz) * 1.2);
          height: calc(var(--fz) * 1.2);
        }
      }
      .icon {
        line-height: calc(var(--fz) * 5);
      }
      .info-icon {
        margin-right: calc(var(--fz) * 1) !important;
        font-size: calc(var(--fz) * 2);
      }
    }
  }
  .menu-wrapper {
    display: inline-flex;
    color: #fff;
    margin-left: 25%;
    height: 80px;
    line-height: 80px;
    li {
      padding: 0 30px;
      cursor: pointer;
      &.active {
        background-image: url('../../../assets/bc/menuSelectbc.png');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position-y: 50%;
      }
      img {
        margin-top: calc(var(--fz) * 0.5);
        margin-right: calc(var(--fz) * 0.5);
        position: relative;
        top: calc(var(--fz) * 0.3);
        margin-left: calc(var(--fz) * 1.5);
      }
      span {
        display: inline-block;
        margin-right: 15px;
      }
    }
  }
}
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .label {
    width: 60px;
  }
  .input {
    width: 300px;
  }
  .code {
    cursor: pointer;
  }
}
</style>
