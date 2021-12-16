export default function({ store, redirect, route }) {
  const user = store.state.user
  if (!user) {
    return redirect('/')
  } else {
    if (!user.tutor) {
      return redirect('/')
    }
  }
}
