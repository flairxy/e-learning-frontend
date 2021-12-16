import axios from 'axios'

export default {
  course: {
    buy: data => axios.post('student/course/buy', data),
    index: data => axios.post('student/course', data),
    show: data => axios.post('student/course/show', data),
    review: data => axios.post('student/course/review', data),
    updateReview: data => axios.post('student/course/review/update', data),
  }
}
