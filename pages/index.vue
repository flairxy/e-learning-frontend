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
        <div class="row">
          <div class="col-sm-4 col-12">
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
          <div class="col-sm-4 col-12">
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
          <div class="col-sm-4 col-12">
            <div flat>
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
            </div>
          </div>
        </div>
      </v-container>
      <featured-courses />
      <category-courses />
    </v-flex>
  </v-layout>
</template>
<style>
.b-border {
  border-bottom: 1px solid rgb(2, 2, 2);
}
</style>
<script>
import api from '~/api/general'
import CourseCard from '~/components/CourseCard'
import Searchbar from '~/components/Search'
import CategoryCourses from './cat-courses'
import FeaturedCourses from './featured'
export default {
  components: {
    CourseCard,
    Searchbar,
    CategoryCourses,
    FeaturedCourses
  },
  data() {
    return {
      searchData: false,
      filter: false,
      fetching: false,
      sticky: false,
      active: true,
      categories: [],
      model: [],
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
