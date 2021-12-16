import axios from 'axios'

export default {
  user: {
    search: query => axios.post('admin/users/search', query),
    approved: (role, page) =>
      axios.get(`admin/users/${role}/approved?page=${page}`),
    pending: (role, page) =>
      axios.get(`admin/users/${role}/pending?page=${page}`),
    rejected: (role, page) =>
      axios.get(`admin/users/${role}/rejected?page=${page}`),
    deleted: (role, page) =>
      axios.get(`admin/users/${role}/deleted?page=${page}`),
    update: data => axios.patch('admin/users/update', data),
    revert: data => axios.patch('admin/users/revert', data),
    delete: (id, type) => axios.delete(`admin/users/delete/${id}/${type}`)
  }
}
