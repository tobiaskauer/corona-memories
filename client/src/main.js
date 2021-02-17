import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
//import AsyncComputed from 'vue-async-computed'
//Vue.use(AsyncComputed)
//import store from './store.js'

Vue.config.productionTip = false

new Vue({
//  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
