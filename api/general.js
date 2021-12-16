import axios from 'axios'

export default {
  category: {
    get: () => axios.get('categories'),
    courses: () => axios.get('categories/courses'),
    create: data => axios.post('categories/create', data),
    update: data => axios.patch('categories/update', data),
    delete: id => axios.delete(`categories/delete/${id}`)
  },
  level: {
    get: () => axios.get('levels'),
    create: data => axios.post('levels/create', data),
    update: data => axios.patch('levels/update', data),
    delete: id => axios.delete(`levels/delete/${id}`)
  },
  tag: {
    get: () => axios.get('tags'),
    create: data => axios.post('tags/create', data),
    update: data => axios.patch('tags/update', data),
    delete: id => axios.delete(`tags/delete/${id}`)
  },
  course: {
    index: page => axios.get(`courses?page=${page}`),
    search: query => axios.post('courses/search', query),
    featured: () => axios.get('courses/featured'),
    category: cat => axios.post('courses/categories', cat),
    show: data => axios.post('course/show', data),
    contents: data => axios.post('course/contents', data),
    instructor: data => axios.post('course/instructor', data)
  },
  notifications: {
    index: data => axios.post('notifications', data),
    update: data => axios.patch('notifications/update', data),
    create: data => axios.post('notifications/delete', data)
  },
  settings: {
    index: data => axios.get('settings', data)
  }
}
