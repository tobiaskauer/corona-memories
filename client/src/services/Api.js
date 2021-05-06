import axios from 'axios'

export default() => {
  return axios.create({
    //baseURL: 'https://corona-memories-server.herokuapp.com',
    baseURL: 'https://coroname.uber.space:40980',
    //baseURL: 'http://localhost:8081',
    //baseURL: 'http://localhost:40980',
  })
}
