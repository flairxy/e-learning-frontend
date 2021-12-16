<template>
  <v-content>
    <v-container>
      <v-row>
        <v-btn
          @click.prevent="newModal"
          :large="$vuetify.breakpoint.smAndDown ? false : true"
          color="success"
          >Schedule meeting</v-btn
        >
      </v-row>
      <br />
      <v-simple-table fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Meeting Id</th>
              <th class="text-left">Topic</th>
              <th class="text-left">Password</th>
              <!-- <th class="text-left">Date</th> -->
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody v-if="meeting">
            <tr>
              <td>{{ meeting.meeting_id }}</td>
              <td>{{ meeting.topic }}</td>
              <td>{{ meeting.password }}</td>
              <!-- <td>{{ meeting.created_at }}</td> -->
              <td>
                <v-row>
                  <v-btn
                    text
                    small
                    class="mr-3"
                    @click.prevent="viewMeeting(meeting.join_url)"
                  >
                    <v-icon>mdi-door-open</v-icon> Join
                  </v-btn>
                  <!-- <v-btn
                    small
                    class="mr-3"
                    color="success"
                    @click.prevent="updateModal(meeting)"
                  >
                    <v-icon>mdi-pencil</v-icon> Update</v-btn
                  > -->

                  <v-btn
                    color="error"
                    small
                    :disabled="deleting"
                    @click.prevent="destroy(meeting.meeting_id)"
                  >
                    <v-icon>mdi-trash-can</v-icon>
                    {{ deleting ? 'deleting...' : 'delete' }}</v-btn
                  >
                </v-row>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline">
            {{ edit ? 'Update' : 'New' }} Meeting
          </v-card-title>

          <v-container>
            <v-form>
              <v-col cols="12">
                <v-text-field
                  label="Topic"
                  placeholder="enter the meeting topic"
                  outlined
                  v-model="form.topic"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Start Time (in minutes)"
                  placeholder="e.g 30"
                  outlined
                  type="number"
                  v-model="form.start_time"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="number"
                  label="Duration"
                  placeholder="How long will the meeting last"
                  outlined
                  required
                  v-model="form.duration"
                ></v-text-field>
              </v-col>
            </v-form>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              v-if="!edit"
              type="submit"
              color="primary darken-1"
              text
              :disabled="creating"
              @click.prevent="create()"
            >
              {{ creating ? 'creating..' : 'create' }}
            </v-btn>

            <v-btn
              v-if="edit"
              type="submit"
              color="primary darken-1"
              text
              :disabled="creating"
              @click.prevent="update()"
            >
              {{ editing ? 'updating.....' : 'update' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-content>
</template>

<script>
import { Form } from 'vform'
import CourseController from '~/api/instructor/courseController'
export default {
  middleware: ['instructor'],
  layout: 'instructorSidebar',
  data: function() {
    return {
      nickname: '',
      meetingId: '',
      meeting: {},
      form: new Form({
        topic: '',
        duration: 30,
        start_time: 10,
        id: ''
      }),
      course: this.$route.query.id,
      dialog: false,
      creating: false,
      deleting: false,
      edit: false,
      editing: false,
      currentId: null
    }
  },
  methods: {
    newModal() {
      this.form.reset()
      this.dialog = true
      this.edit = false
    },
    updateModal(meeting) {
      this.edit = true
      this.currentId = meeting.meeting_id
      this.form.fill(meeting)
      this.dialog = true
    },
    viewMeeting(meeting) {
      window.open(meeting)
    },
    create() {
      this.creating = true
      let data = {
        topic: this.form.topic,
        duration: this.form.duration,
        start_time: this.form.start_time,
        course_id: this.course
      }
      CourseController.meeting
        .create(data)
        .then(res => {
          this.creating = false
          this.dialog = false
          this.$notify({
            title: 'success',
            text: 'Room created'
          })
          this.getMeetings()
        })
        .catch(() => {
          this.creating = false
        })
    },
    update(id) {
      this.editing = true
      let data = {
        topic: this.form.topic,
        duration: this.form.duration,
        start_time: this.form.start_time,
        meeting_id: this.currentId
      }
      CourseController.meeting
        .update(data)
        .then(res => {
          this.editing = false
          this.dialog = false
          this.$notify({
            title: 'success',
            text: 'Room updated'
          })
          this.getMeetings()
        })
        .catch(() => {
          this.editing = false
        })
    },
    destroy(id) {
      this.deleting = true
      CourseController.meeting
        .delete(id)
        .then(res => {
          this.deleting = false
          this.getMeetings()
          this.$notify({
            title: 'success',
            text: 'Room deleted'
          })
        })
        .catch(error => {
          this.deleting = false
          console.log(error)
        })
    },
    getMeetings() {
      CourseController.meeting.get(this.course).then(res => {
        this.meeting = res.data.data
      })
    }
  },
  created() {
    this.getMeetings()
  }
}
</script>
