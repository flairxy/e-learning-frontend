<template>
  <client-only>
    <div>
      <card flat>
        <div class="container d-flex justify-end">
          <v-btn
            @click.prevent="previewCourse"
            outlined
            :large="$vuetify.breakpoint.smAndDown ? false : true"
            color="primary"
            >Preview</v-btn
          >
        </div>
      </card>
      <v-divider></v-divider>

      <v-form>
        <v-container>
          <v-row>
            <v-col class="py-0" cols="12">
              <v-text-field
                label="Course Title"
                v-model="title"
                :counter="counter1"
                :maxlength="counter1"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12">
              <v-text-field
                label="Course Subtitle"
                v-model="subtitle"
                :counter="counter"
                :maxlength="counter"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12">
              <v-label>Course Description</v-label>
              <vue-editor v-model="description"> </vue-editor>
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
                v-model="language"
                outlined
              ></v-select>
            </v-col>
            <v-col class="py-0" cols="12" md="4" lg="4">
              <!-- <v-label>Level</v-label> -->
              <v-select
                :items="levels"
                label="--Select Level--"
                item-value="id"
                v-model="level_id"
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
                v-model="category_id"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" lg="6" cols="12">
              <v-select
                v-model="tags"
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
                v-if="allowPrice"
                v-model="pricing"
                label="Price"
                type="number"
                outlined
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-10">
            <v-alert type="error" text>
              All visible instructors of this course must complete their profile
              before the course can be published. This includes name, image, and
              a short summary of your background 50 words minimum.
            </v-alert>
          </v-row>
          <v-row>
            <v-col>
              <v-container>
                <v-row v-for="i in instructors" :key="i.username">
                  <v-text-field
                    class="col-lg-5 col-md-12"
                    label="Instructor Name"
                    :value="`${i.first_name} ${i.last_name}`"
                    dense
                    disabled
                    outlined
                  ></v-text-field>
                  <v-btn
                    v-if="i.username != creatorUsername"
                    color="error"
                    text
                    @click.prevent="removeInstructor(i)"
                    >Remove</v-btn
                  >
                </v-row>
                <v-row>
                  <v-text-field
                    class="col-lg-5 col-md-12"
                    label="Enter instructor username"
                    v-model="instructor"
                    dense
                    outlined
                  ></v-text-field>
                  <v-btn color="green" text @click.prevent="addInstructor">
                    <v-icon>mdi-plus</v-icon> add instructor
                  </v-btn>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-btn
            class="mb-10"
            @click.prevent="updateLanding"
            :large="$vuetify.breakpoint.smAndDown ? false : true"
            color="error"
            >Save information</v-btn
          >
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
                max-height="300"
                :src="imageUrl ? imageUrl : '/placeholder.png'"
              />
            </v-col>
            <v-col
              class="py-0"
              :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
            >
              <div>
                Upload your course image here. It must meet our course image
                quality standards to be accepted. Important guidelines: 750x422
                pixels; .jpg, .jpeg,. gif, or .png. no text on the image.
              </div>
              <br />
              <S3FileUpload
                @preview-image="previewImage"
                @saveUrl="saveImage"
                :currentFile="imageUrl"
                :courseId="course_id"
                buttonText="Save image"
                directory="images"
                label="Course Image"
                rules=".jpeg, .jpg, .png"
                contentType="image"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <div flat>
        <v-row>
          <v-col cols="6">
            <div class="d-flex justify-start">
              <v-btn
                text
                class="text-capitalize"
                @click.prevent="gotoCurr"
                :large="$vuetify.breakpoint.smAndDown ? false : true"
                color="error"
              >
                < Previous</v-btn
              >
            </div>
          </v-col>
          <v-col cols="6">
            <div class="d-flex justify-end">
              <v-btn
                class="text-capitalize"
                @click.prevent="submitReview"
                :large="$vuetify.breakpoint.smAndDown ? false : true"
                color="error"
                >Submit</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </client-only>
</template>

