import axiosConfig from '@/utils/axios.js'
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 案件列表接口
export function listCase(params) {
  return service({
    url: '/web/case/listCase.jhtml',
    method: 'GET',
    params
  })
}

// 获取案件详情接口 传lawCaseId
export function detailCase(params) {
  return service({
    url: '/court/case/detailsCase.jhtml',
    method: 'GET',
    params
  })
}

// 删除案件
export function delCase(params) {
  return service({
    url: '/court/case/deleteCase.jhtml',
    method: 'GET',
    params
  })
}

// 获取案由
export function brief(params) {
  return service({
    url: '/court/case/getBrief.jhtml',
    method: 'GET',
    params
  })
}

// 添加编辑案件
export function updateCase(params) {
  return service({
    url: '/web/case/updateCaseInfo.jhtml',
    method: 'POST',
    data: params
  })
}

// 查询案件解纷协议/证据信息/当事人信息
export function protocol(params) {
  return service({
    url: '/court/protocol/getProtocolByCaseId.jhtml',
    method: 'GET',
    params
  })
}

// 上传或修改证据
export function addOrUpdateEvi(params) {
  return service({
    url: '/court/evidence/addOrUpdateEvi.jhtml',
    method: 'POST',
    data: params
  })
}

// 删除证据
export function delEvi(params) {
  return service({
    url: '/court/evidence/delEvi.jhtml',
    method: 'POST',
    data: params
  })
}
/**
 * 上传图片
 * file 图片文件
 */
export function uploadImg(param) {
  return service({
    url: '/court/wxRegister/uploadFrontImage.jhtml',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    isLoad: true,
    name: 'file',
    data: param
  })
}

// 添加当事人
export function addLitigant(params) {
  return service({
    url: '/court/litigant/addLitigant.jhtml',
    method: 'POST',
    params
  })
}

// 修改当事人
export function editLitigant(params) {
  return service({
    url: '/court/litigant/editLitigant.jhtml',
    method: 'POST',
    params
  })
}

// 添加当事人(法人)
export function addCompanyLit(params) {
  return service({
    url: '/court/litigant/addCompanyLit.jhtml',
    method: 'POST',
    params
  })
}

// 修改当事人(法人)
export function editCompanyLit(params) {
  return service({
    url: '/court/litigant/editCompanyLit.jhtml',
    method: 'POST',
    params
  })
}

// 删除当事人
export function deleteLitigant(params) {
  return service({
    url: '/court/litigant/deleteLitigant.jhtml',
    method: 'POST',
    params
  })
}

// 获取当事人信息
export function selectLitigant(params) {
  return service({
    url: '/court/litigant/selectLitigant.jhtml',
    method: 'post',
    params
  })
}

// 添加修改代理人
export function addLawyer(params) {
  return service({
    url: '/court/lawyer/addOrUpdateLawyer.jhtml',
    method: 'POST',
    data: params
  })
}

// 查看代理人详情
export function detailById(params) {
  return service({
    url: '/court/lawyer/detailById.jhtml',
    method: 'get',
    params
  })
}

// 添加删除代理人
export function delLawyer(params) {
  return service({
    url: '/court/lawyer/delLawyer.jhtml',
    method: 'POST',
    data: params
  })
}

// 提交案件
export function addCase(params) {
  return service({
    url: '/court/case/submitCase.jhtml',
    method: 'POST',
    params
  })
}

// 修改办理承受信息
export function operateCase(params) {
  return service({
    url: '/web/case/operateCase.jhtml',
    method: 'POST',
    data: params
  })
}

// 获取下级机构
export function getCourtsByCourt(params) {
  return service({
    url: '/court/mediateter/getCourtsByCourtId.jhtml',
    method: 'get',
    params
  })
}

/**
 * 上传文件
 * file 文件
 */
export function uploadFile(param) {
  return service({
    url: '/court/group/uploadImage.jhtml',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    name: 'file',
    data: param
  })
}

// 获取用户信息 court/room/getUserDetail.jhtml
export function userInfo(params) {
  return service({
    url: 'court/room/getUserDetail.jhtml',
    method: 'get',
    params
  })
}

// 获取聊天历史记录
export function getHistory(params) {
  return service({
    url: 'court/group/getHistory.jhtml',
    method: 'get',
    params
  })
}

// 获取解纷号
export function caseNo(params) {
  params.placeType = 1 // 用来区分地区 1代表厦门
  return service({
    url: 'court/case/getCaseNo.jhtml',
    method: 'get',
    params
  })
}

/**
 * 案件审核
 * @param {案件id--是} caseId
 * @param {1为修改登字号/解纷号 2为审核意见--是} step
 * @param {登字号 （step为1传值）} casenNo
 * @param {解纷号 （step为1传值）} sqCaseNo
 * @param {审核意见 0未审核；1同意；2不同意；3补正 （step为2传值）} acceptance
 * @param {补正意见 （step为2传值）} opinion
 */
