
const route = {
  state: {
    allowBack: null
  },
  mutations: {
    SET_ALLOWBACK: (state, allowBack) => {
      state.allowBack = allowBack
    }
  },
  getters: {
    getAllowBack: state => state.allowBack
  }
}
export default route
