<template>
  <client-only>
    <v-container>
      <v-row>
        <v-col>
          <div class="font-weight-bold display-1 mt-10">Courses</div>
        </v-col>
        <v-spacer />
        <v-col>
          <div class="mt-10" v-if="$vuetify.breakpoint.smAndDown">
            <v-btn
              large
              color="error"
              :to="{ name: 'instructor-courses-create' }"
              nuxt
              >New Course</v-btn
            >
          </div>
        </v-col>
      </v-row>

      <v-flex>
        <v-alert dismissible color="cyan" border="left" colored-border>
          Due to increased volume of new courses being submitted for review, the
          Quality Review Process may take up to 6 days.
        </v-alert>

        <v-alert
          v-if="deleteNotification"
          dismissible
          color="red"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-information"
        >
          Your request to delete a course has been recieved. You will get a
          notification once this is done!
        </v-alert>

        <div>
          <div class="row">
            <div class="col-lg-4 col-md-12">
              <!-- <v-text-field
                filled
                v-model="search"
                dense
                label="search your courses"
                append-icon="mdi-magnify"
              ></v-text-field> -->
              <Searchbar
                labelProp="search for course"
                typeProp="courses"
                @reset="reloadPage"
                @getSearchData="searchCourses"
              />
            </div>
            <v-spacer v-if="$vuetify.breakpoint.smAndDown" />
            <!-- <div class="col-5 col-lg-3 col-md-3">
              <v-select :items="items" label="Newest" solo></v-select>
            </div> -->

            <v-spacer v-if="$vuetify.breakpoint.mdAndUp" />

            <v-col lg="2" v-if="$vuetify.breakpoint.mdAndUp">
              <v-btn
                large
                color="error"
                :to="{ name: 'instructor-courses-create' }"
                nuxt
              >
                New Course</v-btn
              >
            </v-col>
          </div>
        </div>

        <div class="row" v-for="course in filteredCourses" :key="course.id">
          <div class="col-12">
            <v-card raised shaped>
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-4">
                    <v-btn
                      x-small
                      class="text-capitalize"
                      depressed
                      :color="
                        course.status == 0
                          ? 'warning'
                          : course.status == 1
                          ? 'error'
                          : 'success'
                      "
                    >
                      {{
                        course.status == 0
                          ? 'Pending'
                          : course.status == 1
                          ? 'Rejected'
                          : 'Approved'
                      }}
                    </v-btn>
                  </div>
                  <v-list-item-title class="headline mb-1">
                    {{ course.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ course.subtitle }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <!-- <v-list-item-avatar tile size="80" color="grey">
                  <v-img
                    :src="
                      course.image_url ? course.image_url : '/placeholder.png'
                    "
                  ></v-img>
                </v-list-item-avatar> -->
              </v-list-item>

              <v-card-actions>
                <v-btn
                  @click.prevent="updateCourse(course.id)"
                  color="info"
                  text
                  >Update</v-btn
                >
                <v-btn
                  v-if="course.status !== 2"
                  @click.prevent="deleteCourse(course.id)"
                  text
                  color="red"
                  >Delete</v-btn
                >
                <v-btn
                  v-if="course.status == 2"
                  @click.prevent="createJoinMeeting(course.id)"
                  text
                  >Create Meeting</v-btn
                >
              </v-card-actions>
            </v-card>
          </div>
        </div>

        <div class="d-flex justify-center text-center">
          <v-progress-circular
            v-if="!searchData && fetching"
            :size="70"
            :width="7"
            color="grey"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-card v-if="!searchData" v-intersect="infiniteScrolling"> </v-card>
      </v-flex>
    </v-container>
  </client-only>
</template>

<script>
import courseController from '~/api/instructor/courseController'
import Searchbar from '~/components/Search'
export default {
  middleware: ['instructor'],
  layout: 'instructorSidebar',
  components: {
    Searchbar
  },
  data() {
    return {
      items: ['Newest', 'Popular'],
      courses: [],
      deleteNotification: false,
      search: '',
      searchData: false,
      filter: false,
      fetching: false,
      page: 1,
      nextPage: null
    }
  },
  methods: {
    createJoinMeeting(id) {
      this.$router.push({
        name: 'instructor-meeting',
        query: { id: id }
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
        let data = {
          created_by: this.$store.state.user.id
        }

        if (this.nextPage != null) {
          courseController.course
            .index(this.page, data)
            .then(res => {
              let courses = res.data.data.data.data
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
    updateCourse(id) {
      this.$store.commit('course/store_id', id)
      this.$router.push({
        name: 'instructor-courses-edit-id',
        params: { id: id }
      })
    },
    deleteCourse(id) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.value) {
          courseController.course
            .delete(id, this.$store.state.user.id)
            .then(res => {
              this.getCourses()
              this.deleteNotification = true
            })
        }
      })
    },
    getCourses() {
      let data = {
        created_by: this.$store.state.user.id
      }
      courseController.course.index(this.page, data).then(res => {
        let data = res.data.data.data
        this.courses = data.data
        this.nextPage = data.next_page_url
      })
    }
  },
  created() {
    this.getCourses()
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => {
        return course.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>
