<template>
  <client-only>
    <v-container>
      <v-row>
        <v-col>
          <div class="font-weight-regular headline">Curriculum</div>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-flex class="mt-10">
        <v-row>
          <v-alert dismissible type="info" text>
            Here’s where you add course content—like lectures, course sections,
            assignments, and more. Click a + icon on the left to get started.
          </v-alert>
        </v-row>

        <div class="container-fluid">
          <v-row>
            Start putting together your course by creating sections, lectures
            and practice (quizzes, coding exercises and assignments).
            <br />
            <span class="mt-5">
              If you’re intending to offer your course for free, the total
              length of video content must be less than 2 hours.
            </span>
          </v-row>
        </div>

        <div class="mt-10">
          <div class="text-center d-flex pb-4">
            <v-btn @click.prevent="sectionModal" class="text-capitalize"
              ><v-icon>mdi-plus</v-icon> Add section</v-btn
            >
          </div>
          <v-row justify="center">
            <v-expansion-panels popout>
              <v-expansion-panel
                v-for="(section, index) in sections"
                :key="section.id"
              >
                <v-expansion-panel-header>
                  <span class="row" @click="toggleOff()">
                    <v-card-title class="body-1"
                      >Section {{ index + 1 }}: {{ section.name }}
                      <v-icon
                        @click.prevent="editSection(section)"
                        class="ml-3 pointer"
                        small
                        >mdi-pencil-outline</v-icon
                      >
                      &nbsp;
                      <v-icon
                        @click.prevent="deleteSection(section.id)"
                        class="pointer"
                        small
                        >mdi-trash-can-outline</v-icon
                      >
                    </v-card-title>
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-timeline
                    :align-top="alignTop"
                    :dense="dense"
                    :reverse="reverse"
                  >
                    <v-timeline-item
                      v-for="n in 1"
                      :key="n"
                      :icon="icon ? 'mdi-plus' : ''"
                      color="grey"
                      :small="small"
                    >
                      <div class="text-center d-flex pb-4">
                        <v-btn
                          @click="lessonModal(section.id)"
                          class="text-capitalize"
                          ><v-icon>mdi-plus</v-icon> Add Lesson</v-btn
                        >
                      </div>
                      <v-card
                        class="elevation-2 mb-5"
                        v-for="(lesson, index) in section.contents"
                        :key="lesson.id"
                      >
                        <span class="row">
                          <v-card-title class="body-1"
                            >Lesson {{ index + 1 }}: {{ lesson.title }}
                            <v-icon
                              @click="editLesson(lesson)"
                              class="ml-3 pointer"
                              small
                              >mdi-pencil-outline</v-icon
                            >
                            &nbsp;
                            <v-icon
                              @click.prevent="
                                deleteLesson(lesson.id, section.id)
                              "
                              class="pointer mr-10"
                              small
                              >mdi-trash-can-outline</v-icon
                            >
                            <span small class="mr-3">
                              <v-btn
                                outlined
                                @click.prevent="showUpload(section, lesson)"
                                class="text-capitalize"
                              >
                                <v-icon>mdi-plus</v-icon> content
                              </v-btn>
                            </span>
                            <!-- <span small v-if="currentLesson == lesson.id">
                              <v-btn
                                outlined
                                @click.prevent="closeItems"
                                class="text-capitalize"
                              >
                                <v-icon>mdi-close</v-icon> close
                              </v-btn>
                            </span> -->
                          </v-card-title>
                        </span>
                        <!-- current content starts here -->
                        <div
                          class="mb-10"
                          v-if="currentVideo || currentDocuments.length > 0"
                        >
                          <div v-if="currentLesson == lesson.id">
                            <div class="mt-2 caption text-center">
                              These are the current files under this lesson
                            </div>
                            <div class="d-flex justify-center py-5">
                              <v-badge color="none" overlap class="mr-5">
                                <v-btn
                                  v-if="currentVideo"
                                  icon
                                  slot="badge"
                                  @click.prevent="
                                    confirmDelete(currentVideo, 'videos')
                                  "
                                >
                                  <v-icon>mdi-trash-can-outline</v-icon>
                                </v-btn>
                                <VideoPlayer
                                  v-if="currentVideo"
                                  :currentVideo="currentVideo"
                                  height="100"
                                  width="200"
                                />
                              </v-badge>
                              <span
                                v-for="file in currentDocuments"
                                :key="file.id"
                              >
                                <v-badge color="none" overlap>
                                  <v-btn
                                    icon
                                    slot="badge"
                                    @click.prevent="
                                      confirmDelete(file.url, 'documents')
                                    "
                                  >
                                    <v-icon>mdi-trash-can-outline</v-icon>
                                  </v-btn>

                                  <a :href="file.url" download>
                                    <img
                                      height="100"
                                      width="100"
                                      src="/file.png"
                                      alt=""
                                    />
                                  </a>
                                </v-badge>
                              </span>
                            </div>
                          </div>
                        </div>
                        <!-- current content ends here -->
                        <!-- content upload starts here -->
                        <div
                          v-if="currentLesson == lesson.id"
                          class="mt-2 caption text-center"
                        >
                          Select the main type of content. Files and links can
                          be added as resources.
                          <br />
                          <span color="red">
                            Uploading a new file replaces the existing file type
                          </span>
                        </div>
                        <div
                          class="d-flex justify-center py-5"
                          v-if="currentLesson == lesson.id"
                        >
                          <v-img
                            @click="showFileCard('video')"
                            :max-height="70"
                            :max-width="70"
                            aspect-ratio="1"
                            class="grey lighten-2 mr-5 pointer"
                          >
                            <template v-slot:placeholder>
                              <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                              >
                                <v-icon>mdi-google-play</v-icon>
                                <span class="text--disabled caption"
                                  >Video</span
                                >
                              </v-row>
                            </template>
                          </v-img>

                          <v-img
                            @click="showFileCard('doc')"
                            :max-height="70"
                            :max-width="70"
                            aspect-ratio="1"
                            class="grey lighten-2 mr-5 pointer"
                          >
                            <template v-slot:placeholder>
                              <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                              >
                                <v-icon>mdi-file-document-edit-outline</v-icon>
                                <span class="text--disabled caption">Docs</span>
                              </v-row>
                            </template>
                          </v-img>
                          <v-img
                            @click="dialog = !dialog"
                            :max-height="70"
                            :max-width="70"
                            aspect-ratio="1"
                            class="grey lighten-2 mr-5 pointer"
                          >
                            <template v-slot:placeholder>
                              <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                              >
                                <v-icon>mdi-signature-text</v-icon>
                                <span class="text--disabled caption">Text</span>
                              </v-row>
                            </template>
                          </v-img>
                        </div>
                        <div
                          class="d-flex justify-center mt-10"
                          v-if="type && currentLesson == lesson.id"
                        >
                          <v-col cols="12" sm="9" md="10">
                            <S3FileUpload
                              @reload="refresh()"
                              :currentFile="currentFile"
                              :courseId="course_id"
                              :contentId="lesson.id"
                              :rules="rules"
                              @upload="saveFile"
                              :buttonText="buttonText"
                              :directory="directory"
                              :label="label"
                              :contentType="contentType"
                            />
                          </v-col>
                        </div>
                        <!-- content ends here -->
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <v-card flat class="mt-5">
            <v-row>
              <v-col cols="6">
                <div class="d-flex justify-start">
                  <v-btn
                    class="text-capitalize"
                    @click.prevent="gotoIndex"
                    :large="$vuetify.breakpoint.smAndDown ? false : true"
                    color="error"
                  >
                    Previous</v-btn
                  >
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex justify-end">
                  <v-btn
                    class="text-capitalize"
                    @click.prevent="goToLanding"
                    :large="$vuetify.breakpoint.smAndDown ? false : true"
                    color="error"
                    >Continue</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-flex>

      <!-- modal dialog -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="700px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ header }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <!-- <v-row> -->
                <vue-editor v-model="form.text"> </vue-editor>

                <!-- </v-row> -->
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false"
                >Close</v-btn
              >
              <v-btn
                color="blue darken-1"
                text
                :disabled="saving"
                @click.prevent="updateLessonText"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- end dialog -->

      <!-- Section modal dialog -->
      <v-row justify="center">
        <v-dialog v-model="sectionDialog" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{
                sectionEdit ? 'Edit Section' : 'New Section'
              }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <!-- <v-row> -->
                <v-row>
                  <v-col class="py-0" cols="12">
                    <v-text-field
                      label="Section Name"
                      v-model="form.name"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- </v-row> -->
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="sectionDialog = false"
                >Close</v-btn
              >
              <v-btn
                :disabled="saving"
                v-if="!sectionEdit"
                color="blue darken-1"
                text
                @click.prevent="createSection"
                >Save</v-btn
              >
              <v-btn
                v-else
                color="blue darken-1"
                text
                @click.prevent="updateSection"
                >Update</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- end dialog -->

      <!-- Lesson modal dialog -->
      <v-row justify="center">
        <v-dialog v-model="lessonDialog" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{
                lessonEdit ? 'Edit Lesson' : 'New Lesson'
              }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <!-- <v-row> -->
                <v-row>
                  <v-col class="py-0" cols="12">
                    <v-text-field
                      label="Lesson title"
                      v-model="form.title"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="py-0" cols="12">
                    <v-text-field
                      type="number"
                      label="Lesson duration (in seconds)"
                      v-model="form.duration"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- </v-row> -->
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="lessonDialog = false"
                >Close</v-btn
              >
              <v-btn
                v-if="lessonEdit"
                color="blue darken-1"
                text
                @click.prevent="updateLesson"
                >Update</v-btn
              >
              <v-btn
                v-else
                :disabled="saving"
                color="blue darken-1"
                text
                @click.prevent="createLesson"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- end dialog -->

      <v-row justify="center">
        <v-dialog v-model="fileDialog" persistent max-width="500px">
          <v-card class="text-center">
            <v-card-title>
              <span class="headline"> Delete current File?</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="!deleting"
                color="blue darken-1"
                text
                @click="noDeleteFile()"
                >No</v-btn
              >

              <v-btn
                v-if="!deleting"
                color="blue darken-1"
                text
                @click.prevent="deleteFile()"
                >Yes</v-btn
              >
              <v-btn v-else color="blue darken-1" :loading="true" disabled
                ><v-icon dark>mdi-cloud-upload</v-icon></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>
