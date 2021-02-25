import { listTeamByCase } from '@/api/collaboration/index'
const collaboration = {
  state: {
    selectUnitList: [], // 协同选择的数据
    logList: {} // 协同日志
  },
  mutations: {
    // 保存跳转详情的组件值
    SET_SELECTUNITLIST: (state, ary) => {
      state.selectUnitList = ary
    },
    SET_LOGLIST: (state, list) => {
      state.logList = list
    }
  },
  getters: {
    getselectUnitList: state => state.selectUnitList,
    getLogList: state => state.logList
  },
  actions: {
    getListTeamByCase({ commit }, params) {
      return new Promise((resolve, reject) => {
        listTeamByCase(params).then(res => {
          if (res.state === 100) {
            commit('SET_LOGLIST', res)
            resolve(res)
          } else {
            reject()
          }
        })
      })
    }
  }
}
export default collaboration
