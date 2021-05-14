import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import App from './App.vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import review from './components/review'
import container from './components/container'
import participantSheet from './components/participantSheet'
import store from './store'

Vue.config.productionTip = false
//let testingOptions = ['/data-discourse-question','/data-question-discourse','/question-data-discourse']
//let chosenOption = testingOptions[Math.floor(Math.random() * 3)] //TODO Get from localStorage (to have people keep their chosen option)
const router = new Router({
  routes: [
  /*{ path: '/', redirect: chosenOption}, //redirect to randomly generated A/B option
  { path: '/data-discourse-question', component: containerA},
  { path: '/data-question-discourse', component: containerB},
  { path: '/question-data-discourse', component: containerC},*/


  { path: '/',  component: container},
  { path: '/participantSheet/', component: participantSheet },
  { path: '/review/', component: review },
  ]
  })

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
