import { SYS_NAME } from '@/utils/constVal'
import { userInfo, getLoginId, loginOut, getUserRouters } from '@/api/user/user'
import { listCourtByAdmin } from '@/api/case/index.js'
const app = SYS_NAME
const user_Info = app + '-userInfo'
const user_role = app + '-userRole'
const user_CourtId = app + '-userCourtId'
const user_loginId = app + '_loginId'
const user = {
  state: {
    userRole: localStorage.getItem(user_role)
      ? JSON.parse(localStorage.getItem(user_role))
      : '', // 用户角色
    userInfo: localStorage.getItem(user_Info)
      ? JSON.parse(localStorage.getItem(user_Info))
      : '', // 用户个人信息,
    loginId: localStorage.getItem(user_loginId)
      ? JSON.parse(localStorage.getItem(user_loginId))
      : '', // 登陆ID,
    menuData: [], // 菜单
    menuList: [], // 首页得菜单
    perms: [], // 角色权限按钮
    loginCourtInfo: null, // 登陆角色机构信息
    courtId: localStorage.getItem(user_CourtId)
      ? JSON.parse(localStorage.getItem(user_CourtId))
      : ''
  },
  mutations: {
    // 保存用户个人信息
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_USERROLE: (state, role) => {
      state.userRole = role
    },
    SET_USER_COURTID: (state, courtId) => {
      state.courtId = courtId
    },
    SET_LOGINID: (state, role) => {
      state.loginId = role
    },
    SET_PERMISSION: (state, data) => {
      state.menuData = data.data.vueRouter ? data.data.vueRouter : []
      for (let index = 0; index < state.menuData.length; index++) {
        const element = state.menuData[index]
        if (element.name == '首页') {
          state.menuList = element.children
        }
      }
      state.perms = data.data.perms ? data.data.perms : []
    },
    SET_PERMISSIONCLEAR: (state, data) => {
      state.menuData = []
      state.menuList = []
    },
    SET_LOGINCOURTINFO: (state, data) => {
      state.loginCourtInfo = data
    }
  },
  getters: {
    getUserInfo: state => state.userInfo, // 获取用户个人信息
    getUserRole: state => state.userRole, // 获取用户个人角色
    getLoginId: state => state.loginId, // 获取登陆用户id
    getCourtId: state => state.courtId, // 获取登陆用户机构id
    getLoginCourtInfo: state => state.loginCourtInfo // 获取登陆用户的机构
  },
  actions: {
    GetUserInfo({ commit }) {
      return new Promise((resolve) => {
        userInfo().then(res => {
          if (res.state == 100) {
            const data = res
            localStorage.setItem(user_Info, JSON.stringify(data))
            commit('SET_USERINFO', data)
            commit('SET_USERROLE', res.roleType)
            commit('SET_USER_COURTID', res.courtId)
          } else {
            localStorage.removeItem(user_Info)
            localStorage.removeItem(user_role)
            localStorage.removeItem(user_loginId)
          }
          resolve(res)
        })
      })
    },
    // 获取当前用户角色菜单
    GetUserRouters({ commit, state }) {
      return new Promise((resolve) => {
        const params = {
          username: state.userInfo.result.id
        }
        getUserRouters(params).then(res => {
          if (res.state == 100) {
            for (let index = 0; index < res.data.vueRouter.length; index++) {
              const element = res.data.vueRouter[index]
              // element.icon = require('../../assets/bc/home.png')
              element.icon = require('../../assets/bc/' + element.icon)
            }
            commit('SET_PERMISSION', res)
          } else {
            commit('SET_PERMISSIONCLEAR')
          }
          resolve(res)
        })
      })
    },
    GetLoginId({ commit }) {
      return new Promise((resolve) => {
        getLoginId().then(res => {
          if (res.state == 100) {
            const data = res.loginId
            localStorage.setItem(user_loginId, JSON.stringify(data))
            commit('SET_LOGINID', data)
          } else {
            localStorage.removeItem(user_Info)
            localStorage.removeItem(user_role)
            localStorage.removeItem(user_loginId)
          }
          resolve(res)
        })
      })
    },
    // 退出登录
    LogOut() {
      return new Promise((resolve, reject) => {
        loginOut()
          .then(() => {
            localStorage.removeItem(user_Info)
            localStorage.removeItem(user_role)
            localStorage.removeItem(user_loginId)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取登陆角色的机构信息
    GetLoginCourtInfo({ commit }) {
      listCourtByAdmin().then(res => {
        if (res.state === 100) {
          commit('SET_LOGINCOURTINFO', res)
        }
      })
    }
  }
}
export default user
