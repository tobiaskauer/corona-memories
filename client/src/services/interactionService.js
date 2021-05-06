import Api from '@/services/Api'

export default {
  sendInteraction (interaction) {
      console.log(interaction)
    return Api().post("sendInteraction", interaction)
  },  
}