<template>
  <v-card
    class="pointer"
    height="300"
    max-width="250"
    nuxt
    :to="{ name: 'id', params: { id: courseId } }"
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
    <v-card-subtitle class="pb-0 text-capitalize overline">
      <span v-for="i in formatedInstructors" :key="i.username">
        {{ i.name }}
      </span></v-card-subtitle
    >
    <v-card-actions>
      <v-rating
        color="yellow accent-4"
        dense
        half-increments
        readonly
        :value="ratingProp"
        size="18"
      ></v-rating>
      <span class="caption mt-1 text--grey">
        {{ ratingProp }} ({{ studentProp }})
      </span>
    </v-card-actions>
    <v-card-text class="d-flex justify-end">
      <!-- {{ currency
      }}
      <del>{{
        parseFloat(pricingProp)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
      }}</del> -->
      <span class="ml-5 title font-weight-bold">{{ formatedPrice }} </span>
    </v-card-text>
  </v-card>
</template>
<script>
import instructor from '../middleware/instructor'
export default {
  props: {
    subtitleProp: String,
    titleProp: String,
    courseImage: String,
    courseId: String,
    subtitleProp: String,
    ratingProp: Number,
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
    formatedPrice() {
      let price = this.pricingProp
      if (price > 0) {
        return (
          this.currency +
          parseFloat(price)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
        )
      } else return 'FREE'
    },
    formatedInstructors() {
      if (this.instructorsProp !== null) {
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
}
</script>
