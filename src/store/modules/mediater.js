import { SYS_NAME } from '@/utils/constVal'
const appMediaterId = `${SYS_NAME}_mediaterId`
const appToken = `${SYS_NAME}_Token`
const appIsOpen = `${SYS_NAME}_isOpen`
const mediater = {
  state: {
    mediaterId: localStorage.getItem(appMediaterId) || '', // 解纷ID
    mediaterInfo: '', // 解纷信息
    roomToken: localStorage.getItem(appToken) || '',
    isOpen: localStorage.getItem(appIsOpen) || false // 判断是否当前角色开启调解室
  },
  mutations: {
    // 解纷ID
    SET_MEDIATERID: (state, id) => {
      state.mediaterId = id
      localStorage.setItem(appMediaterId, id)
    },
    SET_MEDIATERIDINFO: (state, info) => {
      state.mediaterInfo = info
    },
    // 获取视频的token
    SET_ROOMTOKEN: (state, token) => {
      state.roomToken = token
      localStorage.setItem(appToken, token)
    },
    // 设置当前用户是否为该调解室的开启者
    SET_ISOPEN: (state, isOpen) => {
      state.isOpen = isOpen
      localStorage.setItem(appIsOpen, isOpen)
    }
  },
  getters: {
    getMediaterId: state => state.mediaterId // 获取用户个人信息
  },
  actions: {
  }
}
export default mediater
