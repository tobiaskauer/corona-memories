import Api from '@/services/Api'
import store from '../store'


export default {
  sendSurvey (survey) {
    let sessionDetails = store.getters.session
    
    Object.keys(sessionDetails).forEach(key => {
      survey[key] = sessionDetails[key]
    })
    //console.log(interaction)
    return Api().post("sendSurvey", survey)
  },  
}