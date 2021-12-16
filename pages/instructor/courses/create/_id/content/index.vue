<template>
  <div>
    <v-card flat>
      <v-container flat class="mb-12">
        <h4>Overview of the course</h4>
        <v-row>
          <v-col class="py-0" cols="12">
            <vue-editor v-model="overview"> </vue-editor>
          </v-col>
        </v-row>

        <v-btn
          color="primary mt-5"
          :disabled="oprocessing ? true : false"
          @click.prevent="saveOverview"
          >Save</v-btn
        >
      </v-container>
    </v-card>

    <v-card flat>
      <v-container class="mb-12">
        <h4>Are there any course requirements or prerequisites?</h4>
        <v-row>
          <v-col class="py-0">
            <vue-editor v-model="prerequisites"> </vue-editor>
          </v-col>
        </v-row>
        <v-btn
          color="primary mt-5"
          :disabled="oprocessing ? true : false"
          @click.prevent="savePrerequisites"
          >Save</v-btn
        >
      </v-container>
    </v-card>

    <v-card flat>
      <v-container class="mb-12">
        <h4>Welcome Message</h4>
        <v-row>
          <v-col class="py-0" cols="12">
            <vue-editor v-model="welcome_message"> </vue-editor>
          </v-col>
        </v-row>
        <v-btn
          color="primary mt-5"
          :disabled="wprocessing ? true : false"
          @click.prevent="saveWelcome"
          >Save</v-btn
        >
      </v-container>
    </v-card>

    <v-card flat>
      <v-container class="mb-12">
        <h4>Congratulations Message</h4>
        <v-row>
          <v-col class="py-0" cols="12">
            <vue-editor v-model="congratulation_message"> </vue-editor>
          </v-col>
        </v-row>
        <v-btn
          color="primary mt-5"
          :disabled="cprocessing ? true : false"
          @click.prevent="saveCongrats"
          >Save & Continue</v-btn
        >
      </v-container>
    </v-card>
    <div flat>
      <div class="d-flex justify-end">
        <v-btn
          text
          class="text-capitalize"
          @click.prevent="gotoCurr"
          :large="$vuetify.breakpoint.smAndDown ? false : true"
          color="error"
          >Continue ></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import api from '~/api/instructor/courseController'
export default {
  data() {
    return {
      e6: 1,
      overview: '',
      prerequisites: '',
      congratulation_message: '',
      welcome_message: '',
      course_id: this.$route.params.id,
      oprocessing: false,
      processing: false,
      cprocessing: false,
      wprocessing: false,
      p_editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block']
          ]
        }
      }
    }
  },
  methods: {
    gotoCurr() {
      this.$router.push({
        name: 'instructor-courses-create-id-content-curriculum'
      })
    },
    saveOverview() {
      let data = { overview: this.overview, course_id: this.course_id }
      this.oprocessing = true
      api.course
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
    saveOverview() {
      let data = { overview: this.overview, course_id: this.course_id }
      this.oprocessing = true
      api.course
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
    savePrerequisites() {
      let data = {
        prerequisites: this.prerequisites,
        course_id: this.course_id
      }
      this.processing = true
      api.course
        .update(data)
        .then(res => {
          this.processing = false
          this.$notify({
            group: 'foo',
            title: 'Saved!',
            type: 'info'
          })
          this.e6 = 3
        })
        .catch(err => {
          this.processing = false
        })
    },

    saveWelcome() {
      let data = {
        welcome_message: this.welcome_message,
        course_id: this.course_id
      }
      this.processing = true
      api.course
        .update(data)
        .then(res => {
          this.processing = false
          this.$notify({
            group: 'foo',
            title: 'Saved!',
            type: 'info'
          })
          this.e6 = 4
        })
        .catch(err => {
          this.processing = false
        })
    },
    saveCongrats() {
      let data = {
        congratulation_message: this.congratulation_message,
        course_id: this.course_id
      }
      this.processing = true
      api.course
        .update(data)
        .then(res => {
          this.processing = false
          this.$notify({
            group: 'foo',
            title: 'Saved!',
            type: 'info'
          })
          this.$router.push({
            name: 'instructor-courses-create-id-content-curriculum'
          })
        })
        .catch(err => {
          this.processing = false
        })
    },
    getCourse() {
      let course = this.$store.state.course.course
      this.overview = course.overview
      this.prerequisites = course.prerequisites
      this.welcome_message = course.welcome_message
      this.congratulation_message = course.congratulation_message
    }
  },
  created() {
    this.getCourse()
  },
  computed: {
    myQuill() {
      var Editors = ['#short_descr', '#full_descr', '#tags']
      var quill
      for (var k = 0; k <= Editors.length; k++) {
        quill = new Quill(Editors[k], {
          theme: 'snow'
        })
      }
    }
  }
}
</script>
