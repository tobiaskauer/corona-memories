import Api from '@/services/Api'

export default {
  sendMemory (comment) {
    return Api().post("sendMemory", comment)
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

  countryMemories () {
    return Api().post("countryMemories")
  },
}