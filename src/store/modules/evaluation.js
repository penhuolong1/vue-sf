import {op, title} from '@/api/evaluation/index'
import { SYS_NAME } from '@/utils/constVal'
const app = SYS_NAME
const evi_Info = app + '-eviInfo'

const evaluation = {
  state: {
    opInfo: {}, // 当前考评开启状态信息
    answerInfo: {
      index: 0
    }, // 答题信息
    titleInfo: {}, // 头部信息
    eviInfo: localStorage.getItem(evi_Info)
    ? JSON.parse(localStorage.getItem(evi_Info))
    : {},
  },
  mutations: {
    // 保存当前考评开启状态信息
    SET_OPINFO: (state, opInfo) => {
      state.opInfo = opInfo
    },
    SET_ANSWERINFO: (state, info) => {
      state.answerInfo = info
    },
    SET_TITLEINFO: (state, info) => {
      state.titleInfo = info
    },
    SET_EVIINFO: (state, info) => {
      state.eviInfo = info
      localStorage.setItem(evi_Info, JSON.stringify(info))
    }
  },
  getters: {
    getOpInfo: state => state.opInfo, // 获取当前考评开启状态信息
    getAnswerInfo: state => state.answerInfo, // 答题信息
    getTitleInfo: state => state.titleInfo,
    getEviInfo: state => state.eviInfo
  },
  actions: {
    GetOpInfo({ commit }) {
      return new Promise((resolve) => {
        op().then(res => {
          if (res.state == 100) {
            commit('SET_OPINFO', res.data)
          }
        })
      })
    },
    GetTitle({ commit }, params) {
      return new Promise((resolve) => {
        title(params).then(res => {
          if (res.state == 100) {
            commit('SET_TITLEINFO', res.data)
          }
        })
      })
    },
  }
}
export default evaluation
