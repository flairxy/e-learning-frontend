import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('user'),
    login: data => axios.post('login', data),
    register: data => axios.post('register', data),
    password: data => axios.patch('user/password', data),
    update: data => axios.patch('user', data)
  }
}