<script>
import api from '~/api/general'
import courseController from '~/api/instructor/courseController'
import S3FileUpload from '@/components/S3FileUpload'
const LANGUAGES = require('languages-list')
export default {
  components: {
    S3FileUpload
  },
  data() {
    return {
      tags: [],
      video: {},
      category_id: '',
      level_id: null,
      imageUrl: '',
      pricing: 0,
      counter: 120,
      counter1: 60,
      language: '',
      description: '',
      files: [],
      rules: [],
      levels: [],
      allTags: [],
      categories: [],
      instructors: [],
      instructor: '',
      languages: LANGUAGES,
      title: '',
      subtitle: '',
      processing: false,
      course_id: this.$route.params.id,
      creatorUsername: this.$store.state.user.username,
      allowPrice: false
    }
  },
  methods: {
    gotoCurr() {
      this.$router.push({
        name: 'instructor-courses-create-id-content-curriculum'
      })
    },
    addInstructor() {
      let data = {
        username: this.instructor
      }
      api.course
        .instructor(data)
        .then(res => {
          this.instructors.push(res.data.data)
          this.instructor = ''
        })
        .catch(error => {
          this.$notify({
            group: 'foo',
            title: 'Error!',
            text: error.response.data.message,
            type: 'error'
          })
        })
    },
    removeInstructor(i) {
      let newList = this.instructors.filter(e => {
        return e != i
      })
      this.instructors = newList
    },
    previewImage(value) {
      this.imageUrl = URL.createObjectURL(value)
    },
    saveImage(value) {
      this.imageUrl = value
      let data = {
        course_id: this.course_id,
        image_url: value
      }
      courseController.course
        .update(data)
        .then(() => {
          this.$notify({
            group: 'foo',
            title: 'Succes!',
            text: 'Course image saved',
            type: 'info'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Failed!',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    previewCourse() {
      const url = `/instructor/${this.$route.params.id}`
      window.open(url)
    },
    submitReview() {
      let data = {
        status: 0,
        course_id: this.$route.params.id
      }
      courseController.course
        .update(data)
        .then(() => {
          this.$notify({
            group: 'foo',
            title: 'Submission successful!',
            text: 'Course is now under review',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({ name: 'instructor-courses' })
          }, 2000)
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Submission failed!',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    updateLanding() {
      let data = {
        tags: this.tags,
        category_id: this.category_id,
        level_id: this.level_id,
        pricing: this.pricing,
        language: this.language,
        subtitle: this.subtitle,
        title: this.title,
        description: this.description,
        course_id: this.$route.params.id,
        instructors: this.instructors
      }
      this.processing = true
      courseController.course
        .update(data)
        .then(res => {
          this.oprocessing = false
          this.$notify({
            group: 'foo',
            title: 'Saved!',
            type: 'info'
          })
          this.e6 = 2
        })
        .catch(err => {
          this.oprocessing = false
        })
    },
    getCourse() {
      let course = this.$store.state.course.course
      this.subtitle = course.subtitle
      this.title = course.title
      this.tags = course.tags
      this.pricing = course.pricing
      this.level_id = course.level_id
      this.description = course.description
      this.language = course.language
      this.category_id = course.category_id
      this.imageUrl = course.image_url
      let instructors = JSON.parse(course.instructors)
      if (instructors) {
        this.instructors = instructors
      } else {
        let user = this.$store.state.user
        this.instructors.push({
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username
        })
      }
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
    },
    getImage() {
      this.imageUrl = this.$store.state.course.imageURL
    },
    getDetails() {
      let data = {
        directory: 'images/'
      }
      courseController.content
        .files(data)
        .then(res => {
          console.log(res.data.data)
        })
        .catch(error => {})
    },
    getPriceSetting() {
      let settings = this.$store.state.settings
      settings.forEach(setting => {
        if (setting.name == 'ALLOW_TUTOR_PRICE') {
          if (setting.value == 0) {
            this.allowPrice = false
          } else {
            this.allowPrice = true
          }
        }
      })
    }
  },
  created() {
    this.getImage()
    this.getCourse()
    this.getCategories()
    this.getLevels()
    this.getTags()
    // this.getDetails()
    this.getPriceSetting()
  }
}
</script>
