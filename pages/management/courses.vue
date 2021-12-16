<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-btn
            large
            color="error"
            :to="{ name: 'management-courses-create' }"
            nuxt
            >New Course</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <!-- <v-card-title>
            <h4 class="font-weight-bold  basil--text">Courses</h4>
          </v-card-title> -->

          <v-tabs
            background-color="transparent"
            color="basil"
            grow
            v-model="tab"
          >
            <v-tab @click.prevent="goToApproved">Approved</v-tab>
            <v-tab @click.prevent="goToPending">Pending</v-tab>
            <v-tab @click.prevent="goToRejected">Rejected</v-tab>
            <v-tab @click.prevent="goToTrashed">Trashed</v-tab>
            <v-tab @click.prevent="goToFeatured">Featured</v-tab>
            <v-tab @click.prevent="goToTop">Top</v-tab>
          </v-tabs>
          <nuxt-child />
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
import Featured from './courses/featured'
import Top from './courses/top'
export default {
  layout: 'admin',
  middleware: 'admin',
  components: {
    Approved,
    Pending,
    Rejected,
    Trashed,
    Featured,
    Top
  },
  data() {
    return {
      tab: null,
      items: ['Approved', 'Pending', 'Rejected', 'Trashed', 'Featured', 'Top'],
      // items: ['Approved', 'Pending', 'Rejected'],
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
    },
    goToFeatured() {
      this.$router.push({
        name: 'management-courses-featured'
      })
    },
    goToTop() {
      this.$router.push({
        name: 'management-courses-top'
      })
    }
  }
}
</script>
