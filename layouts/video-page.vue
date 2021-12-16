<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      right
      :permanent="$vuetify.breakpoint.mdAndUp ? true : false"
      app
      width="320"
      bottom
    >
      <v-list>
        <v-list-item
          class="mt-10"
          v-for="section in course.sections"
          :key="section.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="section.name" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title class="pointer" nuxt to="/dashboard" v-text="title" />
      <v-spacer />
      <div class="pointer">
        {{ course }}
        <v-avatar size="32"
          ><v-icon> mdi-trophy-variant-outline</v-icon></v-avatar
        >
        Your Progress
      </div>
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import api from '~/api/general'
export default {
  data() {
    return {
      course: {},
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'E-learn',
    }
  },
}
</script>
