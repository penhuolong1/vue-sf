import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 获取账号信息
export function getAdminInfo(params) {
  return service({
    url: '/web/admin/getAdminInfo.jhtml',
    method: 'get',
    params
  })
}
// 通过旧密码更改密码
export function modifyPassword(params) {
  return service({
    url: '/main/modifyPassword.jhtml',
    method: 'post',
    data: params
  })
}
// 通过手机号码更改密码
export function updatePwdByCode(params) {
  return service({
    url: '/web/admin/updatePwdByCode.jhtml',
    method: 'post',
    data: params
  })
}
// 获取手机验证码
export function forgetPwdCode(params) {
  return service({
    url: '/main/forgetPwdCode.jhtml',
    method: 'post',
    data: params
  })
}

// 绑定手机号码
export function updatePhone(params) {
  return service({
    url: '/web/admin/updatePhone.jhtml',
    method: 'post',
    data: params
  })
}
// 绑定邮箱
export function updateEmail(params) {
  return service({
    url: '/web/admin/updateEmail.jhtml',
    method: 'post',
    data: params
  })
}
// 绑定邮箱验证码
export function getEmailCode(params) {
  return service({
    url: '/web/admin/getEmailCode.jhtml',
    method: 'post',
    data: params
  })
}
// 提交上传的头像
export function saveAdminImg(params) {
  return service({
    url: '/web/admin/saveAdminImg.jhtml',
    method: 'post',
    data: params
  })
}

// 查询登录机构自身调字号
export function getDisputeNo(params) {
  return service({
    url: '/web/case/getDisputeNo.jhtml',
    method: 'get',
    params
  })
}

/**
 * 设置机构自身调字号
 * @param {string} part 调解号主体
 *  * @param {string} preStr 年份
 * @param {int} indexType 1:年份在主体前2：年份在主体前
 */
export function updateDisputeNo(params) {
  return service({
    url: '/web/case/updateDisputeNo.jhtml',
    method: 'post',
    data: params
  })
}
