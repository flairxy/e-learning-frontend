import cookie from 'cookie'
import cookies from 'js-cookie'

export default async function({ store, redirect, req }) {
  const user = store.state.user
  const settings = store.state.settings
  if (!settings) {
    await store.dispatch('FETCH_SETTINGS')
  }
  if (!user) {
    const token = cookies.get('x-access-token')
    if (token) {
      await store.dispatch('FETCH', token)
    }
  }
}
