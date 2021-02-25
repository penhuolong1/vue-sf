import { SYS_NAME } from '@/utils/constVal'
import { detailCase } from '@/api/case/index.js'
import { teamWorkerByCase } from '@/api/collaboration/index'
const appCaseId = `${SYS_NAME}_caseId`
const appMenuType = `${SYS_NAME}_menuType`
console.log(appCaseId)
const cases = {
  state: {
    caseId: localStorage.getItem(appCaseId) || '', // 案件id
    caseInfo: {}, // 案件详情
    teamData: {}, // 判断登陆角色是否是该案件的协助角色还是本身处理的角色
    caseInfo1: {}, // 包括案件详情外部的信息
    menuType: localStorage.getItem(appMenuType) || '' // 案件列表选的菜单
  },
  mutations: {
    // 保存用户个人信息
    SET_CASEID: (state, caseId) => {
      localStorage.setItem(appCaseId, caseId)
      state.caseId = caseId
    },
    SET_CASEINFO: (state, info) => {
      state.caseInfo = info
    },
    SET_CASEINFO1: (state, info) => {
      state.caseInfo1 = info
    },
    SET_TEAMDATA: (state, obj) => {
      state.teamData = obj
    },
    SET_MENUTYPE: (state, type) => {
      localStorage.setItem(appMenuType, type)
      state.menuType = type
    }
  },
  getters: {
    getCaseId: state => state.caseId,
    getCaseInfo: state => state.caseInfo || {},
    getCaseInfo1: state => state.caseInfo1 || {},
    getTeamData: state => state.teamData,
    getMenuType: state => state.menuType
  },
  actions: {
    GetCaseInfo({ commit, state }, caseId) {
      return new Promise((resolve) => {
        detailCase({ lawCaseId: caseId || state.caseId }).then(res => {
          if (res.state === 100) {
            commit('SET_CASEINFO', res.lawCase)
            commit('SET_CASEINFO1', res)
            resolve(res.lawCase)
          } else {
            console.error('获取案件详情出错')
          }
        })
      })
    },
    GetTeamData({ commit, state }, id) {
      return new Promise((resolve) => {
        teamWorkerByCase({ caseId: id || state.caseId }).then(res => {
          if (res.state === 100) {
            commit('SET_TEAMDATA', res)
            resolve(res)
          } else {
            console.error('获取案件详情出错')
          }
        })
      })
    }
  }
}
export default cases
