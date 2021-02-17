import Vue from 'vue'
import Vuex from 'vuex'
//import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    country: '',
    countries: [],
  },

  getters: {
    //getCountries: state => state.countries,
  },

  mutations: {
    setCountry(state, countryName) {
      state.country = countryName
    }
    /*callAPI() {
      let param = {foo: "country", country: 'Germany'}
      axios
        .get('/projects/corona/api.php',param)
        .then(response => {
          console.log(response)
          this.countries = response.data
        })
    }*/
  },

  actions: {
    setCountry({commit}, countryName) {
      commit('setCountry', countryName)
    }
  }
})
