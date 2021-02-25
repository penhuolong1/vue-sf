import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 用户登录
export const login = params => {
  params.placeType = 1 // 区分登陆石狮1仓山2
  return service({
    url: '/main/login.jhtml',
    method: 'post',
    params
  })
}

// 查看用户信息
export const userInfo = () => {
  return service({
    url: '/main/getUserInfo.jhtml',
    method: 'get'
  })
}

// 获取登陆ID
export const getLoginId = () => {
  return service({
    url: '/court/group/getLoginId.jhtml',
    method: 'get'
  })
}

// 退出
export const loginOut = () => {
  return service({
    url: '/main/loginOut.jhtml',
    method: 'get'
  })
}

// 获取验证码
export const forgetPwdCode = params => {
  return service({
    url: '/main/forgetPwdCode.jhtml',
    method: 'post',
    data: params
  })
}
// 忘记密码提交
export const forgetPwd = params => {
  return service({
    url: '/main/forgetPwd.jhtml',
    method: 'post',
    data: params
  })
}
// 重置密码
export const modifyPassword = params => {
  return service({
    url: '/main/modifyPassword.jhtml',
    method: 'post',
    data: params
  })
}

// 获取手机验证码
export function phoneCode(data) {
  return service({
    url: '/main/phoneCode.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 注册
export function register(data) {
  return service({
    url: '/user/regist.jhtml',
    method: 'post',
    data: data
  })
}

// 获取手机验证码
export function forgetPwd2(data) {
  return service({
    url: '/user/forgetPwd.jhtml',
    method: 'post',
    data: data
  })
}

/**
 * 绑定手机号
 * @param {*} code 验证码
 * @param {*} name 姓名
 * @param {*} phone 手机号
 * @param {*} password 旧密码
 * @param {*} password2 新密码
 */
export function bindPhone(data) {
  return service({
    url: '/user/bindPhone.jhtml',
    method: 'post',
    data: data
  })
}

/**
 * 多角色选择角色登录
 * @param {*} roleType 角色信息
 */
export function resetRoleType(params) {
  return service({
    url: '/main/resetRoleType.jhtml',
    method: 'get',
    params
  })
}

// 通过用户名获取角色菜单
export function getUserRouters(params) {
  return service({
    url: '/menu/getUserRouters.jhtml',
    method: 'post',
    data: params
  })
}

// 登陆改版
export function login2(params) {
  return service({
    url: '/main/login2.jhtml',
    method: 'post',
    data: params
  })
}
/**
 * 登陆选择机构
 * @param {*} courtId 机构uid
 */
export function setCourt(params) {
  return service({
    url: '/main/setCourt.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 登录选择角色
 * @param {number} roleType 角色
 */
export function setRoleType(params) {
  return service({
    url: '/main/setRoleType.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 查询当前登陆角色的其他角色
 */
export function listCourtAndRoleByAdmin(params) {
  return service({
    url: '/court/court/listCourtAndRoleByAdmin.jhtml',
    method: 'get',
    data: params
  })
}
