import axios from 'axios'

export default {
  course: {
    index: (page, data) => axios.post(`instructor/course?page=${page}`, data),
    show: data => axios.post('instructor/course/show', data),
    create: data => axios.post('instructor/course/create', data),
    update: data => axios.patch('instructor/course/update', data),
    updateFiles: data => axios.patch('instructor/course/files/update', data),
    delete: (id, created_by) =>
      axios.delete(`instructor/course/delete/${id}/${created_by}`)
  },
  section: {
    index: data => axios.get('instructor/section', data),
    show: data => axios.post('instructor/section/show', data),
    showSection: (id, section) =>
      axios.get(`instructor/section/${id}/${section}`),
    create: data => axios.post('instructor/section/create', data),
    update: data => axios.patch('instructor/section/update', data),
    delete: (id, course) =>
      axios.delete(`instructor/section/delete/${id}/${course}`)
  },
  content: {
    index: data => axios.get('instructor/content', data),
    show: data => axios.post('instructor/content/show', data),
    create: data => axios.post('instructor/content/create', data),
    update: data => axios.patch('instructor/content/update', data),
    delete: (id, section, course) =>
      axios.delete(`instructor/content/delete/${id}/${section}/${course}`),
    files: data => axios.post('instructor/content/store', data)
  },
  meeting: {
    get: id => axios.get(`meetings/${id}`),
    create: data => axios.post('meetings/create', data),
    update: data => axios.patch('meetings/update', data),
    delete: id => axios.delete(`meetings/delete/${id}`)
  }
}
