<template>
  <div>
    <v-navigation-drawer
      class="accent-4 fixed"
      width="200"
      absolute
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content class="p-0">
      <v-container v-if="$vuetify.breakpoint.mdAndUp" class="ml-200">
        <nuxt-child />
      </v-container>
      <v-container v-if="$vuetify.breakpoint.smAndDown">
        <nuxt-child />
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  middleware: ['instructor'],
  layout: 'instructorSidebar',
  data() {
    return {
      items: [
        { title: 'Overview', to: 'overview' },
        { title: 'Students', to: 'students' },
        { title: 'Reviews', to: 'reviews' },
        { title: 'Traffic & conversion', to: 'traffic' }
      ]
    }
  }
}
</script>
<style>
.ml-200 {
  margin-left: 200px !important;
}
.fixed {
  position: fixed;
  margin-left: 50px;
  margin-top: 60px;
}
.p-0 {
  padding: 0 !important;
}
</style>
