import axios from 'axios'

export default {
  settings: {
    index: () => axios.get('admin/settings/index'),
    set: data => axios.post('admin/settings', data)
  }
}
