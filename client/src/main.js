import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import App from './App.vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import review from './components/review'
import container from './components/container'
//import participantSheet from './components/participantSheet'
import store from './store'

let routes = [
  "/embedded-stories",
  "/separate-stories",
  "/embedded-policies"
]
let randomRoute = routes[Math.floor(Math.random() * 3)]


Vue.config.productionTip = false
const router = new Router({
  routes: [
    {path: '/',  redirect: randomRoute},
    {name: "embedded",  path: '/embedded-stories',  component: container, props: {testPath: "embedded"}},
    {name: "separated",  path: '/separate-stories',  component: container, props: {testPath: "separated"}},
    {name: "contextual",  path: '/embedded-policies',  component: container, props: {testPath: "contextual"}},
    {path: '/review/', component: review },
  ],
  scrollBehavior () {
    return {x: 0}
  }

  })

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
