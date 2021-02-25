import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 发起协同
 * @param {String} caseId 案件id
 * @param {String} reason 协同理由
 * @param {Array} teamWorkers 邀请协同信息 [{type: 1：主要办案员2：案件协同员, courtId： 机构id，mediaterId: 解纷员id}]
 */
export function initiateTeam(params) {
  return service({
    url: '/web/team/initiateTeam.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 协同日志
 * @param {String} caseId 案件id
 */
export function listTeamByCase(params) {
  return service({
    url: '/web/team/listTeamByCase.jhtml',
    method: 'get',
    params
  })
}
/**
 * 结束协同
 * @param {String} teamWorkId 第一级协同对象uid
 */
export function endTeamWork(params) {
  return service({
    url: '/web/team/endTeamWork.jhtml',
    method: 'post',
    params
  })
}

/**
 * 登录账号是否为案件协同对象
 * @param {String} caseId 案件id
 */
export function teamWorkerByCase(params) {
  return service({
    url: '/web/team/teamWorkerByCase.jhtml',
    method: 'get',
    params
  })
}

/**
 * 协同对象 下发/分配 案件
 * @param {String} caseId 案件id
 * @param {String} mediaterId 解纷员id
 * @param {String} courtId 机构id
 */
export function dispenseCaseForTeam(params) {
  return service({
    url: '/web/team/dispenseCaseForTeam.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 协同对象 下发/分配 案件
 * @param {String} caseId 案件id
 * @param {String} rejectReason 理由
 */
export function rejectTeam(params) {
  return service({
    url: '/web/team/rejectTeam.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 协同对象 接收案件
 * @param {String} caseId 案件id
 */
export function acceptTeam(params) {
  return service({
    url: '/web/team/acceptTeam.jhtml',
    method: 'post',
    data: params
  })
}
