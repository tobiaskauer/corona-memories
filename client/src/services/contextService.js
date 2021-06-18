import Api from '@/services/Api'

export default {
  getContexts (country) {
    return Api().post("getContexts", country)
  },
  countryContexts () {
    return Api().post("countryContexts")
  },
}
