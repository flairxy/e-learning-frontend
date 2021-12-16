import cookie from 'cookie'
import cookies from 'js-cookie'
import api from '~/api'
import settingsController from '~/api/general'
import { setAuthToken, resetAuthToken } from '~/utils/auth'

export const state = () => ({
  locales: ['en', 'fr'],
  locale: 'en',
  unreadMessages: null,
  messages: null,
  user: null,
  settings: null,
  PKEY: null,
  search_data: ''
})

export const mutations = {
  SET_LANG(state, locale) {
    state.locale = locale
  },
  SET_TOTAL_UNREAD(state, payload) {
    state.unreadMessages = payload
  },
  SET_MESSAGES(state, payload) {
    state.messages = payload
  },
  SET_USER(state, payload) {
    state.user = payload
  },
  RESET_USER(state, payload) {
    state.user = payload
  },
  SET_SETTINGS(state, payload) {
    state.settings = payload
  },
  SET_PKEY(state, payload) {
    state.PKEY = payload
  },
  SEARCH_DATA(state, payload) {
    state.search_data = payload
  }
}

export const getters = {}

export const actions = {
  // async nuxtServerInit({ commit }, { req }) {
  //   try {
  //     let response = await settingsController.settings.index()
  //     commit('SET_SETTINGS', response.data.data)
  //   } catch (error) {}
  //   if (req && req.headers && req.headers.cookie) {
  //     const c = cookie.parse(req.headers.cookie || '')
  //     const token = c['x-access-token'] || ''
  //     if (token) {
  //       setAuthToken(token)
  //       try {
  //         let res = await api.auth.me()
  //         await commit('SET_USER', res.data.data)
  //       } catch (error) {
  //         ;(await commit('RESET_USER')) +
  //           resetAuthToken() +
  //           cookies.remove('x-access-token')
  //       }
  //     }
  //   }
  // },

  RESET({ commit }) {
    commit('RESET_USER') + resetAuthToken() + cookies.remove('x-access-token')
  },

  async FETCH({ commit, dispatch }, token) {
    setAuthToken(token)
    try {
      // let response = await settingsController.settings.index()
      // commit('SET_SETTINGS', response.data.data)
      let res = await api.auth.me()
      commit('SET_USER', res.data.data)
    } catch (error) {
      dispatch('RESET')
    }
  },

  async FETCH_SETTINGS({ commit }) {
    try {
      let response = await settingsController.settings.index()
      commit('SET_SETTINGS', response.data.data.settings)
      commit('SET_PKEY', response.data.data.key)
    } catch (error) {}
  }
}
