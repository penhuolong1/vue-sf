import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 获取查询机构列表
export function getMediater(params) {
  params.pageSize = 100
  return service({
    url: '/court/mediateter/getMediater.jhtml',
    method: 'get',
    params
  })
}

// 获取新案件id
export function addCase() {
  return service({
    url: '/court/case/addCase.jhtml',
    method: 'get'
  })
}

// 获取案由列表
export function getBrief() {
  const params = {
    pageSize: 100
  }
  return service({
    url: '/court/case/getBrief.jhtml',
    method: 'get',
    params
  })
}

// 添加当事人信息（第一步/第二步）
export function applyCase(params) {
  return service({
    url: '/court/case/applyCase.jhtml',
    method: 'get',
    params: { ...params }
  })
}

// 添加当事人
export function addLitigant(data) {
  return service({
    url: '/court/litigant/addLitigant.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 添加当事人（法人）
export function addCompanyLit(data) {
  return service({
    url: '/court/litigant/addCompanyLit.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 查询当事人
export function detailsCase(data) {
  return service({
    url: '/court/case/detailsCase.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 上传证据表单
export function addOrUpdateEvi(data) {
  return service({
    url: '/court/evidence/addOrUpdateEvi.jhtml',
    method: 'post',
    data: { ...data }
  })
}

// 上传证据文件
export function uploadProof(data) {
  return service({
    url: '/court/evidence/uploadProof.jhtml',
    method: 'post',
    data
  })
}

// 查看证据
export function detailsEvidence(data) {
  return service({
    url: '/court/evidence/detailsEvidence.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 查看证据列表
export function evidenceList(data) {
  return service({
    url: '/court/evidence/evidenceList.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 添加代理人
export function addLawyer(data) {
  return service({
    url: '/court/lawyer/addLawyer.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 修改当事人
export function editLitigant(data) {
  return service({
    url: '/court/litigant/editLitigant.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 修改当事人（法人）
export function editCompanyLit(data) {
  return service({
    url: '/court/litigant/editCompanyLit.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 修改代理人
export function addOrUpdateLawyer(data) {
  return service({
    url: '/court/lawyer/addOrUpdateLawyer.jhtml',
    method: 'post',
    data: data
  })
}

// 删除当事人
export function deleteLitigant(data) {
  return service({
    url: '/court/litigant/deleteLitigant.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 删除代理人
export function delLawyer(data) {
  return service({
    url: '/court/lawyer/delLawyer.jhtml',
    method: 'post',
    data: Qs.stringify({ ...data })
  })
}

// 删除证据
export function delEvi(data) {
  return service({
    url: '/court/evidence/delEvi.jhtml',
    method: 'post',
    data: data
  })
}

// 案件列表接口
export function listCase(params) {
  return service({
    url: '/court/case/selectCase.jhtml',
    method: 'GET',
    params
  })
}

// 案件提交接口
export function submitCase(params) {
  return service({
    url: '/court/case/applyCase.jhtml',
    method: 'GET',
    params
  })
}

// 上传文件
export function uploadFrontImage(data) {
  return service({
    url: '/court/wxRegister/uploadFrontImage.jhtml',
    method: 'post',
    isLoad: true,
    data
  })
}

// 组织解纷智能推荐
export function getTopThreeCourt(params) {
  return service({
    url: '/court/mediateter/getTopThreeCourt.jhtml',
    method: 'get',
    params
  })
}

// 组织解纷自主选择
export function listCourt(params) {
  return service({
    url: '/court/mediateter/listCourt.jhtml',
    method: 'get',
    params
  })
}

// 获取前三解纷员
export function getTopThreeMediator(params) {
  return service({
    url: '/court/mediateter/getTopThreeMediator.jhtml',
    method: 'get',
    params
  })
}

// 组织解纷排行榜
export function listTopCourt(params) {
  return service({
    url: '/court/mediateter/listTopCourt.jhtml',
    method: 'get',
    params
  })
}

// 解纷员排行榜
export function listTopMediator(params) {
  return service({
    url: '/court/mediateter/listTopMediator.jhtml',
    method: 'get',
    params
  })
}
// 通过身份证号获取性别年龄生日
export function getBirAgeSex(params) {
  return service({
    url: '/court/litigant/getBirAgeSex.jhtml',
    method: 'get',
    params
  })
}

// 扫码修改案件的接口
export function scanCase(params) {
  return service({
    url: '/court/case/scanCase.jhtml',
    method: 'get',
    params
  })
}
