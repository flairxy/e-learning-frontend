<template>
  <client-only>
    <v-app dark>
      <v-app-bar fixed app>
        <v-btn icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
          <v-icon>mdi-weather-night</v-icon>
        </v-btn>
        <v-spacer />
        <div v-if="isLoggedIn">
          <v-btn
            @click="logOut"
            dense
            class="mr-5 pointer body-2 text-capitalize"
            >Logout</v-btn
          >
        </div>
        <div v-else>
          <!-- <span class="mr-5 pointer body-2">
            Login
          </span> -->
          <v-btn
            dense
            class="mr-5 pointer body-2 text-capitalize"
            nuxt
            :to="{ name: 'login' }"
            >Login</v-btn
          >
          <v-btn
            dense
            class="mr-5 pointer body-2 text-capitalize"
            nuxt
            :to="{ name: 'register' }"
            >Register</v-btn
          >
          <v-btn
            dense
            class="mr-5 pointer body-2 text-capitalize"
            nuxt
            :to="{ name: 'instructor-register' }"
            >Become an instructor</v-btn
          >
          <!-- <span class="mr-5 pointer body-2">
            Register
          </span> -->
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
</template>

<script>
export default {
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
    logOut() {
      this.$store.dispatch('RESET').then(() => {
        this.$router.push('/')
        this.$notify({
          group: 'foo',
          title: 'Logged out!!',
          text: 'Logout successful',
          type: 'success'
        })
      })
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.user
    },
    viewLogin() {
      this.$router.push({ name: 'login' })
    },
    viewRegister() {
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
