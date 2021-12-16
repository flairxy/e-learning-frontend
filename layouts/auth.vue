<template>
  <div>
    <client-only>
      <v-app dark>
        <v-app-bar flat fixed app>
          <v-btn icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-icon>mdi-weather-night</v-icon>
          </v-btn>
          <v-spacer />
          <div>
            <div class="row">
              <span @click="instructor()" class="p-2 mr-5 pointer body-2">
                {{
                  $vuetify.breakpoint.mdAndUp
                    ? 'Become an instructor'
                    : 'Instructor'
                }}
              </span>
              <span @click="login" class="mr-5 pointer body-2">
                Login
              </span>
              <span @click="register" class="mr-5 pointer body-2">
                Register
              </span>
            </div>
          </div>
        </v-app-bar>

        <v-content>
          <nuxt />
        </v-content>
        <v-footer :fixed="fixed" app>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-app>
    </client-only>
  </div>
</template>

<script>
export default {
  middleware: ['guest'],
  data() {
    return {
      active: false,
      active2: false,
      clipped: false,
      drawer: false,
      fixed: false
    }
  },
  methods: {
    instructor() {
      this.$router.push({ name: 'instructor-register' })
    },
    login() {
      this.$router.push({ name: 'login' })
    },
    register() {
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
<style>
.pointer {
  cursor: pointer;
}
.unstyle {
  color: rgb(63, 63, 63) !important;
  text-decoration: none;
}
</style>
