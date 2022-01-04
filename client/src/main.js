import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import App from './App.vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import review from './components/review'
import interactions from './components/interactions'
import container from './components/container'
//import participantSheet from './components/participantSheet'
import store from './store'

let routes = [
  "/separate-stories",
  "/embedded-policies",
  "/embedded-stories"
]
let randomRoute = routes[Math.floor(Math.random() * 3)]

/*//test randomness
let numberFrequency = {}
for (let i = 0; i <=10000000; i++) {
  let random = Math.floor(Math.random() * 3) //the randomness i'm using
  if(!numberFrequency[random]) numberFrequency[random] = 0
  numberFrequency[random]++
}
console.log(numberFrequency)*/


Vue.config.productionTip = false
const router = new Router({
  routes: [
    { path: '/', redirect: randomRoute },
    { name: "embedded", path: '/embedded-stories', component: container, props: { testPath: "embedded" } },
    { name: "separated", path: '/separate-stories', component: container, props: { testPath: "separated" } },
    { name: "contextual", path: '/embedded-policies', component: container, props: { testPath: "contextual" } },
    { path: '/review/', component: review },
    { path: '/interactions/', component: interactions },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
      }
    }
  }

})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
