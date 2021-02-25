import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

//获取特色解纷数据
export function  listCourtInfo() {
    return service({
      url: '/web/court/data/listCourtInfo.jhtml',
      method: 'get',
    })
  }
//获取特色解纷数据详情---单个
export function  listCourtData(params) {
    return service({
      url: '/web/court/data/listCourtData.jhtml',
      method: 'get',
      params
    })
  }