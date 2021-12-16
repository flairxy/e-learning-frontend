<template>
  <client-only>
    <div class="container">
      <v-row>
        <v-col cols="12">
          <v-card-title class="text-center justify-center">
            <h3 class="font-weight-bold  basil--text">Settings</h3>
          </v-card-title>
          <v-tabs background-color="transparent" color="basil" grow>
            <v-tab @click.prevent="goToGeneral">General</v-tab>
            <v-tab @click.prevent="goToCategories">Categories</v-tab>
            <v-tab @click.prevent="goToLevels">Levels</v-tab>
            <v-tab @click.prevent="goToTags">Tags</v-tab>
          </v-tabs>

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
    goToGeneral() {
      this.$router.push({ name: 'management-settings-general' })
    },
    goToCategories() {
      this.$router.push({
        name: 'management-settings-categories'
      })
    },
    goToLevels() {
      this.$router.push({
        name: 'management-settings-levels'
      })
    },
    goToTags() {
      this.$router.push({
        name: 'management-settings-tags'
      })
    }
  },
  mounted() {
    this.$nuxt.$loading.start()
  }
}
</script>
