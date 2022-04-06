import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' // 右边工具栏样式
import '@/components/bpmn/assets/css/vue-bmpn.css'

import App from './App'
import store from './store'
import router from './router'
import Print from '@/utils/print'
import config from './api/config.js'
import VueResource from 'vue-resource'
import '@/icons' // icon

Vue.use(Print)
Vue.use(VueResource)
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// 配置全局地址文件
Vue.prototype.$URL = config

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
