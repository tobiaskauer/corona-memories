import axios from 'axios'

export default() => {
  return axios.create({
    //baseURL: 'https://corona-memories-server.herokuapp.com',
    //baseURL: 'http://coroname.uber.space:',
    //baseURL: 'http://localhost:40980',
    baseURL: 'http://localhost:3000',
    //baseURL: 'https://coroname.uber.space',
  })
}
