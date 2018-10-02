// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from 'store'

import iView from 'iview'
// import 'iview/dist/styles/iview.css' // 使用 CSS
import 'js/common'
import axios from 'axios'
import 'babel-polyfill'
import Scrollbar from 'smooth-scrollbar'
//  公用请求方法
import publicUtils from 'js/publicUtils'
import echarts from 'echarts'
// import chinaJson from 'echarts/map/json/china.json' // 此处引入中国地图json
// import worldJson from 'echarts/map/json/world.json' // 此处引入世界地图json
// 设置公用请求端口
import getwbkUrl from 'js/getwbkUrl'
import VueLazyload from 'vue-lazyload'
import config from '../config'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './theme/iview/index.less'
import 'echarts/theme/shine.js' // vintage dark macarons infographic shine roma

axios.defaults.baseURL = process.env.API
axios.defaults.withCredentials = true
Vue.prototype.axios = axios
Vue.prototype.Scrollbar = Scrollbar
Vue.prototype.echarts = echarts
Vue.config.productionTip = false

Vue.use(iView)
Vue.use(publicUtils)
Vue.use(getwbkUrl)

// 懒加载图片
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/loading.png'),
  loading: require('./assets/loading1.gif'),
  attempt: 1
})

// 加载条
NProgress.configure({ showSpinner: false })
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  next()
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

let urlWdatePicker = process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
document.write('<script type="text/javascript" src="' + urlWdatePicker + 'static/My97DatePicker/WdatePicker.js"></script>')
 urlWdatePicker = null
