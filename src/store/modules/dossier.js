import { getBrief, listCourtToFile, listDirType } from '@/api/dossier/dossier.js'
const dossier = {
  state: {
    briefList: [], // 案由、卷宗类型
    courtList: [], // 法院
    tableId: '', // 卷宗id
    caseId: '', // 案件id
    dirTypeList: [] // 卷宗菜单
  },
  mutations: {
    // 保存案由、卷宗类型
    SET_BRIEFLIST: (state, data) => {
      state.briefList = data
    },
    SET_COURTLIST: (state, data) => {
      state.courtList = data
    },
    SET_TABLEID: (state, id) => {
      state.tableId = id
    },
    SET_DITTYPELIST: (state, data) => {
      state.dirTypeList = data
    }
  },
  getters: {
    getTableId: state => state.tableId,
    getBriefList: state => state.briefList, // 获取用户个人信息
    getCourtList: state => state.courtList, // 获取法院
    getDirList: state => state.dirTypeList // 获取卷宗列表
  },
  actions: {
    // 获取案由、卷宗类型
    getBriefData: ({ commit }) => {
      getBrief({ pageSize: 9999 }).then((res) => {
        commit('SET_BRIEFLIST', res.briefPage.content)
      })
    },
    // 获取法院
    getCourtList: ({ commit }) => {
      listCourtToFile({ pageSize: 9999 }).then((res) => {
        commit('SET_COURTLIST', res.content)
      })
    },
    // 获取右侧菜单
    GetListDirType: ({ commit, state }, id) => {
      console.log(state)
      let params = {}
      if (id || state.tableId) {
        params = {
          tableId: id || state.tableId
        }
      }
      listDirType(params).then(res => {
        commit('SET_DITTYPELIST', res.data)
      })
    }
  }
}
export default dossier
