import Api from '@/services/Api'

export default {
  debug (payload) {
    return Api().get("debug", payload)
  },
  
  getMemories (country) {
    return Api().post("getMemories", country)
  },

  upvoteMemory (id) {
    return Api().post("upvoteMemory", id)
  },

  flagMemory (body) {
    console.log("Service: ", body)
    return Api().post("flagMemory", body)
  },
}