<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card-title>
            <h3 class="font-weight-bold basil--text">Users</h3>
          </v-card-title>
          <v-tabs background-color="transparent" color="basil" grow>
            <v-tab @click.prevent="goToApproved">Approved</v-tab>
            <v-tab @click.prevent="goToPending">Pending</v-tab>
            <v-tab @click.prevent="goToRejected">Rejected</v-tab>
            <v-tab @click.prevent="goToTrashed">Trashed</v-tab>
          </v-tabs>
          <!-- <v-stepper non-linear>
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
          </v-stepper> -->

          <nuxt-child />
        </v-col>
      </v-row>
      <notifications group="foo" />
    </div>
  </client-only>
</template>
<script>
export default {
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      currentRoute: this.$route.path.split('/').pop()
    }
  },
  methods: {
    goToApproved() {
      this.$router.push({ name: 'management-users-approved' })
    },
    goToPending() {
      this.$router.push({
        name: 'management-users-pending'
      })
    },
    goToRejected() {
      this.$router.push({
        name: 'management-users-rejected'
      })
    },
    goToTrashed() {
      this.$router.push({
        name: 'management-users-trashed'
      })
    }
  }
}
</script>
