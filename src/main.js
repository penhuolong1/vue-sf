import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
// 配置elementui
import ElementUI from 'element-ui'
import AFTableColumn from 'af-table-column'
import 'element-ui/lib/theme-chalk/index.css'
import VeLine from 'v-charts/lib/line.common'
import vePie from 'v-charts/lib/pie.common'
import veRing from 'v-charts/lib/ring.common'
import { formatDate } from './utils/format'
import './permission' // 路由守卫即页面权限和按钮权限
// import API from "@/api/api"; //请求服务的所有api代码
// Vue.prototype.$api = API; //其中$xx为新命的名。全局引入

// 配置iViewui
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

import dataV from '@jiaminghi/data-view'

import '@/directives/index'
import '@/styles/index.scss' // global css

import './icons'
Vue.use(ElementUI)
Vue.use(AFTableColumn)
Vue.use(ViewUI)
Vue.use(dataV)
Vue.component(VeLine.name, VeLine)
Vue.component(vePie.name, vePie)
Vue.component(veRing.name, veRing)

Vue.config.productionTip = false // 注册全局指令
Vue.config.devtools = true
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.filter('time', function(value) {
  return formatDate(value, 'YYYY-MM-DD H:m:s')
})
Vue.filter('timeDate', function(value, format) {
  const formats = format || 'YYYY-MM-DD'
  return formatDate(value, formats)
})
// 手机号码隐藏中间4为
Vue.filter('phone', function(value) {
  if (!value) {
    return
  }
  if (value.length != 11) {
    return value
  }

  return value.slice(0, 3) + '****' + value.slice(7)
})
