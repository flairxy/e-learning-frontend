<template>
  <div>
    <v-flex>
      <div height="500" flat>
        <v-row>
          <v-col>
            <div
              :class="
                `font-weight-light text-center text ${
                  $vuetify.breakpoint.smAndDown ? 'headline' : 'display-1'
                } mt-10`
              "
            >
              How about a working title?
              <p class="font-regular text--secondary mt-5 subtitle-1">
                It's ok if you can't think of a good title now. You can change
                it later.
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" sm="6">
            <v-text-field
              solo
              v-model="title"
              :counter="counter"
              :maxlength="counter"
              label="e.g. Vue Mastery from Beginner to Pro"
              dense
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-card-actions class="card-actions">
          <v-btn
            @click="saveTitle"
            large
            tile
            color="error"
            :disabled="title ? false : true"
            >Continue</v-btn
          >
        </v-card-actions>
      </div>
    </v-flex>
  </div>
</template>
<style>
.card-actions {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
<script>
import api from '~/api/instructor/courseController'
export default {
  // async validate({ params, query, store }) {
  //   let id = store.state.course.id
  //   if (id) {
  //     if (params.id === id) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   } else {
  //     return (window.location = 'instructor/courses')
  //   }
  // },
  data() {
    return {
      counter: 60,
      title: ''
    }
  },
  methods: {
    saveTitle() {
      //dispatch to the course store
      this.$store.commit('course/store_title', this.title)
      this.$router.push({
        name: 'instructor-courses-edit-id-category',
        params: { id: this.$route.params.id }
      })
    },
    getCourse() {
      let data = {
        id: this.$route.params.id,
        course: null
      }
      api.course
        .show(data)
        .then(res => {
          let course = res.data.data
          this.title = course.title
          this.$store.commit('course/store_course', course)
        })
        .catch(err => console.log(err))
    }
  },
  created() {
    this.getCourse()
  }
}
</script>
