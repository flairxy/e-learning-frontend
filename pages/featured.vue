<template>
  <div>
    <div class="row py-5">
      <v-container>
        <div class="card d-flex justify-center flat">
          <span class="b-border">
            <h2 class="">
              Featured Courses
            </h2>
          </span>
        </div>
        <br />
        <v-sheet max-width="1300" v-if="courses.length > 0">
          <v-slide-group
            class="pa-4"
            v-model="model"
            :show-arrows="$vuetify.breakpoint.smAndUp"
          >
            <v-slide-item v-for="course in courses" :key="course.id">
              <course-card
                class="ma-2"
                :courseId="course.id"
                :instructorsProp="course.instructors"
                :courseImage="course.image_url"
                :titleProp="course.title"
                :subtitleProp="
                  course.subtitle && course.subtitle.length > 50
                    ? course.subtitle.substr(0, 50) + '...'
                    : course.subtitle
                "
                :ratingProp="course.rating"
                :studentProp="course.students ? course.students.length : 0"
                :pricingProp="parseFloat(course.pricing)"
                :adminPriceProps="1000"
              >
                <v-row class="fill-height" align="center" justify="center">
                  <v-scale-transition>
                    <v-icon
                      v-if="active"
                      color="white"
                      size="48"
                      v-text="'mdi-close-circle-outline'"
                    ></v-icon>
                  </v-scale-transition>
                </v-row>
              </course-card>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
        <v-row v-else>
          <v-col>
            <div
              :class="
                `font-weight-light text-center text ${
                  $vuetify.breakpoint.smAndDown ? 'headline' : 'display-1'
                } mt-10`
              "
            >
              No featured course at the moment
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<style>
.b-border {
  border-bottom: 1px solid #a10942;
}
.i-change {
  background-color: #ededed;
}
/* .i-primary {
  color: #a10942;
} */
</style>
<script>
import api from '~/api/general'
import CourseCard from '~/components/CourseCard'
export default {
  components: {
    CourseCard
  },
  data() {
    return {
      sticky: false,
      active: true,
      model: [],
      courses: [],
      currency: process.env.CURRENCY
    }
  },
  methods: {
    getCourses() {
      api.course.featured().then(res => {
        this.courses = res.data.data
      })
    }
  },
  created() {
    this.getCourses()
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()

      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  }
}
</script>
