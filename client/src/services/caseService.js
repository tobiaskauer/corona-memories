import Api from '@/services/Api'

export default {
  getCases (country) {
    return Api().post("getCases", country)
  },
  getCountries () {
    return Api().post("getCountries")
  }
}
