<template>
  <client-only>
    <div>
      <div v-if="course.title">
        <v-card>
          <div
            :class="$vuetify.breakpoint.mdAndUp ? 'px-10 ml-10 py-10' : 'px-3'"
          >
            <v-row
              :class="
                `${$vuetify.breakpoint.smAndDown ? 'flex-column-reverse' : ''}`
              "
            >
              <v-col :cols="$vuetify.breakpoint.mdAndUp ? 6 : 12">
                <v-card-text class="py-0 mb-n5">
                  <div
                    :class="
                      $vuetify.breakpoint.smAndDown
                        ? 'subtitle-1'
                        : 'display-1 font-weight-medium'
                    "
                  >
                    {{ course.title }}
                  </div>
                  <div
                    :class="
                      $vuetify.breakpoint.mdAndUp ? 'title' : 'caption py-0'
                    "
                  >
                    {{ course.subtitle }}
                  </div>
                </v-card-text>
                <v-card-text
                  :class="
                    $vuetify.breakpoint.mdAndUp ? 'px-6 pb-0' : 'px-6 pb-0'
                  "
                >
                  <div class="row">
                    <v-rating
                      color="yellow accent-4 "
                      dense
                      half-increments
                      readonly
                      :value="course.rating"
                      size="18"
                    ></v-rating>
                    <span class="caption mt-1 text--grey">
                      {{ course.rating }} ({{
                        course.reviews ? course.reviews.length : 0
                      }}
                      ratings)
                    </span>
                  </div>
                </v-card-text>
                <v-card-text class="pt-0">
                  <div class="">
                    {{ course.students ? course.students.length : 0 }} students
                    enrolled
                  </div>
                  <div class=" caption px-0 text--grey">
                    Created by
                    <span v-for="i in formatedInstructors" :key="i.username">
                      {{ i.name }}
                    </span>
                  </div>
                  <div
                    :class="
                      `${
                        $vuetify.breakpoint.mdAndUp ? 'body-2' : 'caption'
                      } px-0 text--grey`
                    "
                  >
                    <v-icon class="body-2">mdi-information</v-icon> Last update
                    {{ course.last_update }}
                  </div>
                  <div
                    :class="
                      `${
                        $vuetify.breakpoint.mdAndUp ? 'body-2' : 'caption'
                      } px-0 text--grey`
                    "
                  >
                    <v-icon class="body-2">mdi-web</v-icon>
                    {{ course.language }}
                  </div>
                  <div class=" caption px-0 text--grey" v-if="course.pricing">
                    <span
                      :class="
                        `mr-2 ${
                          $vuetify.breakpoint.mdAndUp ? 'title' : 'subtitle'
                        } font-weight-bold`
                      "
                      >{{ formatedPricing }}</span
                    >
                  </div>
                </v-card-text>
              </v-col>
              <v-col
                :class="
                  `${
                    $vuetify.breakpoint.mdAndUp ? 'pb-0' : 'py-0'
                  } d-flex justify-end`
                "
                :cols="$vuetify.breakpoint.mdAndUp ? '4' : '12'"
              >
                <v-img
                  width="100%"
                  max-height="300"
                  :src="
                    course.image_url ? course.image_url : '/placeholder.png'
                  "
                />
              </v-col>
            </v-row>
            <v-row
              :class="
                `d-flex py-0 ${
                  $vuetify.breakpoint.mdAndUp ? 'justify-end' : 'px-5'
                }`
              "
            >
              <v-col cols="12" lg="6">
                <!-- <v-btn large dark color="red" class="text-capitalize mr-3"
                  >Add to cart</v-btn
                > -->

                <span
                  @click.prevent="initiateTransaction(reference, null)"
                  v-if="user && course.pricing > 0 && !owned"
                >
                  <paystack
                    style="background: #ff5252 !important; padding: 0 19.5555555556px; color: white; border; height: 44px; min-width: 78px;"
                    class="text-capitalize btn btn-primary mr-3"
                    :amount="course.pricing * 100"
                    :email="user.email"
                    :paystackkey="key"
                    :reference="reference"
                    :callback="callback"
                    :close="close"
                    :embed="false"
                  >
                    Buy Now
                  </paystack>
                </span>

                <span
                  @click.prevent="initiateTransaction(reference, 'free')"
                  v-if="user && course.pricing < 1"
                >
                  <v-btn
                    :disabled="owned"
                    large
                    color="success"
                    class="text-capitalize btn mr-3"
                  >
                    Enroll Now
                  </v-btn>
                </span>

                <v-btn
                  v-if="!user"
                  large
                  nuxt
                  to="/login"
                  color="error"
                  class="text-capitalize btn mr-3"
                  >Buy Now</v-btn
                >
              </v-col>
            </v-row>
          </div>
        </v-card>
        <!-- <v-content> -->
        <v-container>
          <div flat class="col-12 col-lg-8">
            <v-row>
              <v-card-text class="title font-weight-medium">
                Course Content
              </v-card-text>
            </v-row>
            <v-row justify="center">
              <v-expansion-panels focusable popout multiple>
                <v-expansion-panel
                  v-for="section in course.sections"
                  :key="section.id"
                >
                  <v-expansion-panel-header>
                    {{ section.name }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list>
                      <v-list-item-group
                        v-model="selected"
                        multiple
                        active-class="pink--text"
                      >
                        <template v-for="(lesson, index) in section.contents">
                          <v-list-item :key="lesson.id">
                            <template v-slot:default="{ active, toggle }">
                              <v-list-item-content>
                                <v-list-item-subtitle
                                  v-text="lesson.title"
                                ></v-list-item-subtitle>
                              </v-list-item-content>

                              <v-list-item-action v-if="lesson.video">
                                <v-list-item-action-text>
                                  <DurationDisplay
                                    :duration="lesson.video.duration"
                                  />
                                </v-list-item-action-text>
                              </v-list-item-action>
                            </template>
                          </v-list-item>

                          <v-divider
                            v-if="index + 1 < section.contents.length"
                            :key="index"
                          ></v-divider>
                        </template>
                      </v-list-item-group>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </div>
          <div flat class="col-12 col-lg-8">
            <v-row>
              <v-card-text class="title font-weight-medium">
                Requirements
              </v-card-text>
            </v-row>
            <v-row>
              <v-card-text v-html="course.prerequisites"></v-card-text>
            </v-row>
          </div>
          <div flat class="col-12 col-lg-8">
            <v-row>
              <v-card-text class="title font-weight-medium">
                Description
              </v-card-text>
            </v-row>
            <v-row>
              <v-card-text v-html="course.description"></v-card-text>
            </v-row>
          </div>
        </v-container>
        <!-- </v-content> -->
      </div>
      <div v-else class="d-flex justify-center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
      </div>
      <notifications group="foo" />
    </div>
  </client-only>
</template>

<script>
import api from '~/api/general'
import courseController from '~/api/student/courseController'
import DurationDisplay from '@/components/DurationDisplay'
export default {
  async validate({ params, query, store }) {
    // await operations
    return true
  },
  components: {
    DurationDisplay
  },
  data() {
    return {
      items: ['Newest', 'Popular'],
      courses: [],
      instructors: [],
      course: {},
      user: this.$store.state.user,
      deleteNotification: false,
      course_id: this.$route.params.id,
      currency: process.env.CURRENCY,
      key: this.$store.state.PKEY,
      selected: [2],
      studentCourses: [],
      owned: false
    }
  },
  methods: {
    initiateTransaction(ref, role) {
      let user = this.$store.state.user
      if (user) {
        let data = {
          reference: ref,
          email: this.user.email,
          fees: 0,
          amount: parseFloat(this.course.pricing),
          course_id: this.course_id,
          type: 'initial',
          role: role
        }

        courseController.course.buy(data).then(res => {
          if (data.role == 'free') {
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Enrollment Successful',
              type: 'success'
            })
            window.location = '/student'
          }
        })
      } else {
        return redirect('/login')
      }
    },
    callback: function(response) {
      if (response.message === 'Approved' && response.status === 'success') {
        response.email = this.user.email
        response.course_id = this.course_id
        response.role = 'paid'
        courseController.course
          .buy(response)
          .then(res => {
            this.$notify({
              group: 'foo',
              title: 'Success',
              text: 'Enrollment Successful',
              type: 'success'
            })
            window.location = '/student'
          })
          .catch(err => {
            this.$notify({
              group: 'foo',
              title: 'Failed!',
              text: 'Enrollment Failed',
              type: 'error'
            })
          })
      } else {
      }
    },
    close: function() {
      console.log('Payment closed')
    },
    getCourse() {
      let data = {
        course_id: this.course_id
      }
      api.course
        .show(data)
        .then(res => {
          let course = res.data.data
          if (course.status == 2) {
            this.instructors = JSON.parse(course.instructors)
            if (!course.instructors) {
              this.instructors = []
            }
            this.course = course
            if (this.user) {
              this.getStudentCourses()
            }
          } else {
            window.location = '/'
            this.course = null
          }
        })
        .catch(err => {
          console.log(err)
          window.location = '/'
        })
    },
    getStudentCourses() {
      let data = {
        id: this.user.id
      }
      courseController.course.index(data).then(res => {
        let studentCourses = res.data.data
        studentCourses.forEach(course => {
          if (course.id == this.course_id) {
            this.owned = true
          }
        })
      })
    }
  },
  created() {
    this.getCourse()
  },
  computed: {
    reference() {
      let text = ''
      let possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))

      return text
    },
    formatedInstructors() {
      return this.instructors.filter(i => {
        return (i.name =
          i.first_name +
          ' ' +
          i.last_name +
          (i != this.instructors[this.instructors.length - 1] ? ',' : ''))
      })
    },
    formatedPricing() {
      let price = this.course.pricing
      if (price > 0) {
        return (
          this.currency +
          parseFloat(price)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
        )
      } else return 'FREE'
    }
  }
}
</script>
