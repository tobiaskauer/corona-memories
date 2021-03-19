import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import App from './App.vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import review from './components/review'
import container from './components/container'

Vue.config.productionTip = false
const router = new Router({
  routes: [
  { path: '/', component: container},
  { path: '/review/', component: review },
  ]
  })

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