import api from '~/api/general'
import { Form } from 'vform'
import courseController from '~/api/instructor/courseController'
import S3FileUpload from '@/components/S3FileUpload'
import VideoPlayer from '@/components/VideoPlayer'
export default {
  components: {
    S3FileUpload,
    VideoPlayer
  },
  data() {
    return {
      rules: '',
      contentType: '',
      currentFile: null,
      label: '',
      buttonText: '',
      directory: '',
      type: false,
      alignTop: false,
      fileDialog: false,
      show: false,
      dense: true,
      icon: true,
      left: false,
      course_id: this.$route.params.id,
      reverse: false,
      right: false,
      small: true,
      dialog: false,
      status: false,
      saving: false,
      sectionDialog: false,
      sectionEdit: false,
      lessonDialog: false,
      lessonEdit: false,
      processing: false,
      deleting: false,
      content: '',
      currentSection: '',
      currentLesson: '',
      sections: [],
      lessons: [],
      files: [],
      header: '',
      form: new Form({
        name: '',
        id: '',
        title: '',
        text: '',
        duration: ''
      }),
      video: {},
      currentVideo: null,
      currentDocuments: []
    }
  },
  methods: {
    goToLanding() {
      this.$router.push({
        name: 'management-courses-create-id-content-landing'
      })
    },
    gotoIndex() {
      this.$router.push({ name: 'management-courses-create-id-content' })
    },
    confirmDelete(url, directory) {
      this.currentFile = url
      this.fileDialog = true
      this.directory = directory
    },
    noDeleteFile() {
      this.fileDialog = false
    },
    async deleteFile(url, content) {
      try {
        this.deleting = true
        let key = this.currentFile.split('.com/').pop()
        let data = {
          oldFile: key,
          courseId: this.course_id,
          contentId: this.currentLesson,
          directory: this.directory
        }
        let response = await courseController.content.files(data)
        this.showUpload(this.currentSection, this.currentLesson)
        this.deleting = false
        this.fileDialog = false
        this.getFiles(this.currentSection, this.currentLesson)
        this.$notify({
          title: 'Success',
          text: 'file deleted',
          group: 'foo',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
        this.fileDialog = false
        this.deleting = false
        this.$notify({
          title: 'Failed',
          text: 'Something went wrong',
          group: 'foo',
          type: 'error'
        })
      }
    },
    toggleOff() {
      ;(this.show = false), (this.type = false)
    },
    saveFile(value, file) {
      this.imageUrl = value
      let data = {
        course_id: this.$route.params.id,
        image_url: value
      }
    },
    showUpload(section, lesson) {
      this.currentVideo = null
      this.currentFile = null
      this.getFiles(section.id, lesson.id)
      this.currentLesson = lesson.id
      this.currentSection = section.id
      this.header = `${lesson.title}`
      this.form.text = lesson.text
      this.show = true
      // let files = this.files
      this.files.forEach(file => {
        if (file.content_id === lesson.id && file.video) {
          if (file.url != null) {
            this.currentVideo = file.url
          }
        }
      })
      let documents = this.files.filter(file => {
        return file.document && file.content_id == lesson.id
      })
      this.currentDocuments = documents
    },
    sectionModal() {
      this.form.reset()
      this.sectionEdit = false
      this.sectionDialog = true
    },
    createSection() {
      this.processing = true
      let data = {
        name: this.form.name,
        course_id: this.course_id
      }
      this.saving = true
      courseController.section
        .create(data)
        .then(res => {
          this.sectionDialog = false
          this.processing = false
          this.saving = false
          this.$notify({
            group: 'foo',
            title: 'Success!',
            text: 'Section created successfully',
            type: 'success'
          })
          this.getSections()
        })
        .catch(err => {
          this.sectionDialog = false
          this.processing = false
          this.saving = false
          this.$notify({
            group: 'foo',
            title: 'Error!',
            text: 'Error creating section',
            type: 'error'
          })
        })
    },
    updateSection() {
      this.processing = true
      let data = {
        id: this.form.id,
        name: this.form.name,
        course_id: this.course_id
      }
      courseController.section
        .update(data)
        .then(res => {
          this.sectionDialog = false
          this.processing = false
          this.getSections()
          this.$notify({
            group: 'foo',
            title: 'Success!',
            text: 'Section update successful',
            type: 'success'
          })
        })
        .catch(err => {
          this.sectionDialog = false
          this.processing = false
          this.$notify({
            group: 'foo',
            title: 'Error!',
            text: 'Error updating section',
            type: 'error'
          })
        })
    },
    deleteSection(id) {
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
          this.processing = true
          courseController.section
            .delete(id, this.course_id)
            .then(res => {
              this.processing = false
              this.getSections()
              this.$notify({
                group: 'foo',
                title: 'Success!',
                text: 'Section deleted successfully',
                type: 'success'
              })
            })
            .catch(err => {
              this.processing = false
              this.$notify({
                group: 'foo',
                title: 'Error!',
                text: 'Error deleting section',
                type: 'error'
              })
            })
        }
      })
    },
    editSection(section) {
      this.form.reset()
      this.sectionEdit = true
      this.sectionDialog = true
      this.form.fill(section)
    },
    lessonModal(id) {
      this.form.reset()
      this.lessonEdit = false
      this.lessonDialog = true
      this.currentSection = id
    },
    createLesson() {
      this.processing = true
      this.saving = true
      let data = {
        title: this.form.title,
        duration: this.form.duration,
        course_id: this.course_id,
        section_id: this.currentSection
      }
      courseController.content
        .create(data)
        .then(res => {
          this.lessonDialog = false
          this.processing = false
          this.saving = false
          this.$notify({
            group: 'foo',
            title: 'Success!',
            text: 'Lesson created successfully',
            type: 'success'
          })
          this.getSections()
        })
        .catch(err => {
          this.lessonDialog = false
          this.processing = false
          this.saving = false
          this.$notify({
            group: 'foo',
            title: 'Error!',
            text: 'Error creating lesson',
            type: 'error'
          })
        })
    },
    updateLesson() {
      this.processing = true
      let data = {
        id: this.form.id,
        title: this.form.title,
        duration: this.form.duration,
        course_id: this.course_id,
        section_id: this.currentSection
      }
      courseController.content
        .update(data)
        .then(res => {
          this.lessonDialog = false
          this.processing = false
          this.getSections()
          this.$notify({
            group: 'foo',
            title: 'Success!',
            text: 'Lesson update successful',
            type: 'success'
          })
        })
        .catch(err => {
          this.lessonDialog = false
          this.processing = false
          this.$notify({
            group: 'foo',
            title: 'Error!',
            text: 'Error updating lesson',
            type: 'error'
          })
        })
    },
    updateLessonText() {
      this.processing = true
      this.saving = true
      let data = {
        course_id: this.course_id,
        text: this.form.text,
        section_id: this.currentSection,
        id: this.currentLesson
      }
      courseController.content
        .update(data)
        .then(res => {
          this.dialog = false
          this.processing = false
          this.saving = false
          this.getSections()
          this.$notify({
            group: 'foo',
            title: 'Success!',
            text: 'Text content update successful',
            type: 'success'
          })
        })
        .catch(err => {
          this.dialog = false
          this.processing = false
          this.saving = false
          this.$notify({
            group: 'foo',
            title: 'Error!',
            text: 'Error updating text content',
            type: 'error'
          })
        })
    },
    deleteLesson(id, section) {
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
          courseController.content
            .delete(id, section, this.course_id)
            .then(res => {
              this.processing = false
              this.getSections()
              this.$notify({
                group: 'foo',
                title: 'Success!',
                text: 'Lesson deleted successfully',
                type: 'success'
              })
            })
            .catch(err => {
              this.processing = false
              this.$notify({
                group: 'foo',
                title: 'Error!',
                text: 'Error deleting lesson',
                type: 'error'
              })
            })
        }
      })
    },
    editLesson(lesson) {
      this.form.reset()
      this.lessonEdit = true
      this.currentSection = lesson.section_id
      this.lessonDialog = true
      this.form.fill(lesson)
    },
    showFileCard(type) {
      // this.show = !this.show
      // this.type = !this.type
      this.type = type

      if (type == 'video') {
        this.rules = '.mp4, .3gp, .webm'
        this.label = 'Lesson video'
        this.buttonText = 'Save video'
        this.directory = 'videos'
        this.contentType = 'video'
        let currentFile = this.currentVideo
        this.currentFile = currentFile
      }
      if (type == 'doc') {
        this.rules = '.pdf, .docx, .doc'
        this.label = 'Lesson document'
        this.buttonText = 'Save file'
        this.directory = 'documents'
        this.contentType = 'document'
      }
    },
    closeItems() {
      this.show = false
      this.type = false
    },
    getSections() {
      courseController.section.show({ course_id: this.course_id }).then(res => {
        this.sections = res.data.data
      })
    },
    getFiles(section, content) {
      let data = {
        course_id: this.course_id
      }
      api.course.contents(data).then(res => {
        let files = res.data.data
        this.files = files
        this.currentSection = section
        this.currentLesson = content
      })
    },
    refresh() {
      this.getSections()
      this.getFiles(this.currentSection, this.currentLesson)
    }
  },
  created() {
    this.getSections()
    this.getFiles(null, null)
  }
}
</script>
