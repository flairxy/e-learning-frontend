<template>
  <client-only>
    <div>
      <v-carousel
        :continuous="false"
        :show-arrows="false"
        hide-delimiter-background
        delimiter-icon="mdi-minus"
        :height="$vuetify.breakpoint.smAndDown ? 150 : 250"
      >
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
          :src="item.src"
          reverse-transition="fade-transition"
          transition="fade-transition"
        >
          <v-row class="fill-height" align="center" justify="center">
            <div
              :class="
                $vuetify.breakpoint.smAndDown ? 'title  px-5' : 'display-3'
              "
              class="white--text text-center"
            >
              An expert for every goal <br />
              <span
                class="font-weight-regular"
                :class="$vuetify.breakpoint.mdAndUp ? 'title' : 'subtitle-1'"
              >
                Learn from instructors from around the globe
              </span>
            </div>
          </v-row>
        </v-carousel-item>
      </v-carousel>

      <v-container>
        <v-row class="px-3">
          <v-col>
            <div class="font-weight-bold headline mt-10">
              Welcome back, {{ user.first_name }}
            </div>
            <div class="subtitle-1 font-weight-light">
              {{
                studentCourses.length > 0
                  ? 'Ready to jump back in?'
                  : 'Get started by enrolling in a course'
              }}
            </div>
          </v-col>
        </v-row>
        <div class="row" v-if="$vuetify.breakpoint.mdAndUp">
          <div
            class="col-12 col-lg-4 col-md-4"
            v-for="course in studentCourses"
            :key="course.id"
          >
            <paid-course
              :courseId="course.id"
              :instructorsProp="course.instructors"
              :courseImage="course.image_url ? course.image_url : ''"
              :titleProp="course.title"
              :subtitleProp="
                course.subtitle && course.subtitle.length > 50
                  ? course.subtitle.substr(0, 50) + '...'
                  : course.subtitle
              "
            />
          </div>
        </div>
        <div v-if="$vuetify.breakpoint.smAndDown">
          <div
            class="row p-0 mb-0 mt-0"
            v-for="course in studentCourses"
            :key="course.id"
          >
            <div class="col-12 p-0 mb-n2 mt-n2">
              <v-card
                nuxt
                :to="{ name: 'student-course-id', params: { id: course.id } }"
              >
                <v-list-item three-line>
                  <v-list-item-avatar tile size="80" color="grey">
                    <v-img
                      :src="
                        course.image_url ? course.image_url : '/placeholder.png'
                      "
                    ></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-1 font-weight-medium">
                      {{ course.title }}

                      <!-- <span class="caption row ml-0 text--grey">
                        <v-rating
                          color="yellow accent-4"
                          dense
                          half-increments
                          readonly
                          :value="course.rating"
                          size="15"
                        ></v-rating>
                        {{ course.rating }} ({{
                          course.students ? course.students.length : 0
                        }})
                      </span> -->
                      <span class="row caption mt-2 ml-0 text--grey"
                        >START COURSE
                      </span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </div>
          </div>
        </div>
      </v-container>
      <v-divider></v-divider>
      <v-container>
        <v-row>
          <v-col cols="2" v-if="$vuetify.breakpoint.mdAndUp">
            <v-card flat class="accent-4 fixed" width="300">
              <v-list dense>
                <v-list-item v-for="category in categories" :key="category.id">
                  <v-list-item-content>
                    <v-list-item-title
                      class="pointer"
                      @click="filterCourses(category.id, category.name)"
                      >{{ category.name }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="10" class="pt-0">
            <div flat class="px-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
              <div class="row">
                <span class="col-4 col-lg-4 pb-0 mb-n4">
                  <Searchbar
                    labelProp="search for course"
                    typeProp="courses"
                    @reset="reloadPage"
                    @getSearchData="searchCourses"
                  />
                </span>
              </div>
            </div>
            <div flat class="px-5">
              <v-container>
                <div
                  class="row text-center justify-center"
                  v-if="$vuetify.breakpoint.mdAndUp"
                >
                  <h3 class="text--disabled">{{ message }}</h3>
                </div>
                <!-- desktop view -->
                <div class="row" v-if="$vuetify.breakpoint.mdAndUp">
                  <div
                    class="col-5 col-lg-4"
                    v-for="course in courses"
                    :key="course.id"
                  >
                    <course-card
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
                      :studentProp="
                        course.students ? course.students.length : 0
                      "
                      :pricingProp="parseFloat(course.pricing)"
                      :adminPriceProps="1000"
                    />
                  </div>
                </div>
                <!-- end of desktop view -->
              </v-container>
            </div>
          </v-col>
          <v-container class="py-0">
            <!-- mobile list view starts -->
            <v-row v-if="$vuetify.breakpoint.smAndDown">
              <span class="col-7 p-0">
                <Searchbar
                  labelProp="search"
                  typeProp="courses"
                  @reset="reloadPage"
                  @getSearchData="searchCourses"
                />
              </span>
              <span class="col-5 p-0">
                <v-select
                  @change="applyFilter"
                  :items="categories"
                  label="Categories"
                  item-value="value"
                  item-text="name"
                  return-object
                  outlined
                  dense
                  v-model="current_category"
                ></v-select>
              </span>
            </v-row>
            <div
              class="row text-center justify-center"
              v-if="$vuetify.breakpoint.smAndDown"
            >
              <h3 class="text--disabled">{{ message }}</h3>
            </div>
            <div v-if="$vuetify.breakpoint.smAndDown">
              <div
                class="row p-0 mb-0 mt-0"
                v-for="course in courses"
                :key="course.id"
              >
                <div class="col-12 p-0 mb-n2 mt-n2">
                  <v-card nuxt :to="{ name: 'id', params: { id: course.id } }">
                    <v-list-item three-line>
                      <v-list-item-avatar tile size="80" color="grey">
                        <v-img
                          :src="
                            course.image_url
                              ? course.image_url
                              : '/placeholder.png'
                          "
                        ></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          class="subtitle-1 font-weight-medium"
                        >
                          {{ course.title }}

                          <span class="caption row ml-0 text--grey">
                            <v-rating
                              color="yellow accent-4"
                              dense
                              half-increments
                              readonly
                              :value="course.rating"
                              size="15"
                            ></v-rating>
                            {{ course.rating }} ({{
                              course.students ? course.students.length : 0
                            }})
                          </span>
                          <span
                            v-if="course.pricing > 0"
                            class="row caption row ml-0 text--grey font-weight-bold"
                            >{{
                              currency +
                                parseFloat(course.pricing)
                                  .toFixed(2)
                                  .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                            }}
                          </span>
                          <span
                            v-else
                            class="row caption ml-0 text--grey font-weight-bold"
                            >FREE
                          </span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </div>
              </div>
            </div>
            <!-- end of mobile list view -->
            <div class="d-flex justify-center">
              <v-progress-circular
                v-if="!searchData && fetching"
                :size="70"
                :width="7"
                color="grey"
                indeterminate
              ></v-progress-circular>
            </div>
            <v-card v-if="!searchData" v-intersect="infiniteScrolling">
            </v-card>
          </v-container>
        </v-row>
      </v-container>
    </div>
  </client-only>
</template>

<script>
import CourseCard from '~/components/CourseCard'
import PaidCourse from '~/components/PaidCourseCard'
import api from '~/api/general'
import courseController from '~/api/student/courseController'
import Searchbar from '~/components/Search'
export default {
  components: {
    CourseCard,
    PaidCourse,
    Searchbar
  },
  layout: 'studentSidebar',
  // middleware: ['auth', 'instructor'],
  data() {
    return {
      items: [
        {
          src: '/bg.jpg'
        }
      ],
      courses: [],
      studentCourses: [],
      user: {},
      deleteNotification: false,
      search: '',
      title: 'Pre-fab homes',
      page: 1,
      query: '',
      message: '',
      nextPage: null,
      searchData: false,
      filter: false,
      fetching: false,
      categories: [],
      current_category: null,
      currency: process.env.CURRENCY
    }
  },
  methods: {
    applyFilter() {
      let category = this.current_category
      return this.filterCourses(category.id, category.name)
    },
    reloadPage() {
      this.message = ''
      this.searchData = false
      this.page = 1
      this.getCourses()
    },

    searchCourses(value) {
      let data = value
      if (data && data.length > 0) {
        this.message = ''
        this.searchData = true
        this.courses = data
      } else {
        this.message = 'Course Not Found'
        this.courses = []

        // this.page = 1
        // this.getCourses()
        // this.searchData = false
      }
    },
    filterCourses(id, name) {
      api.course.category({ id: id }).then(res => {
        let courses = res.data.data
        if (courses && courses.length > 0) {
          this.message = ''
          this.searchData = true
          // this.message = 'Courses under ' + name
          this.courses = res.data.data
        } else {
          this.message = 'No course under ' + name + ' category was found'
          this.courses = []
        }
      })
    },
    getCourses() {
      api.course
        .index(this.page)
        .then(res => {
          let data = res.data.data.data
          this.courses = data.data
          this.nextPage = data.next_page_url
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStudentCourses() {
      let data = {
        id: this.user.id
      }
      courseController.course.index(data).then(res => {
        this.studentCourses = res.data.data
      })
    },
    infiniteScrolling(entries, observer, isIntersecting) {
      this.fetching = true
      setTimeout(() => {
        this.page++
        if (this.nextPage != null) {
          api.course
            .index(this.page)
            .then(res => {
              let data = res.data.data.data
              let courses = data.data
              this.nextPage = data.next_page_url
              if (courses.length > 1) {
                courses.forEach(course => this.courses.push(course))
                this.fetching = false
              }
              this.fetching = false
            })
            .catch(err => {
              this.fetching = false
              console.log(err)
            })
        } else {
          this.fetching = false
        }
      }, 500)
    }
  },
  created() {
    this.user = this.$store.state.user
    this.getCourses()
    this.getStudentCourses()
    api.category.get().then(res => {
      this.categories = res.data.data
    })
  }
}
</script>
