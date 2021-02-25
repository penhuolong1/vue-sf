import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 获取系统公告
 * @param {*} pageNum'
 * @param {*} pageSize
 * @param {类型1公告，2消息} afficheType
 */
export function listByType(params) {
  return service({
    url: '/web/affiche/listByType.jhtml',
    method: 'get',
    params
  })
}
/**
 * 获取系统公告详情
 * @param {公告id} afficheId
 */
export function detailById(params) {
  return service({
    url: '/web/affiche/detailById.jhtml',
    method: 'get',
    params
  })
}
/**
 *上传文件
 * @param {}
 */
export function affiche_uploadFile(data) {
  return service({
    url: '/web/affiche/uploadFile.jhtml',
    method: 'post',
    data
  })
}
