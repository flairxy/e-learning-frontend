export default function({ store, redirect, route }) {
  const userIsLoggedIn = store.state.user
  if (!userIsLoggedIn) {
    return redirect('/login')
  }

  // return Promise.resolve()
}
