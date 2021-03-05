import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader


Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
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
