<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card flat class="px-10">
            <v-card-title>
              <h3 class="text--disabled basil--text">
                Trashed Courses
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
              <v-col lg="4">
                <Searchbar
                  labelProp="search for course"
                  typeProp="courses"
                  @reset="reloadPage"
                  @getSearchData="searchCourses"
                />
              </v-col>
            </v-row>
            <v-simple-table fixed-header height="300px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Created At</th>
                    <th class="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses" :key="course.id">
                    <td>{{ course.title }}</td>
                    <td>{{ course.created_at }}</td>
                    <td>
                      <v-row>
                        <v-btn
                          small
                          class="mr-3"
                          color="success"
                          @click.prevent="editCourse(course)"
                        >
                          Update</v-btn
                        >
                        <v-btn
                          small
                          color="primary"
                          class="mr-3"
                          @click.prevent="updateCourse(course.id)"
                        >
                          Edit/View</v-btn
                        >
                        <v-btn
                          color="error"
                          small
                          @click.prevent="destroy(course.id)"
                        >
                          Delete</v-btn
                        >
                      </v-row>
                    </td>
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

            <!-- view course modal -->
            <div class="text-center">
              <v-row justify="center">
                <v-dialog v-model="dialog" max-width="750">
                  <v-card>
                    <v-card-title class="headline">
                      {{ form.title }}
                    </v-card-title>

                    <v-container>
                      <v-row>
                        <v-col class="py-0" cols="12">
                          <v-text-field
                            label="Course Title"
                            v-model="form.title"
                            counter="60"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="py-0" cols="12">
                          <v-text-field
                            label="Course Subtitle"
                            v-model="form.subtitle"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="py-0" cols="12">
                          <v-label>Course Description</v-label>
                          <vue-editor v-model="form.description"> </vue-editor>
                        </v-col>
                      </v-row>
                      <br />
                      <div></div>
                      <v-row class="mt-10">
                        <v-col class="py-0" cols="12" md="4" lg="4">
                          <!-- <v-label>Language</v-label> -->
                          <v-select
                            :items="languages"
                            label="--Select Language --"
                            item-value="language"
                            v-model="form.language"
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col class="py-0" cols="12" md="4" lg="4">
                          <!-- <v-label>Level</v-label> -->
                          <v-select
                            :items="levels"
                            label="--Select Level--"
                            item-value="id"
                            v-model="form.level_id"
                            item-text="name"
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col class="py-0" cols="12" md="4" lg="4">
                          <!-- <v-label>Category</v-label> -->
                          <v-select
                            :items="categories"
                            label="--Select Category--"
                            item-value="id"
                            item-text="name"
                            outlined
                            v-model="form.category_id"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="py-0" lg="6" cols="12">
                          <v-select
                            v-model="form.tags"
                            :items="allTags"
                            item-text="name"
                            item-value="id"
                            chips
                            label="Tags"
                            multiple
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col class="py-0" cols="12" lg="6">
                          <v-text-field
                            v-model="form.pricing"
                            label="Price"
                            type="number"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-divider></v-divider>
                      </v-row>
                      <v-label>Course Image</v-label>
                      <v-row>
                        <v-col
                          class="py-0"
                          :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                        >
                          <v-img
                            width="100%"
                            :src="
                              form.image_url
                                ? form.image_url
                                : '/placeholder.png'
                            "
                          />
                        </v-col>
                        <v-col
                          class="py-0"
                          :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                        >
                          <div>
                            Upload your course image here. It must meet our
                            course image quality standards to be accepted.
                            Important guidelines: 750x422 pixels; .jpg, .jpeg,.
                            gif, or .png. no text on the image.
                          </div>
                          <br />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-row>
            </div>
            <!-- end view course modal -->

            <!-- modal -->
            <div class="text-center">
              <v-row justify="center">
                <v-dialog v-model="dialog2" max-width="350">
                  <v-card>
                    <v-card-title class="headline">
                      Update {{ form.title }}
                    </v-card-title>

                    <v-container>
                      <v-select
                        :items="items"
                        label="--Update Status --"
                        item-value="value"
                        item-text="name"
                        v-model="form.status"
                        outlined
                      ></v-select>
                    </v-container>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        color="primary darken-1"
                        text
                        @click.prevent="update()"
                      >
                        Update
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </div>
            <!-- end modal -->
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
      items: [
        { name: 'Aproved', value: 2 },
        { name: 'Rejected', value: 1 },
        { name: 'Pending', value: 0 }
      ],
      courses: [],
      tags: [],
      edit: false,
      dialog: false,
      dialog2: false,
      pricing: 0,
      levels: [],
      allTags: [],
      categories: [],
      languages: LANGUAGES,
      form: new Form({
        image_url: '',
        category_id: '',
        rating: '',
        prerequisites: '',
        overview: '',
        congratulation_message: '',
        welcome_message: '',
        level_id: '',
        pricing: '',
        language: '',
        description: '',
        title: '',
        id: '',
        subtitle: '',
        status: ''
      }),
      searchData: false,
      filter: false,
      fetching: false,
      page: 1,
      nextPage: null
    }
  },
  methods: {
    updateCourse(id) {
      this.$store.commit('course/store_id', id)
      this.$router.push({
        name: 'management-courses-edit-id',
        params: { id: id }
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
    editCourse(course) {
      this.form.reset()
      this.edit = true
      this.form.fill(course)
      this.dialog2 = true
    },
    viewCourse(course) {
      this.form.reset()
      this.edit = true
      this.form.fill(course)
      this.dialog = true
    },
    newModal() {
      this.edit = false
      this.form.reset()
      this.dialog = true
    },
    update() {
      let data = {
        status: this.form.status,
        id: this.form.id
      }
      CourseController.course
        .update(data)
        .then(() => {
          this.page = 1
          this.getCourses()
          this.dialog2 = false
          this.$notify({
            group: 'foo',
            title: 'Success',
            text: 'Course updated',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },

    destroy(id) {
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
          CourseController.course
            .delete(id)
            .then(() => {
              this.page = 1
              this.getCourses()
              this.$notify({
                group: 'foo',
                title: 'Success',
                text: 'Course deleted',
                type: 'success'
              })
            })
            .catch(() => {
              this.$notify({
                group: 'foo',
                title: 'Error',
                text: 'Something went wrong',
                type: 'error'
              })
            })
        }
      })
    },
    getCourses() {
      CourseController.course
        .deleted(this.page)
        .then(res => {
          let data = res.data.data.data
          this.courses = data.data
          this.nextPage = data.next_page_url
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    },
    getCategories() {
      api.category.get().then(res => {
        this.categories = res.data.data
      })
    },
    getLevels() {
      api.level.get().then(res => {
        this.levels = res.data.data
      })
    },
    getTags() {
      api.tag.get().then(res => {
        this.allTags = res.data.data
      })
    }
  },
  created() {
    this.getCourses()
    this.getCategories()
    this.getLevels()
    this.getTags()
  },
  mounted() {
    this.$nuxt.$loading.start()
  }
}
</script>
