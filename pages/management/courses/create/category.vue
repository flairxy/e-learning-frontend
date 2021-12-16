<template>
  <div>
    <v-flex>
      <div v-if="!categories" class="d-flex justify-center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
      </div>
      <div height="500" flat v-else>
        <v-row>
          <v-col>
            <div
              :class="
                `font-weight-light text-center text ${
                  $vuetify.breakpoint.smAndDown ? 'headline' : 'display-1'
                } mt-10`
              "
            >
              What category best fits the knowledge you'll share?
              <p class="font-regular text--secondary mt-5 subtitle-1">
                If you're not sure about the right category, you can change it
                later.
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" sm="6">
            <v-select
              :items="categories"
              item-value="id"
              v-model="category"
              item-text="name"
              dense
              solo
              label="Choose a category"
              outlined
            ></v-select>
          </v-col>
        </v-row>

        <v-card-actions class="card-actions-left">
          <v-btn
            large
            tile
            outlined
            color="primary"
            :to="{ name: 'instructor-courses-create' }"
            nuxt
            >Previous</v-btn
          >
        </v-card-actions>
        <v-card-actions class="card-actions-right">
          <v-btn
            @click.prevent="saveCourse"
            large
            tile
            color="error"
            :disabled="disabled"
            >Continue</v-btn
          >
        </v-card-actions>
      </div>
    </v-flex>
    <!-- <notifications group="foo" /> -->
  </div>
</template>
<style>
.card-actions-left {
  position: absolute;
  bottom: 0;
}
.card-actions-right {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
<script>
import api from '~/api/general'
import courseController from '~/api/instructor/courseController'
export default {
  data() {
    return {
      categories: [],
      category: null,
      disabled: false
    }
  },
  methods: {
    saveCourse() {
      let data = {
        title: this.$store.state.course.course.title,
        category: this.category,
        created_by: this.$store.state.user.id
      }
      this.disabled = true
      courseController.course
        .create(data)
        .then(res => {
          this.$router.push({
            name: 'management-courses-create-id-content',
            params: { id: res.data.data.id }
          })
          this.$notify({
            group: 'foo',
            title: 'Saved',
            text: 'course saved',
            type: 'success'
          })
          this.disabled = false
        })
        .catch(err => {
          this.disabled = false
          if (err.response.status == 422) {
            let messages = Object.values(err.response.data.message)
            messages.forEach(message => {
              this.$notify({
                group: 'foo',
                title: 'Required',
                text: message[0],
                type: 'error'
              })
            })
            return
          } else {
            this.$notify({
              group: 'foo',
              title: 'Failed',
              text: 'Something went wrong. try again',
              type: 'error'
            })
            return
          }
        })
    },
    getCategories() {
      api.category.get().then(res => {
        this.categories = res.data.data
      })
    }
  },
  created() {
    this.getCategories()
    let title = this.$store.state.course.course.title
    if (!title) {
      window.location = '/management/courses/create'
    }
  }
}
</script>