export function acceptCase(params) {
  return service({
    url: 'court/case/acceptCase.jhtml',
    method: 'post',
    params
  })
}

// court/case/distributeCase.jhtml
// 分发
export function distributeCase(params) {
  return service({
    url: 'court/case/distributeCase.jhtml',
    method: 'get',
    params
  })
}

// 进入解纷室状态变更
export function intoTalkRoom(params) {
  return service({
    url: 'court/room/talkRoom.jhtml',
    method: 'post',
    data: params
  })
}

// 删除聊天记录
export function deleteMessage(params) {
  return service({
    url: '/court/group/deleteMessage.jhtml',
    method: 'post',
    data: params
  })
}

// 获取证据信息通过ID
export function detailEviById(params) {
  return service({
    url: '/court/evidence/detailEviById.jhtml',
    method: 'post',
    params
  })
}

// 上传证据附件
export function uploadProof(params) {
  return service({
    url: '/court/evidence/uploadProof.jhtml',
    method: 'post',
    isLoad: true,
    data: params
  })
}
// 法院 查询案件列表
export function listCaseCourt(params) {
  return service({
    url: '/web/case/listCaseCourt.jhtml',
    method: 'get',
    params
  })
}

// 身份证号回填
export function backBirthDay(params) {
  return service({
    url: '/court/litigant/backBirthDay.jhtml',
    method: 'get',
    params
  })
}

// 上传文书
export function uploadMediateFiles(params) {
  return service({
    url: '/mediate/file/uploadMediateFiles.jhtml',
    method: 'post',
    data: params
  })
}

// 保存上传文书
export function saveMediateFile(params) {
  return service({
    url: '/mediate/file/saveMediateFile.jhtml',
    method: 'post',
    data: params
  })
}

// 获取日志
export function listCaseLog(params) {
  return service({
    url: '/web/case/listCaseLog.jhtml',
    method: 'get',
    params
  })
}

// 结案处理
export function endCase(params) {
  return service({
    url: '/web/case/endCase.jhtml',
    method: 'post',
    data: params
  })
}

// 导出
export function exportLawCaseInfo(params) {
  return service({
    url: '/web/case/exportLawCaseInfo.jhtml',
    method: 'post',
    data: params
  })
}

// 批量审核/分发/分配
export function batchLawCase(params) {
  return service({
    url: '/web/case/batchLawCase.jhtml',
    method: 'post',
    data: params
  })
}

// 通过url下载
export function downUrl(url) {
  return service({
    url: url,
    method: 'get'
  })
}

// 分流
export function flowCase(params) {
  return service({
    url: '/court/case/flowCase.jhtml',
    method: 'get',
    params
  })
}

// 查看证据
export function evidenceList(params) {
  return service({
    url: '/court/evidence/evidenceList.jhtml',
    method: 'get',
    params
  })
}

// 移动端查看案件详情
export function qrCodeCaseInfo(caseId) {
  return service({
    url: '/court/case/qrCodeCaseInfo.jhtml',
    method: 'get',
    params: {
      caseId
    }
  })
}

// 获取案件二维码
export function qrCodeForCaseLog(caseId) {
  return service({
    url: '/court/case/qrCodeForCase.jhtml',
    method: 'get',
    params: {
      caseId
    }
  })
}

// 法院移送
export function afterEnd(data) {
  return service({
    url: '/court/case/afterEnd.jhtml',
    method: 'post',
    data
  })
}

// 获取法律法规列表
export function searchLaw(params) {
  return service({
    url: '/court/lawquery/search.jhtml',
    method: 'get',
    params
  })
}

// 获取法律法规列表
export function lawDetail(id) {
  return service({
    url: '/court/lawquery/detail.jhtml',
    method: 'get',
    params: {
      id
    }
  })
}

// 案件处理获取案件时间线的接口
export function lawCaseLine(params) {
  return service({
    url: '/court/case/lawCaseLine.jhtml',
    method: 'get',
    params
  })
}

// 结案
export function updateCaseClose(data) {
  return service({
    url: '/web/case/updateCaseClose.jhtml',
    method: 'post',
    data
  })
}
/**
 * 智能推荐路线
 * @param {*} mediaterId 推荐调解员的id
 * @param {*} caseId 案件id
 */
export function getUpCourtByMan(params) {
  return service({
    url: 'court/case/getUpCourtByMan.jhtml',
    method: 'get',
    params
  })
}

/**
 * 办理日志
 * @param {*} lawCaseId 案件id
 */
export function historyList(params) {
  return service({
    url: 'court/history/list.jhtml',
    method: 'get',
    params
  })
}

/**
 * 调解员接收案件
 * @param {*} caseId 案件id
 */
