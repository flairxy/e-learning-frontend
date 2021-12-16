export const state = () => ({
  course: {},
  id: null,
  imageURL:''
})

export const mutations = {
  store_title(state, data) {
    state.course.title = data
  },
  store_course(state, data){
    state.course = data
  },
  store_id(state, data){
    state.id = data
  },
  store_imageURL(state, data){
    state.imageURL = data
  },
}

export const actions = {}
