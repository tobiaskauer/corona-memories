import Api from '@/services/Api'

export default {
  sendInteraction (interaction) {
    return Api().post("sendInteraction", interaction)
  },  
}