/**
 * 引入第三方包，每个包的具体作用太多不详细介绍，请自行在https://www.npmjs.com 上面搜
 */
import 'buefy/dist/buefy.css'
import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import Chart from "chart.js"
Chart.defaults.global.responsive = false

// 注册Buefy组件库
Vue.use(Buefy)

// 设置vue属性
Vue.config.productionTip = false

// Vue初始化
new Vue({
  render: h => h(App),
}).$mount('#app')
