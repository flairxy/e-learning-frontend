import cookies from 'js-cookie'
import api from '~/api'
import { setAuthToken, resetAuthToken } from '~/utils/auth'
export const state = () => ({
  user: null,
})

export const mutations = {
  set_user(store, data) {
    store.user = data
    console.log(store.user)
  },
  reset_user(store) {
    store.user = null
  },
  set_settings(store, data) {
    store.settings = data
  }
}

export const actions = {
  fetch({ commit }) {
    return api.auth
      .me()
      .then(response => {
        commit('set_user', response.data.data)
      })
      .catch(error => {
        console.log(error.response)
        commit('reset_user')
        return error
      })
  },

  login({ commit }, data) {
    return api.auth.login(data).then(response => {
      commit('set_user', response.data.data.user) +
        setAuthToken(response.data.data.token) +
        cookies.set('x-access-token', response.data.data.token, { expires: 7 })
      return response
    })
  },

  register({ commit }, data) {
    return api.auth.register(data).then(response => {
      commit('set_user', response.data.data.user) +
        setAuthToken(response.data.data.token) +
        cookies.set('x-access-token', response.data.data.token, { expires: 7 })
      return response
    })
  },

  reset({ commit }) {
    commit('reset_user') + resetAuthToken() + cookies.remove('x-access-token')
  }
}
