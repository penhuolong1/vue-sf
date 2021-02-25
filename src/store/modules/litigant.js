const litigant = {
  state: {
    lawCaseId: window.localStorage.getItem('lawCaseId') || '',
    registerCourt: {},
    briefName: window.localStorage.getItem('brief') || '', // 案由
    courtData: {}, // 组织解纷
    mediator: {}, // 解纷员
    fromScan: window.localStorage.getItem('fromScan'), // 是否是从扫码添加的案件
    scanCourtId: window.localStorage.getItem('scanCourtId') || '' // 扫码地点的机构id
  },
  mutations: {
    // 暂存案件信息
    SET_CASEID: (state, lawCaseId) => {
      state.lawCaseId = lawCaseId
    },
    SET_COURT: (state, registerCourt) => {
      state.registerCourt = registerCourt
    },
    // 暂存案由
    SET_BRIEF: (state, name) => {
      state.briefName = name
    },
    // 暂存组织解纷
    SET_COURTDATA: (state, data) => {
      state.courtData = data
    },
    // 暂存解纷员
    SET_MEDIATOR: (state, data) => {
      state.mediator = data
    },
    // 暂存是否是从扫码添加的案件
    SET_FROMSCAN: (state, data) => {
      state.fromScan = data
      localStorage.setItem('fromScan', data)
    },
    // 暂存是否是从扫码添加的案件
    SET_SCANCOURTID: (state, data) => {
      state.scanCourtId = data
      localStorage.setItem('scanCourtId', data)
    }
  },
  getters: {
    getLawCaseId: state => state.lawCaseId,
    getRegisterCourt: state => state.registerCourt,
    getCourtData: state => state.courtData,
    getFromScan: state => state.fromScan,
    getScanCourtId: state => state.scanCourtId
  },
  actions: {

  }
}
export default litigant
