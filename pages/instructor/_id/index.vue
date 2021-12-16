<template>
  <client-only>
    <div>
      <div v-if="!course.title" class="d-flex justify-center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
      </div>

      <div v-else>
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
                        course.students ? course.students.length : 0
                      }}
                      ratings)
                    </span>
                  </div>
                </v-card-text>
                <v-card-text class="pt-0">
                  <div class="">
                    {{ course.students ? course.students.length : 0 }}
                    students enrolled
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
                  v-if="course.image_url"
                  :src="course.image_url"
                />
                <v-img
                  width="100%"
                  max-height="300"
                  v-else
                  src="/placeholder.png"
                />
              </v-col>
            </v-row>
          </div>
        </v-card>
        <!-- <v-content> -->
        <v-container>
          <v-card flat class="col-12 col-lg-8">
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
          </v-card>
          <v-card flat class="col-12 col-lg-8">
            <v-row>
              <v-card-text class="title font-weight-medium">
                Requirements
              </v-card-text>
            </v-row>
            <v-row>
              <v-card-text v-html="course.prerequisites"></v-card-text>
            </v-row>
          </v-card>
          <v-card flat class="col-12 col-lg-8">
            <v-row>
              <v-card-text class="title font-weight-medium">
                Description
              </v-card-text>
            </v-row>
            <v-row>
              <v-card-text v-html="course.description"></v-card-text>
            </v-row>
          </v-card>
        </v-container>
        <!-- </v-content> -->
      </div>
    </div>
  </client-only>
</template>

<script>
import api from '~/api/general'
import DurationDisplay from '@/components/DurationDisplay'
import instructor from '../../../middleware/instructor'
export default {
  components: {
    DurationDisplay
  },
  async validate({ params, query, store }) {
    // await operations
    return true
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
      key: process.env.MIX_PAYSTACK_PUBLIC_KEY,
      selected: [2]
    }
  },
  methods: {
    initiateTransaction(ref) {
      let data = {
        reference: ref,
        email: this.user.email,
        fees: 0,
        amount: this.totalPrice,
        details: this.cartItems,
        type: 'initial'
      }

      AR.callback(data).then(res => {})
    },
    getCourse() {
      let data = {
        course_id: this.course_id
      }
      api.course
        .show(data)
        .then(res => {
          let course = res.data.data
          this.instructors = JSON.parse(course.instructors)
          if (!course.instructors) {
            this.instructors = []
          }
          this.course = course
        })
        .catch(err => {
          console.log(err)
          window.location = '/'
        })
    }
  },
  created() {
    this.getCourse()
  },
  computed: {
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
