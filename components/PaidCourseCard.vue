<template>
  <v-card
    class="ma-4 pointer"
    height="300"
    max-width="250"
    nuxt
    :to="{ name: 'student-course-id', params: { id: courseId } }"
  >
    <v-img
      class="white--text align-end"
      height="140"
      :src="courseImage ? courseImage : '/placeholder.png'"
    >
    </v-img>

    <v-card-text class="pb-0 font-weight-bold text-dark"
      >{{ titleProp.length > 30 ? titleProp.slice(0, 25) + '...' : titleProp }}
    </v-card-text>
    <v-card-subtitle class="pb-2 text-capitalize overline"
      ><span v-for="i in formatedInstructors" :key="i.username">
        {{ i.name }}
      </span></v-card-subtitle
    >
    <v-divider />
    <v-card-text class="pb-0 font-weight-medium">
      START COURSE
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    titleProp: String,
    subtitleProp: String,
    ratingProp: Number,
    courseImage: String,
    courseId: String,
    studentProp: Number,
    pricingProp: Number,
    adminPriceProps: Number,
    instructorsProp: Array
  },
  data() {
    return {
      currency: process.env.CURRENCY
    }
  },
  computed: {
    formatedInstructors() {
      return this.instructorsProp.filter(i => {
        return (i.name =
          i.first_name +
          ' ' +
          i.last_name +
          (i != this.instructorsProp[this.instructorsProp.length - 1]
            ? ','
            : ''))
      })
    }
  }
}
</script>
