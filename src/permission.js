import Vue from 'vue'
import router from './router/'
import store from './store/'
// import { Message, MessageBox } from "element-ui";

const loginHome = ['/gridman/index', '/loginHome', '/loginHome/index', '/exampleSearch', '/disputeResocurce', '/help', '/example', '/lawRules/index', '/lawRules/detail', '/caseInquiry/index', '/caseInquiry/detail']
const whiteList = ['/mobile/filesList', '/login', '/loginAdmin', '/register', '/forget', '/resetPwd', '/system', '/mobile', '/loginHome', '/WhiteVisualization', '/handWriting', ...loginHome] // 不重定向白名单
// main.js 路由守卫
router.beforeEach(async(to, from, next) => {
  // let href = location.href
  // console.log(from)
  // if (href.indexOf('sstj') != -1 && to.path != '/system') {
  //   next('/system')
  //   return
  // }
  // console.log("路由拦截", to.path);
  console.log('用户角色', store.getters.getUserRole)
  const roleType = store.getters.getUserRole || 0
  console.log(to.path)
  // 判断是否有角色身份（代表已登录）
  if (roleType > 0) {
    // console.log("已登录，有角色身份");
    if (roleType === 3) { // 为当事人的时候跳转到当事人页面
      if (to.path === '/login') {
        // console.log("有角色身份 , 将要去登录页,强制转到后台首页");
        next({
          path: '/litigant'
        })
      } else {
        // console.log("有角色身份 , 不是去登录页,");
        await store.dispatch('GetUserInfo')
        await store.dispatch('GetUserRouters')
        next()
      }
    } else {
      if (to.path === '/login') {
        // console.log("有角色身份 , 将要去登录页,强制转到后台首页");
        next({
          path: '/home'
        })
      } else {
        // console.log("有角色身份 , 不是去登录页,");
        await store.dispatch('GetUserInfo')
        await store.dispatch('GetUserRouters')
        next()
      }
    }
  } else {
    // console.log("无角色身份");
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      // console.log("在免登录白名单，直接进入");
      next()
    } else {
      // console.log("不在免登录白名单，跳转登录页");
      // 不在免登录白名单，跳转登录页
      next('/login')
    }
  }
})

// 按钮权限相关的自定义指令

Vue.directive('hasPermi', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = store.state.user.perms // 获取该角色得全部权限标识

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value // 当前按钮得权限数组

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
})
