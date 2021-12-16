<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card color="basil">
            <v-card-title class="text-center justify-center py-6">
              <h1 class="font-weight-bold display-3 basil--text">Users</h1>
            </v-card-title>

            <v-tabs
              background-color="transparent"
              color="basil"
              grow
              v-model="tab"
            >
              <v-tab v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item v-for="item in items" :key="item">
                <v-card color="basil" flat>
                  <Approved v-if="item == 'Approved'" />
                  <Pending v-if="item == 'Pending'" />
                  <Rejected v-if="item == 'Rejected'" />
                  <Trashed v-if="item == 'Trashed'" />
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </client-only>
</template>
<script>
import SettingsController from '~/api/admin/SettingsController'
import Approved from './users/approved'
import Pending from './users/pending'
import Rejected from './users/rejected'
import Trashed from './users/trashed'
export default {
  layout: 'admin',
  middleware: 'admin',
  components: {
    Approved,
    Pending,
    Rejected,
    Trashed
  },
  data() {
    return {
      tab: null,
      items: ['Approved', 'Pending', 'Rejected', 'Trashed']
    }
  }
}
</script>
