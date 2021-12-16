<template>
  <v-layout>
    <v-flex>
      <v-carousel
        v-model="model"
        :continuous="false"
        :cycle="cycle"
        :show-arrows="false"
        hide-delimiter-background
        delimiter-icon="mdi-minus"
        :height="$vuetify.breakpoint.smAndDown ? 300 : 450"
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
              :class="$vuetify.breakpoint.smAndDown ? 'title' : 'display-3'"
              class="white--text text-center"
            >
              A an expert for every goal <br />
              <span class="title font-weight-regular">
                Learn from instructors from around the globe
              </span>
            </div>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <v-container>
        <div class="row">
          <div class="col-md-4 col-12">
            <v-card flat>
              <v-list-item
                ><v-avatar
                  class="v-list-item__avatar grey lighten-4"
                  style="height: 40px; min-width: 40px; width: 40px;"
                >
                  <v-icon color="grey">mdi-video</v-icon>
                </v-avatar>
                <div class="v-list-item__content">
                  <div class="v-list-item__title">
                    <span>Online courses</span>
                  </div>
                  <div class="v-list-item__subtitle">
                    <span>Enjoy a variety of fresh topics </span>
                  </div>
                </div>
              </v-list-item>
            </v-card>
          </div>
          <div class="col-md-4 col-12">
            <v-card flat>
              <v-list-item
                ><v-avatar
                  class="v-list-item__avatar grey lighten-4"
                  style="height: 40px; min-width: 40px; width: 40px;"
                >
                  <v-icon color="grey">mdi-seal</v-icon>
                </v-avatar>
                <div class="v-list-item__content">
                  <div class="v-list-item__title">
                    <span>Expert instruction</span>
                  </div>
                  <div class="v-list-item__subtitle">
                    <span>Find the right instructor for you </span>
                  </div>
                </div>
              </v-list-item>
            </v-card>
          </div>
          <div class="col-md-4 col-12">
            <v-card flat>
              <v-list-item
                ><v-avatar
                  class="v-list-item__avatar grey lighten-4"
                  style="height: 40px; min-width: 40px; width: 40px;"
                >
                  <v-icon color="grey">mdi-infinity</v-icon>
                </v-avatar>
                <div class="v-list-item__content">
                  <div class="v-list-item__title">
                    <span>Lifetime access </span>
                  </div>
                  <div class="v-list-item__subtitle">
                    <span>Learn on your schedule </span>
                  </div>
                </div>
              </v-list-item>
            </v-card>
          </div>
        </div>
      </v-container>
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
            <v-card flat class="px-5 ml-6" v-if="$vuetify.breakpoint.mdAndUp">
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
            </v-card>
            <v-card flat class="px-5">
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
                    v-for="course in filteredCourses"
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
                      :pricingProp="course.pricing"
                      :adminPriceProps="1000"
                    />
                  </div>
                </div>
                <!-- end of desktop view -->
              </v-container>
            </v-card>
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
                v-for="course in filteredCourses"
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
    </v-flex>
  </v-layout>
</template>
<script>
import api from '~/api/general'
import CourseCard from '~/components/CourseCard'
import Searchbar from '~/components/Search'
export default {
  components: {
    CourseCard,
    Searchbar
  },
  data() {
    return {
      searchData: false,
      filter: false,
      fetching: false,
      sticky: false,
      active: true,
      categories: [],
      model: null,
      courses: [],
      search: '',
      page: 1,
      query: '',
      message: '',
      nextPage: null,
      currency: process.env.CURRENCY,
      current_category: null,
      colors: ['primary', 'secondary', 'yellow darken-2', 'red', 'orange'],
      model: 0,
      cycle: false,
      items: [
        {
          src: '/bg.jpg'
        }
      ]
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
      api.course.index(this.page).then(res => {
        let data = res.data.data.data
        this.courses = data.data
        this.nextPage = data.next_page_url
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
              if (courses.length > 0) {
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
    this.getCourses()
    api.category.get().then(res => {
      this.categories = res.data.data
    })
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => {
        course.instructors = JSON.parse(course.instructors)
        return course.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()

      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  }
}
</script>
