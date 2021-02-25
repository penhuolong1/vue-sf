import store from '@/store'

export default (Vue) => {
  Vue.directive('permission', {
    inserted: function(el, binding) {
      const role = store.getters.getUserInfo.roleType
      const permissionValue = binding.value
      if (permissionValue.indexOf(role) === -1) { // 假如在没有该权限则删该元素
        el.remove()
      }
    }
  })
}
