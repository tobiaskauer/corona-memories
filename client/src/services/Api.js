import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: 'https://corona-memories-server.herokuapp.com',
  })
}
