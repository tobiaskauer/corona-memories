import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#FA5E2D',
        secondary: '#b0bec5',
        anchor: '#8c9eff',
      },
      dark: false,
    },
  },
}




export default new Vuetify(opts)
