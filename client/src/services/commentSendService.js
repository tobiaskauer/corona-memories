import Api from '@/services/Api'

export default {
  sendComment (comment) {
    return Api().post("sendComment", comment)
  }
}
