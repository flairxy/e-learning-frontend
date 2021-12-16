import axios from 'axios'

export default {
  overview: {
    index: data => axios.post('instructor/performance/overview', data),
    students: data => axios.post('instructor/performance/students', data),
    reviews: data => axios.post('instructor/performance/reviews', data),
  },
}
