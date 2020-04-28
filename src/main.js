import 'buefy/dist/buefy.css'
import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import Chart from "chart.js"
Chart.defaults.global.responsive = false

Vue.use(Buefy)

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
