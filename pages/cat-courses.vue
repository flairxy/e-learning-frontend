<template>
  <div>
    <div class="row" v-for="category in categories" :key="category.id">
      <v-container v-if="category.courses.length > 0" class="mt-5">
        <div class="mx-5 flat" align="center" justify="center">
          <span class="font-weight-medium">
            <span class="title text--disabled"
              >Top {{ category.name }} Courses</span
            >
          </span>
        </div>

        <v-sheet max-width="1300">
          <v-slide-group
            class="pa-4"
            v-model="model"
            :show-arrows="$vuetify.breakpoint.smAndUp"
          >
            <v-slide-item v-for="course in category.courses" :key="course.id">
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
      </v-container>
    </div>
  </div>
</template>
<style>
.b-border {
  border-bottom: 1px solid rgb(2, 2, 2);
}
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
      categories: [],
      model: [],
      currency: process.env.CURRENCY,
      model: 0,
      active: false,
      cycle: false,
      items: [
        {
          src: '/bg.jpg'
        }
      ]
    }
  },
  methods: {},
  created() {
    api.category.courses().then(res => {
      let categories = res.data.data
      // let courses = categories.courses
      // courses.filter(course => {
      //   course.instructors = JSON.parse(course.instructors)
      // })
      this.categories = categories
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()

      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  }
}
</script>
