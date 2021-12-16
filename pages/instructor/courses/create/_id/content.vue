<template>
  <div>
    <div v-if="!course" class="d-flex justify-center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="grey"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-else>
      <!-- <v-stepper non-linear>
        <v-stepper-header>
          <v-stepper-step
            :complete="currentRoute == '' ? true : false"
            editable
            step="1"
            @click.prevent="goToPlan"
          >
            Plan your course
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            editable
            step="2"
            :complete="currentRoute == 'curriculum' ? true : false"
            @click.prevent="goToCurriculum"
          >
            Create your content
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            step="3"
            editable
            :complete="currentRoute == 'landing' ? true : false"
            @click.prevent="goToLanding"
          >
            Publish your course
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper> -->
      <v-content>
        <nuxt-child />
      </v-content>
    </div>
  </div>
</template>
<script>
import api from '~/api/instructor/courseController'
export default {
  data() {
    return {
      currentRoute: this.$route.path.split('/').pop(),
      course: null
    }
  },
  methods: {
    goToPlan() {
      this.$router.push({ name: 'instructor-courses-create-id-content' })
    },
    goToCurriculum() {
      this.$router.push({
        name: 'instructor-courses-create-id-content-curriculum'
      })
    },
    goToLanding() {
      this.$router.push({
        name: 'instructor-courses-create-id-content-landing'
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
          this.course = course
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
