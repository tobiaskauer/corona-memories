import Api from '@/services/Api'
import store from '../store'


export default {
  sendInteraction (interaction) {
    let sessionDetails = store.getters.session
    Object.keys(sessionDetails).forEach(key => {
      interaction[key] = sessionDetails[key]
    })
    return Api().post("sendInteraction", interaction)
  },  

  getInteractions () {
    return Api().get("getInteractions")
  },  
}