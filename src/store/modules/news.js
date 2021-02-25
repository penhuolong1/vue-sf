const news = {
  state: {
    unique_id: localStorage.getItem('news_unique_id') || '', // 消息弹窗进入系统公告需显示详情得id
    nowChoice: localStorage.getItem('news_nowChoice') || 'notice', // 选中系统公告或是系统消息得判断
    changeShow: localStorage.getItem('changeShow') || 'messageBox', // 系统公告显示组件得判断
    readType: localStorage.getItem('news_readType') || '2', // 进入系统消息获取已读、未读消息得判断
    nowList_message: localStorage.getItem('nowList_message') || '2', // 系统消息已读、未读默认选中项判断
    clickMessage: localStorage.getItem('clickMessage') || '' // 点击了弹窗中得系统消息、公告
  },
  mutations: {
    SET_UNIQUEID: (state, unique_id) => {
      state.unique_id = unique_id
      localStorage.setItem('news_unique_id', unique_id)
    },
    SET_NOECHOICE: (state, nowChoice) => {
      state.nowChoice = nowChoice
      localStorage.setItem('news_nowChoice', nowChoice)
    },
    SET_CHANGESHOW: (state, changeShow) => {
      state.changeShow = changeShow
      localStorage.setItem('changeShow', changeShow)
    },
    SET_READTYPE: (state, readType) => {
      state.readType = readType
      localStorage.setItem('news_readType', readType)
    },
    SET_NOWLIST_MESSAGE: (state, nowList_message) => {
      state.nowList_message = nowList_message
      localStorage.setItem('nowList_message', nowList_message)
    },
    SET_CLICKMESSAGE: (state, clickMessage) => {
      state.clickMessage = clickMessage
      localStorage.setItem('clickMessage', clickMessage)
    },
    SET_CLEAR: (state) => {
      state.unique_id = ''
      localStorage.removeItem('news_unique_id')
      state.nowChoice = 'notice'
      localStorage.removeItem('news_nowChoice')
      state.changeShow = 'messageBox'
      localStorage.removeItem('changeShow')
      state.readType = '2'
      localStorage.removeItem('news_readType')
      state.nowList_message = '2'
      localStorage.removeItem('nowList_message')
    }

  },
  getters: {
    getUniqueId: state => state.unique_id,
    changeShow: state => state.changeShow,
    readType: state => state.readType,
    nowList_message: state => state.nowList_message,
    clickMessage: state => state.clickMessage
  }
}
export default news
