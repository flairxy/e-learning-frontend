<template>
  <span>
    <v-text-field
      v-if="typeProp === 'courses'"
      v-model="query"
      @keyup.enter="searchCourses"
      outlined
      filled
      dense
      :label="labelProp"
      append-icon="mdi-magnify"
    ></v-text-field>
    <v-text-field
      v-if="typeProp === 'users'"
      v-model="query"
      @keyup.enter="searchUsers"
      outlined
      filled
      dense
      :label="labelProp"
      append-icon="mdi-magnify"
    ></v-text-field>
  </span>
</template>

<script>
import api from '~/api/general'
import adminController from '~/api/admin/UsersController'
export default {
  props: {
    labelProp: {
      type: String,
      required: true
    },
    typeProp: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      query: ''
    }
  },
  watch: {
    query: function() {
      let data = this.query.length
      if (data < 1) {
        this.$emit('reset')
      }
    }
  },
  methods: {
    searchCourses() {
      let data = {
        search: this.query
      }
      // magnam
      api.course.search(data).then(res => {
        this.$emit('getSearchData', res.data.data)
      })
    },
    searchUsers() {
      let data = {
        search: this.query
      }
      // magnam
      adminController.user.search(data).then(res => {
        this.$emit('getSearchData', res.data.data)
      })
    }
  }
}
</script>

<style scoped></style>
