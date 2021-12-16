<template>
  <client-only>
    <div>
      <v-app dark v-if="course.id">
        <v-navigation-drawer
          v-model="drawer"
          :mini-variant="miniVariant"
          :clipped="clipped"
          fixed
          right
          :permanent="$vuetify.breakpoint.mdAndUp ? true : false"
          app
          width="350"
          bottom
        >
          <v-list>
            <div class="mt-10"></div>
            <v-subheader class="subtitle-1 font-weight-bold"
              >Course content</v-subheader
            >
            <v-divider></v-divider>
            <v-row justify="center">
              <v-expansion-panels multiple>
                <v-expansion-panel
                  v-for="(section, index) in course.sections"
                  :key="section.id"
                >
                  <v-expansion-panel-header class="font-weight-medium">
                    Section {{ index + 1 }}: {{ section.name }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list>
                      <v-list-item-group multiple active-class="pink--text">
                        <template v-for="(lesson, index) in section.contents">
                          <v-list-item :key="lesson.id">
                            <v-checkbox
                              v-model="selected"
                              :value="lesson.id"
                            ></v-checkbox>

                            <v-list-item-content
                              @click.prevent="playVideo(lesson)"
                            >
                              <v-list-item-subtitle
                                v-text="lesson.title"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                            &nbsp;
                            <v-icon v-if="!lesson.video"
                              >mdi-message-text</v-icon
                            >

                            <v-list-item-action v-if="lesson.video">
                              <v-list-item-action-text>
                                <DurationDisplay
                                  :duration="lesson.video.duration"
                                />
                              </v-list-item-action-text>
                            </v-list-item-action>
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
          </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="clipped" fixed app>
          <img v-if="$vuetify.theme.dark" width="120" src="/logo.png" />
          <img v-else width="120" src="/invoge-logo.png" />
          <v-btn icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-icon>mdi-weather-night</v-icon>
          </v-btn>
          <v-toolbar-title class="subtitle-2 mt-1" v-text="course.title" />
          <v-spacer />
          <div class="pointer" v-if="$vuetify.breakpoint.mdAndUp">
            <v-avatar size="32"
              ><v-icon> mdi-trophy-variant-outline</v-icon></v-avatar
            >
            Your Progress
          </div>
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-app-bar>
        <VideoPlayer
          justify="center"
          align="center"
          :key="currentVideo"
          v-if="currentVideo"
          :currentVideo="currentVideo"
          :width="
            $vuetify.breakpoint.mdAndUp
              ? '1024'
              : $vuetify.breakpoint.smAndDown
              ? '260'
              : '260'
          "
          :height="$vuetify.breakpoint.mdAndUp ? '450' : '250'"
        />
        <v-card
          :height="$vuetify.breakpoint.mdAndUp ? 450 : 250"
          v-else
          class="justify-center d-flex align-center"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            color="grey"
            indeterminate
          ></v-progress-circular>
        </v-card>

        <div>
          <v-tabs
            v-model="tab"
            background-color="transparent"
            class="v-tabs"
            color="basil"
            grow
          >
            <v-tab>
              Overview
            </v-tab>
            <v-tab>
              Other Resources
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat>
                <v-card-text> {{ course.overview }} </v-card-text>
                <v-divider></v-divider>
                <v-container v-if="meeting">
                  <v-col cols="12" lg="6">
                    <v-card-text class="pb-0 mb-0">
                      <span class="font-weight-black">Meeting ID:</span>
                      {{ meeting.meeting_id }}
                    </v-card-text>
                    <v-card-text class="">
                      <span class="font-weight-black">Meeting Password:</span>
                      {{ meeting.password }}
                    </v-card-text>
                    <v-btn
                      class="text-capitalize"
                      text
                      small
                      @click.prevent="enterMeeting(meeting.join_url)"
                    >
                      <v-icon color="success" x-small>mdi-circle</v-icon> Join
                      Live Class Now
                    </v-btn>
                  </v-col>
                </v-container>
                <v-container v-if="allow_review">
                  <v-card-text class="title"> Review this course </v-card-text>
                  <v-col cols="12" lg="6">
                    <star-rating
                      v-model="rating"
                      :increment="0.5"
                      class="mb-10"
                    />
                    <v-textarea
                      label="Leave a review"
                      v-model="comment"
                    ></v-textarea>
                    <v-btn @click.prevent="review" color="error">submit</v-btn>
                  </v-col>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <v-row>
                  <v-container>
                    <div>
                      <ul style="list-style: none;">
                        <li
                          v-for="(file, index) in currentFiles"
                          :key="file.id"
                        >
                          <a :href="file.url" download>
                            File {{ index + 1 }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </v-container>
                </v-row>
                <v-row>
                  <v-container>
                    <v-card-text v-html="currentText"></v-card-text>
                  </v-container>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <!-- <v-footer :fixed="fixed" app>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer> -->
      </v-app>
      <!-- <v-content v-else>
        <v-container class="justify-center">
          <v-row>
            <v-col>
              <div
                :class="
                  `font-weight-light text-center text ${
                    $vuetify.breakpoint.smAndDown ? 'headline' : 'display-1'
                  } mt-10`
                "
              >
                Course not found
                <p class="font-regular text--secondary mt-5 subtitle-1">
                  Once you enroll in this course, come here to learn about your
                  course.
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-content> -->
      <notifications group="foo" />
    </div>
  </client-only>
</template>

<script>
import api from '~/api/general'
import courseController from '~/api/student/courseController'
import MeetingController from '~/api/instructor/courseController'
import VideoPlayer from '@/components/VideoPlayer'

import DurationDisplay from '@/components/DurationDisplay'
export default {
  components: {
    DurationDisplay,
    VideoPlayer
  },
  middleware: ['student'],
  layout: 'studentSidebar',
  data() {
    return {
      currentVideo: '',
      tab: null,
      course: {},
      ready: false,
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Home',
      checked: '',
      selected: [],
      files: [],
      rating: 0,
      comment: 'Enter your review here',
      allow_review: false,
      meeting: {},
      currentText: '',
      currentFiles: []
    }
  },
  methods: {
    enterMeeting(url) {
      window.open(url)
    },
    markAsWatched() {},
    review() {
      let data = {
        body: this.comment,
        rating: this.rating,
        user_id: this.$store.state.user.id,
        course_id: this.$route.params.id
      }
      courseController.course
        .review(data)
        .then(() => {
          this.$notify({
            group: 'foo',
            title: 'Saved!!',
            text: 'Review saved',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'foo',
            title: 'Error!',
            text: 'Something went wrong',
            type: 'error'
          })
        })
    },
    playVideo(lesson) {
      this.currentText = lesson.text
      let video = lesson.video
      let files = lesson.documents
      this.currentFiles = files
      if (lesson.video !== null) {
        this.currentVideo = video.url
        this.ready = true
      } else {
        this.ready = true
      }
    },
    getCourse() {
      let data = {
        course_id: this.$route.params.id,
        id: this.$store.state.user.id
      }
      let settings = this.$store.state.settings
      settings.forEach(setting => {
        if (setting.name == 'ENABLE_REVIEW') {
          setting.value == 1
            ? (this.allow_review = true)
            : (this.allow_review = false)
        }
      })
      courseController.course.show(data).then(res => {
        let course = res.data.data
        this.course = course
        this.currentVideo = course.sections[0].contents[0].video.url
        // this.rating = course.review.rating
        // this.comment = course.review.body
      })
    },
    getMeeting() {
      MeetingController.meeting.get(this.$route.params.id).then(res => {
        this.meeting = res.data.data
      })
    }
  },
  created() {
    this.getCourse()
    this.getMeeting()
  },
  computed: {
    videos() {
      return this.files.filter(file => {
        return file.video == true
      })
    }
  }
}
</script>
