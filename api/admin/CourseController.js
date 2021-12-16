import axios from 'axios'

export default {
  course: {
    approved: page => axios.get(`admin/courses/approved?page=${page}`),
    pending: page => axios.get(`admin/courses/pending?page=${page}`),
    rejected: page => axios.get(`admin/courses/rejected?page=${page}`),
    deleted: page => axios.get(`admin/courses/deleted?page=${page}`),
    update: data => axios.patch('admin/courses/update', data),
    revert: data => axios.patch('admin/courses/revert', data),
    delete: id => axios.delete(`admin/courses/delete/${id}`),
    top: page => axios.get(`admin/courses/top?page=${page}`),
    featured: page => axios.get(`admin/courses/featured?page=${page}`),
    setFeatured: data => axios.post(`admin/courses/featured/create`, data),
    deleteFeatured: data => axios.post(`admin/courses/featured/delete`, data),
    setTopCourse: data => axios.post(`admin/courses/top/create`, data),
    deleteTopCourse: data => axios.post(`admin/courses/top/delete`, data)
  }
}
