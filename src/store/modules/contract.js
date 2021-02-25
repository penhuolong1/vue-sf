import { SYS_NAME } from '@/utils/constVal'
const courtIdName = `${SYS_NAME}_courtID`
const contract = {
  state: {
    showIndex: localStorage.getItem('myshowIndex') ? JSON.parse(localStorage.getItem('myshowIndex')) : 0,
    id: localStorage.getItem('mygroupId') ? JSON.parse(localStorage.getItem('mygroupId')) : '',
    roomToken: localStorage.getItem('roomToken') ? localStorage.getItem('roomToken') : '',
    roomId: localStorage.getItem('roomId') ? localStorage.getItem('roomId') : ''
  },
  mutations: {
    // 保存跳转详情的组件值
    SET_SHOWINDEX: (state, index) => {
      localStorage.setItem('myshowIndex', JSON.stringify(index))
      state.showIndex = index
    },
    SET_ID: (state, id) => {
      localStorage.setItem('mygroupId', JSON.stringify(id))
      state.id = id
    },
    SET_TOKEN: (state, roomToken) => {
      localStorage.setItem('roomToken', roomToken)
      state.roomToken = roomToken
    },
    SET_RoomId: (state, roomId) => {
      localStorage.setItem('roomId', roomId)
      state.roomId = roomId
    }

  },
  getters: {
    getShowIndex: state => state.showIndex,
    getId: state => state.id,
    getRoomToken: state => state.roomToken
  }
}
export default contract
