<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <div class="mt-10">
            <v-btn
              large
              color="error"
              :to="{ name: 'management-courses-create' }"
              nuxt
              >New Course</v-btn
            >
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card-title class="text-center justify-center">
            <h1 class="font-weight-bold display-3 basil--text">Courses</h1>
          </v-card-title>
          <v-stepper outlined non-linear>
            <v-stepper-header>
              <v-stepper-step
                :complete="currentRoute == 'approved' ? true : false"
                editable
                step=""
                @click.prevent="goToApproved"
              >
                Approved
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                editable
                step=""
                :complete="currentRoute == 'pending' ? true : false"
                @click.prevent="goToPending"
              >
                Pending
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                step=""
                editable
                :complete="currentRoute == 'rejected' ? true : false"
                @click.prevent="goToRejected"
              >
                Rejected
              </v-stepper-step>
              <v-divider></v-divider>

              <v-stepper-step
                step=""
                editable
                :complete="currentRoute == 'trashed' ? true : false"
                @click.prevent="goToTrashed"
              >
                Trashed
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>
          <v-content>
            <nuxt-child />
          </v-content>
        </v-col>
      </v-row>
      <notifications group="foo" />
    </div>
  </client-only>
</template>
<script>
import SettingsController from '~/api/admin/SettingsController'
import Approved from './courses/approved'
import Pending from './courses/pending'
import Rejected from './courses/rejected'
import Trashed from './courses/trashed'
export default {
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      tab: null,
      // items: ['Approved', 'Pending', 'Rejected', 'Trashed']
      items: ['Approved', 'Pending', 'Rejected'],
      currentRoute: this.$route.path.split('/').pop()
    }
  },
  methods: {
    goToApproved() {
      this.$router.push({ name: 'management-courses-approved' })
    },
    goToPending() {
      this.$router.push({
        name: 'management-courses-pending'
      })
    },
    goToRejected() {
      this.$router.push({
        name: 'management-courses-rejected'
      })
    },
    goToTrashed() {
      this.$router.push({
        name: 'management-courses-trashed'
      })
    }
  }
}
</script>
