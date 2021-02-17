import Api from '@/services/Api'

export default {
  sendMemory (comment) {
    return Api().post("sendMemory", comment)
  }
}
