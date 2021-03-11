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
  }
}