<template>
  <client-only>
    <v-container>
      <v-row>
        <v-col>
          <div class="font-weight-regular headline">
            {{ section.name }}
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <div class="mt-10">
        <div class="text-center d-flex pb-4">
          <v-btn @click="lessonModal()" class="text-capitalize"
            ><v-icon>mdi-plus</v-icon> Add Lesson</v-btn
          >
        </div>

        <v-row
          v-for="(lesson, index) in section.contents"
          :key="lesson.id"
          class="pb-0 b-shade"
        >
          <v-card flat width="1200" min-width="260">
            <v-card-text class="pb-0 font-weight-bold text-dark">
              <div class="overline">Lesson {{ index + 1 }}</div>
              {{ lesson.title }}
              <v-icon @click.prevent="editLesson(lesson)" class="pointer" small
                >mdi-pencil-outline</v-icon
              >
              <div class="overline mt-2">
                <span class="pointer" @click.prevent="deleteLesson(lesson.id)">
                  <v-icon color="error" small>mdi-trash-can-outline</v-icon>
                  delete </span
                >&nbsp;
                <span small>
                  <v-btn
                    small
                    @click.prevent="showUpload(lesson)"
                    class="text-capitalize"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add content
                  </v-btn>
                </span>
              </div>
            </v-card-text>
            <div class="container">
              <!-- current content starts here -->
              <div v-if="lesson.video || lesson.documents.length > 0">
                <div>
                  <div class="d-flex justify-center pt-3">
                    <v-row class="px-5">
                      <v-badge color="none" overlap class="mr-5 mb-3">
                        <v-btn
                          v-if="lesson.video"
                          icon
                          slot="badge"
                          @click.prevent="
                            confirmDelete(lesson.video.url, lesson.id, 'videos')
                          "
                        >
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                        <VideoPlayer
                          v-if="lesson.video"
                          :currentVideo="lesson.video.url"
                          height="100"
                          width="200"
                        />
                      </v-badge>
                      <span
                        class="ml-3"
                        v-for="file in lesson.documents"
                        :key="file.id"
                      >
                        <v-badge color="none" overlap class="mr-6">
                          <v-btn
                            icon
                            slot="badge"
                            @click.prevent="
                              confirmDelete(file.url, lesson.id, 'documents')
                            "
                          >
                            <v-icon>mdi-trash-can-outline</v-icon>
                          </v-btn>

                          <a :href="file.url" download>
                            <img
                              height="50"
                              width="50"
                              src="/file.png"
                              alt=""
                            />
                          </a>
                        </v-badge>
                      </span>
                    </v-row>
                  </div>
                </div>
              </div>
              <!-- current content ends here -->
              <!-- content upload starts here -->
              <div v-if="currentLesson == lesson.id" class="caption px-5 mt-2">
                Select the type of content.
              </div>
              <div class="d-flex" v-if="currentLesson == lesson.id">
                <v-card
                  flat
                  @click="showFileCard('video')"
                  :max-height="70"
                  :max-width="100"
                  class="ma-3"
                >
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-icon>mdi-google-play</v-icon>
                    <span class="text--disabled caption">Video</span>
                  </v-row>
                </v-card>

                <v-card
                  flat
                  @click="showFileCard('doc')"
                  :max-height="70"
                  :max-width="100"
                  class="ma-3"
                >
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-icon>mdi-file-document-edit-outline</v-icon>
                    <span class="text--disabled caption">Docs</span>
                  </v-row>
                </v-card>
                <v-card
                  flat
                  @click="dialog = !dialog"
                  :max-height="70"
                  :max-width="100"
                  class="ma-3"
                >
                  <v-row class="fill-height ma-0" justify="center">
                    <v-icon>mdi-signature-text</v-icon>
                    <span class="text--disabled caption">Text</span>
                  </v-row>
                </v-card>
              </div>
              <div v-if="type && currentLesson == lesson.id">
                <v-col cols="12" lg="8" sm="9" md="10">
                  <S3FileUpload
                    @storeLength="saveVideoLength"
                    @uploadFailed="uploadFailure"
                    @reload="refreshSection"
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
            </div>
          </v-card>
        </v-row>

        <!-- navigation starts -->
        <v-row>
          <div flat class="mt-5">
            <v-col cols="6">
              <div class="d-flex justify-start">
                <v-btn
                  text
                  class="text-capitalize"
                  @click.prevent="gotoCurr"
                  :large="$vuetify.breakpoint.smAndDown ? false : true"
                  color="error"
                >
                  < Back</v-btn
                >
              </div>
            </v-col>
          </div>
        </v-row>
        <!-- navigation ends -->
      </div>
      <!-- modal dialog -->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent>
          <v-card flat>
            <v-card-title>
              <span class="headline">{{ header }}</span>
            </v-card-title>
            <v-card-text class="px-0">
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
      section_id: this.$route.params.section_id,
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
      currentLesson: '',
      section: {},
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
    saveVideoLength(length) {
      let data = {
        id: this.currentLesson,
        course_id: this.course_id,
        section_id: this.section_id,
        duration: length
      }
      courseController.content
        .update(data)
        .then(res => {
          console.log('saved')
        })
        .catch(err => {
          console.log(err)
        })
    },
    uploadFailure() {
      this.getSection()
      return this.$notify({
        group: 'foo',
        title: 'Failed!!',
        text: 'Something went wrong',
        type: 'error'
      })
    },
    gotoCurr() {
      this.$router.push({
        name: 'instructor-courses-create-id-content-curriculum'
      })
    },
    confirmDelete(url, id, directory) {
      this.currentFile = url
      this.fileDialog = true
      ;(this.directory = directory), (this.currentLesson = id)
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
          directory: this.directory,
          type: 'delete'
        }

        let response = await courseController.content.files(data)
        // this.showUpload(this.currentLesson)
        this.getSection()
        this.deleting = false
        this.fileDialog = false
        // this.getFiles(this.currentLesson)
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
    showUpload(lesson) {
      this.currentVideo = null
      this.currentFile = null
      // this.getFiles(lesson.id)
      this.currentLesson = lesson.id
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
          this.getSection()
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
    lessonModal() {
      this.form.reset()
      this.lessonEdit = false
      this.lessonDialog = true
    },
    createLesson() {
      this.processing = true
      this.saving = true
      let data = {
        title: this.form.title,
        duration: this.form.duration,
        course_id: this.course_id,
        section_id: this.section_id,
        duration: 0
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
          this.getSection()
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
        course_id: this.course_id,
        section_id: this.section_id
      }
      courseController.content
        .update(data)
        .then(res => {
          this.lessonDialog = false
          this.processing = false
          this.getSection()
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
        section_id: this.section_id,
        id: this.currentLesson
      }
      courseController.content
        .update(data)
        .then(res => {
          this.dialog = false
          this.processing = false
          this.saving = false
          this.getSection()
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
    deleteLesson(id) {
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
            .delete(id, this.section_id, this.course_id)
            .then(res => {
              this.processing = false
              this.getSection()
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
    getSection() {
      courseController.section
        .showSection(this.course_id, this.section_id)
        .then(res => {
          this.section = res.data.data
        })
    },
    getFiles(content) {
      let data = {
        course_id: this.course_id
      }
      api.course.contents(data).then(res => {
        let files = res.data.data
        let filtredFiles = files.filter(file => {
          return file.status === 1
        })
        this.files = filtredFiles
        this.currentLesson = content
      })
    },
    refreshSection() {
      this.getSection()
      // this.getFiles()
    }
  },
  created() {
    this.getSection()
    // this.getFiles(null)
  }
}
</script>
<style>
.b-shade {
  border-bottom: 1px solid grey;
}
</style>