export function accept(params) {
  return service({
    url: 'web/case/accept.jhtml',
    method: 'get',
    params
  })
}

/**
 * 一键设置智能推荐
 * @param {*} caseId 案件id
 */
export function setRecommend(params) {
  return service({
    url: 'court/mediateter/setRecommend.jhtml',
    method: 'get',
    params
  })
}

/**
 * 修改化解结果和移送法院
 */
export function updateResult(data) {
  return service({
    url: 'web/case/updateResult.jhtml',
    method: 'post',
    data
  })
}

/**
 * 补正案件
 * @param {*} caseId 案件id
 */
export function supply(params) {
  return service({
    url: 'court/case/supply.jhtml',
    method: 'get',
    params
  })
}

/**
 * 案件转内网
 * @params {string} caseIds 案件id
 * @params {string} courtName 法院名字
 */
export function wxSetCase(data) {
  return service({
    url: '/web/case/wxSetCase.jhtml',
    method: 'post',
    data
  })
}

/**
 * 查询已办理为办理
 */
export function searchCase(params) {
  return service({
    url: '/court/case/searchCase.jhtml',
    method: 'GET',
    params
  })
}

/**
 * 修改解纷方案
 * @params {string} caseIds 案件id
 * @params {string} method 解纷方案
 */
export function updateMethod(params) {
  return service({
    url: '/court/case/updateMethod.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 删除案件
 * @params {string} caseIds 案件id
 */
export function deleteCase(params) {
  return service({
    url: '/court/case/deleteCase.jhtml',
    method: 'get',
    params
  })
}

/**
 * 获取登录账号court集合
 */
export function listCourtByAdmin(params) {
  return service({
    url: '/court/court/listCourtByAdmin.jhtml',
    method: 'get',
    params
  })
}

/**
 * 工作人员查询案件
 * @params {string} pageNum 页码默认1
 * @params {string} pageSize 每页记录数默认20
 * @params {Number} type 默认0 全部0/解纷1/协同2/法院赋强3/法院立案4/结案5
 * @params {Number} dealType 默认0 全部0/待办理1/已办理2
 * @params {string} order desc/asc 时间排序
 * @params {string} applyType 案件申请类型 “调解”, “仲裁”, “公证”, “行政复议”, “行政裁决”, “其他”
 * @params {string} caseSource “法院委派”, “当事人申请”, “联动单位”, “网格员端”
 * @params {string} sqCaseNO 案号查询
 * @params {string} litigantName 当事人姓名查询
 * @params {string} startTime 案件查询开始时间 eg:”2020-02-12”
 * @params {string} endTime 案件查询结束时间 eg:”2020-02-12”
 * @params {string} briefId 案由id
 */
export function briefTree(params) {
  return service({
    url: '/menu/getBriefTree.jhtml',
    method: 'get',
    params
  })
}

/**
 * 获取案由
 */
export function listCase2(params) {
  return service({
    url: '/web/case/listCase2.jhtml',
    method: 'get',
    params
  })
}

/**
 * 获取案件来源
 */
export function getCaseSource() {
  return service({
    url: '/court/view/getCaseSource.jhtml',
    method: 'get'
  })
}

/**
 * 通过名字获取当前办理的数据
 * @params {String} name 查询的姓名
 */
export function listGoalByName(params) {
  return service({
    url: '/court/court/listGoalByName.jhtml',
    method: 'get',
    params
  })
}

/**
 * 通过案件id查询这个案件的相关人员(包括协同人员, 当事人， 调解人员)
 * @params {String} caseId 案件id
 */
export function getCurrentMan(params) {
  return service({
    url: '/court/case/getCurrentMan.jhtml',
    method: 'get',
    params
  })
}

/**
 * 设置邀请多少个人参加当前案件
 * @params {String} caseId 案件id
 * @params {Array} currentMan 数组
 */
export function setCurrentMan(params) {
  return service({
    url: '/court/case/setCurrentMan.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 移送法院回填信息
 * @params {String} caseId 案件id
 */
export function transferInfo(params) {
  return service({
    url: '/court/case/transferInfo.jhtml',
    method: 'get',
    params
  })
}

/**
 * 司法确认接收和退回
 * @params {String} 必填 caseId 案件id
 * @params {String} 必填 state 接收并移交内网(receive) 退回（back）
 * @params {String} ssqq 诉讼请求 (仅receive必填)
 * @params {String} reason 事实理由(仅receive必填)
 * @params {String} protocolId 调解协议ID
 * @params {String} applyId 司法确认申请书ID
 * @params {String} remark 退回意见(仅退回填写)
 */
export function acceptance(params) {
  return service({
    url: '/court/case/acceptance.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 司法确认受理成功保存数据
 * @params {String} caseId 必填 案件id
 * @params {String} caseNo 必填 案号
 * @params {String} judge 必填 法官
 * @params {String} assistant 必填 法官助理
 * @params {String} clerk 书记员
 * @params {String} noticeFile 司法确认受理通知书
 * @params {String} rulingFile 民事裁定书
 */
export function saveInfo(params) {
  return service({
    url: '/court/case/saveInfo.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 司法确认受理退回补正
 * @params {String} caseId 必填 案件id
 * @params {String} remark 备注
 */
export function back(params) {
  return service({
    url: '/court/case/back.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 司法确认受理不予受理
 * @params {String} caseId 必填 案件id
 * @params {String} file 不予受理通知书
 */
export function rejection(params) {
  return service({
    url: '/court/case/rejection.jhtml',
    method: 'post',
    data: params
  })
}

/**
 * 在线解纷案件查询 pc端
 * @params {String} pageNum 页码
 * @params {String} pageSize 每页记录数
 * @params {String} startTime	开始时间
 * @params {String} endTime 结束时间
 * @params {String} briefId 案由uid
 * @params {String} sqCaseNo 调解号
 */
export function listCaseOL(params) {
  return service({
    url: '/web/case/listCaseOL.jhtml',
    method: 'get',
    params
  })
}

/**
 * 司法确认上传文件
 * file 文件
 * name: 司法确认受理通知书  / 民事裁定书 / 不予受理通知书
 */
export function upFile(param) {
  return service({
    url: 'court/case/upFile.jhtml',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    name: 'file',
    isLoad: true,
    data: param
  })
}

/**
 * 结案的时候同步人民调解平台(具体参数查看接口文档)
 * @params {String} caseId 案件ID
 * @params {String} appUser 人民调解平台APP登录账号
 * @params {String} appPsw	人民调解平台APP登录密码
 * @params {Object} rmtj { description 调解结论 protocolId 调解协议 state 状态 } 对象
 */
export function caseClosedRMTJ(params) {
  return service({
    url: '/court/case/caseClosed.jhtml?sync=RMTJ',
    method: 'post',
    data: params
  })
}

/**
 * 结案的时候同步司法行政平台(具体参数查看接口文档)
 */
export function caseClosedSFXZ(params) {
  return service({
    url: '/court/case/caseClosed.jhtml?sync=SFXZ',
    method: 'post',
    data: params
  })
}

/**
 * 结案
 *  @params {String} caseId 案件ID
 */
export function closeCase(params) {
  return service({
    url: '/court/case/closeCase.jhtml',
    method: 'GET',
    params
  })
}
/**
 * 协同日志
 * @params {String} caseId 案件ID
 */
export function listTeamInfoByCase(params) {
  return service({
    url: '/web/team/listTeamInfoByCase.jhtml',
    method: 'get',
    params
  })
}

/**
 * 设置当事人是否需要人脸识别并生成对应账号
 * @params {String} goalId 当事人/代理人uid
 * @params {String} goalType 1：当事人 2：代理人
 * @params {boolean} faceCheck true 需要
 */
export function faceCheck(params) {
  return service({
    url: '/court/litigant/faceCheck.jhtml',
    method: 'post',
    data: params
  })
}
// 保存录音
export function saveCallWav(params) {
  return service({
    url: '/mediate/file/saveCallWav.jhtml',
    method: 'post',
    data: params
  })
}

export function listCallWav(params) {
  return service({
    url: '/video_record_file/listCallWav.jhtml',
    method: 'get',
    params
  })
}

/**
 * 获取数据
 * @param {string} caseId 案件id
 */
export function sfInfo(params) {
  return service({
    url: '/court/case/sfInfo.jhtml',
    method: 'get',
    params
  })
}

/**
 * 查询当事人密文
 * @param {string} litigantId 当事人id
 * @param {string} type litigantPhone/identityCard/legalManId/legalManPhone
 */
export function getEncryptInfo(params) {
  return service({
    url: '/court/litigant/getEncryptInfo.jhtml',
    method: 'get',
    params
  })
}

/**
 * 查询代理人密文
 * @param {string} lawyerId 代理人id
 * @param {string} type agentMobile/agentIdentiCard
 */
export function getEncryptInfoLawyer(params) {
  return service({
    url: '/court/lawyer/getEncryptInfo.jhtml',
    method: 'get',
    params
  })
}
/**
 * 查询电话录音密文
 * @param {string} callLogId 记录ID
 * @param {string} uid 当事人ID
 */
export function getPhone(params) {
  return service({
    url: '/court/litigant/getPhone.jhtml',
    method: 'get',
    params
  })
}

/**
 * 查询机构相关人员密文
 * @param {string} id 相关人员id
 * @param {string} type mediater 机构管理员/案管/调解员 / linkMan联络员
 */
export function getEncryptInfoMed(params) {
  return service({
    url: '/court/mediateter/getEncryptInfo.jhtml',
    method: 'get',
    params
  })
}
