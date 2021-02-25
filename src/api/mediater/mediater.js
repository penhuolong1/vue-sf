import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 获取解纷机构
export function getMediater(params) {
  params.placeType = 1 // 1为厦门
  params.pageSize = 1000
  return service({
    url: '/court/mediateter/getMediater.jhtml',
    method: 'GET',
    params
  })
}

// 获取解纷人员
export function getMediaterUser(params) {
  return service({
    url: '/court/mediateter/getMByCId.jhtml',
    method: 'GET',
    params
  })
}

// 根据卷宗uid/目录uid获取目标目录文件详情
export function detailDirType(params) {
  return service({
    url: '/mediate/file/detailDirType.jhtml',
    method: 'GET',
    params
  })
}

// 转成笔录
export function downloadMessage(params) {
  return service({
    url: '/court/group/downloadMessage.jhtml',
    method: 'GET',
    params
  })
}

// 转成笔录pdf
export function downloadPDF(params) {
  return service({
    url: '/court/group/downloadPDF.jhtml',
    method: 'GET',
    params
  })
}

// 获取解纷笔录 /court/protocol/getProtocolByCaseId
export function protocolByCaseId(params) {
  return service({
    url: '/court/protocol/getProtocolByCaseId.jhtml',
    method: 'GET',
    params
  })
}

// 生成解纷结果
export function updateCaseResult(params) {
  return service({
    url: '/web/case/updateCaseResult.jhtml',
    method: 'post',
    data: params
  })
}

// 进入解纷
export function inRecord(params) {
  return service({
    url: '/court/grouprecord/inRecord.jhtml',
    method: 'post',
    data: params
  })
}

// 退出解纷
export function outRecord(params) {
  return service({
    url: '/court/grouprecord/outRecord.jhtml',
    method: 'post',
    data: params
  })
}

// 解纷列表
export function groupRecord(params) {
  return service({
    url: '/court/grouprecord/searchPageGroupRecord.jhtml',
    method: 'get',
    params
  })
}
// 删除解纷记录
export function deleteGroupRecord(params) {
  return service({
    url: '/court/grouprecord/deleteGroupRecord.jhtml',
    method: 'get',
    params
  })
}

// 验证是否有身份证号
export function verifyHasCard(params) {
  return service({
    url: '/court/group/verifyHasCard.jhtml',
    method: 'get',
    params
  })
}
