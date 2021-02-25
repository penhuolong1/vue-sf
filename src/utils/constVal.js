// 全局常量文件
export const SYS_NAME = 'SHUYUAN-sys'
export const ROLEMAP = { // 角色类型map
  1: '机构管理员',
  2: '解纷员',
  3: '当事人',
  4: '法院',
  5: '法官',
  6: '超级管理员',
  7: '案管人员',
  8: '联络员'
}
export const PROCESSMAP = { // 案件进程map
  '-1': '补正',
  0: '未申请',
  1: '已申请',
  2: '已受理',
  3: '已分发',
  4: '已分配(待化解)',
  5: '化解中',
  6: '化解完毕',
  7: '退回补正',
  8: '移送法院',
  9: '法院受理并立案',
  10: '不予受理',
  99: '结案'
}
export const IDENTITYMAP = { // 证件类型
  1: '居民身份证',
  2: '中国公民护照',
  3: '台湾居民来往大陆通行证',
  4: '港澳居民来往内地通行证',
  5: '外国公民护照',
  6: '户口薄',
  7: '社会统一信用代码证',
  255: '其他'
}
export const LITIGANTTYPEMAP = { // 当事人类型
  0: '自然人',
  1: '法人',
  2: '非法人'
}
export const SEXMAP = { // 性别类型 0男 1女
  0: '男',
  1: '女'
}
export const AGENTTYPEMAP = { // 代理人类型
  1: '律师',
  2: '法律工作者',
  3: '单位工作人员',
  4: '近亲属',
  5: '公民'
}
export const LITIGATIONMAP = { // 诉讼地位
  1: '原告',
  2: '被告',
  3: '第三人',
  4: '申请人',
  5: '被申请人'
}
export const CASETYPE = { // 案件类型
  1: '调解',
  2: '仲裁',
  3: '公证',
  4: '行政复议',
  5: '行政裁决',
  6: '其他'
}
export const ORGANIZATYPEMAP = { // 组织类型
  1: '法院特邀调解',
  2: '人民调解',
  3: '行业调解',
  4: '商事调解',
  5: '律师调解',
  6: '行政调解',
  7: '其他'
}
export const OFFICE365RUL = 'https://vip.ow365.cn/' // officeweb365地址
export const OFFICE365ID = process.env.VUE_APP_BASE_OFFICE365ID // officeweb365ID
// export const OFFICE365ID = '21929' //officeweb365ID

console.log(process.env)
const BASEIMGURL = process.env.VUE_APP_BASE_SERVE // 图片地址
const SERVICEURL = process.env.VUE_APP_BASE_SERVE + '/' // 服务器地址
const SOCKETURL = process.env.VUE_APP_BASE_SOCKET // socket的url
export {
  BASEIMGURL,
  SERVICEURL,
  SOCKETURL
}

export const APPLICATIONTYPR = { // 申请类型
  0: '解纷',
  1: '仲裁',
  2: '行政复议',
  3: '行政裁决',
  4: '其他'
}

export const MOVETYPEMAP = { // 赋强类型
  1: '司法确认',
  2: '仲裁裁决',
  3: '申请支付令',
  4: '公证赋强'
}

export const FILE_SIZE = '20' // 上传文件大小限制 最大20M
export const HWYURL = 'https://xmtj.obs.cn-south-1.myhuaweicloud.com:443' // 华为云地址
