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
          <v-alert type="info" text width="1200" min-width="260">
            Here’s where you add course content—like lectures, course sections,
            assignments, and more.
          </v-alert>
        </v-row>

        <div class="container-fluid">
          <v-row>
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
          <v-row
            v-for="(section, index) in sections"
            :key="section.id"
            class="mb-3 b-shade"
          >
            <v-card flat width="1200" min-width="260">
              <v-card-text class=" font-weight-bold text-dark">
                <div class="overline">Section {{ index + 1 }}</div>
                {{ section.name }}
                <v-icon
                  @click.prevent="editSection(section)"
                  class="pointer"
                  small
                  >mdi-pencil-outline</v-icon
                >
                <div class="overline mt-2">
                  <span
                    class="pointer"
                    @click.prevent="viewSection(section.id)"
                  >
                    <v-icon small>mdi-eye</v-icon>
                    view
                  </span>
                  &nbsp;
                  <span
                    class="pointer"
                    @click.prevent="deleteSection(section.id)"
                  >
                    <v-icon color="error" small>mdi-trash-can-outline</v-icon>
                    delete
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-row>

          <!-- navigation starts -->
          <div flat class="mt-5">
            <v-row>
              <v-col cols="6">
                <div class="d-flex justify-start">
                  <v-btn
                    text
                    class="text-capitalize"
                    @click.prevent="gotoIndex"
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
                    text
                    class="text-capitalize"
                    @click.prevent="goToLanding"
                    :large="$vuetify.breakpoint.smAndDown ? false : true"
                    color="error"
                    >Continue ></v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </div>
          <!-- navigation ends -->
        </div>
      </v-flex>

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
    </v-container>
  </client-only>
</template>

<script>
import api from '~/api/general'
import { Form } from 'vform'
import courseController from '~/api/instructor/courseController'
export default {
  data() {
    return {
      course_id: this.$route.params.id,
      saving: false,
      sectionDialog: false,
      sectionEdit: false,
      sections: [],
      form: new Form({
        name: '',
        id: ''
      })
    }
  },
  methods: {
    viewSection(id) {
      this.$router.push({
        name: 'management-courses-create-id-section-section_id',
        params: { section_id: id }
      })
    },
    goToLanding() {
      this.$router.push({
        name: 'management-courses-create-id-content-landing'
      })
    },
    gotoIndex() {
      this.$router.push({ name: 'management-courses-create-id-content' })
    },

    sectionModal() {
      this.form.reset()
      this.sectionEdit = false
      this.sectionDialog = true
    },
    createSection() {
      let data = {
        name: this.form.name,
        course_id: this.course_id
      }
      this.saving = true
      courseController.section
        .create(data)
        .then(res => {
          this.sectionDialog = false
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
      let data = {
        id: this.form.id,
        name: this.form.name,
        course_id: this.course_id
      }
      courseController.section
        .update(data)
        .then(res => {
          this.sectionDialog = false
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
          courseController.section
            .delete(id, this.course_id)
            .then(res => {
              this.getSections()
              this.$notify({
                group: 'foo',
                title: 'Success!',
                text: 'Section deleted successfully',
                type: 'success'
              })
            })
            .catch(err => {
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
    getSections() {
      courseController.section.show({ course_id: this.course_id }).then(res => {
        this.sections = res.data.data
      })
    },
    refresh() {
      this.getSections()
    }
  },
  created() {
    this.getSections()
  }
}
</script>
