import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 用户管理分页
export function searchPageAdmin(params) {
  return service({
    url: '/user/searchPageAdmin.jhtml',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(params)
  })
}
// 修改用户
export function editAdmin(params) {
  return service({
    url: '/user/editAdmin.jhtml',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(params)
  })
}
// 添加用户
export function addAdmin(params) {
  return service({
    url: '/user/addAdmin.jhtml',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(params)
  })
}
// 删除用户
export function deleteAdmin(params) {
  return service({
    url: '/user/deleteAdmin.jhtml',
    // method: "GET",
    params
  })
}
// 查询用户
export function selectAdmin(params) {
  return service({
    url: '/user/selectAdmin.jhtml',
    method: 'get',
    params
  })
}
// 角色分页
export function searchPageRole(params) {
  return service({
    url: '/role/searchPageRole.jhtml',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(params)
  })
}

// 获取调解机构
export function getMediater(params) {
  params.placeType = 1
  params.pageSize = 1000
  return service({
    url: '/court/mediateter/getMediater.jhtml',
    method: 'GET',
    params
  })
}

// 删除角色
export function deleteRole(params) {
  return service({
    url: '/role/deleteRole.jhtml',
    method: 'get',
    params
  })
}

// 获取菜单树
export function getMenuTree(params) {
  return service({
    url: '/menu/getMenuTree.jhtml',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(params)
  })
}
// 查询角色
export function selectRole(params) {
  return service({
    url: '/role/selectRole.jhtml',
    method: 'get',
    params
  })
}
// 修改角色权限
export function editRole(params) {
  return service({
    url: '/role/editRole.jhtml',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: Qs.stringify(params)
  })
}
