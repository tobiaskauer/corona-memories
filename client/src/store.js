import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    countries: null,
  },

  getters: {
    getCountries: state => state.countries,
  },

  mutations: {
    callAPI() {
      let param = {foo: "country", country: 'Germany'}
      axios
        .get('/projects/corona/api.php',param)
        .then(response => {
          console.log(response)
          this.countries = response.data
        })
    }
  },

  actions: {
  }
})
