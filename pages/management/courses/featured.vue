<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card flat class="px-10">
            <v-card-title>
              <h3 class="text--disabled basil--text">
                Featured Courses
              </h3>
            </v-card-title>
            <!-- <v-btn
              color="primary text-capitalize"
              dark
              @click.prevent="newModal"
            >
              <v-icon>mdi-plus</v-icon> course
            </v-btn> -->
            <v-row>
              <!-- <v-col lg="4">
                <Searchbar
                  labelProp="search for course"
                  typeProp="courses"
                  @reset="reloadPage"
                  @getSearchData="searchCourses"
                />
              </v-col>
              <v-spacer /> -->

              <v-col lg="3" sm="6">
                <v-btn
                  class="text-capitalize"
                  color="error"
                  @click.prevent="remove"
                >
                  Remove courses</v-btn
                >
              </v-col>
            </v-row>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Total Students</th>
                    <th class="text-left">Average Review</th>
                    <th class="text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses" :key="course.id">
                    <td>
                      <v-checkbox
                        v-model="selected"
                        color="#a10942"
                        :value="course.id"
                      ></v-checkbox>
                    </td>
                    <td>{{ course.title }}</td>
                    <td>{{ course.total_students }}</td>
                    <td>{{ course.rating ? course.rating : 'Unavailable' }}</td>
                    <td>{{ course.date }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <div class="d-flex justify-center text-center">
              <v-progress-circular
                v-if="!searchData && fetching"
                :size="40"
                :width="7"
                color="grey"
                indeterminate
              ></v-progress-circular>
            </div>
            <v-card v-if="!searchData" v-intersect="infiniteScrolling">
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </client-only>
</template>
<script>
import CourseController from '~/api/admin/CourseController'
import Searchbar from '~/components/Search'
import api from '~/api/general'
import { Form } from 'vform'
const LANGUAGES = require('languages-list')
export default {
  layout: 'admin',
  middleware: 'admin',
  components: {
    Searchbar
  },
  data() {
    return {
      courses: [],
      selected: [],
      searchData: false,
      filter: false,
      fetching: false,
      page: 1,
      nextPage: null,
      set_type: ''
    }
  },
  methods: {
    remove() {
      this.$swal({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, continue!'
      }).then(async result => {
        if (result.value) {
          this.page = 1
          try {
            await CourseController.course.deleteFeatured({
              courses: this.selected
            })
            this.set_type = ''
            this.getCourses()
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Featured Courses removed',
              type: 'success'
            })
          } catch (error) {
            console.log(error)
            this.$notify({
              group: 'foo',
              title: 'error',
              text: 'Something went wrong',
              type: 'error'
            })
          }
        }
      })
    },
    reloadPage() {
      this.searchData = false
      this.page = 1
      this.getCourses()
    },

    searchCourses(value) {
      let data = value
      if (data && data.length > 0) {
        this.searchData = true
        this.courses = data
      } else {
        this.page = 1
        this.getCourses()
        this.searchData = false
      }
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
    },

    getCourses() {
      CourseController.course
        .featured(this.page)
        .then(res => {
          let data = res.data.data.data
          this.courses = data.data
          this.nextPage = data.next_page_url
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    }
  },
  created() {
    this.getCourses()
  },
  mounted() {
    this.$nuxt.$loading.start()
  }
}
</script>
