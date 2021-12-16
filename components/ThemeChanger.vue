<template>
  <v-btn class="mr-4" icon @click.stop="toggleTheme">
    <v-icon>mdi-weather-night</v-icon>
  </v-btn>
</template>
<script>
export default {
  methods: {
    toggleTheme() {
      let theme = localStorage.getItem('dark')
      if (theme === 'true') {
        localStorage.setItem('dark', false)
      } else {
        localStorage.setItem('dark', true)
      }
      this.getTheme()
    },

    getTheme() {
      let theme = localStorage.getItem('dark')
      if (theme === 'true') {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    }
  },
  created() {
    let theme = localStorage.getItem('dark')
    if (!theme) {
      localStorage.setItem('dark', false)
    }
    this.getTheme()
  }
}
</script>
