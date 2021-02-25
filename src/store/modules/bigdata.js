import { SYS_NAME } from '@/utils/constVal'
const courtIdName = `${SYS_NAME}_courtID`
const bigdata = {
  state: {
    menuIndex: '', //
    courtId: localStorage.getItem(courtIdName) || '',
    uid: '',
    path: ''
  },
  mutations: {
    // 保存跳转详情的组件值
    SET_MENUINDEX: (state, index) => {
      state.menuIndex = index
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_COURTID: (state, courtId) => {
      state.courtId = courtId
      localStorage.setItem(courtIdName, courtId)
    },
    SET_PATH: (state, path) => {
      state.path = path
    }
  },
  getters: {
    getMenuIndex: state => state.menuIndex
  }
}
export default bigdata
